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
			'renders <%s> when type is %s',
			(type) => {
				const wrapper = mount(Heading, { props: { type } });

				expect(wrapper.element.tagName).toBe(type.toUpperCase());
			}
		);
	});

	describe('styling', () => {
		it('applies md size class by default (text-2xl)', () => {
			const wrapper = mount(Heading);

			expect(wrapper.classes()).toContain('text-2xl');
		});

		it('applies sm size class (text-xl)', () => {
			const wrapper = mount(Heading, { props: { size: 'sm' } });

			expect(wrapper.classes()).toContain('text-xl');
		});

		it('applies lg size class (text-4xl)', () => {
			const wrapper = mount(Heading, { props: { size: 'lg' } });

			expect(wrapper.classes()).toContain('text-4xl');
		});
	});
});
