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
			const wrapper = mount(Card, { slots: { default: 'Card content' } });

			expect(wrapper.text()).toBe('Card content');
		});
	});

	describe('styling', () => {
		it('applies md rounded class by default', () => {
			const wrapper = mount(Card);

			expect(wrapper.classes()).toContain('rounded-md');
		});

		it('applies rounded-px when rounded is px', () => {
			const wrapper = mount(Card, { props: { rounded: 'px' } });

			expect(wrapper.classes()).toContain('rounded-px');
		});

		it('applies rounded-lg when rounded is lg', () => {
			const wrapper = mount(Card, { props: { rounded: 'lg' } });

			expect(wrapper.classes()).toContain('rounded-lg');
		});

		it('applies rounded-full when rounded is full', () => {
			const wrapper = mount(Card, { props: { rounded: 'full' } });

			expect(wrapper.classes()).toContain('rounded-full');
		});

		it('applies base background classes', () => {
			const wrapper = mount(Card);

			expect(wrapper.classes()).toContain('bg-white');
		});
	});
});
