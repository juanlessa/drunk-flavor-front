import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import ViewDrink from './ViewDrink.vue';

const mockRouterPush = vi.fn();
const mockRouterReplace = vi.fn();
const mockCanUpdate = ref<boolean | undefined>(false);

const ml = {
	id: 'ml',
	symbol: 'ml',
	spaceBeforeSymbol: true,
	allowDecimal: true,
	kind: 'volume',
	translations: {
		en: { name: 'Milliliter', namePlural: 'Milliliters' },
		pt: { name: 'Mililitro', namePlural: 'Mililitros' }
	}
};
const ingredient = (id: string, name: string) => ({
	id,
	translations: { en: { name }, pt: { name } },
	category: { id: 'c', translations: { en: { name: 'Liqueur' }, pt: { name: 'Licor' } } },
	units: [ml],
	kind: 'generic'
});
const drink = ref<Record<string, unknown>>({});
const buildDrink = (images = true) => ({
	id: 'drink-1',
	translations: {
		en: { name: 'Carajillo', method: 'Add ice.\nPour.' },
		pt: { name: 'Carajillo', method: 'Adicione gelo.' }
	},
	ingredients: [
		{
			ingredient: ingredient('licor', 'Licor 43'),
			amount: { type: 'exact', quantity: 75, unit: ml },
			optional: false
		},
		{
			ingredient: ingredient('ice', 'Ice'),
			amount: { type: 'qualitative', qualifier: 'to_taste' },
			optional: true
		}
	],
	garnishes: [{ ingredient: ingredient('bean', 'Coffee bean'), amount: { type: 'none' } }],
	...(images ? { thumbnail: { url: '/thumb.png' }, cover: { url: '/cover.png' } } : {}),
	createdBy: 'other'
});

vi.stubGlobal('useNuxtApp', () => ({
	$api: { drinks: { getWithAuthorship: vi.fn() } },
	$router: { push: mockRouterPush, replace: mockRouterReplace }
}));
vi.stubGlobal('useLocalePath', () => (path: string) => path);
vi.stubGlobal('useI18n', () => ({ t: (key: string) => key, locale: ref('en') }));
vi.stubGlobal('useAuthoredRecord', () => ({
	record: drink,
	canUpdate: mockCanUpdate,
	error: ref(null)
}));

const ReadOnlyViewStub = {
	props: ['title', 'backTo', 'backLabel'],
	emits: ['back'],
	template:
		'<div data-testid="read-only-view"><h1>{{ title }}</h1><slot /><button data-testid="back" @click="$emit(\'back\')" /></div>'
};

const mountView = async () => {
	const wrapper = mount(ViewDrink, {
		props: { drinkId: 'drink-1' },
		global: {
			stubs: {
				ReadOnlyView: ReadOnlyViewStub,
				ReadOnlyField: {
					props: ['label', 'value'],
					template:
						'<div data-testid="field" :data-label="label">{{ value }}<slot /></div>'
				},
				FormSection: {
					props: ['title'],
					template: '<section :data-title="title"><slot /></section>'
				},
				Badge: {
					props: ['value'],
					template: '<span data-testid="badge">{{ value }}</span>'
				},
				Text: { template: '<p><slot /></p>' }
			},
			mocks: { $t: (key: string) => key }
		}
	});
	await flushPromises();
	return wrapper;
};

describe('ViewDrink', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockCanUpdate.value = false;
		drink.value = buildDrink();
	});

	it('shows the drink read-only, titled with its name', async () => {
		const wrapper = await mountView();

		expect(wrapper.find('[data-testid="read-only-view"] h1').text()).toBe('Carajillo');
	});

	it('lists the ingredients and garnishes in order, with their amounts', async () => {
		const lines = (await mountView()).findAll('[data-testid="recipe-line"]');

		expect(lines).toHaveLength(3);
		expect(lines[0]!.text()).toContain('1. Licor 43');
		expect(lines[0]!.text()).toContain('75 ml');
		expect(lines[1]!.text()).toContain('organisms.recipeLines.qualifier.options.to_taste');
		expect(lines[2]!.text()).toContain('organisms.recipeLines.amountType.options.none');
	});

	it('marks each ingredient as required or optional, and garnishes not at all', async () => {
		const lines = (await mountView()).findAll('[data-testid="recipe-line"]');

		expect(lines[0]!.find('[data-testid="badge"]').text()).toBe('organisms.drinkView.required');
		expect(lines[1]!.find('[data-testid="badge"]').text()).toBe('organisms.drinkView.optional');
		expect(lines[2]!.find('[data-testid="badge"]').exists()).toBe(false);
	});

	it('shows the method of every language', async () => {
		const text = (await mountView()).text();

		expect(text).toContain('Add ice.');
		expect(text).toContain('Adicione gelo.');
	});

	it('shows the thumbnail and the cover in the images block', async () => {
		const wrapper = await mountView();

		expect(wrapper.find('[data-testid="thumbnail"]').attributes('src')).toBe('/thumb.png');
		expect(wrapper.find('[data-testid="cover"]').attributes('src')).toBe('/cover.png');
	});

	it('says when an image is missing', async () => {
		drink.value = buildDrink(false);

		const wrapper = await mountView();

		expect(wrapper.find('[data-testid="thumbnail"]').exists()).toBe(false);
		expect(wrapper.text().match(/organisms\.drinkView\.noImage/g)).toHaveLength(2);
	});

	it('goes back to the list', async () => {
		const wrapper = await mountView();

		await wrapper.find('[data-testid="back"]').trigger('click');

		expect(mockRouterPush).toHaveBeenCalledWith('/drinks');
	});

	it('sends who can edit to the edit form and shows nothing', async () => {
		mockCanUpdate.value = true;

		const wrapper = await mountView();

		expect(mockRouterReplace).toHaveBeenCalledWith('/drinks/drink-1/edit');
		expect(wrapper.find('[data-testid="read-only-view"]').exists()).toBe(false);
	});

	it('shows nothing until the permission is known', async () => {
		mockCanUpdate.value = undefined;

		const wrapper = await mountView();

		expect(mockRouterReplace).not.toHaveBeenCalled();
		expect(wrapper.find('[data-testid="read-only-view"]').exists()).toBe(false);
	});
});
