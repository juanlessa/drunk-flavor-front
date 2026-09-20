import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AnimatedPlaceHolder from './AnimatedPlaceHolder.vue';

describe('AnimatedPlaceHolder', () => {
	describe('rendering', () => {
		it('renders a <div> element', () => {
			const wrapper = mount(AnimatedPlaceHolder);

			expect(wrapper.element.tagName).toBe('DIV');
		});

		it('applies default dimension classes', () => {
			const wrapper = mount(AnimatedPlaceHolder);
			const classes = wrapper.classes();

			expect(classes).toContain('h-6');
			expect(classes).toContain('w-12');
			expect(classes).toContain('rounded-none');
		});
	});

	describe('styling', () => {
		it('applies the animation and gradient classes', () => {
			const wrapper = mount(AnimatedPlaceHolder);
			const classes = wrapper.classes();

			expect(classes).toContain('animate-loading');
			expect(classes).toContain('bg-loading-gradient');
		});

		it('lets a consumer class override the default dimensions', () => {
			const wrapper = mount(AnimatedPlaceHolder, {
				attrs: { class: 'w-40 h-5 rounded-xs' }
			});
			const classes = wrapper.classes();

			// twMerge drops the conflicting defaults in favor of the consumer classes
			expect(classes).toContain('w-40');
			expect(classes).toContain('h-5');
			expect(classes).toContain('rounded-xs');
			expect(classes).not.toContain('w-12');
			expect(classes).not.toContain('h-6');
			expect(classes).not.toContain('rounded-none');
		});
	});
});
