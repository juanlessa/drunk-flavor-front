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
});
