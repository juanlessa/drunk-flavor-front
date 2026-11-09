import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import type { MatchDrinks, MatchDrinksQuery } from '~/domain/drink/drink.dtos';
import type { Drink, DrinkMatch, DrinkMatchMaxMissing } from '~/domain/drink/drink.entity';
import { DRINK_MATCH_PAGE_SIZE, useDrinkMatch } from './useDrinkMatch';

type Received = {
	page: number;
	limit: number;
	ingredientIds: string[];
	maxMissing: unknown;
};

const buildMatch = (id: string, missingCount = 0): DrinkMatch => ({
	drink: { id } as Drink,
	missingCount,
	missingIngredientIds: []
});
const fullPage = (prefix: string) =>
	Array.from({ length: DRINK_MATCH_PAGE_SIZE }, (_, index) => buildMatch(`${prefix}${index}`));

let respond: (request: Received) => DrinkMatch[] | Promise<DrinkMatch[]> = () => [];
let isFailing = false;
const received: Received[] = [];

// The real repository is covered by its own spec; here only what the composable asks for matters.
const stubMatchRequest = () =>
	vi
		.spyOn(useNuxtApp().$api.drinks, 'match')
		.mockImplementation(async (body: MatchDrinks, query: MatchDrinksQuery) => {
			const request = { ...query, ...body };
			received.push(request);
			if (isFailing) throw new Error('match failed');
			return { items: await respond(request) };
		});

type Match = ReturnType<typeof useDrinkMatch>;

const mountMatch = async (initialIds: string[], initialMaxMissing: DrinkMatchMaxMissing = 0) => {
	const ingredientIds = ref(initialIds);
	const maxMissing = ref<DrinkMatchMaxMissing>(initialMaxMissing);
	let match: Match | undefined;
	const wrapper = await mountSuspended(
		defineComponent({
			setup() {
				match = useDrinkMatch(ingredientIds, maxMissing);
				return () => h('div');
			}
		})
	);
	if (!match) throw new Error('useDrinkMatch did not run');
	return { wrapper, match, ingredientIds, maxMissing };
};
const idsOf = (match: Match) => match.matches.value.map(({ drink }) => drink.id);

