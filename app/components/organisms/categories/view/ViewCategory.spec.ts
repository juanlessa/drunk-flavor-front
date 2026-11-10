import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import ViewCategory from './ViewCategory.vue';

const mockRouterPush = vi.fn();
const mockRouterReplace = vi.fn();
const mockCanUpdate = ref<boolean | undefined>(false);

vi.stubGlobal('useNuxtApp', () => ({
	$api: { categories: { getWithAuthorship: vi.fn() } },
	$router: { push: mockRouterPush, replace: mockRouterReplace }
}));
vi.stubGlobal('useLocalePath', () => (path: string) => path);
vi.stubGlobal('useI18n', () => ({
	t: (key: string) => key,
	locale: ref('en')
}));
vi.stubGlobal('useAuthoredRecord', () => ({
	record: ref({
		id: 'cat-1',
		translations: { en: { name: 'Liqueur' }, pt: { name: 'Licor' } },
		isAlcoholic: true,
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
	props: ['label', 'value'],
	template: '<div data-testid="field" :data-label="label">{{ value }}<slot /></div>'
};
const ReadOnlySwitchStub = {
	props: ['checked'],
	template: '<span data-testid="switch" :data-checked="String(checked)" />'
};

const mountView = async () => {
	const wrapper = mount(ViewCategory, {
		props: { categoryId: 'cat-1' },
		global: {
			stubs: {
				ReadOnlyFormView: ReadOnlyFormViewStub,
				ReadOnlyInput: ReadOnlyInputStub,
				ReadOnlySwitch: ReadOnlySwitchStub,
				FormSection: { template: '<section><slot /></section>' },
				Text: { template: '<p><slot /></p>' }
			},
			mocks: { $t: (key: string) => key }
		}
	});
	await flushPromises();
	return wrapper;
};

describe('ViewCategory', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockCanUpdate.value = false;
	});

	it('shows the category read-only, titled with its name', async () => {
		const wrapper = await mountView();

		expect(wrapper.find('[data-testid="read-only-view"] h1').text()).toBe('Liqueur');

		const values = wrapper.findAll('[data-testid="field"]').map((field) => field.text());
		expect(values).toContain('Liqueur');
		expect(values).toContain('Licor');
	});

	it('uses the labels of the form', async () => {
		const wrapper = await mountView();

		const labels = wrapper
			.findAll('[data-testid="field"]')
			.map((f) => f.attributes('data-label'));
		expect(labels).toEqual([
			'organisms.categoryForm.nameInput.label',
			'organisms.categoryForm.nameInput.label'
		]);
	});

	it('shows the alcoholic switch of the form, with its texts, as a read-only yes or no', async () => {
		const wrapper = await mountView();

		const row = wrapper.find('[data-testid="toggle-isAlcoholic"]');
		expect(row.text()).toContain('organisms.categoryForm.isAlcoholicInput.label');
		expect(row.text()).toContain('organisms.categoryForm.isAlcoholicInput.help');
		expect(row.find('[data-testid="switch"]').attributes('data-checked')).toBe('true');
	});

	it('goes back to the list', async () => {
		const wrapper = await mountView();

		await wrapper.find('[data-testid="back"]').trigger('click');

		expect(mockRouterPush).toHaveBeenCalledWith('/categories');
	});

	it('sends who can edit to the edit form and shows nothing', async () => {
		mockCanUpdate.value = true;

		const wrapper = await mountView();

		expect(mockRouterReplace).toHaveBeenCalledWith('/categories/cat-1/edit');
		expect(wrapper.find('[data-testid="read-only-view"]').exists()).toBe(false);
	});

	it('shows nothing until the permission is known', async () => {
		mockCanUpdate.value = undefined;

		const wrapper = await mountView();

		expect(mockRouterReplace).not.toHaveBeenCalled();
		expect(wrapper.find('[data-testid="read-only-view"]').exists()).toBe(false);
	});
});
