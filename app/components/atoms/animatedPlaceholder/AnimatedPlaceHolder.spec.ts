import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AnimatedPlaceHolder from './AnimatedPlaceHolder.vue';

describe('AnimatedPlaceHolder', () => {
	describe('rendering', () => {
		it('renders a <div> element', () => {
			const wrapper = mount(AnimatedPlaceHolder);

			expect(wrapper.element.tagName).toBe('DIV');
		});

		it('applies default dimensions via style', () => {
			const wrapper = mount(AnimatedPlaceHolder);
			const style = wrapper.attributes('style');

			expect(style).toContain('height: 1.5rem');
			expect(style).toContain('width: 3rem');
		});

		it('applies custom dimensions via props', () => {
			const wrapper = mount(AnimatedPlaceHolder, {
				props: { height: '2rem', width: '10rem', borderRadius: '0.5rem' }
			});
			const style = wrapper.attributes('style');

			expect(style).toContain('height: 2rem');
			expect(style).toContain('width: 10rem');
			expect(style).toContain('border-radius: 0.5rem');
		});

		it('applies default borderRadius token', () => {
			const wrapper = mount(AnimatedPlaceHolder);
			const style = wrapper.attributes('style');

			expect(style).toContain('border-radius: var(--radius-none)');
		});
	});

	describe('styling', () => {
		it('applies animation class', () => {
			const wrapper = mount(AnimatedPlaceHolder);

			expect(wrapper.classes()).toContain('animate-loading');
		});
	});
});
