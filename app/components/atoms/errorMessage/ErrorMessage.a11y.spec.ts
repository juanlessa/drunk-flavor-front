import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import ErrorMessage from './ErrorMessage.vue';

describe('ErrorMessage accessibility', () => {
	it('has no violations with a message', async () => {
		const wrapper = mount(ErrorMessage, {
			props: { value: 'Required field' },
			attachTo: document.body
		});

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
