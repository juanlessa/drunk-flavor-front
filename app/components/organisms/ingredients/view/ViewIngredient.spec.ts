import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import ViewIngredient from './ViewIngredient.vue';

const mockRouterPush = vi.fn();
const mockRouterReplace = vi.fn();
const mockCanUpdate = ref<boolean | undefined>(false);

const milliliter = {
	id: 'u1',
	symbol: 'ml',
	kind: 'volume',
	translations: { en: { name: 'Milliliter' }, pt: { name: 'Mililitro' } }
};
const dash = {
	id: 'u2',
	kind: 'count',
	translations: { en: { name: 'Dash' }, pt: { name: 'Dash' } }
};
const baseIngredient = () => ({
	id: 'ing-1',
	translations: {
		en: { name: 'Coffee liqueur', description: 'Sweet liqueur' },
		pt: { name: 'Licor de café', gender: 'masculine' }
	},
	category: { id: 'c', translations: { en: { name: 'Liqueur' }, pt: { name: 'Licor' } } },
	kind: 'branded',
	brand: 'Kahlúa',
	units: [milliliter, dash] as Record<string, unknown>[],
	createdBy: 'other'
});
const mockRecord = ref(baseIngredient());

vi.stubGlobal('useNuxtApp', () => ({
	$api: { ingredients: { getWithAuthorship: vi.fn() } },
	$router: { push: mockRouterPush, replace: mockRouterReplace }
}));
vi.stubGlobal('useLocalePath', () => (path: string) => path);
vi.stubGlobal('useI18n', () => ({
	t: (key: string) => key,
	locale: ref('en')
}));
vi.stubGlobal('useAuthoredRecord', () => ({
	record: mockRecord,
	canUpdate: mockCanUpdate,
	error: ref(null)
}));

const ReadOnlyFormViewStub = {
	props: ['title', 'backTo', 'backLabel'],
	emits: ['back'],
	template:
		'<div data-testid="read-only-view"><h1>{{ title }}</h1><slot /><button data-testid="back" @click="$emit(\'back\')" /></div>'
};
const ReadOnlyInputStub = {
	props: ['label', 'value', 'help'],
	template:
		'<div data-testid="field" :data-label="label" :data-help="help"><span data-testid="value">{{ value }}<slot /></span><slot name="after" /></div>'
};

