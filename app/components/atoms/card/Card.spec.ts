import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Card from './Card.vue';

describe('Card', () => {
	describe('rendering', () => {
		it('renders a <div> element', () => {
			const wrapper = mount(Card);

			expect(wrapper.element.tagName).toBe('DIV');
		});

		it('renders slot content', () => {
			const wrapper = mount(Card, { slots: { default: '<p>Hello</p>' } });

			expect(wrapper.text()).toBe('Hello');
		});
	});

	describe('styling', () => {
		it('applies bg-surface class', () => {
			const wrapper = mount(Card);

			expect(wrapper.classes()).toContain('bg-surface');
		});

		it('applies shadow-card class', () => {
			const wrapper = mount(Card);

			expect(wrapper.classes()).toContain('shadow-card');
		});

		it('applies rounded-md by default', () => {
			const wrapper = mount(Card);

			expect(wrapper.classes()).toContain('rounded-md');
		});
	});
});
