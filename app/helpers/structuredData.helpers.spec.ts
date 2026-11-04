import { describe, expect, it } from 'vitest';
import {
	buildBreadcrumbJsonLd,
	buildRecipeJsonLd,
	buildSiteJsonLd,
	serializeJsonLd,
	splitMethodSteps,
	type RecipeJsonLdInput
} from './structuredData.helpers';

const SITE_URL = 'https://drunkflavor.com';

const buildInput = (overrides: Partial<RecipeJsonLdInput> = {}): RecipeJsonLdInput => ({
	drink: {
		cover: { name: 'c', mimetype: 'image/png', url: 'https://cdn.drunkflavor.com/cover.png' },
		thumbnail: {
			name: 't',
			mimetype: 'image/png',
			url: 'https://cdn.drunkflavor.com/thumb.png'
		},
		avgRating: 4.26,
		ratingsCount: 3,
		createdAt: new Date('2026-11-02T10:00:00.000Z'),
		updatedAt: new Date('2026-11-03T12:30:00.000Z')
	},
	name: 'Negroni',
	description: 'Negroni recipe: gin, Campari and sweet vermouth.',
	method: 'Stir with ice.\nStrain into a glass.',
	ingredients: ['30 ml of gin', '30 ml of Campari'],
	category: 'Drink',
	locale: 'en',
	url: `${SITE_URL}/en/drinks/abc`,
	siteUrl: SITE_URL,
	publisherName: 'DrunkFlavor',
	...overrides
});

describe('buildRecipeJsonLd', () => {
	it('describes the drink with the fields Google asks for', () => {
		const recipe = buildRecipeJsonLd(buildInput());

		expect(recipe).toMatchObject({
			'@context': 'https://schema.org',
			'@type': 'Recipe',
			name: 'Negroni',
			description: 'Negroni recipe: gin, Campari and sweet vermouth.',
			url: `${SITE_URL}/en/drinks/abc`,
			inLanguage: 'en',
			recipeCategory: 'Drink',
			recipeIngredient: ['30 ml of gin', '30 ml of Campari'],
			datePublished: '2026-11-02T10:00:00.000Z',
			dateModified: '2026-11-03T12:30:00.000Z',
			author: { '@type': 'Organization', name: 'DrunkFlavor', url: SITE_URL }
		});
	});

	it('offers the square thumbnail and the wide cover as images', () => {
		expect(buildRecipeJsonLd(buildInput())?.image).toEqual([
			'https://cdn.drunkflavor.com/thumb.png',
			'https://cdn.drunkflavor.com/cover.png'
		]);
	});

	it('turns each line of the method into a step', () => {
		expect(buildRecipeJsonLd(buildInput())?.recipeInstructions).toEqual([
			{ '@type': 'HowToStep', text: 'Stir with ice.' },
			{ '@type': 'HowToStep', text: 'Strain into a glass.' }
		]);
	});

	it('rates the recipe with a one-decimal average on the 1 to 5 scale', () => {
		expect(buildRecipeJsonLd(buildInput())?.aggregateRating).toEqual({
			'@type': 'AggregateRating',
			ratingValue: 4.3,
			ratingCount: 3,
			bestRating: 5,
			worstRating: 1
		});
	});

	it('leaves the rating out until the drink has at least one', () => {
		const recipe = buildRecipeJsonLd(
			buildInput({
				drink: { ...buildInput().drink, avgRating: 0, ratingsCount: 0 }
			})
		);

		expect(JSON.parse(serializeJsonLd(recipe!))).not.toHaveProperty('aggregateRating');
	});

	it('returns nothing without an image, which Google requires', () => {
		const drink = { ...buildInput().drink, cover: undefined, thumbnail: undefined };

		expect(buildRecipeJsonLd(buildInput({ drink }))).toBeUndefined();
	});

	it('works with a single image and does not repeat it', () => {
		const drink = { ...buildInput().drink, thumbnail: undefined };
		const same = {
			...buildInput().drink,
			thumbnail: {
				name: 't',
				mimetype: 'image/png',
				url: 'https://cdn.drunkflavor.com/cover.png'
			}
		};

		expect(buildRecipeJsonLd(buildInput({ drink }))?.image).toEqual([
			'https://cdn.drunkflavor.com/cover.png'
		]);
		expect(buildRecipeJsonLd(buildInput({ drink: same }))?.image).toEqual([
			'https://cdn.drunkflavor.com/cover.png'
		]);
	});

	it('resolves a relative image against the site URL', () => {
		const drink = {
			...buildInput().drink,
			thumbnail: undefined,
			cover: { name: 'c', mimetype: 'image/png', url: '/uploads/cover.png' }
		};

		expect(buildRecipeJsonLd(buildInput({ drink }))?.image).toEqual([
			`${SITE_URL}/uploads/cover.png`
		]);
	});

	it('returns nothing without a name', () => {
		expect(buildRecipeJsonLd(buildInput({ name: '' }))).toBeUndefined();
	});

	it('omits empty optional fields instead of emitting blanks', () => {
		const recipe = buildRecipeJsonLd(
			buildInput({ description: '', method: '  \n ', ingredients: [], category: '' })
		);
		const serialized = JSON.parse(serializeJsonLd(recipe!));

		expect(serialized).not.toHaveProperty('description');
		expect(serialized).not.toHaveProperty('recipeInstructions');
		expect(serialized).not.toHaveProperty('recipeIngredient');
		expect(serialized).not.toHaveProperty('recipeCategory');
	});

	it('accepts dates sent by the API as strings and skips invalid ones', () => {
		const drink = {
			...buildInput().drink,
			createdAt: '2026-01-05T08:00:00.000Z' as unknown as Date,
			updatedAt: 'not a date' as unknown as Date
		};
		const recipe = buildRecipeJsonLd(buildInput({ drink }));

		const serialized = JSON.parse(serializeJsonLd(recipe!));

		expect(serialized.datePublished).toBe('2026-01-05T08:00:00.000Z');
		expect(serialized).not.toHaveProperty('dateModified');
	});

	it('does not invent facts the site does not hold', () => {
		const serialized = JSON.parse(serializeJsonLd(buildRecipeJsonLd(buildInput())!));

		for (const field of ['prepTime', 'cookTime', 'totalTime', 'recipeYield', 'nutrition']) {
			expect(serialized).not.toHaveProperty(field);
		}
	});
});

