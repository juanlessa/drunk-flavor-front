import { defineConfig } from '@vite-pwa/assets-generator/config';
import { PWA_BACKGROUND_COLOR } from './config/pwa';

const opaque = { fit: 'contain', background: PWA_BACKGROUND_COLOR } as const;

/**
 * Generates the favicon and the installable-app icons from the vector mark (glasses only, in the
 * dark theme accent, `blue-400`). Run `npm run pwa:assets` after changing the source and commit the
 * output. Paths are relative to the source file, so `..` is `public/`:
 *
 * - `public/favicon.ico`: transparent, the browser tab shows it on light and dark chrome.
 * - `public/apple-touch-icon.png`: iOS "Add to Home Screen", requested from the site root by default.
 * - `public/icons/icon-192.png` and `icon-512.png`: regular ("any") manifest icons.
 * - `public/icons/icon-maskable-512.png`: manifest icon the OS crops to its own shape.
 *
 * Every app icon has an opaque dark background (the mark is light blue and would vanish on light
 * launchers). The generator's `transparent` preset never flattens the image, so the `apple`
 * preset, which does, also produces the regular icons through `assetName`. Maskable icons get
 * extra padding so the mark stays inside the 80% safe zone that OS masks leave visible.
 */
export default defineConfig({
	preset: {
		// The default (`quality: 60`) reduces PNGs to an 8-bit palette, which posterizes the soft
		// tones of the mark. Keep full color; the icons are small either way.
		png: { compressionLevel: 9, palette: false },
		transparent: {
			sizes: [],
			favicons: [[48, '../favicon.ico']],
			padding: 0.05
		},
		maskable: {
			sizes: [512],
			// Measured so the whole mark (the left foot is the widest point) stays inside the circle
			// with 80% of the icon's width as diameter.
			padding: 0.4,
			resizeOptions: opaque
		},
		apple: {
			sizes: [180, 192, 512],
			padding: 0.2,
			resizeOptions: opaque
		},
		assetName: (type, size) => {
			if (type === 'maskable') return `../icons/icon-maskable-${size.width}.png`;
			if (size.width === 180) return '../apple-touch-icon.png';
			return `../icons/icon-${size.width}.png`;
		}
	},
	images: ['public/images/logo-mark.svg']
});
