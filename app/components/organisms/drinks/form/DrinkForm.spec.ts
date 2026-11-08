import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { computed, ref } from 'vue';
import DrinkForm from './DrinkForm.vue';
import PreparationPlanBuilder from '../preparation/PreparationPlanBuilder.vue';
import RecipeLinesSelection from '../recipeLines/RecipeLinesSelection.vue';
import type { Drink } from '~/domain/drink/drink.entity';
import type { ApiFieldError } from '~/domain/shared/api.types';
import { initEmptyDrinkForm } from '~/factories/drink.factory';
import { buildIngredient, buildLine, milliliter } from '~/test/drink.fixtures';
import type { DrinkFormState, PreparationPreviewState } from '~/types/drink.types';

const buildState = (): DrinkFormState => ({
	form: {
		...initEmptyDrinkForm(),
		translations: {
			en: { name: 'Mojito', method: 'Muddle and shake.' },
			pt: { name: 'Mojito', method: 'Macere e bata.' }
		},
		ingredients: [buildLine(buildIngredient('rum', 'Rum'))]
	},
	cover: undefined,
	thumbnail: undefined,
	errors: [],
	displayErrors: false
});

const mockFormState = ref<DrinkFormState>(buildState());
const mockValidateForm = vi.fn();
const mockUpdateFormState = vi.fn();
const mockGenerate = vi.fn();
const mockAddToast = vi.fn();
const mockPreview = ref<PreparationPreviewState>({
	loading: false,
	method: undefined,
	sentences: undefined,
	errors: [],
	warnings: [],
	stale: false
});

vi.stubGlobal('useLocalePath', () => (path: string) => path);
vi.stubGlobal('useI18n', () => ({ t: (key: string) => key, locale: ref('en') }));
vi.stubGlobal('useToast', () => ({ addToast: mockAddToast }));
vi.stubGlobal('useDrinkForm', () => ({
	formState: mockFormState,
	checkError: (field: string) =>
		mockFormState.value.errors.find((e) => e.field === field)?.message ?? '',
	validateForm: mockValidateForm,
	updateFormState: mockUpdateFormState
}));
vi.stubGlobal('usePreparationPreview', () => ({
	preview: computed(() => mockPreview.value),
	generate: mockGenerate
}));

const FormStub = {
	emits: ['submit', 'cancel'],
	template: '<form @submit.prevent="$emit(\'submit\')"><slot /><slot name="buttons" /></form>'
};
const DropZoneStub = {
	props: ['id', 'modelValue', 'aspect', 'previewUrl'],
	template: '<div :id="id" data-testid="dropzone" :data-preview="previewUrl" />'
};
const SelectionStub = {
	props: ['lines', 'kind', 'checkError'],
	emits: ['update:lines', 'blur'],
	template: '<div data-testid="lines" :data-kind="kind" :data-count="lines.length" />'
};
const BuilderStub = {
	props: ['plan', 'ingredients', 'garnishes', 'checkError', 'preview'],
	emits: ['update:plan', 'generate'],
	template: '<div data-testid="builder" />'
};
const RadioStub = {
	props: ['id', 'modelValue', 'options', 'label'],
	emits: ['update:modelValue'],
	template: '<div data-testid="method-mode" :data-value="modelValue" />'
};

const mountForm = (props: Record<string, unknown> = {}) =>
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
				Label: { props: ['for'], template: '<label :for="$props.for"><slot /></label>' },
				InputWrapper: {
					template: '<div><slot name="label" /><slot /><slot name="error" /></div>'
				},
				InputText: {
					props: ['id', 'modelValue', 'hasError'],
					emits: ['update:modelValue', 'blur'],
					template:
						'<input :id="id" :value="modelValue" :data-error="String(hasError)" />'
				},
				InputTextArea: {
					props: ['id', 'modelValue', 'hasError'],
					emits: ['update:modelValue', 'blur'],
					template:
						'<textarea :id="id" :value="modelValue" :data-error="String(hasError)" />'
				},
				ErrorMessage: {
					props: ['value'],
					template: '<span data-testid="error">{{ value }}</span>'
				},
				Button: {
					props: ['type'],
					template: '<button :type="type ?? \'button\'"><slot /></button>'
				},
				DropZone: DropZoneStub,
				RecipeLinesSelection: SelectionStub,
				PreparationPlanBuilder: BuilderStub,
				RadioCardGroup: RadioStub,
				ArrowLeftIcon: true
			},
			mocks: { $t: (key: string) => key }
		}
	});

