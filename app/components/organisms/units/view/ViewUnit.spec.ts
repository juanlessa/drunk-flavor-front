import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import ViewUnit from './ViewUnit.vue';

const mockRouterPush = vi.fn();
const mockRouterReplace = vi.fn();
const mockCanUpdate = ref<boolean | undefined>(false);

vi.stubGlobal('useNuxtApp', () => ({
	$api: { units: { getWithAuthorship: vi.fn() } },
	$router: { push: mockRouterPush, replace: mockRouterReplace }
}));
vi.stubGlobal('useLocalePath', () => (path: string) => path);
vi.stubGlobal('useI18n', () => ({
	t: (key: string) => key,
	locale: ref('en')
}));
vi.stubGlobal('useAuthoredRecord', () => ({
	record: ref({
		id: 'unit-1',
		translations: {
			en: { name: 'Milliliter', namePlural: 'Milliliters' },
			pt: { name: 'Mililitro', namePlural: 'Mililitros', gender: 'masculine' }
		},
		symbol: 'ml',
		spaceBeforeSymbol: true,
		allowDecimal: true,
		kind: 'volume',
		createdBy: 'other'
	}),
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
		'<div data-testid="field" :data-label="label" :data-help="help">{{ value }}<slot /></div>'
};
const ReadOnlySwitchStub = {
	props: ['checked'],
	template: '<span data-testid="switch" :data-checked="String(checked)" />'
};

const mountView = async () => {
	const wrapper = mount(ViewUnit, {
		props: { unitId: 'unit-1' },
		global: {
			stubs: {
				ReadOnlyFormView: ReadOnlyFormViewStub,
				ReadOnlyInput: ReadOnlyInputStub,
				ReadOnlySwitch: ReadOnlySwitchStub,
				FormSection: {
					props: ['title', 'description'],
					template: '<section :data-title="title"><slot /></section>'
				},
				Text: { template: '<p><slot /></p>' }
			},
			mocks: { $t: (key: string) => key }
		}
	});
	await flushPromises();
	return wrapper;
};

describe('ViewUnit', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockCanUpdate.value = false;
	});

	it('shows the unit read-only, titled with its name', async () => {
		const wrapper = await mountView();

		expect(wrapper.find('[data-testid="read-only-view"] h1').text()).toBe('Milliliter');

		const values = wrapper.findAll('[data-testid="field"]').map((field) => field.text());
		expect(values).toEqual(expect.arrayContaining(['Milliliter', 'Mililitros', 'ml']));
		expect(wrapper.find('[data-testid="unit-preview"]').exists()).toBe(true);
	});

	it('uses the labels and the help of the form', async () => {
		const wrapper = await mountView();
		const labels = wrapper
			.findAll('[data-testid="field"]')
			.map((f) => f.attributes('data-label'));
		expect(labels).toEqual([
			'organisms.unitForm.nameInput.label',
			'organisms.unitForm.namePluralInput.label',
			'organisms.unitForm.nameInput.label',
			'organisms.unitForm.namePluralInput.label',
			'molecules.genderField.label',
			'organisms.unitForm.symbolInput.label',
			'organisms.unitForm.kindInput.label'
		]);
		const gender = wrapper.find('[data-label="molecules.genderField.label"]');
		expect(gender.attributes('data-help')).toBe('molecules.genderField.help');
		expect(gender.text()).toBe('molecules.genderField.options.masculine');
	});

	it('shows each switch of the form, with its texts, as a read-only yes or no', async () => {
		const wrapper = await mountView();
		const expected = [
			['spaceBeforeSymbol', 'spaceBeforeSymbolInput', 'true'],
			['allowDecimal', 'allowDecimalInput', 'true'],
			['useIngredientName', 'useIngredientNameInput', 'false']
		];
		for (const [field, key, checked] of expected) {
			const row = wrapper.find(`[data-testid="toggle-${field}"]`);
			expect(row.text()).toContain(`organisms.unitForm.${key}.label`);
			expect(row.text()).toContain(`organisms.unitForm.${key}.help`);
			expect(row.find('[data-testid="switch"]').attributes('data-checked')).toBe(checked);
		}
	});

	it('goes back to the list', async () => {
		const wrapper = await mountView();

		await wrapper.find('[data-testid="back"]').trigger('click');

		expect(mockRouterPush).toHaveBeenCalledWith('/units');
	});

	it('sends who can edit to the edit form and shows nothing', async () => {
		mockCanUpdate.value = true;

		const wrapper = await mountView();

		expect(mockRouterReplace).toHaveBeenCalledWith('/units/unit-1/edit');
		expect(wrapper.find('[data-testid="read-only-view"]').exists()).toBe(false);
	});

	it('shows nothing until the permission is known', async () => {
		mockCanUpdate.value = undefined;

		const wrapper = await mountView();

		expect(mockRouterReplace).not.toHaveBeenCalled();
		expect(wrapper.find('[data-testid="read-only-view"]').exists()).toBe(false);
	});
});
