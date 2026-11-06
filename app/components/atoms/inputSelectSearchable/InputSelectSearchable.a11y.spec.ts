import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { expectNoA11yViolations, withLabel } from '~/test/axe';
import ChevronDownIcon from '~/components/icons/ChevronDownIcon.vue';
import Text from '~/components/atoms/text/Text.vue';
import InputSelectSearchable from './InputSelectSearchable.vue';

const options = [
	{ label: 'Whiskey', value: 'whiskey' },
	{ label: 'Rum', value: 'rum' }
];

describe('InputSelectSearchable accessibility', () => {
	// The id must land on the text input so the associated <label for> names the field, not the arrow button.
	it('applies the id to the text input', () => {
		const wrapper = mount(
			withLabel(InputSelectSearchable, {
				options,
				placeholder: 'Search',
				noResult: 'No results'
			}),
			{
				global: { components: { ChevronDownIcon, Text } },
				attachTo: document.body
			}
		);

		expect(wrapper.find('#a11y-field').element.tagName).toBe('INPUT');
		wrapper.unmount();
	});

	it.each([{}, { hasError: true }])('has no violations with props %o', async (props) => {
		const wrapper = mount(
			withLabel(InputSelectSearchable, {
				options,
				placeholder: 'Search',
				noResult: 'No results',
				...props
			}),
			{ global: { components: { ChevronDownIcon, Text } }, attachTo: document.body }
		);

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
