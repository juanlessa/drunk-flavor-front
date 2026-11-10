import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ReadOnlyChoiceCards from './ReadOnlyChoiceCards.vue';

const options = [
	{ value: 'generic', label: 'Any brand', description: 'Generic.' },
	{ value: 'branded', label: 'Specific brand', description: 'Needs one product.' }
];

const mountCards = (modelValue = 'branded') =>
	mount(ReadOnlyChoiceCards, {
		props: { modelValue, options, label: 'ingredient type' },
		global: { mocks: { $t: (key: string) => key } }
	});

describe('ReadOnlyChoiceCards', () => {
	it('lists every option with its label and description, named like the form group', () => {
		const wrapper = mountCards();
		expect(wrapper.find('ul').attributes('aria-label')).toBe('ingredient type');
		const items = wrapper.findAll('li');
		expect(items).toHaveLength(2);
		expect(items[0]?.text()).toContain('Any brand');
		expect(items[0]?.text()).toContain('Generic.');
		expect(items[1]?.text()).toContain('Specific brand');
	});

	it('marks the chosen option with a check and says it is selected', () => {
		const [generic, branded] = mountCards().findAll('li');
		expect(branded?.attributes('data-state')).toBe('checked');
		expect(branded?.findComponent({ name: 'CheckIcon' }).exists()).toBe(true);
		expect(branded?.text()).toContain('molecules.readOnlyChoiceCards.selected');
		expect(generic?.attributes('data-state')).toBe('unchecked');
		expect(generic?.findComponent({ name: 'CloseIcon' }).exists()).toBe(true);
		expect(generic?.text()).not.toContain('molecules.readOnlyChoiceCards.selected');
	});

	it('keeps the card size of the radio cards', () => {
		for (const item of mountCards().findAll('li')) {
			expect(item.classes()).toEqual(
				expect.arrayContaining(['min-h-11', 'p-3', 'gap-3', 'rounded-control', 'border'])
			);
		}
	});

	it('is not a control: no radio, nothing to focus', () => {
		const wrapper = mountCards();
		expect(
			wrapper.find('input, button, [role="radio"], [role="radiogroup"], [tabindex]').exists()
		).toBe(false);
		expect(wrapper.html()).not.toContain('cursor-pointer');
	});
});
