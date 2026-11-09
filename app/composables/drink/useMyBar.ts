import { useLocalStorage } from '@vueuse/core';
import { DRINK_MATCH_MAX_INGREDIENTS } from '~/domain/drink/drink.constants';
import type { DrinkMatchMaxMissing } from '~/domain/drink/drink.entity';
import type { Ingredient } from '~/domain/ingredient/ingredient.entity';
import { EMPTY_BAR, readStoredBar, toBarIngredient } from '~/helpers/myBar.helpers';
import type { MyBarStorage } from '~/types/myBar.types';

export const MY_BAR_STORAGE_KEY = 'drunkflavor:my-bar';

/**
 * The ingredients a person has and how the bar matches drinks with them. Kept in the browser, so the bar is
 * there on the next visit without an account, and in step between tabs.
 *
 * It reads the browser storage, which the server does not have: there it is always empty, so render from it
 * only on the client (inside `<ClientOnly>`, or once mounted) to keep the hydration in step.
 */
export const useMyBar = () => {
	const bar = useLocalStorage<MyBarStorage>(
		MY_BAR_STORAGE_KEY,
		{ ...EMPTY_BAR, ingredients: [] },
		{
			serializer: { read: readStoredBar, write: (value) => JSON.stringify(value) },
			writeDefaults: false
		}
	);

	const ingredients = computed(() => bar.value.ingredients);
	const ingredientIds = computed(() => bar.value.ingredients.map(({ id }) => id));
	const isFull = computed(() => bar.value.ingredients.length >= DRINK_MATCH_MAX_INGREDIENTS);
	const maxMissing = computed<DrinkMatchMaxMissing>({
		get: () => bar.value.maxMissing,
		set: (value) => {
			bar.value = { ...bar.value, maxMissing: value };
		}
	});

	/** Adds an ingredient at the end; one already in the bar, or one over the limit, is left out. */
	const add = (ingredient: Pick<Ingredient, 'id' | 'translations'>): boolean => {
		if (isFull.value || bar.value.ingredients.some(({ id }) => id === ingredient.id))
			return false;
		bar.value = {
			...bar.value,
			ingredients: [...bar.value.ingredients, toBarIngredient(ingredient)]
		};
		return true;
	};
	const remove = (id: string) => {
		bar.value = {
			...bar.value,
			ingredients: bar.value.ingredients.filter((item) => item.id !== id)
		};
	};
	/** Empties the bar; the way to match is a preference, so it stays. */
	const clear = () => {
		bar.value = { ...bar.value, ingredients: [] };
	};

	return { ingredients, ingredientIds, maxMissing, isFull, add, remove, clear };
};
