import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import ImageThumbnail from './ImageThumbnail.vue';

// A new source per test: the component remembers the sources that already loaded.
let sourceCount = 0;
let primarySrc = '';
const FALLBACK_SRC = '/images/logo-mark.svg';
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
		sourceCount += 1;
		primarySrc = `https://example.com/thumb-${sourceCount}.png`;
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe('while the primary image is loading', () => {
		it('shows the animated placeholder', () => {
			mockImages();
			const wrapper = mountThumbnail(primarySrc);

			expect(wrapper.find('[data-testid="placeholder"]').exists()).toBe(true);
			expect(wrapper.find('img').exists()).toBe(false);
			wrapper.unmount();
		});
	});

	describe('when the primary image loads', () => {
		it('shows the primary image', async () => {
			mockImages();
			const wrapper = mountThumbnail(primarySrc);
			await settleLoads();

			const img = wrapper.find('img');
			expect(img.exists()).toBe(true);
			expect(img.attributes('src')).toBe(primarySrc);
			expect(img.attributes('alt')).toBe(ALT_TEXT);
			expect(wrapper.find('[data-testid="placeholder"]').exists()).toBe(false);
			wrapper.unmount();
		});
	});

	describe('when the primary image fails', () => {
		it('shows the fallback image', async () => {
			mockImages([primarySrc]);
			const wrapper = mountThumbnail(primarySrc);
			await settleLoads();

			const img = wrapper.find('img');
			expect(img.exists()).toBe(true);
			expect(img.attributes('src')).toBe(FALLBACK_SRC);
			wrapper.unmount();
		});
	});

	describe('when both the primary and fallback images fail', () => {
		it('renders no image, leaving the grey surface visible', async () => {
			mockImages([primarySrc, FALLBACK_SRC]);
			const wrapper = mountThumbnail(primarySrc);
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

	describe('when a source fails to load', () => {
		// `useImage` reports failures to `globalThis.reportError` unless told otherwise. The spy is
		// installed before mounting because the handler is resolved when the component sets up.
		const originalReportError = globalThis.reportError;
		const reportError = vi.fn();

		beforeEach(() => {
			reportError.mockClear();
			globalThis.reportError = reportError;
		});

		afterEach(() => {
			globalThis.reportError = originalReportError;
		});

		it('does not report an empty src as an uncaught error', async () => {
			mockImages(['']);
			const wrapper = mountThumbnail('');
			await settleLoads();

			expect(reportError).not.toHaveBeenCalled();
			wrapper.unmount();
		});

		it('does not report a broken primary image as an uncaught error', async () => {
			mockImages([primarySrc]);
			const wrapper = mountThumbnail(primarySrc);
			await settleLoads();

			expect(wrapper.find('img').attributes('src')).toBe(FALLBACK_SRC);
			expect(reportError).not.toHaveBeenCalled();
			wrapper.unmount();
		});
	});

	describe('with a fallback slot', () => {
		const mountWithSlot = (src: string) =>
			mount(ImageThumbnail, {
				props: { src, alt: ALT_TEXT },
				slots: { fallback: '<span data-testid="fallback-slot" />' },
				global: { stubs: { AnimatedPlaceHolder: AnimatedPlaceHolderStub } },
				attachTo: document.body
			});

		it('shows the slot right away when src is empty', () => {
			mockImages();
			const wrapper = mountWithSlot('');

			expect(wrapper.find('[data-testid="fallback-slot"]').exists()).toBe(true);
			expect(wrapper.find('img').exists()).toBe(false);
			wrapper.unmount();
		});

		it('shows the slot when the primary image fails', async () => {
			mockImages([primarySrc]);
			const wrapper = mountWithSlot(primarySrc);
			await settleLoads();

			expect(wrapper.find('[data-testid="fallback-slot"]').exists()).toBe(true);
			expect(wrapper.find('img').exists()).toBe(false);
			wrapper.unmount();
		});

		it('shows the primary image instead of the slot when it loads', async () => {
			mockImages();
			const wrapper = mountWithSlot(primarySrc);
			await settleLoads();

			expect(wrapper.find('img').attributes('src')).toBe(primarySrc);
			expect(wrapper.find('[data-testid="fallback-slot"]').exists()).toBe(false);
			wrapper.unmount();
		});
	});
	describe('when the same source is mounted again', () => {
		it('shows the image at once instead of the placeholder', async () => {
			mockImages();
			const first = mountThumbnail(primarySrc);
			await settleLoads();
			expect(first.find('img').exists()).toBe(true);
			first.unmount();

			const second = mountThumbnail(primarySrc);

			expect(second.find('img').exists()).toBe(true);
			expect(second.find('[data-testid="placeholder"]').exists()).toBe(false);
			second.unmount();
		});
	});
});
