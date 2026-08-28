import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Button from './Button.vue';

describe('Button', () => {
	describe('rendering', () => {
		it('renders with default props', () => {
			const wrapper = mount(Button);
			const button = wrapper.find('button');

			expect(button.exists()).toBe(true);
			expect(button.attributes('type')).toBe('button');
			expect(button.attributes('disabled')).toBeUndefined();
		});

		it('renders the value prop as text content', () => {
			const wrapper = mount(Button, { props: { value: 'Click me' } });

			expect(wrapper.text()).toContain('Click me');
		});

		it('renders slot content over value prop', () => {
			const wrapper = mount(Button, {
				props: { value: 'Fallback' },
				slots: { default: 'Slot Content' }
			});

			expect(wrapper.text()).toContain('Slot Content');
			expect(wrapper.text()).not.toContain('Fallback');
		});
	});

	describe('props', () => {
		it('applies disabled attribute when disabled is true', () => {
			const wrapper = mount(Button, { props: { disabled: true } });

			expect(wrapper.find('button').attributes('disabled')).toBeDefined();
		});

		it('sets the correct type attribute', () => {
			const wrapper = mount(Button, { props: { type: 'submit' } });

			expect(wrapper.find('button').attributes('type')).toBe('submit');
		});

		it('applies primary variant classes by default', () => {
			const wrapper = mount(Button);

			expect(wrapper.find('button').classes()).toContain('bg-accent');
		});

		it('applies secondary variant classes', () => {
			const wrapper = mount(Button, { props: { variant: 'secondary' } });

			expect(wrapper.find('button').classes()).toContain('bg-surface-input');
		});

		it('applies delete variant classes', () => {
			const wrapper = mount(Button, { props: { variant: 'delete' } });

			expect(wrapper.find('button').classes()).toContain('bg-danger-emphasis');
		});

		it('applies outline variant classes', () => {
			const wrapper = mount(Button, { props: { variant: 'outline' } });

			expect(wrapper.find('button').classes()).toContain('bg-transparent');
		});

		it('applies sm size classes', () => {
			const wrapper = mount(Button, { props: { size: 'sm' } });

			expect(wrapper.find('button').classes()).toContain('py-1');
			expect(wrapper.find('button').classes()).toContain('text-body-sm');
		});

		it('applies md size classes by default', () => {
			const wrapper = mount(Button);

			expect(wrapper.find('button').classes()).toContain('py-2');
			expect(wrapper.find('button').classes()).toContain('text-body');
		});
	});

	describe('events', () => {
		it('emits click event when clicked', async () => {
			const wrapper = mount(Button);
			await wrapper.find('button').trigger('click');

			expect(wrapper.emitted('click')).toHaveLength(1);
		});

		it('does not emit click event when disabled', async () => {
			const wrapper = mount(Button, { props: { disabled: true } });
			await wrapper.find('button').trigger('click');

			expect(wrapper.emitted('click')).toBeUndefined();
		});
	});
});
