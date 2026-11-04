import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import Anchor from './Anchor.vue';

const NuxtLinkStub = {
	template: '<a :href="to"><slot /></a>',
	props: ['to']
};

describe('Anchor accessibility', () => {
	it('has no violations with visible text', async () => {
		const wrapper = mount(Anchor, {
			props: { to: '/home', value: 'Home' },
			global: { stubs: { NuxtLink: NuxtLinkStub } },
			attachTo: document.body
		});

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
