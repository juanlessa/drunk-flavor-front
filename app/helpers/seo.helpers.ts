import type { Drink } from '~/domain/drink/drink.entity';

/** Ingredients named in a meta description; more would push it past what search results show. */
export const MAX_DESCRIPTION_INGREDIENTS = 4;

/**
 * Joins ingredient names the way the language writes a list ("gin, Campari and vermouth",
 * "gin, Campari e vermute"), keeping only the first ones so the description stays short.
 */
export const formatIngredientList = (
	names: string[],
	locale: string,
	max = MAX_DESCRIPTION_INGREDIENTS
): string => {
	const listed = names
		.map((name) => name.trim())
		.filter(Boolean)
		.slice(0, max);
	return new Intl.ListFormat(locale, { style: 'long', type: 'conjunction' }).format(listed);
};

/** Absolute URL for a possibly relative one; `undefined` when it cannot be resolved. */
export const toAbsoluteUrl = (url: string | undefined, siteUrl: string): string | undefined => {
	if (!url) return undefined;
	try {
		return new URL(url, siteUrl).href;
	} catch {
		return undefined;
	}
};

export type ShareImage = {
	url: string;
	alt: string;
	/** `summary_large_image` for the wide cover, `summary` for the square thumbnail. */
	card: 'summary_large_image' | 'summary';
};

/**
 * Picture shown when a drink link is shared. The wide cover fills the large card; a drink with only
 * a square thumbnail gets the small card, where a square image is not cropped. `undefined` when the
 * drink has no picture, so the page keeps the site-wide default image.
 */
export const getDrinkShareImage = (
	drink: Pick<Drink, 'cover' | 'thumbnail'>,
	name: string,
	siteUrl: string
): ShareImage | undefined => {
	const cover = toAbsoluteUrl(drink.cover?.url, siteUrl);
	if (cover) return { url: cover, alt: name, card: 'summary_large_image' };
	const thumbnail = toAbsoluteUrl(drink.thumbnail?.url, siteUrl);
	if (thumbnail) return { url: thumbnail, alt: name, card: 'summary' };
	return undefined;
};
