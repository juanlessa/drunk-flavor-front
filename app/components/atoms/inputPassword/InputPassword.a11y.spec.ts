import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations, withLabel } from '~/test/axe';
import Button from '~/components/atoms/button/Button.vue';
import HideIcon from '~/components/icons/HideIcon.vue';
import ShowIcon from '~/components/icons/ShowIcon.vue';
import InputPassword from './InputPassword.vue';

const global = {
	components: { Button, HideIcon, ShowIcon },
	mocks: { $t: (key: string) => key }
};

describe('InputPassword accessibility', () => {
	it.each([{}, { hasError: true }])('has no violations with props %o', async (props) => {
		const wrapper = mount(withLabel(InputPassword, props), { global, attachTo: document.body });

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
