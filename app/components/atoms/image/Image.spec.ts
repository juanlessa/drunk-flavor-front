import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import type { VueWrapper } from '@vue/test-utils';
import { mount, flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import Image from './Image.vue';
import type { ImageRounded } from './Image.types';

const VALID_SRC = 'https://example.com/image.png';
const INVALID_SRC = 'https://example.com/broken.png';
const ALT_TEXT = 'Sample image';
const LOAD_DELAY = 150;

interface MockImageInstance {
	onload: () => void;
	onerror: () => void;
	src: string;
}

const mockImageThatLoads = (delay = LOAD_DELAY) => {
	window.Image = function (this: MockImageInstance) {
		this.onload = () => {};
		this.onerror = () => {};
		this.src = '';
		setTimeout(() => this.onload(), delay);
	} as unknown as typeof window.Image;
};

const mockImageThatFails = () => {
	window.Image = function (this: MockImageInstance) {
		this.onload = () => {};
		this.onerror = () => {};
		this.src = '';
		queueMicrotask(() => this.onerror());
	} as unknown as typeof window.Image;
};

const mockImageInert = () => {
	window.Image = function (this: MockImageInstance) {
		this.onload = () => {};
		this.onerror = () => {};
		this.src = '';
	} as unknown as typeof window.Image;
};

const waitForImageLoad = async () => {
	await vi.advanceTimersByTimeAsync(LOAD_DELAY + 50);
	await flushPromises();
	await nextTick();
};

const waitForError = async () => {
	await vi.advanceTimersByTimeAsync(100);
	await flushPromises();
	await nextTick();
};

describe('Image', () => {
	describe('given a working image', () => {
		let wrapper: VueWrapper<InstanceType<typeof Image>>;

		beforeAll(async () => {
			vi.useFakeTimers();
			mockImageThatLoads();
			wrapper = mount(Image, {
				props: { src: VALID_SRC, alt: ALT_TEXT },
				attachTo: document.body
			});
		});

		afterAll(() => {
			wrapper.unmount();
			vi.useRealTimers();
		});

		it('renders the loading state initially', () => {
			expect(wrapper.find('img').exists()).toBe(false);
		});

		it('renders the image after it loads', async () => {
			await waitForImageLoad();

			const img = wrapper.find('img');
			expect(img.exists()).toBe(true);
			expect(img.attributes('src')).toBe(VALID_SRC);
		});

		it('has alt text on the image', () => {
			const img = wrapper.find('img');
			expect(img.attributes('alt')).toBe(ALT_TEXT);
		});

		it('does not show fallback after image loads', () => {
			expect(wrapper.find('span').exists()).toBe(false);
		});
	});

	describe('given a broken image', () => {
		let wrapper: VueWrapper<InstanceType<typeof Image>>;

		beforeAll(async () => {
			vi.useFakeTimers();
			mockImageThatFails();
			wrapper = mount(Image, {
				props: { src: INVALID_SRC, alt: ALT_TEXT },
				attachTo: document.body
			});
			await waitForError();
		});

		afterAll(() => {
			wrapper.unmount();
			vi.useRealTimers();
		});

		it('does not render an img element', () => {
			expect(wrapper.find('img').exists()).toBe(false);
		});

		it('renders the fallback with alt text', () => {
			expect(wrapper.text()).toContain(ALT_TEXT);
		});
	});

	describe('slots', () => {
		describe('fallback slot', () => {
			let wrapper: VueWrapper<InstanceType<typeof Image>>;

			beforeAll(async () => {
				vi.useFakeTimers();
				mockImageThatFails();
				wrapper = mount(Image, {
					props: { src: INVALID_SRC, alt: ALT_TEXT },
					slots: { fallback: '<div class="custom-fallback">Custom Fallback</div>' },
					attachTo: document.body
				});
				await waitForError();
			});

			afterAll(() => {
				wrapper.unmount();
				vi.useRealTimers();
			});

			it('renders custom fallback slot content', () => {
				expect(wrapper.find('.custom-fallback').exists()).toBe(true);
				expect(wrapper.text()).toContain('Custom Fallback');
			});

			it('does not render the default alt text fallback', () => {
				const span = wrapper.find('span');
				if (span.exists()) {
					expect(span.text()).not.toBe(ALT_TEXT);
				}
			});
		});

		describe('loading slot', () => {
			let wrapper: VueWrapper<InstanceType<typeof Image>>;

			beforeAll(async () => {
				vi.useFakeTimers();
				mockImageThatLoads();
				wrapper = mount(Image, {
					props: { src: VALID_SRC, alt: ALT_TEXT },
					slots: { loading: '<div class="loading-indicator">Loading...</div>' },
					attachTo: document.body
				});
			});

			afterAll(() => {
				wrapper.unmount();
				vi.useRealTimers();
			});

			it('renders the loading slot while image is loading', () => {
				expect(wrapper.find('.loading-indicator').exists()).toBe(true);
				expect(wrapper.text()).toContain('Loading...');
			});

			it('hides loading slot after image loads', async () => {
				await waitForImageLoad();
				expect(wrapper.find('.loading-indicator').exists()).toBe(false);
			});
		});
	});

	describe('given empty src', () => {
		let wrapper: VueWrapper<InstanceType<typeof Image>>;

		beforeAll(async () => {
			vi.useFakeTimers();
			mockImageInert();
			wrapper = mount(Image, {
				props: { src: '', alt: ALT_TEXT },
				attachTo: document.body
			});
			await waitForError();
		});

		afterAll(() => {
			wrapper.unmount();
			vi.useRealTimers();
		});

		it('does not render an img element', () => {
			expect(wrapper.find('img').exists()).toBe(false);
		});

		it('shows the loading state since no error is triggered', () => {
			expect(wrapper.find('div').exists()).toBe(true);
		});
	});

	describe('strict mode', () => {
		describe('when image loads successfully', () => {
			let wrapper: VueWrapper<InstanceType<typeof Image>>;

			beforeAll(async () => {
				vi.useFakeTimers();
				mockImageThatLoads();
				wrapper = mount(Image, {
					props: { src: VALID_SRC, alt: ALT_TEXT, strict: true },
					attachTo: document.body
				});
				await waitForImageLoad();
			});

			afterAll(() => {
				wrapper.unmount();
				vi.useRealTimers();
			});

			it('renders the container', () => {
				expect(wrapper.find('div').exists()).toBe(true);
			});

			it('renders the image', () => {
				const img = wrapper.find('img');
				expect(img.exists()).toBe(true);
				expect(img.attributes('src')).toBe(VALID_SRC);
			});
		});

		describe('when image fails to load', () => {
			let wrapper: VueWrapper<InstanceType<typeof Image>>;

			beforeAll(async () => {
				vi.useFakeTimers();
				mockImageThatFails();
				wrapper = mount(Image, {
					props: { src: INVALID_SRC, alt: ALT_TEXT, strict: true },
					attachTo: document.body
				});
				await waitForError();
			});

			afterAll(() => {
				wrapper.unmount();
				vi.useRealTimers();
			});

			it('does not render any DOM element', () => {
				expect(wrapper.find('div').exists()).toBe(false);
				expect(wrapper.find('img').exists()).toBe(false);
			});

			it('renders only a comment node', () => {
				expect(wrapper.html()).toBe('<!--v-if-->');
			});
		});
	});

	describe('dimensions', () => {
		let wrapper: VueWrapper<InstanceType<typeof Image>>;

		beforeAll(async () => {
			vi.useFakeTimers();
			mockImageThatLoads();
			wrapper = mount(Image, {
				props: { src: VALID_SRC, alt: ALT_TEXT, width: '200px', height: '150px' },
				attachTo: document.body
			});
			await waitForImageLoad();
		});

		afterAll(() => {
			wrapper.unmount();
			vi.useRealTimers();
		});

		it('applies custom width and height styles', () => {
			const root = wrapper.find('div');
			expect(root.attributes('style')).toContain('width: 200px');
			expect(root.attributes('style')).toContain('height: 150px');
		});

		it('applies default width and height when not provided', async () => {
			wrapper.unmount();
			mockImageThatLoads();
			wrapper = mount(Image, {
				props: { src: VALID_SRC, alt: ALT_TEXT },
				attachTo: document.body
			});
			await waitForImageLoad();

			const root = wrapper.find('div');
			expect(root.attributes('style')).toContain('width: 7rem');
			expect(root.attributes('style')).toContain('height: 8.5rem');
		});
	});

	describe('rounded variants', () => {
		const mountWithRounded = async (rounded: ImageRounded) => {
			vi.useFakeTimers();
			mockImageThatLoads();
			const wrapper = mount(Image, {
				props: { src: VALID_SRC, alt: ALT_TEXT, rounded },
				attachTo: document.body
			});
			await waitForImageLoad();
			return wrapper;
		};

		afterAll(() => {
			vi.useRealTimers();
		});

		it('applies rounded-md by default', async () => {
			const wrapper = await mountWithRounded('md');
			expect(wrapper.find('div').classes()).toContain('rounded-md');
			wrapper.unmount();
		});

		it('applies rounded-full when set', async () => {
			const wrapper = await mountWithRounded('full');
			expect(wrapper.find('div').classes()).toContain('rounded-full');
			wrapper.unmount();
		});

		it('applies rounded-none when set', async () => {
			const wrapper = await mountWithRounded('none');
			expect(wrapper.find('div').classes()).toContain('rounded-none');
			wrapper.unmount();
		});

		it('applies rounded-lg when set', async () => {
			const wrapper = await mountWithRounded('lg');
			expect(wrapper.find('div').classes()).toContain('rounded-lg');
			wrapper.unmount();
		});

		it('applies rounded-sm when set', async () => {
			const wrapper = await mountWithRounded('sm');
			expect(wrapper.find('div').classes()).toContain('rounded-sm');
			wrapper.unmount();
		});

		it('applies rounded-xs when set', async () => {
			const wrapper = await mountWithRounded('xs');
			expect(wrapper.find('div').classes()).toContain('rounded-xs');
			wrapper.unmount();
		});

		it('applies rounded-px when set', async () => {
			const wrapper = await mountWithRounded('px');
			expect(wrapper.find('div').classes()).toContain('rounded-px');
			wrapper.unmount();
		});
	});
});
