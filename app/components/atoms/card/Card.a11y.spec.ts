import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import Card from './Card.vue';

describe('Card accessibility', () => {
	it('has no violations with content', async () => {
		const wrapper = mount(Card, {
			slots: { default: '<p>Content</p>' },
			attachTo: document.body
		});

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
