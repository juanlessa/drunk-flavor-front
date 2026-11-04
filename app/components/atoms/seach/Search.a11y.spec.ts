import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations, withLabel } from '~/test/axe';
import ChevronDownIcon from '~/components/icons/ChevronDownIcon.vue';
import ThinCloseIcon from '~/components/icons/ThinCloseIcon.vue';
import Text from '~/components/atoms/text/Text.vue';
import Search from './Search.vue';

const options = [
	{ label: 'Whiskey', value: 'whiskey', description: 'Spirit' },
	{ label: 'Rum', value: 'rum' }
];

describe('Search accessibility', () => {
	// KNOWN VIOLATION (button-name): the Combobox.Cancel (clear) button has an icon only and no accessible name.
	// `it.fails` keeps CI green and turns red as soon as the component is fixed, so this marker must then be removed.
	it.fails.each([{}, { hasError: true }])('has no violations with props %o', async (props) => {
		const wrapper = mount(
			withLabel(Search, { options, placeholder: 'Search', noResult: 'No results', ...props }),
			{
				global: { components: { ChevronDownIcon, ThinCloseIcon, Text } },
				attachTo: document.body
			}
		);

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
