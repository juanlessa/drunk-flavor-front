import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Label from './Label.vue';

describe('Label', () => {
	describe('rendering', () => {
		it('renders a <label> element', () => {
			const wrapper = mount(Label);

			expect(wrapper.element.tagName).toBe('LABEL');
		});

		it('renders the value prop as text content', () => {
			const wrapper = mount(Label, { props: { value: 'Username' } });

			expect(wrapper.text()).toBe('Username');
		});

		it('renders slot content over value prop', () => {
			const wrapper = mount(Label, {
				props: { value: 'Fallback' },
				slots: { default: 'Slot Label' }
			});

			expect(wrapper.text()).toBe('Slot Label');
		});
	});

	describe('accessibility', () => {
		it('applies the for attribute', () => {
			const wrapper = mount(Label, { props: { for: 'input-email' } });

			expect(wrapper.attributes('for')).toBe('input-email');
		});

		it('renders with empty for attribute when not provided', () => {
			const wrapper = mount(Label);

			expect(wrapper.attributes('for')).toBe('');
		});
	});
});
