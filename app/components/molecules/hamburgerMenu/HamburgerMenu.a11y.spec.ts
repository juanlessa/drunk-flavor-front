import { flushPromises, mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import HamburgerMenu from './HamburgerMenu.vue';

const props = { title: 'Navigation', openLabel: 'Open menu', closeLabel: 'Close menu' };

describe('HamburgerMenu accessibility', () => {
	it('has no violations when closed', async () => {
		const wrapper = mount(HamburgerMenu, { props, attachTo: document.body });
		await flushPromises();

		expect(document.body.querySelector('[role="dialog"]')).toBeNull();
		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});

	// The panel renders in a portal outside the component root, so the whole body is audited.
	// The portal content only exists after pending promises flush.
	it('has no violations when open', async () => {
		const wrapper = mount(HamburgerMenu, {
			props: { ...props, open: true },
			slots: { default: '<nav aria-label="Main"><a href="/home">Home</a></nav>' },
			attachTo: document.body
		});
		await flushPromises();

		expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
		await expectNoA11yViolations(document.body);
		wrapper.unmount();
	});
});
