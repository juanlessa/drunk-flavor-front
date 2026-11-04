import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import Card from '~/components/atoms/card/Card.vue';
import Heading from '~/components/atoms/heading/Heading.vue';
import Text from '~/components/atoms/text/Text.vue';
import FormSection from './FormSection.vue';

describe('FormSection accessibility', () => {
	it.each([{}, { description: 'Update your details' }])(
		'has no violations with props %o',
		async (extra) => {
			const wrapper = mount(FormSection, {
				props: { title: 'Profile', ...extra },
				slots: { default: '<p>Content</p>' },
				global: { components: { Card, Heading, Text } },
				attachTo: document.body
			});

			await expectNoA11yViolations(wrapper.element);
			wrapper.unmount();
		}
	);
});
