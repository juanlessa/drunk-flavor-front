import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations, withLabel } from '~/test/axe';
import InputText from './InputText.vue';

describe('InputText accessibility', () => {
	it.each([
		{ type: 'text' },
		{ type: 'email' },
		{ disabled: true },
		{ hasError: true },
		{ suffix: 'ml' }
	])('has no violations with props %o', async (props) => {
		const wrapper = mount(withLabel(InputText, props), { attachTo: document.body });

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
