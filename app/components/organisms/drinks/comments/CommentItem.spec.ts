import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import type { ActionMenuItem } from '~/components/molecules/actionMenu/ActionMenu.types';
import type { CommentWithAuthor } from '~/domain/comment/comment.entity';
import CommentItem from './CommentItem.vue';

vi.stubGlobal('useI18n', () => ({
	t: (key: string) => key,
	locale: ref('en')
}));

const ActionMenuStub = {
	props: ['label', 'items', 'disabled'],
	emits: ['select'],
	template:
		'<div data-testid="menu"><button v-for="item in items" :key="item.key" :data-key="item.key" @click="$emit(\'select\', item.key)">{{ item.label }}</button></div>'
};

const focus = vi.fn();
const CommentComposerStub = {
	props: [
		'modelValue',
		'initialValue',
		'isSubmitting',
		'cancelable',
		'submitLabel',
		'label',
		'id'
	],
	emits: ['update:modelValue', 'submit', 'cancel'],
	setup(_: unknown, { expose }: { expose: (exposed: Record<string, unknown>) => void }) {
		expose({ focus });
	},
	template: '<div data-testid="editor">{{ modelValue }}</div>'
};

const buildComment = (overrides: Partial<CommentWithAuthor> = {}): CommentWithAuthor => ({
	id: 'c1',
	drinkId: 'd1',
	userId: 'u1',
	content: 'Refreshing\nand sweet',
	status: 'visible',
	createdAt: new Date('2026-10-01T10:00:00.000Z'),
	updatedAt: new Date('2026-10-01T10:00:00.000Z'),
	author: { id: 'u1', name: 'Ada', surname: 'Lovelace' },
	...overrides
});

const mountItem = (props: Record<string, unknown> = {}) =>
	mount(CommentItem, {
		props: { comment: buildComment(), ...props },
		global: {
			stubs: {
				Avatar: { props: ['src', 'alt'], template: '<span data-testid="avatar" />' },
				Badge: { template: '<span data-testid="badge"><slot /></span>' },
				Text: { template: '<p data-testid="content"><slot /></p>' },
				ActionMenu: ActionMenuStub,
				CommentComposer: CommentComposerStub
			},
			mocks: { $t: (key: string) => key }
		}
	});

const menuKeys = (wrapper: ReturnType<typeof mountItem>) =>
	(wrapper.findComponent(ActionMenuStub).props('items') as ActionMenuItem[]).map(
		({ key }) => key
	);

describe('CommentItem', () => {
	it('shows the author name, the content and no menu without permissions', () => {
		const wrapper = mountItem();

		expect(wrapper.text()).toContain('Ada Lovelace');
		expect(wrapper.find('[data-testid="content"]').text()).toContain('Refreshing');
		expect(wrapper.find('[data-testid="menu"]').exists()).toBe(false);
		expect(wrapper.find('[data-testid="badge"]').exists()).toBe(false);
	});

	it('falls back to a generic name when the author no longer exists', () => {
		expect(mountItem({ comment: buildComment({ author: null }) }).text()).toContain(
			'drinkDetailPage.comments.unknownAuthor'
		);
	});

	it('marks the viewer own comment and edited comments', () => {
		const wrapper = mountItem({
			isOwn: true,
			comment: buildComment({ updatedAt: new Date('2026-10-02T10:00:00.000Z') })
		});

		expect(wrapper.find('[data-testid="badge"]').text()).toBe('drinkDetailPage.comments.you');
		expect(wrapper.text()).toContain('drinkDetailPage.comments.edited');
		expect(wrapper.find('time').attributes('datetime')).toBe('2026-10-01T10:00:00.000Z');
	});

	it('lists only the permitted actions in order', () => {
		expect(menuKeys(mountItem({ canEdit: true, canDelete: true }))).toEqual(['edit', 'delete']);
		expect(menuKeys(mountItem({ canHide: true, canDelete: true }))).toEqual(['hide', 'delete']);
	});

	it('emits hide and delete from the menu', async () => {
		const wrapper = mountItem({ canHide: true, canDelete: true });

		await wrapper.find('[data-key="hide"]').trigger('click');
		await wrapper.find('[data-key="delete"]').trigger('click');

		expect(wrapper.emitted('hide')).toHaveLength(1);
		expect(wrapper.emitted('delete')).toHaveLength(1);
	});

	it('edits inline, focusing the editor and closing it once saved', async () => {
		const wrapper = mountItem({ canEdit: true });

		await wrapper.find('[data-key="edit"]').trigger('click');
		await flushPromises();

		const editor = wrapper.findComponent(CommentComposerStub);
		expect(editor.props('modelValue')).toBe('Refreshing\nand sweet');
		expect(editor.props('initialValue')).toBe('Refreshing\nand sweet');
		expect(focus).toHaveBeenCalled();
		expect(wrapper.find('[data-testid="menu"]').exists()).toBe(false);

		editor.vm.$emit('submit', 'Updated');
		const [content, done] = wrapper.emitted('update')![0] as [string, (saved: boolean) => void];
		expect(content).toBe('Updated');

		done(false);
		await flushPromises();
		expect(wrapper.find('[data-testid="editor"]').exists()).toBe(true);

		done(true);
		await flushPromises();
		expect(wrapper.find('[data-testid="editor"]').exists()).toBe(false);
	});

	it('leaves edit mode on cancel', async () => {
		const wrapper = mountItem({ canEdit: true });
		await wrapper.find('[data-key="edit"]').trigger('click');
		await flushPromises();

		wrapper.findComponent(CommentComposerStub).vm.$emit('cancel');
		await flushPromises();

		expect(wrapper.find('[data-testid="editor"]').exists()).toBe(false);
		expect(wrapper.emitted('update')).toBeUndefined();
	});
});
