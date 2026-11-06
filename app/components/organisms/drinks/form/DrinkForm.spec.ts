import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import DrinkForm from './DrinkForm.vue';
import type { DrinkFormState } from '~/types/drink.types';

const buildState = (): DrinkFormState => ({
	form: {
		translations: {
			en: { name: 'Mojito', method: 'Muddle and shake.' },
			pt: { name: 'Mojito', method: 'Macere e bata.' }
		},
		ingredients: [{ ingredientId: 'rum', quantity: 60 }]
	},
	cover: undefined,
	thumbnail: undefined,
	errors: [],
	displayErrors: false,
	defaultIngredients: []
});

const mockFormState = ref<DrinkFormState>(buildState());
const mockValidateForm = vi.fn();
const mockUpdateFormState = vi.fn();

vi.stubGlobal('useLocalePath', () => (path: string) => path);
vi.stubGlobal('useDrinkForm', () => ({
	formState: mockFormState,
	checkError: () => '',
	validateForm: mockValidateForm,
	updateFormState: mockUpdateFormState
}));

const FormStub = {
	emits: ['submit', 'cancel'],
	template: '<form @submit.prevent="$emit(\'submit\')"><slot /><slot name="buttons" /></form>'
};
const DropZoneStub = {
	props: ['id', 'modelValue', 'aspect', 'previewUrl'],
	template:
		'<div data-testid="drop-zone" :id="id" :data-aspect="aspect" :data-preview="previewUrl" />'
};
const IngredientsSelectionStub = {
	props: ['modelValue', 'initialIngredients', 'checkError'],
	template: '<div data-testid="ingredients" :data-count="initialIngredients.length" />'
};

const mountForm = (props = {}) =>
	mount(DrinkForm, {
		props: { title: 'New drink', submitLabel: 'Create drink', ...props },
		global: {
			stubs: {
				Form: FormStub,
				FormSection: {
					props: ['title', 'description'],
					template: '<section :data-title="title"><slot /></section>'
				},
				Anchor: { props: ['to'], template: '<a :href="to"><slot /></a>' },
				Heading: { template: '<h1><slot /></h1>' },
				Text: { template: '<p><slot /></p>' },
				Label: { template: '<label><slot /></label>' },
				InputWrapper: {
					template: '<div><slot name="label" /><slot /><slot name="error" /></div>'
				},
				InputText: {
					props: ['id', 'modelValue'],
					template: '<input :id="id" :value="modelValue" />'
				},
				InputTextArea: {
					props: ['id', 'modelValue'],
					template: '<textarea :id="id" :value="modelValue" />'
				},
				ErrorMessage: true,
				DropZone: DropZoneStub,
				IngredientsSelection: IngredientsSelectionStub,
				Button: {
					props: ['type'],
					template: '<button :type="type ?? \'button\'"><slot /></button>'
				},
				ArrowLeftIcon: true
			},
			mocks: { $t: (key: string) => key }
		}
	});

const drink = {
	id: 'mojito',
	translations: buildState().form.translations,
	ingredients: [{ quantity: 60, ingredient: { id: 'rum' } }],
	thumbnail: { name: 'thumb', mimetype: 'image/png', url: '/mojito-thumb.png' },
	cover: { name: 'cover', mimetype: 'image/png', url: '/mojito-cover.png' },
	avgRating: 0,
	ratingsCount: 0,
	createdAt: new Date(),
	updatedAt: new Date()
};

describe('DrinkForm', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockFormState.value = buildState();
	});

	it('renders the page header with a link back to the drinks list', () => {
		const wrapper = mountForm();

		expect(wrapper.find('h1').text()).toBe('New drink');
		expect(wrapper.find('a').attributes('href')).toBe('/drinks');
	});

	it('groups the fields in the recipe, ingredients and images sections', () => {
		const titles = mountForm()
			.findAll('section')
			.map((section) => section.attributes('data-title'));

		expect(titles).toEqual([
			'organisms.drinkForm.recipeSection.title',
			'organisms.drinkForm.ingredientsSection.title',
			'organisms.drinkForm.imagesSection.title'
		]);
	});

	it('renders a name and a method field per language', () => {
		const wrapper = mountForm();

		expect(wrapper.findAll('input').map((input) => input.attributes('id'))).toEqual([
			'en-name',
			'pt-name'
		]);
		expect(wrapper.findAll('textarea').map((input) => input.attributes('id'))).toEqual([
			'en-method',
			'pt-method'
		]);
	});

	it('shapes the thumbnail as a square and the cover as a wide frame', () => {
		const zones = mountForm().findAll('[data-testid="drop-zone"]');

		expect(
			zones.map((zone) => [zone.attributes('id'), zone.attributes('data-aspect')])
		).toEqual([
			['thumbnail', 'square'],
			['cover', 'wide']
		]);
	});

	it('loads the drink being edited, with its ingredients and current images', () => {
		const wrapper = mountForm({ drink });
		const zones = wrapper.findAll('[data-testid="drop-zone"]');

		expect(mockUpdateFormState).toHaveBeenCalled();
		expect(wrapper.find('[data-testid="ingredients"]').attributes('data-count')).toBe('1');
		expect(zones[0]!.attributes('data-preview')).toBe('/mojito-thumb.png');
		expect(zones[1]!.attributes('data-preview')).toBe('/mojito-cover.png');
	});

	it('emits the form and the chosen images when it is valid', async () => {
		const thumbnail = new File(['a'], 'thumb.png', { type: 'image/png' });
		mockFormState.value.thumbnail = thumbnail;
		const wrapper = mountForm();

		await wrapper.find('form').trigger('submit');

		expect(mockValidateForm).toHaveBeenCalled();
		expect(wrapper.emitted('submit')?.[0]?.[0]).toEqual({
			form: mockFormState.value.form,
			cover: undefined,
			thumbnail
		});
	});

	it('does not emit while there are validation errors', async () => {
		mockFormState.value.errors = [
			{ field: 'ingredients', message: 'errors.drinks.ingredients' }
		];
		const wrapper = mountForm();

		await wrapper.find('form').trigger('submit');

		expect(wrapper.emitted('submit')).toBeUndefined();
	});

	it('emits cancel from the cancel button', async () => {
		const wrapper = mountForm();
		const cancel = wrapper
			.findAll('button')
			.find((button) => button.text() === 'organisms.drinkForm.cancelButton');

		await cancel!.trigger('click');

		expect(wrapper.emitted('cancel')).toHaveLength(1);
	});
});
