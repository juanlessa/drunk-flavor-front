import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import Anchor from '~/components/atoms/anchor/Anchor.vue';
import Button from '~/components/atoms/button/Button.vue';
import Heading from '~/components/atoms/heading/Heading.vue';
import ReadOnlyView from './ReadOnlyView.vue';

describe('ReadOnlyView accessibility', () => {
	it('has no violations', async () => {
		const wrapper = mount(ReadOnlyView, {
			props: { title: 'Liqueur', backTo: '/categories', backLabel: 'Categories' },
			global: {
				components: { Anchor, Button, Heading },
				stubs: { NuxtLink: { props: ['to'], template: '<a :href="to"><slot /></a>' } },
				mocks: { $t: (key: string) => key }
			},
			attachTo: document.body
		});

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
