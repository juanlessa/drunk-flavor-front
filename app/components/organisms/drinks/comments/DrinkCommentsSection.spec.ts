import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import { defineAbilityForUser } from '~/domain/accessControl';
import type { AppAbility } from '~/domain/accessControl/accessControl.types';
import type { CommentWithAuthor } from '~/domain/comment/comment.entity';
import type { User } from '~/domain/user/user.entity';
import DrinkCommentsSection from './DrinkCommentsSection.vue';

const buildUser = (id: string, role: User['role']) =>
	({ id, role, name: 'Viewer', surname: 'One', status: 'active' }) as User;

const buildComment = (id: string, userId: string): CommentWithAuthor => ({
	id,
	drinkId: 'd1',
	userId,
	content: id,
	status: 'visible',
	createdAt: new Date(),
	updatedAt: new Date(),
	author: { id: userId, name: 'Someone' }
});

const thread = {
	comments: ref<CommentWithAuthor[]>([]),
	hasMore: ref(false),
	isLoading: ref(false),
	isLoadingMore: ref(false),
	hasLoadError: ref(false),
	isCreating: ref(false),
	isAuthenticated: ref(true),
	viewer: ref<User | undefined>(undefined),
	load: vi.fn().mockResolvedValue(true),
	loadMore: vi.fn().mockResolvedValue(true),
	create: vi.fn().mockResolvedValue(true),
	update: vi.fn().mockResolvedValue(true),
	remove: vi.fn().mockResolvedValue(true),
	hide: vi.fn().mockResolvedValue(true),
	isPending: () => false
};

let ability: AppAbility = defineAbilityForUser();
const mockPush = vi.fn();
const mockReplace = vi.fn();
const mockAddToast = vi.fn();
const mockFocus = vi.fn();
const route = { fullPath: '/drinks/d1', query: {} as Record<string, string> };

vi.stubGlobal('useDrinkComments', () => thread);
vi.stubGlobal('useAppAbility', () => ({
	can: (...args: Parameters<AppAbility['can']>) => ability.can(...args)
}));
vi.stubGlobal('useNuxtApp', () => ({ $router: { push: mockPush, replace: mockReplace } }));
vi.stubGlobal('useRoute', () => route);
vi.stubGlobal('useLocalePath', () => (path: string) => path);
vi.stubGlobal('useToast', () => ({ addToast: mockAddToast }));
vi.stubGlobal('useI18n', () => ({ t: (key: string) => key }));

// Looked up by name: lookups by the stub object stop matching after the first mount.
const CommentItemStub = {
	name: 'CommentItemStub',
	props: ['comment', 'isOwn', 'canEdit', 'canDelete', 'canHide', 'isPending'],
	emits: ['update', 'hide', 'delete'],
	template: '<div data-testid="comment" />'
};
const DeleteModalStub = {
	name: 'DeleteModalStub',
	props: ['open', 'title', 'description'],
	emits: ['update:open', 'cancel', 'delete'],
	template: '<div data-testid="delete-modal" :data-open="String(open)" />'
};

const mountSection = () =>
	mount(DrinkCommentsSection, {
		props: { drinkId: 'd1' },
		global: {
			stubs: {
				Card: { template: '<div><slot /></div>' },
				Heading: { template: '<h2><slot /></h2>' },
				Text: { template: '<p><slot /></p>' },
				Button: { template: '<button @click="$emit(\'click\')"><slot /></button>' },
				Avatar: true,
				CommentComposer: {
					methods: { focus: mockFocus },
					template: '<div data-testid="composer" />'
				},
				CommentItemSkeleton: true,
				CommentItem: CommentItemStub,
				DeleteModal: DeleteModalStub
			},
			mocks: { $t: (key: string) => key }
		}
	});

const permissionsOf = (wrapper: ReturnType<typeof mountSection>) =>
	wrapper.findAllComponents({ name: 'CommentItemStub' }).map((item) => ({
		id: (item.props('comment') as CommentWithAuthor).id,
		isOwn: item.props('isOwn'),
		canEdit: item.props('canEdit'),
		canDelete: item.props('canDelete'),
		canHide: item.props('canHide')
	}));

const signIn = (user: User) => {
	thread.isAuthenticated.value = true;
	thread.viewer.value = user;
	ability = defineAbilityForUser(user);
};

