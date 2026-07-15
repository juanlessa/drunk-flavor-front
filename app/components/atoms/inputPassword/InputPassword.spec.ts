import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import InputPassword from './InputPassword.vue';

const HideIconStub = { template: '<svg data-testid="hide-icon" />' };
const ShowIconStub = { template: '<svg data-testid="show-icon" />' };

const mountInputPassword = (props = {}) =>
	mount(InputPassword, {
		props,
		global: {
			stubs: { HideIcon: HideIconStub, ShowIcon: ShowIconStub }
		}
	});

describe('InputPassword', () => {
	describe('rendering', () => {
		it('renders an input with type password by default', () => {
			const wrapper = mountInputPassword();

			expect(wrapper.find('input').attributes('type')).toBe('password');
		});

		it('applies the id attribute', () => {
			const wrapper = mountInputPassword({ id: 'pw-field' });

			expect(wrapper.find('input').attributes('id')).toBe('pw-field');
		});

		it('applies the name attribute', () => {
			const wrapper = mountInputPassword({ name: 'password' });

			expect(wrapper.find('input').attributes('name')).toBe('password');
		});

		it('renders the modelValue as input value', () => {
			const wrapper = mountInputPassword({ modelValue: 'secret' });

			expect(wrapper.find('input').element.value).toBe('secret');
		});
	});

	describe('visibility toggle', () => {
		it('shows ShowIcon when password is hidden', () => {
			const wrapper = mountInputPassword();

			expect(wrapper.find('[data-testid="show-icon"]').exists()).toBe(true);
			expect(wrapper.find('[data-testid="hide-icon"]').exists()).toBe(false);
		});

		it('toggles to text type when visibility icon is clicked', async () => {
			const wrapper = mountInputPassword();
			const toggle = wrapper.find('[class*="cursor-pointer"]');

			await toggle.trigger('click');

			expect(wrapper.find('input').attributes('type')).toBe('text');
			expect(wrapper.find('[data-testid="hide-icon"]').exists()).toBe(true);
		});

		it('toggles back to password type on second click', async () => {
			const wrapper = mountInputPassword();
			const toggle = wrapper.find('[class*="cursor-pointer"]');

			await toggle.trigger('click');
			await toggle.trigger('click');

			expect(wrapper.find('input').attributes('type')).toBe('password');
		});
	});

	describe('events', () => {
		it('emits update:modelValue on input', async () => {
			const wrapper = mountInputPassword();
			const input = wrapper.find('input');

			await input.setValue('newpass');

			expect(wrapper.emitted('update:modelValue')![0]).toEqual(['newpass']);
		});

		it('emits blur on blur', async () => {
			const wrapper = mountInputPassword();
			const input = wrapper.find('input');

			await input.trigger('blur');

			expect(wrapper.emitted('blur')).toHaveLength(1);
		});
	});

	describe('styling', () => {
		it('applies error border when hasError is true', () => {
			const wrapper = mountInputPassword({ hasError: true });

			expect(wrapper.find('[class*="border-red"]').exists()).toBe(true);
		});
	});
});
