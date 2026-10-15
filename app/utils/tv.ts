import { createTV } from 'tailwind-variants';

/**
 * Design-system font sizes declared in `styles/tokens/typography.css`.
 *
 * tailwind-merge only knows Tailwind's built-in scale, so a custom `text-body`
 * is indistinguishable from a custom colour such as `text-content`: both look
 * like `text-<unknown>` and fall into the same conflict group, where the later
 * class silently drops the earlier one. Declaring the sizes puts them in the
 * `font-size` group and leaves the colours in `text-color`, so a recipe can
 * carry a size and a colour at the same time.
 */
const FONT_SIZE_CLASSES = [
	'text-caption-sm',
	'text-caption',
	'text-body-sm',
	'text-body',
	'text-body-lg',
	'text-title-sm',
	'text-title',
	'text-title-lg',
	'text-headline-sm',
	'text-headline',
	'text-headline-lg',
	'text-display-sm',
	'text-display',
	'text-display-lg'
];

/**
 * The project's `tv`. Every recipe must import it from here.
 *
 * Importing `tv` straight from `tailwind-variants` yields an instance that does
 * not know the tokens above, and the failure is silent: classes just disappear.
 * ESLint blocks that import so the mistake cannot ship.
 */
export const tv = createTV({
	twMergeConfig: {
		extend: {
			classGroups: {
				'font-size': FONT_SIZE_CLASSES
			}
		}
	}
});
