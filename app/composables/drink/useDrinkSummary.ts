import type { Drink, DrinkRecipeItem } from '~/domain/drink/drink.entity';
import type { Language } from '~/domain/shared/translations.types';
import { formatDrinkAmount } from '~/helpers/drink.helpers';

/**
 * Localized, display-ready pieces of a drink shared by the detail page and the card
 * hover preview: name, method, formatted ingredients and the short rating summary.
 */
export const useDrinkSummary = (drink: MaybeRefOrGetter<Drink>) => {
	const { t, locale } = useI18n();

	const lang = computed(() => locale.value as Language);
	const name = computed(() => toValue(drink).translations[lang.value]?.name ?? '');
	const method = computed(() => toValue(drink).translations[lang.value]?.method ?? '');

	const toItem = ({ amount, ingredient }: DrinkRecipeItem, optional: boolean) => {
		const measurement = formatDrinkAmount(amount, lang.value);
		return {
			id: ingredient.id,
			measurement,
			// Without a measurement there is nothing for the connector to join ("of Gin").
			connector: measurement ? t('drinkDetailPage.ingredients.ofPreposition') : '',
			name: ingredient.translations[lang.value]?.name ?? '',
			description: ingredient.translations[lang.value]?.description ?? '',
			brand: ingredient.brand ?? '',
			optional
		};
	};
	const ingredientItems = computed(() =>
		toValue(drink).ingredients.map((line) => toItem(line, line.optional))
	);
	const garnishItems = computed(() =>
		(toValue(drink).garnishes ?? []).map((line) => toItem(line, false))
	);
	const ingredientCountLabel = computed(() =>
		t('drinkDetailPage.ingredients.count', toValue(drink).ingredients.length)
	);

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
		hasRatings,
		ratingSummaryText,
		ratingSummaryLabel
	};
};
