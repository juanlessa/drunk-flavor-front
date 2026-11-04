import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import Box from '~/components/atoms/box/Box.vue';
import Button from '~/components/atoms/button/Button.vue';
import Heading from '~/components/atoms/heading/Heading.vue';
import ButtonGroup from '~/components/molecules/buttonGroup/ButtonGroup.vue';
import Form from './Form.vue';

const global = {
	components: { Box, Button, Heading, ButtonGroup },
	mocks: { $t: (key: string) => key }
};

describe('Form accessibility', () => {
	it.each<{ title?: string }>([{}, { title: 'Sign in' }])(
		'has no violations with props %o',
		async (props) => {
			const wrapper = mount(Form, {
				props,
				slots: {
					default: '<label for="email">Email</label><input id="email" type="email" />'
				},
				global,
				attachTo: document.body
			});

			await expectNoA11yViolations(wrapper.element);
			wrapper.unmount();
		}
	);
});