describe('DrinkCommentsSection', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		thread.comments.value = [buildComment('mine', 'viewer'), buildComment('theirs', 'other')];
		thread.hasLoadError.value = false;
		thread.isLoading.value = false;
		route.query = {};
	});

	it('lets members edit and delete only their own comments', async () => {
		signIn(buildUser('viewer', 'member'));
		const wrapper = mountSection();
		await flushPromises();

		expect(permissionsOf(wrapper)).toEqual([
			{ id: 'mine', isOwn: true, canEdit: true, canDelete: true, canHide: false },
			{ id: 'theirs', isOwn: false, canEdit: false, canDelete: false, canHide: false }
		]);
	});

	it.each(['admin', 'owner'] as const)(
		'lets an %s hide or delete any comment but edit only their own',
		async (role) => {
			signIn(buildUser('viewer', role));
			const wrapper = mountSection();
			await flushPromises();

			expect(permissionsOf(wrapper)).toEqual([
				{ id: 'mine', isOwn: true, canEdit: true, canDelete: true, canHide: false },
				{ id: 'theirs', isOwn: false, canEdit: false, canDelete: true, canHide: true }
			]);
		}
	);

	it('shows a sign-in prompt instead of the composer to guests', async () => {
		thread.isAuthenticated.value = false;
		thread.viewer.value = undefined;
		ability = defineAbilityForUser();
		const wrapper = mountSection();
		await flushPromises();

		expect(wrapper.find('[data-testid="composer"]').exists()).toBe(false);
		await wrapper.find('button').trigger('click');
		expect(mockPush).toHaveBeenCalledWith({
			path: '/signin',
			query: { redirect: '/drinks/d1', intent: 'comment' }
		});
		expect(permissionsOf(wrapper).every((item) => !item.canDelete && !item.canEdit)).toBe(true);
	});

	it('confirms before deleting and reports the outcome', async () => {
		signIn(buildUser('viewer', 'member'));
		const wrapper = mountSection();
		await flushPromises();

		wrapper.findAllComponents({ name: 'CommentItemStub' })[0]!.vm.$emit('delete');
		await flushPromises();
		const modal = wrapper.findComponent({ name: 'DeleteModalStub' });
		expect(modal.props('open')).toBe(true);
		expect(thread.remove).not.toHaveBeenCalled();

		// Same order as the real dialog: its action closes it before emitting `delete`.
		modal.vm.$emit('update:open', false);
		modal.vm.$emit('delete');
		await flushPromises();

		expect(thread.remove).toHaveBeenCalledWith('mine');
		expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
		expect(wrapper.findComponent({ name: 'DeleteModalStub' }).props('open')).toBe(false);
	});

	it('does not delete when the dialog is dismissed', async () => {
		signIn(buildUser('viewer', 'member'));
		const wrapper = mountSection();
		await flushPromises();

		wrapper.findAllComponents({ name: 'CommentItemStub' })[0]!.vm.$emit('delete');
		await flushPromises();
		wrapper.findComponent({ name: 'DeleteModalStub' }).vm.$emit('update:open', false);
		await flushPromises();

		expect(thread.remove).not.toHaveBeenCalled();
		expect(wrapper.findComponent({ name: 'DeleteModalStub' }).props('open')).toBe(false);
	});

	it('hides a comment and shows an error toast when moderation fails', async () => {
		signIn(buildUser('viewer', 'admin'));
		thread.hide.mockResolvedValueOnce(false);
		const wrapper = mountSection();
		await flushPromises();

		wrapper.findAllComponents({ name: 'CommentItemStub' })[1]!.vm.$emit('hide');
		await flushPromises();

		expect(thread.hide).toHaveBeenCalledWith('theirs');
		expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
	});

	it('drops the comment intent from the URL after signing in', async () => {
		signIn(buildUser('viewer', 'member'));
		route.query = { intent: 'comment', tab: 'x' };
		mountSection();
		await flushPromises();

		expect(mockReplace).toHaveBeenCalledWith({ query: { tab: 'x' } });
		expect(mockFocus).toHaveBeenCalled();
	});

	it('shows the empty state when there are no comments', async () => {
		signIn(buildUser('viewer', 'member'));
		thread.comments.value = [];
		const wrapper = mountSection();
		await flushPromises();

		expect(wrapper.text()).toContain('drinkDetailPage.comments.empty');
	});
});
