import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { computed, ref } from 'vue';
import RecipeLinesSelection from './RecipeLinesSelection.vue';
import { buildIngredient, buildLine, leaf } from '~/test/drink.fixtures';
import type { DrinkRecipeLineForm } from '~/types/drink.types';

const gin = buildIngredient('gin', 'Gin');
const rum = buildIngredient('rum', 'Rum');
const mint = buildIngredient('mint', 'Mint', [leaf]);
const foam = buildIngredient('foam', 'Foam', []);

const mockOptions = ref([gin, rum, mint, foam]);
const mockUseIngredientSearch = vi.fn((_scope?: string) => ({
	options: computed(() => mockOptions.value),
	searchTerm: ref(''),
	loading: ref(false),
	loadNextPage: vi.fn()
}));

vi.stubGlobal('useI18n', () => ({
	t: (key: string, params?: Record<string, unknown>) =>
		params ? `${key}:${JSON.stringify(params)}` : key,
	locale: ref('en')
}));
vi.stubGlobal('useIngredientSearch', mockUseIngredientSearch);

const SearchStub = {
	props: ['options', 'id'],
	emits: ['select', 'load-more', 'update:searchTerm'],
	template: '<div data-testid="search" :id="id"><slot name="prefix" /></div>'
};
const ItemStub = {
	props: [
		'line',
		'index',
		'total',
		'kind',
		'idPrefix',
		'quantityError',
		'unitError',
		'qualifierError'
	],
	emits: ['update:line', 'moveUp', 'moveDown', 'remove', 'blur'],
	template: '<li data-testid="item">{{ index + 1 }}. {{ line.ingredient.id }}</li>'
};

const mountSelection = (props: Record<string, unknown> = {}) =>
	mount(RecipeLinesSelection, {
		props: { lines: [], kind: 'ingredients', ...props },
		global: {
			stubs: {
				Label: { props: ['for'], template: '<label :for="$props.for"><slot /></label>' },
				Search: SearchStub,
				SearchIcon: true,
				ErrorMessage: {
					props: ['value'],
					template: '<span data-testid="error">{{ value }}</span>'
				},
				RecipeLineItem: ItemStub
			},
			mocks: {
				$t: (key: string, params?: Record<string, unknown>) =>
					params ? `${key}:${JSON.stringify(params)}` : key
			}
		}
	});
const lastLines = (wrapper: ReturnType<typeof mountSelection>) =>
	wrapper.emitted('update:lines')?.at(-1)?.[0] as DrinkRecipeLineForm[];
const announcement = (wrapper: ReturnType<typeof mountSelection>) =>
	wrapper.find('[data-testid="recipe-lines-announcement"]').text();

