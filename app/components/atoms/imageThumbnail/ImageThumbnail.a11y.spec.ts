import { afterEach, describe, it } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { expectNoA11yViolations } from '~/test/axe';
import AnimatedPlaceHolder from '~/components/atoms/animatedPlaceholder/AnimatedPlaceHolder.vue';
import ImageThumbnail from './ImageThumbnail.vue';

const originalImage = window.Image;
const LOAD_DELAY = 10;

/** Replaces window.Image so every source loads (or fails) after a short delay, as the browser would. */
const mockImages = (failing: string[] = []) => {
	window.Image = function (this: { onload: () => void; onerror: () => void }) {
		this.onload = () => {};
		this.onerror = () => {};
		Object.defineProperty(this, 'src', {
			set: (value: string) => {
				setTimeout(
					() => (failing.includes(value) ? this.onerror() : this.onload()),
					LOAD_DELAY
				);
			}
		});
	} as unknown as typeof window.Image;
};

// Real timers on purpose: axe-core relies on its own timers and hangs under fake timers.
const waitForImages = async () => {
	await new Promise((resolve) => setTimeout(resolve, LOAD_DELAY * 5));
	await flushPromises();
};

const mountThumbnail = () =>
	mount(ImageThumbnail, {
		props: { src: '/thumb.png', srcFallback: '/fallback.png', alt: 'A cocktail' },
		global: { components: { AnimatedPlaceHolder } },
		attachTo: document.body
	});

describe('ImageThumbnail accessibility', () => {
	afterEach(() => {
		window.Image = originalImage;
	});

	it('has no violations while loading', async () => {
		mockImages();
		const wrapper = mountThumbnail();

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});

	it('has no violations once the primary image has loaded', async () => {
		mockImages();
		const wrapper = mountThumbnail();
		await waitForImages();

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});

	it('has no violations when falling back to the placeholder image', async () => {
		mockImages(['/thumb.png']);
		const wrapper = mountThumbnail();
		await waitForImages();

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
