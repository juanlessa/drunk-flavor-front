import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations, withLabel } from '~/test/axe';
import InputTextArea from './InputTextArea.vue';

describe('InputTextArea accessibility', () => {
	it.each([{}, { hasError: true }, { border: true }])(
		'has no violations with props %o',
		async (props) => {
			const wrapper = mount(withLabel(InputTextArea, props), { attachTo: document.body });

			await expectNoA11yViolations(wrapper.element);
			wrapper.unmount();
		}
	);
});
