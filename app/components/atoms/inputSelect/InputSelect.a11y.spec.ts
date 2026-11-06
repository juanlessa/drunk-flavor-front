import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { expectNoA11yViolations, withLabel } from '~/test/axe';
import ChevronDownIcon from '~/components/icons/ChevronDownIcon.vue';
import InputSelect from './InputSelect.vue';

const options = [
	{ label: 'Whiskey', value: 'whiskey' },
	{ label: 'Rum', value: 'rum' }
];

describe('InputSelect accessibility', () => {
	// A hardcoded aria-label on the trigger would override the visible <label> and break the accessible name.
	it('lets the associated label name the trigger', () => {
		const wrapper = mount(
			withLabel(InputSelect, { options, placeholder: 'Select one' }, 'Kind'),
			{
				global: { components: { ChevronDownIcon } },
				attachTo: document.body
			}
		);
		const trigger = wrapper.find('button[role="combobox"]');

		expect(trigger.exists()).toBe(true);
		expect(trigger.attributes('aria-label')).toBeUndefined();
		wrapper.unmount();
	});

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
