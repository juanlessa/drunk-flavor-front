import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations, withLabel } from '~/test/axe';
import InputSwitch from './InputSwitch.vue';

describe('InputSwitch accessibility', () => {
	it.each([{}, { checked: true }, { disabled: true }])(
		'has no violations with props %o',
		async (props) => {
			const wrapper = mount(withLabel(InputSwitch, props), { attachTo: document.body });

			await expectNoA11yViolations(wrapper.element);
			wrapper.unmount();
		}
	);
});
