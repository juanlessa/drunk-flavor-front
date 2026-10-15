import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Image from './Image.vue';

const mountImage = (props: Record<string, unknown> = {}) =>
	mount(Image, { props: { src: '/logo.png', alt: 'alt text', ...props } });

describe('Image', () => {
	describe('rendering', () => {
		it('renders an img element', () => {
			const wrapper = mountImage();

			expect(wrapper.find('img').exists()).toBe(true);
		});

		it('applies the src', () => {
			const wrapper = mountImage({ src: '/light-logo.png' });

			expect(wrapper.find('img').attributes('src')).toBe('/light-logo.png');
		});

		it('applies the alt text', () => {
			const wrapper = mountImage({ alt: 'Drunk Flavor logo' });

			expect(wrapper.find('img').attributes('alt')).toBe('Drunk Flavor logo');
		});
	});
});
