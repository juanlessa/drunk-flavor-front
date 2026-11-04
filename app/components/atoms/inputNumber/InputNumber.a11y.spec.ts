import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations, withLabel } from '~/test/axe';
import InputNumber from './InputNumber.vue';

describe('InputNumber accessibility', () => {
	it.each([{}, { integer: true }, { hasError: true }, { suffix: 'ml', suffixOutside: true }])(
		'has no violations with props %o',
		async (props) => {
			const wrapper = mount(withLabel(InputNumber, props), { attachTo: document.body });

			await expectNoA11yViolations(wrapper.element);
			wrapper.unmount();
		}
	);
});