const mountView = async () => {
	const wrapper = mount(ViewIngredient, {
		props: { ingredientId: 'ing-1' },
		global: {
			stubs: {
				ReadOnlyFormView: ReadOnlyFormViewStub,
				ReadOnlyInput: ReadOnlyInputStub,
				ReadOnlySwitch: {
					props: ['checked'],
					template: '<span data-testid="switch" :data-checked="String(checked)" />'
				},
				ReadOnlyChoiceCards: {
					props: ['modelValue', 'options', 'label'],
					template:
						'<ul data-testid="kind" :data-value="modelValue" :aria-label="label"><li v-for="o in options" :key="o.value">{{ o.label }}</li></ul>'
				},
				FormSection: { template: '<section><slot /></section>' },
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
const field = (wrapper: Awaited<ReturnType<typeof mountView>>, label: string) =>
	wrapper.findAll(`[data-label="${label}"]`);

describe('ViewIngredient', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockCanUpdate.value = false;
		mockRecord.value = baseIngredient();
	});

	it('shows the ingredient read-only, titled with its name', async () => {
		const wrapper = await mountView();

		expect(wrapper.find('[data-testid="read-only-view"] h1').text()).toBe('Coffee liqueur');
		const text = wrapper.text();
		expect(text).toContain('Kahlúa');
		expect(text).toContain('Liqueur');
		expect(text).toContain('Milliliter');
		expect(text).toContain('Dash');
	});

	it('shows the description with its short help and without the character counter', async () => {
		const wrapper = await mountView();

		const descriptions = field(wrapper, 'organisms.ingredientForm.descriptionInput.label');
		expect(descriptions).toHaveLength(2);
		expect(descriptions[0]?.attributes('data-help')).toBe(
			'organisms.ingredientForm.descriptionInput.help'
		);
		expect(wrapper.text()).not.toContain('organisms.ingredientForm.descriptionInput.counter');
	});

	it('shows the plural name only while a unit is written with the ingredient name', async () => {
		expect(
			field(await mountView(), 'organisms.ingredientForm.namePluralInput.label')
		).toHaveLength(0);

		mockRecord.value = {
			...baseIngredient(),
			units: [{ ...dash, useIngredientName: true }]
		};
		const plural = field(await mountView(), 'organisms.ingredientForm.namePluralInput.label');
		expect(plural).toHaveLength(2);
		expect(plural[0]?.attributes('data-help')).toBe(
			'organisms.ingredientForm.namePluralInput.help'
		);
	});

	it('shows the kind as the read-only cards of the form, then the brand', async () => {
		const wrapper = await mountView();

		const kind = wrapper.find('[data-testid="kind"]');
		expect(kind.attributes('data-value')).toBe('branded');
		expect(kind.attributes('aria-label')).toBe('organisms.ingredientForm.kindInput.legend');
		expect(kind.findAll('li').map((item) => item.text())).toEqual([
			'organisms.ingredientForm.kindInput.options.generic.label',
			'organisms.ingredientForm.kindInput.options.branded.label'
		]);
		expect(field(wrapper, 'organisms.ingredientForm.brandInput.label')).toHaveLength(1);
	});

	it('hides the brand of a generic ingredient', async () => {
		mockRecord.value = { ...baseIngredient(), kind: 'generic' };

		expect(field(await mountView(), 'organisms.ingredientForm.brandInput.label')).toHaveLength(
			0
		);
	});

	it('shows the default unit as the value, numbered and badged, and the others under it', async () => {
		const wrapper = await mountView();

		expect(wrapper.find('[data-testid="switch"]').attributes('data-checked')).toBe('true');
		const units = field(wrapper, 'organisms.ingredientForm.unitsSelection.label')[0];
		const value = units?.find('[data-testid="value"]');
		expect(value?.find('[data-testid="default-unit"]').text()).toContain('1. Milliliter');
		expect(value?.find('[data-testid="badge"]').text()).toBe(
			'organisms.ingredientForm.unitsSelection.defaultBadge'
		);
		const others = units?.findAll('[data-testid="other-units"] li') ?? [];
		expect(others).toHaveLength(1);
		// Only the name, without the kind summary the form shows.
		expect(others[0]?.text()).toBe('2. Dash');
	});

	it('has no list under the value when there is only one unit', async () => {
		mockRecord.value = { ...baseIngredient(), units: [milliliter] };

		const wrapper = await mountView();

		expect(wrapper.find('[data-testid="default-unit"]').text()).toContain('1. Milliliter');
		expect(wrapper.find('[data-testid="other-units"]').exists()).toBe(false);
	});

	it('shows an ingredient without units as not measurable, with no unit', async () => {
		mockRecord.value = { ...baseIngredient(), units: [] };

		const wrapper = await mountView();

		expect(wrapper.find('[data-testid="switch"]').attributes('data-checked')).toBe('false');
		expect(field(wrapper, 'organisms.ingredientForm.unitsSelection.label')).toHaveLength(0);
		const unit = field(wrapper, 'organisms.ingredientForm.unitInput.label')[0];
		expect(unit?.text()).toBe('organisms.ingredientForm.unitInput.none');
	});

	it('shows the preview of the form', async () => {
		const wrapper = await mountView();

		const preview = wrapper.find('[data-testid="ingredient-preview"]');
		expect(preview.exists()).toBe(true);
		expect(preview.text()).toContain('Sweet liqueur');
	});

	it('goes back to the list', async () => {
		const wrapper = await mountView();

		await wrapper.find('[data-testid="back"]').trigger('click');

		expect(mockRouterPush).toHaveBeenCalledWith('/ingredients');
	});

	it('sends who can edit to the edit form and shows nothing', async () => {
		mockCanUpdate.value = true;

		const wrapper = await mountView();

		expect(mockRouterReplace).toHaveBeenCalledWith('/ingredients/ing-1/edit');
		expect(wrapper.find('[data-testid="read-only-view"]').exists()).toBe(false);
	});

	it('shows nothing until the permission is known', async () => {
		mockCanUpdate.value = undefined;

		const wrapper = await mountView();

		expect(mockRouterReplace).not.toHaveBeenCalled();
		expect(wrapper.find('[data-testid="read-only-view"]').exists()).toBe(false);
	});
});
