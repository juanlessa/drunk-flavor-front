import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import InputText from './InputText.vue';

describe('InputText', () => {
	describe('rendering', () => {
		it('renders an input element', () => {
			const wrapper = mount(InputText);

			expect(wrapper.find('input').exists()).toBe(true);
		});

		it('renders with type text by default', () => {
			const wrapper = mount(InputText);

			expect(wrapper.find('input').attributes('type')).toBe('text');
		});

		it('applies the id attribute', () => {
			const wrapper = mount(InputText, { props: { id: 'username' } });

			expect(wrapper.find('input').attributes('id')).toBe('username');
		});

		it('applies the name attribute', () => {
			const wrapper = mount(InputText, { props: { name: 'email' } });

			expect(wrapper.find('input').attributes('name')).toBe('email');
		});

		it('applies the placeholder attribute', () => {
			const wrapper = mount(InputText, { props: { placeholder: 'Enter text' } });

			expect(wrapper.find('input').attributes('placeholder')).toBe('Enter text');
		});

		it('renders the modelValue as input value', () => {
			const wrapper = mount(InputText, { props: { modelValue: 'Hello' } });

			expect(wrapper.find('input').element.value).toBe('Hello');
		});
	});

	describe('suffix', () => {
		it('renders suffix inside when suffixOutside is false', () => {
			const wrapper = mount(InputText, { props: { suffix: 'kg' } });

			expect(wrapper.text()).toContain('kg');
		});

		it('renders suffix outside when suffixOutside is true', () => {
			const wrapper = mount(InputText, { props: { suffix: 'ml', suffixOutside: true } });

			expect(wrapper.text()).toContain('ml');
		});
	});

	describe('events', () => {
		it('emits update:modelValue on input', async () => {
			const wrapper = mount(InputText);
			const input = wrapper.find('input');

			await input.setValue('New value');

			expect(wrapper.emitted('update:modelValue')).toBeTruthy();
			expect(wrapper.emitted('update:modelValue')![0]).toEqual(['New value']);
		});

		it('emits blur on blur', async () => {
			const wrapper = mount(InputText, { props: { modelValue: 'Test' } });
			const input = wrapper.find('input');

			await input.trigger('blur');

			expect(wrapper.emitted('blur')).toHaveLength(1);
		});
	});

	describe('styling', () => {
		it('applies error border classes when hasError is true', () => {
			const wrapper = mount(InputText, { props: { hasError: true } });
			const container = wrapper.find('[class*="border-danger-stroke"]');

			expect(container.exists()).toBe(true);
		});

		it('does not apply error classes by default', () => {
			const wrapper = mount(InputText);
			const container = wrapper.find('[class*="border-danger-stroke"]');

			expect(container.exists()).toBe(false);
		});
	});
});
