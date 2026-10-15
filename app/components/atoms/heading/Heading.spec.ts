import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Heading from './Heading.vue';

describe('Heading', () => {
	describe('rendering', () => {
		it('renders an <h2> element by default', () => {
			const wrapper = mount(Heading);

			expect(wrapper.element.tagName).toBe('H2');
		});

		it('renders the value prop as text content', () => {
			const wrapper = mount(Heading, { props: { value: 'Title' } });

			expect(wrapper.text()).toBe('Title');
		});

		it('renders slot content over value prop', () => {
			const wrapper = mount(Heading, {
				props: { value: 'Fallback' },
				slots: { default: 'Slot Title' }
			});

			expect(wrapper.text()).toBe('Slot Title');
		});
	});

	describe('semantic element', () => {
		it.each(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const)(
			'renders <%s> when as is %s',
			(as) => {
				const wrapper = mount(Heading, { props: { as } });

				expect(wrapper.element.tagName).toBe(as.toUpperCase());
			}
		);
	});

	describe('styling', () => {
		it('applies default text-title class', () => {
			const wrapper = mount(Heading);

			expect(wrapper.classes()).toContain('text-title');
		});

		it('applies default font-bold class', () => {
			const wrapper = mount(Heading);

			expect(wrapper.classes()).toContain('font-bold');
		});

		it('applies default text-content class', () => {
			const wrapper = mount(Heading);

			expect(wrapper.classes()).toContain('text-content');
		});
	});
});
