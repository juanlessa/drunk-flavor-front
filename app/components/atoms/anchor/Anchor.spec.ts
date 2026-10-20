import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Anchor from './Anchor.vue';

const NuxtLinkStub = {
	template: '<a :href="to"><slot /></a>',
	props: ['to']
};

const mountAnchor = (props = {}, slots = {}) =>
	mount(Anchor, {
		props,
		slots,
		global: { stubs: { NuxtLink: NuxtLinkStub } }
	});

describe('Anchor', () => {
	describe('rendering', () => {
		it('renders an anchor element', () => {
			const wrapper = mountAnchor({ to: '/home' });

			expect(wrapper.find('a').exists()).toBe(true);
		});

		it('renders the value prop as text content', () => {
			const wrapper = mountAnchor({ to: '/home', value: 'Go home' });

			expect(wrapper.text()).toBe('Go home');
		});

		it('renders slot content over value prop', () => {
			const wrapper = mountAnchor(
				{ to: '/home', value: 'Fallback' },
				{ default: 'Slot Link' }
			);

			expect(wrapper.text()).toBe('Slot Link');
		});

		it('applies the to prop as href', () => {
			const wrapper = mountAnchor({ to: '/about' });

			expect(wrapper.find('a').attributes('href')).toBe('/about');
		});
	});

	describe('styling', () => {
		it('applies default text-body class', () => {
			const wrapper = mountAnchor({ to: '/' });

			expect(wrapper.classes()).toContain('text-body');
		});

		it('applies default font-regular class', () => {
			const wrapper = mountAnchor({ to: '/' });

			expect(wrapper.classes()).toContain('font-regular');
		});

		it('applies default text-content class', () => {
			const wrapper = mountAnchor({ to: '/' });

			expect(wrapper.classes()).toContain('text-content');
		});
	});
});