describe('splitMethodSteps', () => {
	it('trims lines, drops blanks and handles Windows line breaks', () => {
		expect(splitMethodSteps('  First \r\n\r\n Second\n')).toEqual(['First', 'Second']);
	});
});

describe('buildBreadcrumbJsonLd', () => {
	it('numbers the items in order', () => {
		expect(
			buildBreadcrumbJsonLd([
				{ name: 'DrunkFlavor', url: `${SITE_URL}/en` },
				{ name: 'Negroni', url: `${SITE_URL}/en/drinks/abc` }
			])
		).toEqual({
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'DrunkFlavor', item: `${SITE_URL}/en` },
				{
					'@type': 'ListItem',
					position: 2,
					name: 'Negroni',
					item: `${SITE_URL}/en/drinks/abc`
				}
			]
		});
	});
});

describe('buildSiteJsonLd', () => {
	it('describes the website and its organization', () => {
		expect(
			buildSiteJsonLd({
				name: 'DrunkFlavor',
				siteUrl: SITE_URL,
				homeUrl: `${SITE_URL}/pt`,
				locale: 'pt'
			})
		).toEqual([
			{
				'@context': 'https://schema.org',
				'@type': 'WebSite',
				name: 'DrunkFlavor',
				url: `${SITE_URL}/pt`,
				inLanguage: 'pt'
			},
			{
				'@context': 'https://schema.org',
				'@type': 'Organization',
				name: 'DrunkFlavor',
				url: SITE_URL
			}
		]);
	});
});

describe('serializeJsonLd', () => {
	it('keeps a script closing tag in the data from ending the script block', () => {
		const output = serializeJsonLd({ name: '</script><img src=x onerror=alert(1)>' });

		expect(output).not.toContain('</script>');
		expect(output).not.toContain('<');
		expect(JSON.parse(output)).toEqual({ name: '</script><img src=x onerror=alert(1)>' });
	});

	it('escapes ampersands and the JavaScript line separators', () => {
		const output = serializeJsonLd({ text: 'Tom & Jerry\u2028\u2029' });

		expect(output).not.toMatch(/[&\u2028\u2029]/);
		expect(JSON.parse(output)).toEqual({ text: 'Tom & Jerry\u2028\u2029' });
	});

	it('serializes a list of nodes', () => {
		expect(JSON.parse(serializeJsonLd([{ a: 1 }, { b: 2 }]))).toEqual([{ a: 1 }, { b: 2 }]);
	});
});
