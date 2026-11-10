import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, ref, Suspense } from 'vue';
import UpdateUnit from './UpdateUnit.vue';

const UnitFormStub = {
	template: '<div data-testid="unit-form" />',
	props: ['unitForm', 'title', 'submitLabel'],
	emits: ['submit', 'cancel']
};

const mockRouterBack = vi.fn();
const mockRouterReplace = vi.fn();
const mockApiUpdate = vi.fn();
const mockAddToast = vi.fn();
const mockCanUpdate = ref<boolean | undefined>(true);

vi.stubGlobal('useNuxtApp', () => ({
	$api: { units: { getWithAuthorship: vi.fn(), update: mockApiUpdate } },
	$router: { back: mockRouterBack, replace: mockRouterReplace }
}));
vi.stubGlobal('useToast', () => ({ addToast: mockAddToast }));
vi.stubGlobal('useLocalePath', () => (path: string) => path);
vi.stubGlobal('useI18n', () => ({ t: (key: string) => key }));
vi.stubGlobal('useAuthoredRecord', () => ({
	record: ref({
		id: 'unit-1',
		translations: {
			en: { name: 'Milliliter', namePlural: 'Milliliters' },
			pt: { name: 'Mililitro', namePlural: 'Mililitros', gender: 'masculine' }
		},
		symbol: 'ml',
		allowDecimal: true,
		kind: 'volume',
		createdAt: new Date(),
		updatedAt: new Date()
	}),
	canUpdate: mockCanUpdate,
	error: ref(null)
}));

const mountUpdateUnit = async () => {
	const wrapper = mount(
		defineComponent({
			render: () => h(Suspense, null, { default: () => h(UpdateUnit, { unitId: 'unit-1' }) })
		}),
		{ global: { stubs: { UnitForm: UnitFormStub }, mocks: { $t: (key: string) => key } } }
	);
	await flushPromises();
	return wrapper;
};

describe('UpdateUnit', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockCanUpdate.value = true;
		mockApiUpdate.mockResolvedValue({});
	});

	it('shows the edit form with the edit title for who can edit', async () => {
		const form = (await mountUpdateUnit()).findComponent(UnitFormStub);

		expect(form.exists()).toBe(true);
		expect(form.props('title')).toBe('organisms.unitForm.editTitle');
		expect(form.props('unitForm')).toMatchObject({ symbol: 'ml', kind: 'volume' });
		expect(mockRouterReplace).not.toHaveBeenCalled();
	});

	it('sends who cannot edit to the read-only view and shows no form', async () => {
		mockCanUpdate.value = false;

		const wrapper = await mountUpdateUnit();

		expect(mockRouterReplace).toHaveBeenCalledWith('/units/unit-1');
		expect(wrapper.find('[data-testid="unit-form"]').exists()).toBe(false);
	});

	it('waits for the permission before showing the form or redirecting', async () => {
		mockCanUpdate.value = undefined;

		const wrapper = await mountUpdateUnit();

		expect(mockRouterReplace).not.toHaveBeenCalled();
		expect(wrapper.find('[data-testid="unit-form"]').exists()).toBe(false);
	});

	it('updates the unit and goes back on submit', async () => {
		const wrapper = await mountUpdateUnit();

		await wrapper
			.findComponent(UnitFormStub)
			.vm.$emit('submit', wrapper.findComponent(UnitFormStub).props('unitForm'));
		await flushPromises();

		expect(mockApiUpdate).toHaveBeenCalledWith(expect.objectContaining({ id: 'unit-1' }));
		expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
		expect(mockRouterBack).toHaveBeenCalled();
	});
});
