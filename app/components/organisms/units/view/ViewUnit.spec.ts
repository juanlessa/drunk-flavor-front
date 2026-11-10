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
	const wrapper = mount(ViewUnit, {
		props: { unitId: 'unit-1' },
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
