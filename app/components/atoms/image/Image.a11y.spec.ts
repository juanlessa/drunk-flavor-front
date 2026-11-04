import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import Image from './Image.vue';

describe('Image accessibility', () => {
	it('has no violations with an alt text', async () => {
		const wrapper = mount(Image, {
			props: { src: '/image.png', alt: 'A cocktail' },
			attachTo: document.body
		});

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