const issue = (path: string): ApiFieldError => ({
	location: 'body',
	path,
	localeKey: `key.${path}`,
	message: path
});

describe('DrinkForm', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockFormState.value = buildState();
		mockPreview.value = {
			loading: false,
			method: undefined,
			sentences: undefined,
			errors: [],
			warnings: [],
			stale: false
		};
	});

	it('renders the page header with a link back to the drinks list', () => {
		const wrapper = mountForm();

		expect(wrapper.find('h1').text()).toBe('New drink');
		expect(wrapper.find('a').attributes('href')).toBe('/drinks');
	});

	it('groups the fields in the names, ingredients, garnishes, method and images sections, in that order', () => {
		const titles = mountForm()
			.findAll('section')
			.map((section) => section.attributes('data-title'));

		expect(titles).toEqual([
			'organisms.drinkForm.namesSection.title',
			'organisms.drinkForm.ingredientsSection.title',
			'organisms.drinkForm.garnishesSection.title',
			'organisms.drinkForm.methodSection.title',
			'organisms.drinkForm.imagesSection.title'
		]);
	});

	describe('names', () => {
		it('asks only for a name in each language in the first section', () => {
			const wrapper = mountForm();
			const [names] = wrapper.findAll('section');

			expect(names!.findAll('input').map((input) => input.attributes('id'))).toEqual([
				'en-name',
				'pt-name'
			]);
			expect(names!.find('textarea').exists()).toBe(false);
		});

		it('shows the error of each name', () => {
			mockFormState.value.errors = [
				{ field: 'translations.pt.name', message: 'errors.drinks.name' }
			];
			const wrapper = mountForm();

			expect(wrapper.find('#pt-name').attributes('data-error')).toBe('true');
			expect(wrapper.find('#en-name').attributes('data-error')).toBe('false');
		});
	});

	describe('ingredients and garnishes', () => {
		it('edits the ingredients and the garnishes in lists of their own', () => {
			mockFormState.value.form.garnishes = [
				buildLine(buildIngredient('mint', 'Mint')),
				buildLine(buildIngredient('lime', 'Lime'))
			];
			const lists = mountForm().findAllComponents(SelectionStub);

			expect(lists.map((list) => list.props('kind'))).toEqual(['ingredients', 'garnishes']);
			expect(lists.map((list) => list.props('lines').length)).toEqual([1, 2]);
		});

		it('writes the edited lines in the form and validates', async () => {
			const wrapper = mountForm();
			const [ingredients, garnishes] = wrapper.findAllComponents(SelectionStub);
			const line = buildLine(buildIngredient('gin', 'Gin'));

			ingredients!.vm.$emit('update:lines', [line]);
			garnishes!.vm.$emit('update:lines', [line]);
			await flushPromises();

			expect(mockFormState.value.form.ingredients).toEqual([line]);
			expect(mockFormState.value.form.garnishes).toEqual([line]);
			expect(mockValidateForm).toHaveBeenCalled();
		});
	});

	describe('method', () => {
		it('offers to build the method or to write it, starting on building it', () => {
			const radio = mountForm().findComponent(RadioStub);

			expect(radio.props('modelValue')).toBe('generated');
			expect(radio.props('options').map((o: { value: string }) => o.value)).toEqual([
				'generated',
				'manual'
			]);
		});

		it('shows only the two texts when the method is written by hand', () => {
			mockFormState.value.form.methodMode = 'manual';
			const wrapper = mountForm();

			expect(wrapper.findAll('textarea').map((area) => area.attributes('id'))).toEqual([
				'en-method',
				'pt-method'
			]);
			expect(wrapper.findComponent(BuilderStub).exists()).toBe(false);
		});

		it('shows the error of each text', () => {
			mockFormState.value.form.methodMode = 'manual';
			mockFormState.value.errors = [
				{ field: 'translations.en.method', message: 'errors.drinks.method' }
			];

			expect(mountForm().find('#en-method').attributes('data-error')).toBe('true');
		});

		it('shows only the builder when the method is built from steps', () => {
			mockFormState.value.form.methodMode = 'generated';
			const wrapper = mountForm();

			expect(wrapper.findAll('textarea')).toHaveLength(0);
			expect(wrapper.findComponent(BuilderStub).exists()).toBe(true);
		});

		it('gives the builder the plan and the lines it can point at', () => {
			mockFormState.value.form.methodMode = 'generated';
			const builder = mountForm().findComponent(BuilderStub);

			expect(builder.props('plan')).toEqual(mockFormState.value.form.preparation);
			expect(builder.props('ingredients')).toEqual(mockFormState.value.form.ingredients);
			expect(builder.props('garnishes')).toEqual(mockFormState.value.form.garnishes);
		});

		it('switches the way the method is given and validates', async () => {
			const wrapper = mountForm();

			wrapper.findComponent(RadioStub).vm.$emit('update:modelValue', 'manual');
			await flushPromises();

			expect(mockFormState.value.form.methodMode).toBe('manual');
			expect(mockValidateForm).toHaveBeenCalled();
		});

		it('ignores a way that does not exist', async () => {
			const wrapper = mountForm();

			wrapper.findComponent(RadioStub).vm.$emit('update:modelValue', 'telepathy');
			await flushPromises();

			expect(mockFormState.value.form.methodMode).toBe('generated');
		});

		it('writes the edited plan in the form', async () => {
			mockFormState.value.form.methodMode = 'generated';
			const wrapper = mountForm();
			const plan = {
				mixingVessel: 'pitcher',
				servingGlass: 'rocks',
				actions: [{ type: 'muddle' }]
			};

			wrapper.findComponent(BuilderStub).vm.$emit('update:plan', plan);
			await flushPromises();

			expect(mockFormState.value.form.preparation).toEqual(plan);
		});
	});

	describe('preview', () => {
		const generated = () => {
			mockFormState.value.form.methodMode = 'generated';
			return mountForm();
		};

		it('asks the backend for the preview when the recipe and the steps are fine', async () => {
			const wrapper = generated();

			wrapper.findComponent(BuilderStub).vm.$emit('generate');
			await flushPromises();

			expect(mockGenerate).toHaveBeenCalledTimes(1);
			expect(mockAddToast).not.toHaveBeenCalled();
		});

		it('does not ask when something the backend needs is wrong, and says so', async () => {
			mockValidateForm.mockImplementation(() => {
				mockFormState.value.errors = [
					{
						field: 'preparation.actions.0.items',
						message: 'errors.drinks.preparation.items'
					}
				];
			});
			const wrapper = generated();

			wrapper.findComponent(BuilderStub).vm.$emit('generate');
			await flushPromises();

			expect(mockGenerate).not.toHaveBeenCalled();
			expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
			expect(mockFormState.value.displayErrors).toBe(true);
			mockValidateForm.mockReset();
		});

		it.each(['ingredients', 'ingredients.0.amount.quantity', 'garnishes.1.amount.unitId'])(
			'is also stopped by an error in %s',
			async (field) => {
				mockValidateForm.mockImplementation(() => {
					mockFormState.value.errors = [{ field, message: 'x' }];
				});
				const wrapper = generated();

				wrapper.findComponent(BuilderStub).vm.$emit('generate');
				await flushPromises();

				expect(mockGenerate).not.toHaveBeenCalled();
				mockValidateForm.mockReset();
			}
		);

		it('is not stopped by an empty name, which the backend does not need', async () => {
			mockValidateForm.mockImplementation(() => {
				mockFormState.value.errors = [
					{ field: 'translations.en.name', message: 'errors.drinks.name' }
				];
			});
			const wrapper = generated();

			wrapper.findComponent(BuilderStub).vm.$emit('generate');
			await flushPromises();

			expect(mockGenerate).toHaveBeenCalledTimes(1);
			mockValidateForm.mockReset();
		});

		it('hands the builder what the backend said about the preview', () => {
			mockPreview.value = { ...mockPreview.value, errors: [issue('preparation.actions.1')] };
			mockFormState.value.form.methodMode = 'generated';

			const builder = mountForm().findComponent(BuilderStub);

			expect(builder.props('preview').errors.map((e: ApiFieldError) => e.path)).toEqual([
				'preparation.actions.1'
			]);
		});

		it('adds what the backend said when the drink was submitted', () => {
			mockPreview.value = { ...mockPreview.value, errors: [issue('preparation.actions.1')] };
			mockFormState.value.form.methodMode = 'generated';

			const builder = mountForm({ serverErrors: [issue('preparation')] }).findComponent(
				BuilderStub
			);

			expect(builder.props('preview').errors.map((e: ApiFieldError) => e.path)).toEqual([
				'preparation.actions.1',
				'preparation'
			]);
		});
	});

	describe('images', () => {
		const drink = {
			id: 'mojito',
			translations: buildState().form.translations,
			ingredients: [
				{
					ingredient: buildIngredient('rum', 'Rum'),
					amount: { type: 'exact', quantity: 60, unit: milliliter },
					optional: false
				}
			],
			garnishes: [],
			thumbnail: { name: 'thumb', mimetype: 'image/png', url: '/mojito-thumb.png' },
			cover: { name: 'cover', mimetype: 'image/png', url: '/mojito-cover.png' },
			avgRating: 0,
			ratingsCount: 0,
			createdAt: new Date(),
			updatedAt: new Date()
		} as Drink;

		it('previews the current thumbnail and cover of the drink being edited', () => {
			const zones = mountForm({ drink }).findAll('[data-testid="dropzone"]');

			expect(zones.map((zone) => zone.attributes('data-preview'))).toEqual([
				'/mojito-thumb.png',
				'/mojito-cover.png'
			]);
		});

		it('loads the drink being edited into the form', () => {
			mountForm({ drink });

			expect(mockUpdateFormState).toHaveBeenCalledWith(
				expect.objectContaining({
					methodMode: 'manual',
					ingredients: [
						expect.objectContaining({
							amount: { type: 'exact', quantity: 60, unitId: 'ml' }
						})
					]
				})
			);
		});

		it('does not load anything for a new drink', () => {
			mountForm();

			expect(mockUpdateFormState).not.toHaveBeenCalled();
		});
	});

	describe('submit and cancel', () => {
		it('validates before submitting, and submits the form with the images when it is fine', async () => {
			const wrapper = mountForm();

			await wrapper.find('form').trigger('submit');

			expect(mockValidateForm).toHaveBeenCalled();
			expect(mockFormState.value.displayErrors).toBe(true);
			expect(wrapper.emitted('submit')?.[0]).toEqual([
				{ form: mockFormState.value.form, cover: undefined, thumbnail: undefined }
			]);
		});

		it('does not submit while there are errors', async () => {
			mockValidateForm.mockImplementation(() => {
				mockFormState.value.errors = [
					{ field: 'ingredients', message: 'errors.drinks.ingredients' }
				];
			});
			const wrapper = mountForm();

			await wrapper.find('form').trigger('submit');

			expect(wrapper.emitted('submit')).toBeUndefined();
			mockValidateForm.mockReset();
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

	it('references the real selection and builder components it composes', () => {
		expect(RecipeLinesSelection).toBeDefined();
		expect(PreparationPlanBuilder).toBeDefined();
	});
});
