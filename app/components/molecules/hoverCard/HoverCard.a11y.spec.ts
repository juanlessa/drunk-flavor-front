import { flushPromises, mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import HoverCard from './HoverCard.vue';

const slots = {
	trigger: '<button type="button">Details</button>',
	default: '<p id="hover-card-content">More information</p>'
};

describe('HoverCard accessibility', () => {
	it('has no violations when closed', async () => {
		const wrapper = mount(HoverCard, { slots, attachTo: document.body });
		await flushPromises();

		expect(document.body.querySelector('#hover-card-content')).toBeNull();
		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});

	// The card renders in a portal outside the component root, so the whole body is audited.
	// The portal content only exists after pending promises flush.
	it('has no violations when open', async () => {
		const wrapper = mount(HoverCard, { props: { open: true }, slots, attachTo: document.body });
		await flushPromises();

		expect(document.body.querySelector('#hover-card-content')).not.toBeNull();
		await expectNoA11yViolations(document.body);
		wrapper.unmount();
	});
});
