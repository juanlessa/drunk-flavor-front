import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import IconButton from './IconButton.vue';

describe('IconButton', () => {
	describe('rendering', () => {
		it('renders a button element', () => {
			const wrapper = mount(IconButton, { props: { ariaLabel: 'remove' } });

			expect(wrapper.element.tagName).toBe('BUTTON');
		});

		it('renders slot content', () => {
			const wrapper = mount(IconButton, {
				props: { ariaLabel: 'remove' },
				slots: { default: '<svg data-testid="icon" />' }
			});

			expect(wrapper.find('[data-testid="icon"]').exists()).toBe(true);
		});
	});

	describe('accessibility', () => {
		it('applies the ariaLabel as aria-label', () => {
			const wrapper = mount(IconButton, { props: { ariaLabel: 'remove ingredient' } });

			expect(wrapper.attributes('aria-label')).toBe('remove ingredient');
		});

		it('defaults type to button to avoid implicit form submit', () => {
			const wrapper = mount(IconButton, { props: { ariaLabel: 'remove' } });

			expect(wrapper.attributes('type')).toBe('button');
		});

		it('applies a visible focus ring class', () => {
			const wrapper = mount(IconButton, { props: { ariaLabel: 'remove' } });

			expect(wrapper.classes()).toContain('focus-visible:shadow-focus-ring');
		});
	});

	describe('disabled', () => {
		it('is not disabled by default', () => {
			const wrapper = mount(IconButton, { props: { ariaLabel: 'remove' } });

			expect(wrapper.attributes('disabled')).toBeUndefined();
		});

		it('applies the disabled attribute when disabled', () => {
			const wrapper = mount(IconButton, { props: { ariaLabel: 'remove', disabled: true } });

			expect(wrapper.attributes('disabled')).toBeDefined();
		});
	});

	describe('events', () => {
		it('emits click when pressed', async () => {
			const wrapper = mount(IconButton, { props: { ariaLabel: 'remove' } });

			await wrapper.trigger('click');

			expect(wrapper.emitted('click')).toBeTruthy();
		});
	});
});
