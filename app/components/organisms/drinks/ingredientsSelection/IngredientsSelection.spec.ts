import { flushPromises, mount } from '@vue/test-utils';
import type { SortableEvent } from 'sortablejs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { computed, ref } from 'vue';
import IngredientsSelection from './IngredientsSelection.vue';

// Captures the Sortable options; `moveArrayElement` stays real so the drop handler is exercised.
const sortableOptions = vi.hoisted(() => ({
	current: undefined as Record<string, unknown> | undefined
}));
vi.mock('@vueuse/integrations/useSortable', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@vueuse/integrations/useSortable')>();
	return {
		...actual,
		useSortable: vi.fn((_el: unknown, _list: unknown, options: Record<string, unknown>) => {
			sortableOptions.current = options;
			return { start: vi.fn(), stop: vi.fn(), option: vi.fn() };
		})
	};
});

const buildIngredient = (id: string, name: string) => ({
	id,
	translations: { en: { name }, pt: { name } },
	category: { translations: { en: { name: 'Spirit' }, pt: { name: 'Destilado' } } },
	units: [
		{
			id: 'ml',
			symbol: 'ml',
			allowDecimal: true,
			translations: {
				en: { name: 'milliliter', namePlural: 'milliliters' },
				pt: { name: 'mililitro', namePlural: 'mililitros' }
			}
		}
	]
});
// A drink line with an exact amount in the ingredient's first unit.
const exactLine = (quantity: number, ingredient: ReturnType<typeof buildIngredient>) => ({
	ingredient,
	amount: { type: 'exact' as const, quantity, unit: ingredient.units[0] },
	optional: false
});
// The same line as the list sends it.
const exactRequest = (ingredientId: string, quantity: number) => ({
	ingredientId,
	amount: { type: 'exact', quantity, unitId: 'ml' },
	optional: false
});

type TestIngredient = ReturnType<typeof buildIngredient>;

const mockSelected = ref<TestIngredient[]>([]);
const mockOptions = ref<TestIngredient[]>([]);
const mockHandleSelect = vi.fn((option: { value: string }) => {
	const found = mockOptions.value.find((ingredient) => ingredient.id === option.value);
	if (found) mockSelected.value = [...mockSelected.value, found];
});
const mockMoveSelected = vi.fn((from: number, to: number) => {
	const list = [...mockSelected.value];
	const [moved] = list.splice(from, 1);
	list.splice(to, 0, moved!);
	mockSelected.value = list;
});

vi.stubGlobal('useI18n', () => ({
	t: (key: string, params?: Record<string, unknown>) =>
		params ? `${key}:${JSON.stringify(params)}` : key,
	locale: ref('en')
}));
vi.stubGlobal('useIngredientSearch', () => ({
	options: computed(() => mockOptions.value),
	searchTerm: ref(''),
	loading: ref(false),
	selected: computed({
		get: () => mockSelected.value,
		set: (value) => (mockSelected.value = value)
	}),
	handleSelect: mockHandleSelect,
	handleRemoveSelected: (option: { value: string }) => {
		mockSelected.value = mockSelected.value.filter(
			(ingredient) => ingredient.id !== option.value
		);
	},
	initSelected: (ingredients: TestIngredient[]) => (mockSelected.value = [...ingredients]),
	moveSelected: mockMoveSelected,
	loadNextPage: vi.fn()
}));

const SearchStub = {
	props: ['options'],
	emits: ['select'],
	template: '<div data-testid="search" />'
};

const ItemStub = {
	props: ['ingredient', 'index', 'total', 'quantity', 'error'],
	emits: ['update:quantity', 'moveUp', 'moveDown', 'remove', 'blur'],
	template: '<li data-testid="item">{{ index + 1 }}. {{ ingredient.id }} = {{ quantity }}</li>'
};

const mountSelection = (props = {}) =>
	mount(IngredientsSelection, {
		props,
		global: {
			stubs: {
				Search: SearchStub,
				IngredientsSelectionItem: ItemStub,
				Label: { template: '<label><slot /></label>' },
				ErrorMessage: {
					props: ['value'],
					template: '<span data-testid="error">{{ value }}</span>'
				},
				SearchIcon: true
			},
			mocks: { $t: (key: string) => key }
		}
	});

const announcement = (wrapper: ReturnType<typeof mountSelection>) =>
	wrapper.find('[data-testid="ingredients-announcement"]').text();

