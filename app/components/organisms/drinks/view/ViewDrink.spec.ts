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

const ReadOnlyFormViewStub = {
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
				ReadOnlyFormView: ReadOnlyFormViewStub,
				ReadOnlyInput: {
					props: ['label', 'value'],
					template:
						'<div data-testid="field" :data-label="label">{{ value }}<slot /></div>'
				},
				ReadOnlyRecipeLine: {
					props: ['line', 'index', 'kind'],
					template:
						'<li data-testid="recipe-line" :data-kind="kind" :data-index="index">{{ line.ingredient.translations.en.name }}</li>'
				},
				FormSection: {
					props: ['title', 'description'],
					template:
						'<section :data-title="title" :data-description="description"><slot /></section>'
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

	it('lists the ingredients and the garnishes, in order, as the lines of the form', async () => {
		const wrapper = await mountView();

		const ingredients = wrapper.findAll(
			'[data-testid="ingredients-section"] [data-testid="recipe-line"]'
		);
		expect(ingredients.map((line) => line.text())).toEqual(['Licor 43', 'Ice']);
		expect(ingredients.map((line) => line.attributes('data-index'))).toEqual(['0', '1']);
		const garnishes = wrapper.findAll(
			'[data-testid="garnishes-section"] [data-testid="recipe-line"]'
		);
		expect(garnishes.map((line) => line.text())).toEqual(['Coffee bean']);
		expect(garnishes[0]!.attributes('data-kind')).toBe('garnishes');
	});

	it('leaves the ingredient search out', async () => {
		const wrapper = await mountView();

		expect(wrapper.find('input').exists()).toBe(false);
		expect(wrapper.text()).not.toContain('searchLabel');
	});

	it('says when there are no garnishes', async () => {
		drink.value = { ...buildDrink(), garnishes: [] };

		const wrapper = await mountView();

		expect(wrapper.find('[data-testid="garnishes-section"]').text()).toBe(
			'organisms.drinkView.empty.garnishes'
		);
	});

	it('shows the method as written by hand, without the mode choice', async () => {
		const wrapper = await mountView();

		// The attributes given to each method field replace the test id of the stub.
		expect(wrapper.find('[data-testid="method-en"]').attributes('data-label')).toBe(
			'organisms.drinkForm.methodInput.label · languages.en'
		);
		expect(wrapper.find('[data-testid="method-pt"]').attributes('data-label')).toBe(
			'organisms.drinkForm.methodInput.label · languages.pt'
		);
		expect(wrapper.text()).not.toContain('organisms.drinkForm.methodMode');
	});

	it('uses the texts of the form for the images', async () => {
		const wrapper = await mountView();

		const images = wrapper.find('[data-title="organisms.drinkForm.imagesSection.title"]');
		expect(images.attributes('data-description')).toBe(
			'organisms.drinkForm.imagesSection.description'
		);
		expect(images.text()).toContain('organisms.drinkForm.thumbnailInput.help');
		expect(images.text()).toContain('organisms.drinkForm.coverInput.help');
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
