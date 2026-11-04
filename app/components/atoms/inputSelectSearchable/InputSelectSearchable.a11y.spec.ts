import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations, withLabel } from '~/test/axe';
import ChevronDownIcon from '~/components/icons/ChevronDownIcon.vue';
import Text from '~/components/atoms/text/Text.vue';
import InputSelectSearchable from './InputSelectSearchable.vue';

const options = [
	{ label: 'Whiskey', value: 'whiskey' },
	{ label: 'Rum', value: 'rum' }
];

describe('InputSelectSearchable accessibility', () => {
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
