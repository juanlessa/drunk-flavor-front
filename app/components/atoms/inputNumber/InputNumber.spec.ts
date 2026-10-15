import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import InputNumber from './InputNumber.vue';

describe('InputNumber', () => {
	describe('rendering', () => {
		it('renders an input with type number', () => {
			const wrapper = mount(InputNumber);
			const input = wrapper.find('input');

			expect(input.exists()).toBe(true);
			expect(input.attributes('type')).toBe('number');
		});

		it('applies the id attribute', () => {
			const wrapper = mount(InputNumber, { props: { id: 'quantity' } });

			expect(wrapper.find('input').attributes('id')).toBe('quantity');
		});

		it('applies the name attribute', () => {
			const wrapper = mount(InputNumber, { props: { name: 'amount' } });

			expect(wrapper.find('input').attributes('name')).toBe('amount');
		});

		it('renders the modelValue as input value', () => {
			const wrapper = mount(InputNumber, { props: { modelValue: 42 } });

			expect(wrapper.find('input').element.value).toBe('42');
		});
	});

	describe('suffix', () => {
		it('renders suffix inside when suffixOutside is false', () => {
			const wrapper = mount(InputNumber, { props: { suffix: 'ml' } });

			expect(wrapper.text()).toContain('ml');
		});

		it('renders suffix outside when suffixOutside is true', () => {
			const wrapper = mount(InputNumber, { props: { suffix: 'kg', suffixOutside: true } });

			expect(wrapper.text()).toContain('kg');
		});

		it('does not render suffix when empty', () => {
			const wrapper = mount(InputNumber);

			expect(wrapper.text()).toBe('');
		});
	});

	describe('inputWidth', () => {
		it('applies custom width style when inputWidth is set', () => {
			const wrapper = mount(InputNumber, { props: { inputWidth: '5ch' } });

			expect(wrapper.find('input').attributes('style')).toContain('width: 5ch');
		});

		it('applies flex-1 class when inputWidth is not set', () => {
			const wrapper = mount(InputNumber);

			expect(wrapper.find('input').classes()).toContain('flex-1');
		});
	});

	describe('events', () => {
		it('emits update:modelValue with number on input', async () => {
			const wrapper = mount(InputNumber);
			const input = wrapper.find('input');

			await input.setValue('123');

			expect(wrapper.emitted('update:modelValue')).toBeTruthy();
			expect(wrapper.emitted('update:modelValue')![0]).toEqual([123]);
		});

		it('emits blur on blur', async () => {
			const wrapper = mount(InputNumber);
			const input = wrapper.find('input');

			await input.trigger('blur');

			expect(wrapper.emitted('blur')).toHaveLength(1);
		});
	});

	describe('styling', () => {
		it('applies error border when hasError is true', () => {
			const wrapper = mount(InputNumber, { props: { hasError: true } });
			const container = wrapper.find('[class*="border-danger-stroke"]');

			expect(container.exists()).toBe(true);
		});

		it('does not apply error border by default', () => {
			const wrapper = mount(InputNumber);
			const container = wrapper.find('[class*="border-danger-stroke"]');

			expect(container.exists()).toBe(false);
		});
	});
});
