import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Text from './Text.vue';

describe('Text', () => {
	describe('rendering', () => {
		it('renders a <p> element by default', () => {
			const wrapper = mount(Text);

			expect(wrapper.element.tagName).toBe('P');
		});

		it('renders the value prop as text content', () => {
			const wrapper = mount(Text, { props: { value: 'Hello world' } });

			expect(wrapper.text()).toBe('Hello world');
		});

		it('renders slot content over value prop', () => {
			const wrapper = mount(Text, {
				props: { value: 'Fallback' },
				slots: { default: 'Slot Content' }
			});

			expect(wrapper.text()).toBe('Slot Content');
		});
	});

	describe('semantic element', () => {
		it('renders a <span> when as is span', () => {
			const wrapper = mount(Text, { props: { as: 'span' } });

			expect(wrapper.element.tagName).toBe('SPAN');
		});

		it('renders a <strong> when as is strong', () => {
			const wrapper = mount(Text, { props: { as: 'strong' } });

			expect(wrapper.element.tagName).toBe('STRONG');
		});
	});

	describe('styling', () => {
		it('applies default text-body class', () => {
			const wrapper = mount(Text);

			expect(wrapper.classes()).toContain('text-body');
		});

		it('applies default font-regular class', () => {
			const wrapper = mount(Text);

			expect(wrapper.classes()).toContain('font-regular');
		});

		it('applies default text-content class', () => {
			const wrapper = mount(Text);

			expect(wrapper.classes()).toContain('text-content');
		});
	});
});
