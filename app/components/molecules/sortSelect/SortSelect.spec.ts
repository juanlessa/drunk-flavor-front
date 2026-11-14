import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import SortIcon from '~/components/icons/SortIcon.vue';
import ChevronDownIcon from '~/components/icons/ChevronDownIcon.vue';
import SortSelect from './SortSelect.vue';

const options = [
	{ label: 'Best rated', value: 'rating' },
	{ label: 'Name (A–Z)', value: 'name' }
];

const mountSelect = (modelValue = 'rating') =>
	mount(SortSelect, {
		props: { modelValue, options, label: 'Sort by', id: 'sort' },
		global: { components: { SortIcon, ChevronDownIcon } },
		attachTo: document.body
	});

describe('SortSelect', () => {
	it('shows the visible label in the trigger', () => {
		const wrapper = mountSelect();
		const trigger = wrapper.find('#sort');

		expect(trigger.text()).toContain('Sort by');
		wrapper.unmount();
	});

	it('names the trigger after the visible label', () => {
		const wrapper = mountSelect();
		const trigger = wrapper.find('#sort');
		const labelId = trigger.attributes('aria-labelledby')!;

		expect(wrapper.find(`[id="${labelId}"]`).text()).toBe('Sort by');
		wrapper.unmount();
	});
	it('reserves the room of every option, hidden from sight and from assistive technology', () => {
		const wrapper = mountSelect('rating');
		const sizers = wrapper.findAll('[data-testid="sort-select-sizer"]');
		expect(sizers.map((sizer) => sizer.text())).toEqual(['Best rated', 'Name (A–Z)']);
		for (const sizer of sizers) {
			expect(sizer.attributes('aria-hidden')).toBe('true');
			expect(sizer.classes()).toContain('invisible');
		}
		wrapper.unmount();
	});
	it('reserves the same room whichever option is picked', () => {
		const first = mountSelect('rating');
		const second = mountSelect('name');
		const labelsOf = (wrapper: ReturnType<typeof mountSelect>) =>
			wrapper.findAll('[data-testid="sort-select-sizer"]').map((sizer) => sizer.text());
		expect(labelsOf(first)).toEqual(labelsOf(second));
		first.unmount();
		second.unmount();
	});
});
