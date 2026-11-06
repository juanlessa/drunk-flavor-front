import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import Box from './Box.vue';

describe('Box accessibility', () => {
	it('has no violations with content', async () => {
		const wrapper = mount(Box, {
			slots: { default: '<p>Content</p>' },
			attachTo: document.body
		});

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
