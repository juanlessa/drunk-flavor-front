import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ImageCover from './ImageCover.vue';

const SRC = 'https://example.com/cover.png';
const ALT = 'Piña Colada';

const mountImageCover = (props: Record<string, unknown> = {}) =>
	mount(ImageCover, { props: { src: SRC, ...props } });

describe('ImageCover', () => {
	describe('rendering', () => {
		it('renders the image via CSS background-image', () => {
			const wrapper = mountImageCover();
			const style = wrapper.attributes('style');

			expect(style).toContain('background-image:');
			expect(style).toContain(SRC);
		});
	});

	describe('accessibility', () => {
		describe('when alt is provided (informative)', () => {
			it('exposes role="img"', () => {
				const wrapper = mountImageCover({ alt: ALT });

				expect(wrapper.attributes('role')).toBe('img');
			});

			it('exposes the alt as the accessible name via aria-label', () => {
				const wrapper = mountImageCover({ alt: ALT });

				expect(wrapper.attributes('aria-label')).toBe(ALT);
			});

			it('is not hidden from assistive technology', () => {
				const wrapper = mountImageCover({ alt: ALT });

				expect(wrapper.attributes('aria-hidden')).toBeUndefined();
			});
		});

		describe('when alt is omitted (decorative)', () => {
			it('is hidden from assistive technology', () => {
				const wrapper = mountImageCover();

				expect(wrapper.attributes('aria-hidden')).toBe('true');
			});

			it('does not expose an img role', () => {
				const wrapper = mountImageCover();

				expect(wrapper.attributes('role')).toBeUndefined();
			});

			it('does not expose an aria-label', () => {
				const wrapper = mountImageCover();

				expect(wrapper.attributes('aria-label')).toBeUndefined();
			});
		});

		describe('when alt is whitespace only', () => {
			it('is treated as decorative', () => {
				const wrapper = mountImageCover({ alt: '   ' });

				expect(wrapper.attributes('aria-hidden')).toBe('true');
				expect(wrapper.attributes('role')).toBeUndefined();
				expect(wrapper.attributes('aria-label')).toBeUndefined();
			});
		});
	});
});
