import type { Drink, DrinkRecipeItem } from '~/domain/drink/drink.entity';
import type { Language } from '~/domain/shared/translations.types';
import { formatDrinkRecipeItem } from '~/helpers/drink.helpers';

/**
 * Localized, display-ready pieces of a drink shared by the detail page and the card
 * hover preview: name, method, formatted ingredients and the short rating summary.
 *
 * With `missingIngredientIds` (the drink was opened from the bar), each ingredient says whether it is
 * missing and `matchStatus` sums it up; without them, nothing is missing and there is no status.
 */
export const useDrinkSummary = (
	drink: MaybeRefOrGetter<Drink>,
	missingIngredientIds: MaybeRefOrGetter<readonly string[] | undefined> = undefined
) => {
	const { t, locale } = useI18n();

	const lang = computed(() => locale.value as Language);
	const name = computed(() => toValue(drink).translations[lang.value]?.name ?? '');
	const method = computed(() => toValue(drink).translations[lang.value]?.method ?? '');

	const missingIds = computed(() => new Set(toValue(missingIngredientIds) ?? []));

	const toItem = (item: DrinkRecipeItem, optional: boolean) => {
		const { ingredient } = item;
		const { measurement, name, joinedByPreposition } = formatDrinkRecipeItem(item, lang.value);
		return {
			id: ingredient.id,
			measurement,
			// Without a measurement there is nothing for the connector to join ("of Gin"), and a unit written
			// with the ingredient name joins it without one ("3 limes").
			connector: joinedByPreposition ? t('drinkDetailPage.ingredients.ofPreposition') : '',
			name,
			description: ingredient.translations[lang.value]?.description ?? '',
			brand: ingredient.brand ?? '',
			optional,
			missing: missingIds.value.has(ingredient.id)
		};
	};
	const ingredientItems = computed(() =>
		toValue(drink).ingredients.map((line) => toItem(line, line.optional))
	);
	const garnishItems = computed(() =>
		// Garnishes never count as missing, like in the bar's match.
		(toValue(drink).garnishes ?? []).map((line) => ({ ...toItem(line, false), missing: false }))
	);
	const ingredientCountLabel = computed(() =>
		t('drinkDetailPage.ingredients.count', toValue(drink).ingredients.length)
	);

	/** Whether the drink can be made with the bar, or how many ingredients are missing; only from the bar. */
	const matchStatus = computed<{ tone: 'success' | 'warning'; label: string } | undefined>(() => {
		const missing = toValue(missingIngredientIds);
		if (!missing) return undefined;
		if (missing.length === 0) {
			return { tone: 'success', label: t('drinkDetailPage.ingredients.matchReady') };
		}
		return {
			tone: 'warning',
			label: t('drinkDetailPage.ingredients.matchMissing', missing.length)
		};
	});

	const hasRatings = computed(() => toValue(drink).ratingsCount > 0);
	const formattedAverage = computed(() =>
		new Intl.NumberFormat(lang.value === 'pt' ? 'pt-BR' : 'en-US', {
			minimumFractionDigits: 1,
			maximumFractionDigits: 1
		}).format(toValue(drink).avgRating)
	);
	/** Visible text, e.g. "4.0 · 1 rating" or "No ratings yet". */
	const ratingSummaryText = computed(() =>
		hasRatings.value
			? `${formattedAverage.value} · ${t('drinkDetailPage.rating.count', toValue(drink).ratingsCount)}`
			: t('drinkDetailPage.rating.noRatings')
	);
	/** Screen reader wording of the same summary. */
	const ratingSummaryLabel = computed(() =>
		hasRatings.value
			? t('drinkDetailPage.rating.summaryLabel', {
					value: formattedAverage.value,
					count: toValue(drink).ratingsCount
				})
			: t('drinkDetailPage.rating.noRatings')
	);

	return {
		name,
		method,
		ingredientItems,
		garnishItems,
		ingredientCountLabel,
		matchStatus,
		hasRatings,
		ratingSummaryText,
		ratingSummaryLabel
	};
};