describe('IngredientsSelection', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockSelected.value = [];
		mockOptions.value = [buildIngredient('gin', 'Gin'), buildIngredient('rum', 'Rum')];
	});

	it('explains how to start while the list is empty', () => {
		const wrapper = mountSelection();

		expect(wrapper.find('ol').exists()).toBe(false);
		expect(wrapper.text()).toContain('organisms.ingredientsSelection.empty');
	});

	it('offers the search results with their category and unit', () => {
		const options = mountSelection().findComponent(SearchStub).props('options');

		expect(options[0]).toEqual({ label: 'Gin', value: 'gin', description: 'Spirit · ml' });
	});

	it('adds the selected result, announces it and emits the ingredients', async () => {
		const wrapper = mountSelection();

		wrapper.findComponent(SearchStub).vm.$emit('select', { label: 'Gin', value: 'gin' });
		await wrapper.vm.$nextTick();

		expect(wrapper.findAll('[data-testid="item"]').map((item) => item.text())).toEqual([
			'1. gin = 0'
		]);
		expect(announcement(wrapper)).toContain('announcements.added');
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[exactRequest('gin', 0)]]);
	});

	it('loads the drink ingredients with their quantities, in order', () => {
		const wrapper = mountSelection({
			initialIngredients: [
				exactLine(50, buildIngredient('rum', 'Rum')),
				exactLine(20, buildIngredient('gin', 'Gin'))
			]
		});

		expect(wrapper.findAll('[data-testid="item"]').map((item) => item.text())).toEqual([
			'1. rum = 50',
			'2. gin = 20'
		]);
	});

	it('moves an ingredient with the arrows, announces it and emits the new order', async () => {
		const wrapper = mountSelection({
			initialIngredients: [
				exactLine(50, buildIngredient('rum', 'Rum')),
				exactLine(20, buildIngredient('gin', 'Gin'))
			]
		});

		wrapper.findAllComponents(ItemStub)[1]!.vm.$emit('moveUp');
		await wrapper.vm.$nextTick();

		expect(mockMoveSelected).toHaveBeenCalledWith(1, 0);
		expect(announcement(wrapper)).toContain('"position":1');
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
			[exactRequest('gin', 20), exactRequest('rum', 50)]
		]);
	});

	it('configures Sortable for the drag handle and follows the conditional list element', () => {
		mountSelection();

		expect(sortableOptions.current).toMatchObject({
			watchElement: true,
			handle: '[data-drag-handle]',
			animation: 150,
			ghostClass: 'ingredients-selection-ghost',
			chosenClass: 'ingredients-selection-chosen'
		});
	});

	it('reorders on drop, keeps the DOM owned by Vue and announces the move', async () => {
		const wrapper = mountSelection({
			initialIngredients: [
				exactLine(50, buildIngredient('rum', 'Rum')),
				exactLine(20, buildIngredient('gin', 'Gin'))
			]
		});
		const list = wrapper.find('ol').element;
		const dragged = wrapper.findAll('[data-testid="item"]')[1]!.element;
		// Sortable has already moved the node by the time it fires onUpdate.
		list.insertBefore(dragged, list.firstChild);

		const onUpdate = sortableOptions.current!.onUpdate as (event: SortableEvent) => void;
		onUpdate({
			oldIndex: 1,
			newIndex: 0,
			item: dragged,
			from: list
		} as unknown as SortableEvent);
		await flushPromises();

		expect(mockSelected.value.map(({ id }) => id)).toEqual(['gin', 'rum']);
		expect(wrapper.findAll('[data-testid="item"]').map((item) => item.text())).toEqual([
			'1. gin = 20',
			'2. rum = 50'
		]);
		expect(announcement(wrapper)).toContain('"position":1');
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
			[exactRequest('gin', 20), exactRequest('rum', 50)]
		]);
	});

	it('ignores moves past the ends of the list', () => {
		const wrapper = mountSelection({
			initialIngredients: [exactLine(50, buildIngredient('rum', 'Rum'))]
		});

		wrapper.findComponent(ItemStub).vm.$emit('moveUp');

		expect(mockMoveSelected).not.toHaveBeenCalled();
	});

	it('removes an ingredient and announces it', async () => {
		const wrapper = mountSelection({
			initialIngredients: [exactLine(50, buildIngredient('rum', 'Rum'))]
		});

		wrapper.findComponent(ItemStub).vm.$emit('remove');
		await wrapper.vm.$nextTick();

		expect(wrapper.findAll('[data-testid="item"]')).toHaveLength(0);
		expect(announcement(wrapper)).toContain('announcements.removed');
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[]]);
	});

	it('updates the quantity of an ingredient', async () => {
		const wrapper = mountSelection({
			initialIngredients: [exactLine(50, buildIngredient('rum', 'Rum'))]
		});

		wrapper.findComponent(ItemStub).vm.$emit('update:quantity', 60);
		await wrapper.vm.$nextTick();

		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[exactRequest('rum', 60)]]);
	});

	it('sends back, as they came, the lines whose amount this list does not edit', async () => {
		const mint = buildIngredient('mint', 'Mint');
		const wrapper = mountSelection({
			initialIngredients: [
				exactLine(50, buildIngredient('rum', 'Rum')),
				{
					ingredient: mint,
					amount: { type: 'qualitative', qualifier: 'top_up' },
					optional: true
				},
				{
					ingredient: buildIngredient('foam', 'Foam'),
					amount: { type: 'none' },
					optional: false
				}
			]
		});
		wrapper.findAllComponents(ItemStub)[0]!.vm.$emit('update:quantity', 60);
		await wrapper.vm.$nextTick();
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
			[
				exactRequest('rum', 60),
				{
					ingredientId: 'mint',
					amount: { type: 'qualitative', qualifier: 'top_up' },
					optional: true
				},
				{ ingredientId: 'foam', amount: { type: 'none' }, optional: false }
			]
		]);
	});
	it('shows the list error', () => {
		const wrapper = mountSelection({
			checkError: (field: string) =>
				field === 'ingredients' ? 'errors.drinks.ingredients' : ''
		});

		expect(wrapper.find('[data-testid="error"]').text()).toBe('errors.drinks.ingredients');
	});
});
