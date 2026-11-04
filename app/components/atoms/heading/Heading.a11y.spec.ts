import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import Heading from './Heading.vue';

describe('Heading accessibility', () => {
	it.each(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const)(
		'has no violations as %s',
		async (as) => {
			const wrapper = mount(Heading, {
				props: { as, value: 'Title' },
				attachTo: document.body
			});

			await expectNoA11yViolations(wrapper.element);
			wrapper.unmount();
		}
	);
});
