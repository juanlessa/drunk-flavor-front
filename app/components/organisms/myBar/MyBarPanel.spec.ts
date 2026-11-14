import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { computed, ref } from 'vue';
import { buildIngredient } from '~/test/drink.fixtures';
import type { BarIngredient } from '~/types/myBar.types';
import MyBarPanel from './MyBarPanel.vue';

const gin = buildIngredient('gin', 'Gin');
const lime = buildIngredient('lime', 'Lime');
const mint = buildIngredient('mint', 'Mint');
const mockOptions = ref([gin, lime, mint]);
const mockUseIngredientSearch = vi.fn((_scope?: string, _options?: { inUse?: boolean }) => ({
	options: computed(() => mockOptions.value),
	searchTerm: ref(''),
	loading: ref(false),
	loadNextPage: vi.fn()
}));
const translate = (key: string, params?: Record<string, unknown>) =>
	params ? `${key}:${JSON.stringify(params)}` : key;
vi.stubGlobal('useI18n', () => ({ t: translate, locale: ref('en') }));
vi.stubGlobal('useIngredientSearch', mockUseIngredientSearch);

const SearchStub = {
	props: ['options', 'id'],
	emits: ['select', 'load-more', 'update:searchTerm'],
	template: '<div data-testid="search" :id="id" />'
};
const ModeStub = {
	props: ['modelValue', 'options', 'id', 'label', 'name', 'layout'],
	emits: ['update:modelValue'],
	template: '<div data-testid="mode" />'
};

const barIngredient = ({ id, translations }: typeof gin): BarIngredient => ({
	id,
	translations: { en: { name: translations.en.name }, pt: { name: translations.pt.name } }
});

const mountPanel = (props: Record<string, unknown> = {}) =>
	mount(MyBarPanel, {
		props: { ingredients: [], maxMissing: 0, isFull: false, ...props },
		global: {
			stubs: {
				Label: { props: ['for'], template: '<label :for="$props.for"><slot /></label>' },
				Search: SearchStub,
				SearchIcon: true,
				RadioCardGroup: ModeStub
			},
			mocks: { $t: translate }
		}
	});

const search = (wrapper: ReturnType<typeof mountPanel>) => wrapper.findComponent(SearchStub);
const mode = (wrapper: ReturnType<typeof mountPanel>) => wrapper.findComponent(ModeStub);
const announcement = (wrapper: ReturnType<typeof mountPanel>) =>
	wrapper.find('[data-testid="my-bar-announcement"]').text();

describe('MyBarPanel', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockOptions.value = [gin, lime, mint];
	});

	it('searches the ingredients on its own, apart from the other ingredient searches', () => {
		mountPanel();

		expect(mockUseIngredientSearch.mock.calls[0]?.[0]).toBe('myBar');
	});
	it('offers only the ingredients that some drink uses', () => {
		mountPanel();
		expect(mockUseIngredientSearch).toHaveBeenCalledWith('myBar', { inUse: true });
	});

	it('leaves the ingredients already in the bar out of the search', () => {
		const wrapper = mountPanel({ ingredients: [barIngredient(lime)] });

		expect(
			search(wrapper)
				.props('options')
				.map(({ value }: { value: string }) => value)
		).toEqual(['gin', 'mint']);
	});

	it('adds the chosen ingredient and announces it', async () => {
		const wrapper = mountPanel();

		search(wrapper).vm.$emit('select', { value: 'gin', label: 'Gin' });
		await wrapper.vm.$nextTick();

		expect(wrapper.emitted('add')).toEqual([[gin]]);
		expect(announcement(wrapper)).toBe('organisms.myBar.announcements.added:{"name":"Gin"}');
	});

	it('adds nothing once the bar is full, and says so', async () => {
		const wrapper = mountPanel({ isFull: true });

		search(wrapper).vm.$emit('select', { value: 'gin', label: 'Gin' });
		await wrapper.vm.$nextTick();

		expect(wrapper.emitted('add')).toBeUndefined();
		expect(wrapper.find('[data-testid="my-bar-full"]').exists()).toBe(true);
	});

	it('removes an ingredient from its chip and announces it', async () => {
		const wrapper = mountPanel({ ingredients: [barIngredient(gin), barIngredient(lime)] });
		const remove = wrapper
			.findAll('li button')
			.find(
				(button) =>
					button.attributes('aria-label') ===
					'organisms.myBar.ingredients.remove:{"name":"Lime"}'
			);

		await remove!.trigger('click');

		expect(wrapper.emitted('remove')).toEqual([['lime']]);
		expect(announcement(wrapper)).toBe('organisms.myBar.announcements.removed:{"name":"Lime"}');
	});

	it('offers to clear the bar only when it has ingredients', async () => {
		const clearLabel = 'organisms.myBar.ingredients.clear';
		const findClear = (wrapper: ReturnType<typeof mountPanel>) =>
			wrapper.findAll('button').find((button) => button.text() === clearLabel);
		expect(findClear(mountPanel())).toBeUndefined();

		const wrapper = mountPanel({ ingredients: [barIngredient(gin)] });
		await findClear(wrapper)!.trigger('click');

		expect(wrapper.emitted('clear')).toEqual([[]]);
		expect(announcement(wrapper)).toBe('organisms.myBar.announcements.cleared');
	});

	it('offers every way to match, with the current one chosen', () => {
		const wrapper = mountPanel({ maxMissing: 'any' });

		expect(mode(wrapper).props('modelValue')).toBe('any');
		expect(mode(wrapper).props('layout')).toBe('filter');
		expect(
			mode(wrapper)
				.props('options')
				.map(({ value }: { value: string }) => value)
		).toEqual(['0', '1', '2', 'any']);
	});

	it.each([
		{ chosen: '2', expected: 2 },
		{ chosen: 'any', expected: 'any' }
	])('emits the way to match $chosen with its own type', ({ chosen, expected }) => {
		const wrapper = mountPanel();

		mode(wrapper).vm.$emit('update:modelValue', chosen);

		expect(wrapper.emitted('update:maxMissing')).toEqual([[expected]]);
	});

	it('moves the focus to the search, so more ingredients can be added', () => {
		const wrapper = mountPanel();
		document.body.appendChild(wrapper.element);
		const target = search(wrapper).element as HTMLElement;
		target.tabIndex = -1;

		(wrapper.vm as unknown as { focusSearch: () => void }).focusSearch();

		expect(document.activeElement).toBe(target);
		wrapper.unmount();
	});
});
