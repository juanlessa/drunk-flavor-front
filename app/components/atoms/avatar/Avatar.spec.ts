import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Avatar from './Avatar.vue';

describe('Avatar', () => {
	it('applies the requested size to the Radix root', () => {
		const wrapper = mount(Avatar, {
			props: { alt: 'User avatar', size: 'lg', fallbackDelay: 0 }
		});

		expect(wrapper.classes()).toContain('size-24');
		expect(wrapper.element.tagName).toBe('SPAN');
	});

	it('renders the themed ProfileIcon fallback when no source is provided', () => {
		const wrapper = mount(Avatar, { props: { alt: 'User avatar', fallbackDelay: 0 } });

		expect(wrapper.find('svg.fill-current').exists()).toBe(true);
		expect(wrapper.find('.bg-accent-subtle').exists()).toBe(true);
		expect(wrapper.find('.dark\\:bg-blue-950').exists()).toBe(true);
		expect(wrapper.find('.dark\\:text-neutral-300').exists()).toBe(true);
		expect(wrapper.text()).toContain('User avatar');
	});

	it('forwards the source and accessible name to Radix Avatar.Image', () => {
		const wrapper = mount(Avatar, {
			props: { src: '/avatar.png', alt: 'Jane avatar', fallbackDelay: 0 }
		});
		const image = wrapper.find('img[src="/avatar.png"]');

		expect(image.exists()).toBe(true);
		expect(image.attributes('alt')).toBe('Jane avatar');
	});
});
