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

	// The size prop only shows up as a typography class, so the class is the behavioural output here.
	describe('size', () => {
		it.each([
			['titleSm', 'text-title-sm'],
			['title', 'text-title'],
			['titleLg', 'text-title-lg'],
			['headlineSm', 'text-headline-sm'],
			['headline', 'text-headline'],
			['headlineLg', 'text-headline-lg']
		] as const)('maps size %s to %s', (size, expected) => {
			const wrapper = mount(Heading, { props: { size } });

			expect(wrapper.classes()).toContain(expected);
		});

		it('defaults to the title size', () => {
			const wrapper = mount(Heading);

			expect(wrapper.classes()).toContain('text-title');
		});
	});
});
