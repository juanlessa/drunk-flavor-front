import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import ImageCover from './ImageCover.vue';

describe('ImageCover accessibility', () => {
	it('has no violations when informative', async () => {
		const wrapper = mount(ImageCover, {
			props: { src: '/cover.png', alt: 'A cocktail' },
			attachTo: document.body
		});

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});

	it('has no violations when decorative', async () => {
		const wrapper = mount(ImageCover, {
			props: { src: '/cover.png' },
			attachTo: document.body
		});

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
