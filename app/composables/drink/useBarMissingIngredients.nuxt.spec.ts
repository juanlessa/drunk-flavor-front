import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import type { Drink } from '~/domain/drink/drink.entity';
import { MY_BAR_STORAGE_KEY } from './useMyBar';
import { useBarMissingIngredients } from './useBarMissingIngredients';

const gin = 'a'.repeat(24);
const lime = 'b'.repeat(24);
const sugar = 'c'.repeat(24);
const soda = 'd'.repeat(24);

const line = (id: string, optional = false) => ({ ingredient: { id }, optional });
const drink = {
	id: 'gimlet',
	ingredients: [line(gin), line(lime), line(sugar), line(soda, true)]
} as unknown as Drink;

const keepBar = (ids: string[]) =>
	localStorage.setItem(
		MY_BAR_STORAGE_KEY,
		JSON.stringify({
			ingredients: ids.map((id) => ({
				id,
				translations: { en: { name: id }, pt: { name: id } }
			})),
			maxMissing: 0
		})
	);
const comeFrom = (back: string | null) =>
	window.history.replaceState({ ...window.history.state, back }, '');

const mountMissing = async () => {
	let missing: ReturnType<typeof useBarMissingIngredients> | undefined;
	const wrapper = await mountSuspended(
		defineComponent({
			setup() {
				missing = useBarMissingIngredients(() => drink);
				return () => h('div');
			}
		})
	);
	if (!missing) throw new Error('useBarMissingIngredients did not run');
	return { wrapper, missing };
};

describe('useBarMissingIngredients', () => {
	let previousState: unknown;

	beforeEach(() => {
		previousState = window.history.state;
		localStorage.clear();
		keepBar([gin]);
	});
	afterEach(() => {
		window.history.replaceState(previousState, '');
		localStorage.clear();
	});

	// The app always runs with the language in the path, so that is what the history holds.
	it.each(['/pt/bar', '/en/bar'])(
		'lists what the bar lacks when the drink was opened from %s',
		async (back) => {
			comeFrom(back);
			const { wrapper, missing } = await mountMissing();

			expect(missing.value).toEqual([lime, sugar]);
			wrapper.unmount();
		}
	);

	it('lists nothing missing when the bar has every required ingredient', async () => {
		keepBar([gin, lime, sugar]);
		comeFrom('/pt/bar');
		const { wrapper, missing } = await mountMissing();

		expect(missing.value).toEqual([]);
		wrapper.unmount();
	});

	it.each([
		{ title: 'the home', back: '/pt' },
		{ title: 'another drink', back: '/pt/drinks/negroni' },
		{ title: 'nowhere (opened directly)', back: null }
	])('keeps the plain recipe when the drink was opened from $title', async ({ back }) => {
		comeFrom(back);
		const { wrapper, missing } = await mountMissing();

		expect(missing.value).toBeUndefined();
		wrapper.unmount();
	});

	it('keeps the plain recipe when the bar was emptied', async () => {
		keepBar([]);
		comeFrom('/pt/bar');
		const { wrapper, missing } = await mountMissing();

		expect(missing.value).toBeUndefined();
		wrapper.unmount();
	});
});