describe('RecipeLinesSelection', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockOptions.value = [gin, rum, mint, foam];
	});

	it('searches on its own for each list, so the ingredients and the garnishes do not share options', () => {
		mountSelection({ kind: 'garnishes' });

		expect(mockUseIngredientSearch).toHaveBeenCalledWith('garnishes');
	});

	it('uses the wording of the list it is for', () => {
		const wrapper = mountSelection({ kind: 'garnishes' });

		expect(wrapper.text()).toContain('organisms.recipeLines.kinds.garnishes.searchLabel');
		expect(wrapper.text()).toContain('organisms.recipeLines.kinds.garnishes.empty');
	});

	it('explains that the list is empty', () => {
		const wrapper = mountSelection();

		expect(wrapper.findAll('[data-testid="item"]')).toHaveLength(0);
		expect(wrapper.text()).toContain('organisms.recipeLines.kinds.ingredients.empty');
	});

	it('renders a card per line, in order', () => {
		const wrapper = mountSelection({ lines: [buildLine(gin), buildLine(rum)] });

		expect(wrapper.findAll('[data-testid="item"]').map((item) => item.text())).toEqual([
			'1. gin',
			'2. rum'
		]);
	});

	it('offers the found ingredients that are not in the list yet', () => {
		const wrapper = mountSelection({ lines: [buildLine(gin)] });

		expect(
			wrapper
				.findComponent(SearchStub)
				.props('options')
				.map((o: { value: string }) => o.value)
		).toEqual(['rum', 'mint', 'foam']);
	});

	describe('adding', () => {
		it('adds an ingredient with an exact amount in its first unit, to be filled in', async () => {
			const wrapper = mountSelection();

			wrapper.findComponent(SearchStub).vm.$emit('select', { label: 'Gin', value: 'gin' });

			expect(lastLines(wrapper)).toEqual([
				{
					ingredient: gin,
					optional: false,
					amount: { type: 'exact', quantity: 0, unitId: 'ml' }
				}
			]);
			await wrapper.vm.$nextTick();
			expect(announcement(wrapper)).toContain('announcements.added');
		});

		it('starts a garnish at one piece', () => {
			const wrapper = mountSelection({ kind: 'garnishes' });

			wrapper.findComponent(SearchStub).vm.$emit('select', { label: 'Mint', value: 'mint' });

			expect(lastLines(wrapper)[0]!.amount).toEqual({
				type: 'exact',
				quantity: 1,
				unitId: 'leaf'
			});
		});

		it('adds an ingredient with no units without an amount to measure', () => {
			const wrapper = mountSelection();

			wrapper.findComponent(SearchStub).vm.$emit('select', { label: 'Foam', value: 'foam' });

			expect(lastLines(wrapper)[0]!.amount).toEqual({ type: 'none' });
		});

		it('keeps the lines already in the list and ignores an ingredient that was not found', () => {
			const existing = buildLine(gin);
			const wrapper = mountSelection({ lines: [existing] });

			wrapper.findComponent(SearchStub).vm.$emit('select', { label: '?', value: 'unknown' });
			expect(wrapper.emitted('update:lines')).toBeUndefined();

			wrapper.findComponent(SearchStub).vm.$emit('select', { label: 'Rum', value: 'rum' });
			expect(lastLines(wrapper).map((line) => line.ingredient.id)).toEqual(['gin', 'rum']);
		});
	});

	describe('editing', () => {
		it('replaces the line that changed', () => {
			const wrapper = mountSelection({ lines: [buildLine(gin), buildLine(rum)] });
			const changed = { ...buildLine(rum), optional: true };

			wrapper.findAllComponents(ItemStub)[1]!.vm.$emit('update:line', changed);

			expect(lastLines(wrapper)).toEqual([buildLine(gin), changed]);
		});

		it('moves a line up and announces it', async () => {
			const wrapper = mountSelection({ lines: [buildLine(gin), buildLine(rum)] });

			wrapper.findAllComponents(ItemStub)[1]!.vm.$emit('moveUp');

			expect(lastLines(wrapper).map((line) => line.ingredient.id)).toEqual(['rum', 'gin']);
			await wrapper.vm.$nextTick();
			expect(announcement(wrapper)).toContain('"position":1');
		});

		it('ignores moves past the ends of the list', () => {
			const wrapper = mountSelection({ lines: [buildLine(gin), buildLine(rum)] });

			wrapper.findAllComponents(ItemStub)[0]!.vm.$emit('moveUp');
			wrapper.findAllComponents(ItemStub)[1]!.vm.$emit('moveDown');

			expect(wrapper.emitted('update:lines')).toBeUndefined();
		});

		it('removes a line and announces it', async () => {
			const wrapper = mountSelection({ lines: [buildLine(gin), buildLine(rum)] });

			wrapper.findAllComponents(ItemStub)[0]!.vm.$emit('remove');

			expect(lastLines(wrapper).map((line) => line.ingredient.id)).toEqual(['rum']);
			await wrapper.vm.$nextTick();
			expect(announcement(wrapper)).toContain('announcements.removed');
		});

		it('passes the blur up so the form validates', () => {
			const wrapper = mountSelection({ lines: [buildLine(gin)] });

			wrapper.findComponent(ItemStub).vm.$emit('blur');

			expect(wrapper.emitted('blur')).toHaveLength(1);
		});
	});

	describe('errors', () => {
		it('asks the form for the errors of each field of each line, by list and position', () => {
			const checkError = vi.fn(() => '');
			mountSelection({
				lines: [buildLine(gin), buildLine(rum)],
				kind: 'garnishes',
				checkError
			});

			expect(checkError).toHaveBeenCalledWith('garnishes.1.amount.quantity');
			expect(checkError).toHaveBeenCalledWith('garnishes.1.amount.unitId');
			expect(checkError).toHaveBeenCalledWith('garnishes.0.amount.qualifier');
		});

		it('shows the error of the whole list', () => {
			const wrapper = mountSelection({
				checkError: (field: string) =>
					field === 'ingredients' ? 'errors.drinks.ingredients' : ''
			});

			expect(wrapper.find('[data-testid="error"]').text()).toBe('errors.drinks.ingredients');
		});
	});
});
