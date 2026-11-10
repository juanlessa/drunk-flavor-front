import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import ViewIngredient from './ViewIngredient.vue';

const mockRouterPush = vi.fn();
const mockRouterReplace = vi.fn();
const mockCanUpdate = ref<boolean | undefined>(false);

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
	record: ref({
		id: 'ing-1',
		translations: {
			en: { name: 'Coffee liqueur', description: 'Sweet liqueur' },
			pt: { name: 'Licor de café', gender: 'masculine' }
		},
		category: { id: 'c', translations: { en: { name: 'Liqueur' }, pt: { name: 'Licor' } } },
		kind: 'branded',
		brand: 'Kahlúa',
		units: [
			{
				id: 'u1',
				symbol: 'ml',
				translations: { en: { name: 'Milliliter' }, pt: { name: 'Mililitro' } }
			},
			{ id: 'u2', translations: { en: { name: 'Dash' }, pt: { name: 'Dash' } } }
		],
		createdBy: 'other'
	}),
	canUpdate: mockCanUpdate,
	error: ref(null)
}));

const ReadOnlyViewStub = {
	props: ['title', 'backTo', 'backLabel'],
	emits: ['back'],
	template:
		'<div data-testid="read-only-view"><h1>{{ title }}</h1><slot /><button data-testid="back" @click="$emit(\'back\')" /></div>'
};
const ReadOnlyFieldStub = {
	props: ['label', 'value', 'flag'],
	template: '<div data-testid="field" :data-label="label">{{ value }}<slot /></div>'
};

const mountView = async () => {
	const wrapper = mount(ViewIngredient, {
		props: { ingredientId: 'ing-1' },
		global: {
			stubs: {
				ReadOnlyView: ReadOnlyViewStub,
				ReadOnlyField: ReadOnlyFieldStub,
				FormSection: { template: '<section><slot /></section>' },
				Badge: { props: ['value'], template: '<span>{{ value }}</span>' },
				Text: { template: '<p><slot /></p>' }
			},
			mocks: { $t: (key: string) => key }
		}
	});
	await flushPromises();
	return wrapper;
};

describe('ViewIngredient', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockCanUpdate.value = false;
	});

	it('shows the ingredient read-only, titled with its name', async () => {
		const wrapper = await mountView();

		expect(wrapper.find('[data-testid="read-only-view"] h1').text()).toBe('Coffee liqueur');

		const text = wrapper.text();
		expect(text).toContain('Kahlúa');
		expect(text).toContain('Liqueur');
		expect(text).toContain('ml');
		expect(text).toContain('Dash');
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
