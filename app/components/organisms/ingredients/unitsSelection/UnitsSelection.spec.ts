import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { computed, ref } from 'vue';
import UnitsSelection from './UnitsSelection.vue';
import type { Unit } from '~/domain/unit/unit.entity';

const buildUnit = (id: string, en: string, symbol?: string): Unit => ({
	id,
	translations: {
		en: { name: en, namePlural: `${en}s` },
		pt: { name: en, namePlural: `${en}s` }
	},
	symbol,
	allowDecimal: true,
	kind: 'volume',
	createdAt: new Date(),
	updatedAt: new Date()
});
const milliliter = buildUnit('ml', 'milliliter', 'ml');
const leaf = buildUnit('leaf', 'leaf');
const dash = buildUnit('dash', 'dash');

const mockOptions = ref<Unit[]>([]);
const mockSelected = ref({ label: 'milliliter', value: 'ml' });
const mockSearchTerm = ref('mil');
const mockLoadNextPage = vi.fn();

vi.stubGlobal('useI18n', () => ({ t: (key: string) => key, locale: ref('en') }));
vi.stubGlobal('useUnitSearchableSelect', () => ({
	options: computed(() => mockOptions.value),
	searchTerm: mockSearchTerm,
	loading: ref(false),
	selected: mockSelected,
	loadNextPage: mockLoadNextPage
}));

const SelectStub = {
	props: ['id', 'modelValue', 'searchTerm', 'options', 'hasError', 'placeholder', 'noResult'],
	emits: ['update:modelValue', 'update:searchTerm', 'load-more', 'blur'],
	template: '<div :id="id" data-testid="select" :data-error="String(hasError)" />'
};

const mountSelection = (props: Record<string, unknown> = {}) =>
	mount(UnitsSelection, {
		props: { units: [], ...props },
		global: {
			stubs: {
				InputWrapper: {
					template: '<div><slot name="label" /><slot /><slot name="error" /></div>'
				},
				Label: { props: ['for'], template: '<label :for="$props.for"><slot /></label>' },
				Text: { template: '<p><slot /></p>' },
				ErrorMessage: {
					props: ['value'],
					template: '<span data-testid="error">{{ value }}</span>'
				},
				Badge: {
					props: ['value', 'tone'],
					template: '<span data-testid="badge">{{ value }}</span>'
				},
				InputSelectSearchable: SelectStub,
				ArrowUpIcon: true,
				ArrowDownIcon: true,
				TrashIcon: true
			},
			mocks: {
				$t: (key: string, params?: { name?: string }) =>
					params?.name ? `${key}:${params.name}` : key
			}
		}
	});

const rows = (wrapper: ReturnType<typeof mountSelection>) => wrapper.findAll('li');
const button = (wrapper: ReturnType<typeof mountSelection>, action: string, name: string) =>
	wrapper.find(
		`button[aria-label="organisms.ingredientForm.unitsSelection.${action}.label:${name}"]`
	);

describe('UnitsSelection', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockOptions.value = [milliliter, leaf, dash];
		mockSelected.value = { label: 'milliliter', value: 'ml' };
		mockSearchTerm.value = 'mil';
	});

	it('explains that no unit was added yet', () => {
		const wrapper = mountSelection();

		expect(rows(wrapper)).toHaveLength(0);
		expect(wrapper.text()).toContain('organisms.ingredientForm.unitsSelection.empty');
	});

	it('lists the units in order, with a summary, and marks only the first as the default', () => {
		const wrapper = mountSelection({ units: [milliliter, leaf] });

		expect(rows(wrapper).map((row) => row.find('p span').text())).toEqual([
			'1. milliliter',
			'2. leaf'
		]);
		expect(wrapper.findAll('[data-testid="badge"]')).toHaveLength(1);
		expect(rows(wrapper)[0]!.text()).toContain(
			'ml · organisms.unitForm.kindInput.options.volume'
		);
	});

	it('offers only the units that are not in the list yet', () => {
		const wrapper = mountSelection({ units: [milliliter] });

		expect(wrapper.findComponent(SelectStub).props('options')).toEqual([
			{ label: 'leaf', value: 'leaf' },
			{ label: 'dash', value: 'dash' }
		]);
	});

	it('adds the picked unit at the end and clears the select so another one can be picked', () => {
		const wrapper = mountSelection({ units: [milliliter] });

		wrapper
			.findComponent(SelectStub)
			.vm.$emit('update:modelValue', { label: 'leaf', value: 'leaf' });

		expect(wrapper.emitted('update:units')).toEqual([[[milliliter, leaf]]]);
		expect(mockSelected.value).toEqual({ label: '', value: '' });
		expect(mockSearchTerm.value).toBe('');
	});

	it('ignores a pick that is not among the options', () => {
		const wrapper = mountSelection();

		wrapper.findComponent(SelectStub).vm.$emit('update:modelValue', { label: '', value: '' });

		expect(wrapper.emitted('update:units')).toBeUndefined();
	});

	it('loads more options when the select asks for them and passes the blur up', () => {
		const wrapper = mountSelection();

		wrapper.findComponent(SelectStub).vm.$emit('load-more');
		wrapper.findComponent(SelectStub).vm.$emit('blur');

		expect(mockLoadNextPage).toHaveBeenCalled();
		expect(wrapper.emitted('blur')).toHaveLength(1);
	});

	it('moves a unit up and down, and validates', async () => {
		const wrapper = mountSelection({ units: [milliliter, leaf, dash] });

		await button(wrapper, 'moveUp', 'leaf').trigger('click');
		await button(wrapper, 'moveDown', 'leaf').trigger('click');

		expect(wrapper.emitted('update:units')).toEqual([
			[[leaf, milliliter, dash]],
			[[milliliter, dash, leaf]]
		]);
		expect(wrapper.emitted('blur')).toHaveLength(2);
	});

	it('cannot move the first unit up or the last one down', () => {
		const wrapper = mountSelection({ units: [milliliter, leaf] });

		expect(button(wrapper, 'moveUp', 'milliliter').attributes('disabled')).toBeDefined();
		expect(button(wrapper, 'moveDown', 'leaf').attributes('disabled')).toBeDefined();
		expect(button(wrapper, 'moveDown', 'milliliter').attributes('disabled')).toBeUndefined();
	});

	it('removes a unit and validates', async () => {
		const wrapper = mountSelection({ units: [milliliter, leaf] });

		await button(wrapper, 'remove', 'milliliter').trigger('click');

		expect(wrapper.emitted('update:units')).toEqual([[[leaf]]]);
		expect(wrapper.emitted('blur')).toHaveLength(1);
	});

	it('flags the select and shows the message when there is an error', () => {
		const wrapper = mountSelection({ error: 'errors.ingredients.unit' });

		expect(wrapper.find('[data-testid="select"]').attributes('data-error')).toBe('true');
		expect(wrapper.find('[data-testid="error"]').text()).toBe('errors.ingredients.unit');
	});
});
