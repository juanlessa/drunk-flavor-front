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
		it('renders a <span> when type is span', () => {
			const wrapper = mount(Text, { props: { type: 'span' } });

			expect(wrapper.element.tagName).toBe('SPAN');
		});

		it('renders a <strong> when type is strong', () => {
			const wrapper = mount(Text, { props: { type: 'strong' } });

			expect(wrapper.element.tagName).toBe('STRONG');
		});
	});

	describe('styling', () => {
		it('applies md size class by default', () => {
			const wrapper = mount(Text);

			expect(wrapper.classes()).toContain('text-md');
		});

		it('applies regular weight class by default', () => {
			const wrapper = mount(Text);

			expect(wrapper.classes()).toContain('font-regular');
		});

		it('applies sm size class', () => {
			const wrapper = mount(Text, { props: { size: 'sm' } });

			expect(wrapper.classes()).toContain('text-sm');
		});

		it('applies bold weight class', () => {
			const wrapper = mount(Text, { props: { weight: 'bold' } });

			expect(wrapper.classes()).toContain('font-bold');
		});
	});
});
