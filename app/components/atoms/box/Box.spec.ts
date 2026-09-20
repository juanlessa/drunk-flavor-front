import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Box from './Box.vue';
import { boxAsOptions } from './Box.constants';

describe('Box', () => {
	describe('rendering', () => {
		it('renders a <div> element by default', () => {
			const wrapper = mount(Box);

			expect(wrapper.element.tagName).toBe('DIV');
		});

		it('renders slot content', () => {
			const wrapper = mount(Box, { slots: { default: '<p>Child</p>' } });

			expect(wrapper.text()).toBe('Child');
		});
	});

	describe('as', () => {
		it.each(boxAsOptions)('renders <%s> when as is %s', (as) => {
			const wrapper = mount(Box, { props: { as } });

			expect(wrapper.element.tagName).toBe(as.toUpperCase());
		});

		it('keeps the layout classes when rendering a semantic element', () => {
			const wrapper = mount(Box, { props: { as: 'nav', direction: 'row' } });

			expect(wrapper.element.tagName).toBe('NAV');
			expect(wrapper.classes()).toContain('flex');
			expect(wrapper.classes()).toContain('flex-row');
		});
	});

	describe('direction', () => {
		it('applies responsive direction by default (flex-col)', () => {
			const wrapper = mount(Box);

			expect(wrapper.classes()).toContain('flex');
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

		it('applies flex-row flex-wrap when direction is wrap', () => {
			const wrapper = mount(Box, { props: { direction: 'wrap' } });

			expect(wrapper.classes()).toContain('flex-row');
			expect(wrapper.classes()).toContain('flex-wrap');
		});
	});

	describe('container', () => {
		it('does not apply @container by default', () => {
			const wrapper = mount(Box);

			expect(wrapper.classes()).not.toContain('@container');
		});

		it('applies @container when container prop is true', () => {
			const wrapper = mount(Box, { props: { container: true } });

			expect(wrapper.classes()).toContain('@container');
		});
	});
});
