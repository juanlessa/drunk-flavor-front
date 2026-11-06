import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import PasswordStrength from './PasswordStrength.vue';

const global = { mocks: { $t: (key: string) => key } };

describe('PasswordStrength accessibility', () => {
	it.each<{ active?: boolean; password?: string; confirmPassword?: string }>([
		{ active: true, password: '' },
		{ password: 'abc' },
		{ password: 'Abcdef1!', confirmPassword: 'Abcdef1!' },
		{ password: 'Abcdef1!', confirmPassword: 'different' }
	])('has no violations with props %o', async (props) => {
		const wrapper = mount(PasswordStrength, { props, global, attachTo: document.body });

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
