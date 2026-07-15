import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Box from './Box.vue';

describe('Box', () => {
	describe('rendering', () => {
		it('renders a <div> element', () => {
			const wrapper = mount(Box);

			expect(wrapper.element.tagName).toBe('DIV');
		});

		it('renders slot content', () => {
			const wrapper = mount(Box, { slots: { default: '<p>Child</p>' } });

			expect(wrapper.text()).toBe('Child');
		});
	});

	describe('styling', () => {
		it('applies flex class always', () => {
			const wrapper = mount(Box);

			expect(wrapper.classes()).toContain('flex');
		});

		it('applies responsive direction by default (flex-col tablet:flex-row)', () => {
			const wrapper = mount(Box);

			expect(wrapper.classes()).toContain('flex-col');
		});

		it('applies flex-row when direction is row', () => {
			const wrapper = mount(Box, { props: { direction: 'row' } });

			expect(wrapper.classes()).toContain('flex-row');
		});

		it('applies flex-col when direction is col', () => {
			const wrapper = mount(Box, { props: { direction: 'col' } });

			expect(wrapper.classes()).toContain('flex-col');
		});
	});
});
