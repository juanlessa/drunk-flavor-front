import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ErrorMessage from './ErrorMessage.vue';

describe('ErrorMessage', () => {
	describe('rendering', () => {
		it('renders a <span> element', () => {
			const wrapper = mount(ErrorMessage);

			expect(wrapper.element.tagName).toBe('SPAN');
		});

		it('renders empty when no value or slot is provided', () => {
			const wrapper = mount(ErrorMessage);

			expect(wrapper.text()).toBe('');
		});

		it('renders the value prop as text content', () => {
			const wrapper = mount(ErrorMessage, { props: { value: 'Field is required' } });

			expect(wrapper.text()).toBe('Field is required');
		});

		it('renders slot content over value prop', () => {
			const wrapper = mount(ErrorMessage, {
				props: { value: 'Fallback error' },
				slots: { default: 'Custom error message' }
			});

			expect(wrapper.text()).toBe('Custom error message');
		});
	});

	describe('styling', () => {
		it('applies error text color classes', () => {
			const wrapper = mount(ErrorMessage, { props: { value: 'Error' } });

			expect(wrapper.classes()).toContain('text-red-600');
		});
	});
});
