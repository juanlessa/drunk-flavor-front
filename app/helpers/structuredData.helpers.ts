import type { Drink } from '~/domain/drink/drink.entity';
import { RATING_MAX_VALUE, RATING_MIN_VALUE } from '~/domain/rating/rating.constants';

type JsonLdNode = Record<string, unknown>;

const SCHEMA_CONTEXT = 'https://schema.org';

/**
 * Serializes JSON-LD for an inline `<script type="application/ld+json">`.
 *
 * The content comes from user-managed data (drink names, methods), and a `</script>` inside it
 * would end the block early. Escaping `<`, `>` and `&` keeps the JSON valid and the page safe;
 * U+2028 and U+2029 are escaped because they are not valid in JavaScript string literals.
 */
export const serializeJsonLd = (data: JsonLdNode | JsonLdNode[]): string =>
	JSON.stringify(data)
		.replace(/</g, '\\u003c')
		.replace(/>/g, '\\u003e')
		.replace(/&/g, '\\u0026')
		.replace(/\u2028/g, '\\u2028')
		.replace(/\u2029/g, '\\u2029');

/** One recipe step per non-empty line of the method. */
export const splitMethodSteps = (method: string): string[] =>
	method
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean);

/** Absolute URL for a possibly relative one; `undefined` when it cannot be resolved. */
const toAbsoluteUrl = (url: string | undefined, siteUrl: string): string | undefined => {
	if (!url) return undefined;
	try {
		return new URL(url, siteUrl).href;
	} catch {
		return undefined;
	}
};

/** ISO 8601 date; the API sends dates as strings even though the entity types them as `Date`. */
const toIsoDate = (value: Date | string | undefined): string | undefined => {
	if (!value) return undefined;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

const roundToOneDecimal = (value: number): number => Math.round(value * 10) / 10;

export type RecipeJsonLdInput = {
	drink: Pick<
		Drink,
		'cover' | 'thumbnail' | 'avgRating' | 'ratingsCount' | 'createdAt' | 'updatedAt'
	>;
	name: string;
	description: string;
	method: string;
	/** Ingredients as written on the page ("75 ml of gin"), so the markup matches the visible text. */
	ingredients: string[];
	category: string;
	/** Language of the page, e.g. `en`. */
	locale: string;
	/** Absolute canonical URL of the page. */
	url: string;
	siteUrl: string;
	/** Who wrote the recipe: the site itself, since drinks have no individual author. */
	publisherName: string;
};

/**
 * schema.org `Recipe` for a drink page. Returns `undefined` when the drink has no image, because
 * Google requires one and would reject the markup.
 *
 * Only values the site really holds are emitted: no invented prep time, yield or nutrition.
 * `aggregateRating` is left out until the drink has at least one rating, as Google requires.
 */
export const buildRecipeJsonLd = (input: RecipeJsonLdInput): JsonLdNode | undefined => {
	const { drink, siteUrl } = input;

	// The square thumbnail and the wide cover give Google more than one aspect ratio to pick from.
	const images = [drink.thumbnail?.url, drink.cover?.url]
		.map((url) => toAbsoluteUrl(url, siteUrl))
		.filter((url): url is string => !!url);
	const uniqueImages = [...new Set(images)];
	if (!input.name || uniqueImages.length === 0) return undefined;

	const steps = splitMethodSteps(input.method);
	const hasRating =
		drink.ratingsCount > 0 &&
		Number.isFinite(drink.avgRating) &&
		drink.avgRating >= RATING_MIN_VALUE;

	return {
		'@context': SCHEMA_CONTEXT,
		'@type': 'Recipe',
		name: input.name,
		image: uniqueImages,
		description: input.description || undefined,
		url: input.url,
		mainEntityOfPage: input.url,
		inLanguage: input.locale,
		author: { '@type': 'Organization', name: input.publisherName, url: siteUrl },
		datePublished: toIsoDate(drink.createdAt),
		dateModified: toIsoDate(drink.updatedAt),
		recipeCategory: input.category || undefined,
		recipeIngredient: input.ingredients.length ? input.ingredients : undefined,
		recipeInstructions: steps.length
			? steps.map((text) => ({ '@type': 'HowToStep', text }))
			: undefined,
		aggregateRating: hasRating
			? {
					'@type': 'AggregateRating',
					ratingValue: roundToOneDecimal(drink.avgRating),
					ratingCount: drink.ratingsCount,
					bestRating: RATING_MAX_VALUE,
					worstRating: RATING_MIN_VALUE
				}
			: undefined
	};
};

export type BreadcrumbItem = { name: string; url: string };

/** schema.org `BreadcrumbList`; the last item is the current page. */
export const buildBreadcrumbJsonLd = (items: BreadcrumbItem[]): JsonLdNode => ({
	'@context': SCHEMA_CONTEXT,
	'@type': 'BreadcrumbList',
	itemListElement: items.map((item, index) => ({
		'@type': 'ListItem',
		position: index + 1,
		name: item.name,
		item: item.url
	}))
});

export type SiteJsonLdInput = {
	name: string;
	/** Origin of the site, e.g. `https://drunkflavor.com`. */
	siteUrl: string;
	/** Absolute URL of the home page in the language being read. */
	homeUrl: string;
	locale: string;
};

/** schema.org `WebSite` and `Organization` for the home page. */
export const buildSiteJsonLd = (input: SiteJsonLdInput): JsonLdNode[] => [
	{
		'@context': SCHEMA_CONTEXT,
		'@type': 'WebSite',
		name: input.name,
		url: input.homeUrl,
		inLanguage: input.locale
	},
	{
		'@context': SCHEMA_CONTEXT,
		'@type': 'Organization',
		name: input.name,
		url: input.siteUrl
	}
];