describe('useDrinkMatch', () => {
	let unmount: (() => void) | undefined;

	beforeEach(() => {
		respond = () => [buildMatch('a'), buildMatch('b', 1)];
		isFailing = false;
		received.length = 0;
		useState('toastNotification').value = undefined;
		stubMatchRequest();
	});
	afterEach(() => {
		unmount?.();
		unmount = undefined;
		vi.restoreAllMocks();
	});

	it('asks for the first page with the ingredients and the way to match', async () => {
		const { wrapper, match } = await mountMatch(['gin', 'lime'], 1);
		unmount = () => wrapper.unmount();

		await vi.waitFor(() => expect(match.hasLoaded.value).toBe(true));

		expect(idsOf(match)).toEqual(['a', 'b']);
		expect(received).toEqual([
			{
				page: 1,
				limit: DRINK_MATCH_PAGE_SIZE,
				ingredientIds: ['gin', 'lime'],
				maxMissing: 1
			}
		]);
		expect(match.loading.value).toBe(false);
	});

	it('asks for nothing while the bar is empty', async () => {
		const { wrapper, match } = await mountMatch([]);
		unmount = () => wrapper.unmount();
		await nextTick();

		expect(received).toEqual([]);
		expect(match.hasLoaded.value).toBe(false);
		expect(match.matches.value).toEqual([]);
	});

	it('appends the next page and marks the last one when it comes short', async () => {
		respond = ({ page }) => (page === 1 ? fullPage('p1-') : [buildMatch('last', 2)]);
		const { wrapper, match } = await mountMatch(['gin']);
		unmount = () => wrapper.unmount();
		await vi.waitFor(() => expect(match.hasLoaded.value).toBe(true));
		expect(match.isLastPage.value).toBe(false);

		match.loadNextPage();

		await vi.waitFor(() => expect(match.matches.value).toHaveLength(DRINK_MATCH_PAGE_SIZE + 1));
		expect(idsOf(match).at(-1)).toBe('last');
		expect(match.isLastPage.value).toBe(true);
		expect(received.map(({ page }) => page)).toEqual([1, 2]);
	});

	it('stops asking for pages after the last one', async () => {
		const { wrapper, match } = await mountMatch(['gin']);
		unmount = () => wrapper.unmount();
		await vi.waitFor(() => expect(match.isLastPage.value).toBe(true));

		match.loadNextPage();
		await nextTick();

		expect(received).toHaveLength(1);
	});

	it.each([
		{
			title: 'an ingredient is added',
			change: (ids: { value: string[] }) => (ids.value = ['gin', 'lime'])
		},
		{
			title: 'an ingredient is removed',
			change: (ids: { value: string[] }) => (ids.value = [])
		}
	])('starts over when $title', async ({ change }) => {
		respond = ({ ingredientIds }) => ingredientIds.map((id) => buildMatch(id));
		const { wrapper, match, ingredientIds } = await mountMatch(['gin']);
		unmount = () => wrapper.unmount();
		await vi.waitFor(() => expect(idsOf(match)).toEqual(['gin']));

		change(ingredientIds);

		await vi.waitFor(() => expect(idsOf(match)).toEqual(ingredientIds.value));
		expect(received.every(({ page }) => page === 1)).toBe(true);
	});

	it('starts over from the first page when the way to match changes', async () => {
		respond = ({ page }) => (page === 1 ? fullPage('p1-') : [buildMatch('p2')]);
		const { wrapper, match, maxMissing } = await mountMatch(['gin']);
		unmount = () => wrapper.unmount();
		await vi.waitFor(() => expect(match.hasLoaded.value).toBe(true));
		match.loadNextPage();
		await vi.waitFor(() => expect(received).toHaveLength(2));

		maxMissing.value = 'any';

		await vi.waitFor(() => expect(received).toHaveLength(3));
		expect(received.at(-1)).toMatchObject({ page: 1, maxMissing: 'any' });
		await vi.waitFor(() => expect(match.matches.value).toHaveLength(DRINK_MATCH_PAGE_SIZE));
	});

	it('does not ask again for the same ingredients in a new list', async () => {
		const { wrapper, match, ingredientIds } = await mountMatch(['gin', 'lime']);
		unmount = () => wrapper.unmount();
		await vi.waitFor(() => expect(match.hasLoaded.value).toBe(true));

		ingredientIds.value = ['gin', 'lime'];
		await nextTick();

		expect(received).toHaveLength(1);
	});

	it('keeps the latest list when an older answer arrives late', async () => {
		let releaseSlow: () => void = () => {};
		respond = ({ ingredientIds }) =>
			ingredientIds.includes('slow')
				? new Promise((resolve) => {
						releaseSlow = () => resolve([buildMatch('stale')]);
					})
				: [buildMatch('fresh')];
		const { wrapper, match, ingredientIds } = await mountMatch(['slow']);
		unmount = () => wrapper.unmount();
		await vi.waitFor(() => expect(received).toHaveLength(1));

		ingredientIds.value = ['fast'];
		await vi.waitFor(() => expect(idsOf(match)).toEqual(['fresh']));
		releaseSlow();
		await new Promise((resolve) => setTimeout(resolve, 20));

		expect(idsOf(match)).toEqual(['fresh']);
		expect(match.loading.value).toBe(false);
	});

	it('warns the user when the drinks cannot be loaded', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		isFailing = true;
		const { wrapper, match } = await mountMatch(['gin']);
		unmount = () => wrapper.unmount();

		await vi.waitFor(() =>
			expect(useToast().state.value.displayingToasts).toContainEqual(
				expect.objectContaining({
					type: 'error',
					title: 'organisms.myBar.errorTitle',
					message: 'organisms.myBar.errorMessage'
				})
			)
		);
		expect(match.loading.value).toBe(false);
		expect(match.hasLoaded.value).toBe(false);
	});
});
