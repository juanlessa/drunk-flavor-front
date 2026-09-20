import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { VueWrapper } from '@vue/test-utils';
import { mount, flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import ImageThumbnail from './ImageThumbnail.vue';

const PRIMARY_SRC = 'https://example.com/thumb.png';
const FALLBACK_SRC = '/thumbnail-placeholder.png';
const ALT_TEXT = 'thumbnail';
const LOAD_DELAY = 150;

interface MockImageInstance {
	onload: () => void;
	onerror: () => void;
	src: string;
}

/**
 * Drives each mock <img> by its src: sources listed in `failing` reject,
 * everything else resolves after a short delay.
 */
const mockImages = (failing: string[] = []) => {
	window.Image = function (this: MockImageInstance) {
		this.onload = () => {};
		this.onerror = () => {};
		Object.defineProperty(this, 'src', {
			set: (value: string) => {
				if (failing.includes(value)) {
					queueMicrotask(() => this.onerror());
				} else {
					setTimeout(() => this.onload(), LOAD_DELAY);
				}
			}
		});
	} as unknown as typeof window.Image;
};

const settleLoads = async () => {
	// Flush any microtask-based errors first so the fallback chain is engaged,
	// then advance timers for the load and let the reactive chain settle.
	await flushPromises();
	await nextTick();
	await vi.advanceTimersByTimeAsync(LOAD_DELAY + 50);
	await flushPromises();
	await nextTick();
};

const settleErrors = async () => {
	await flushPromises();
	await nextTick();
};

const AnimatedPlaceHolderStub = {
	template: '<div data-testid="placeholder" />'
};

const mountThumbnail = (src: string) =>
	mount(ImageThumbnail, {
		props: { src, srcFallback: FALLBACK_SRC, alt: ALT_TEXT },
		global: { stubs: { AnimatedPlaceHolder: AnimatedPlaceHolderStub } },
		attachTo: document.body
	});

describe('ImageThumbnail', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('always renders a grey surface on the root container', () => {
		mockImages();
		const wrapper = mountThumbnail(PRIMARY_SRC);

		expect(wrapper.classes()).toContain('bg-surface-sunken');
		wrapper.unmount();
	});

	describe('while the primary image is loading', () => {
		it('shows the animated placeholder', () => {
			mockImages();
			const wrapper = mountThumbnail(PRIMARY_SRC);

			expect(wrapper.find('[data-testid="placeholder"]').exists()).toBe(true);
			expect(wrapper.find('img').exists()).toBe(false);
			wrapper.unmount();
		});
	});

	describe('when the primary image loads', () => {
		it('shows the primary image', async () => {
			mockImages();
			const wrapper = mountThumbnail(PRIMARY_SRC);
			await settleLoads();

			const img = wrapper.find('img');
			expect(img.exists()).toBe(true);
			expect(img.attributes('src')).toBe(PRIMARY_SRC);
			expect(img.attributes('alt')).toBe(ALT_TEXT);
			expect(wrapper.find('[data-testid="placeholder"]').exists()).toBe(false);
			wrapper.unmount();
		});
	});

	describe('when the primary image fails', () => {
		it('shows the fallback image', async () => {
			mockImages([PRIMARY_SRC]);
			const wrapper = mountThumbnail(PRIMARY_SRC);
			await settleLoads();

			const img = wrapper.find('img');
			expect(img.exists()).toBe(true);
			expect(img.attributes('src')).toBe(FALLBACK_SRC);
			wrapper.unmount();
		});
	});

	describe('when both the primary and fallback images fail', () => {
		it('renders no image, leaving the grey surface visible', async () => {
			mockImages([PRIMARY_SRC, FALLBACK_SRC]);
			const wrapper = mountThumbnail(PRIMARY_SRC);
			await settleErrors();

			expect(wrapper.find('img').exists()).toBe(false);
			expect(wrapper.find('[data-testid="placeholder"]').exists()).toBe(false);
			expect(wrapper.classes()).toContain('bg-surface-sunken');
			wrapper.unmount();
		});
	});

	describe('when src is empty', () => {
		it('skips the primary source and shows the fallback', async () => {
			mockImages();
			const wrapper = mountThumbnail('');
			await settleLoads();

			const img = wrapper.find('img');
			expect(img.exists()).toBe(true);
			expect(img.attributes('src')).toBe(FALLBACK_SRC);
			wrapper.unmount();
		});
	});
});
