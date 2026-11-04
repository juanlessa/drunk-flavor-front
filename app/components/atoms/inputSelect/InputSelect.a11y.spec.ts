import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations, withLabel } from '~/test/axe';
import ChevronDownIcon from '~/components/icons/ChevronDownIcon.vue';
import InputSelect from './InputSelect.vue';

const options = [
	{ label: 'Whiskey', value: 'whiskey' },
	{ label: 'Rum', value: 'rum' }
];

describe('InputSelect accessibility', () => {
	it.each([{}, { modelValue: 'rum' }, { hasError: true }])(
		'has no violations with props %o',
		async (props) => {
			const wrapper = mount(
				withLabel(InputSelect, { options, placeholder: 'Select one', ...props }),
				{
					global: { components: { ChevronDownIcon } },
					attachTo: document.body
				}
			);

			await expectNoA11yViolations(wrapper.element);
			wrapper.unmount();
		}
	);
});
