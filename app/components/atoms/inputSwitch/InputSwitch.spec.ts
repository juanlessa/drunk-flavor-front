import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import InputSwitch from './InputSwitch.vue';

describe('InputSwitch', () => {
	describe('rendering', () => {
		it('renders a switch root element', () => {
			const wrapper = mount(InputSwitch);

			expect(wrapper.find('button[role="switch"]').exists()).toBe(true);
		});

		it('applies the id attribute', () => {
			const wrapper = mount(InputSwitch, { props: { id: 'dark-mode' } });

			expect(wrapper.find('button[role="switch"]').attributes('id')).toBe('dark-mode');
		});

		it('applies the name attribute', () => {
			const wrapper = mount(InputSwitch, { props: { name: 'toggle' } });

			expect(wrapper.find('button[role="switch"]').exists()).toBe(true);
		});
	});

	describe('state', () => {
		it('is unchecked by default', () => {
			const wrapper = mount(InputSwitch);

			expect(wrapper.find('button[role="switch"]').attributes('data-state')).toBe(
				'unchecked'
			);
		});

		it('is checked when checked prop is true', () => {
			const wrapper = mount(InputSwitch, { props: { checked: true } });

			expect(wrapper.find('button[role="switch"]').attributes('data-state')).toBe('checked');
		});
	});

	describe('events', () => {
		it('emits update:checked when toggled', async () => {
			const wrapper = mount(InputSwitch);
			const switchEl = wrapper.find('button[role="switch"]');

			await switchEl.trigger('click');

			expect(wrapper.emitted('update:checked')).toBeTruthy();
			expect(wrapper.emitted('update:checked')![0]).toEqual([true]);
		});
	});
});
