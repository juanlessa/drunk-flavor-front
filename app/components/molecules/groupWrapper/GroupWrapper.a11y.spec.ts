import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import Heading from '~/components/atoms/heading/Heading.vue';
import GroupWrapper from './GroupWrapper.vue';

describe('GroupWrapper accessibility', () => {
	it.each<{ title?: string }>([{}, { title: 'Group title' }])(
		'has no violations with props %o',
		async (props) => {
			const wrapper = mount(GroupWrapper, {
				props,
				slots: { default: '<p>Content</p>' },
				global: { components: { Heading } },
				attachTo: document.body
			});

			await expectNoA11yViolations(wrapper.element);
			wrapper.unmount();
		}
	);
});
