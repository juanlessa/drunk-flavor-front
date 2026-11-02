import type { Drink } from '~/domain/drink/drink.entity';
import type { Language } from '~/domain/shared/translations.types';
import { formatUnitQuantity } from '~/helpers/unit.helpers';

/**
 * Localized, display-ready pieces of a drink shared by the detail page and the card
 * hover preview: name, method, formatted ingredients and the short rating summary.
 */
export const useDrinkSummary = (drink: MaybeRefOrGetter<Drink>) => {
	const { t, locale } = useI18n();

	const lang = computed(() => locale.value as Language);
	const name = computed(() => toValue(drink).translations[lang.value]?.name ?? '');
	const method = computed(() => toValue(drink).translations[lang.value]?.method ?? '');

	const ingredientItems = computed(() =>
		toValue(drink).ingredients.map(({ quantity, ingredient }) => ({
			id: ingredient.id,
			measurement: formatUnitQuantity(quantity, ingredient.unit, lang.value),
			connector: t('drinkDetailPage.ingredients.ofPreposition'),
			name: ingredient.translations[lang.value]?.name ?? ''
		}))
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
		ingredientCountLabel,
		hasRatings,
		ratingSummaryText,
		ratingSummaryLabel
	};
};
