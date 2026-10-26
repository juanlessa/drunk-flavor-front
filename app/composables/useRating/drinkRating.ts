import type { Rating, RatingSummary } from '~/domain/rating/rating.entity';

type ViewerRating = Pick<Rating, '_id' | 'value'>;

const EMPTY_SUMMARY: RatingSummary = { average: 0, count: 0 };

export const useDrinkRating = (drinkId: MaybeRefOrGetter<string>) => {
	const { $api, $auth } = useNuxtApp();

	const summary = ref<RatingSummary>({ ...EMPTY_SUMMARY });
	const myRating = ref<ViewerRating | null>(null);
	const selectedValue = ref(0);
	const isLoading = ref(false);
	const isSaving = ref(false);

	const isAuthenticated = computed(() => $auth.state.value.isAuthenticated);

	const load = async (): Promise<boolean> => {
		isLoading.value = true;
		try {
			const [ratingSummary, viewerRating] = await Promise.all([
				$api.ratings.getSummaryByDrink(toValue(drinkId)),
				isAuthenticated.value
					? $api.ratings.getMineByDrink(toValue(drinkId))
					: Promise.resolve(null)
			]);

			summary.value = ratingSummary;
			myRating.value = viewerRating
				? { _id: viewerRating._id, value: viewerRating.value }
				: null;
			selectedValue.value = viewerRating?.value ?? 0;
			return true;
		} catch (error) {
			console.error(error);
			return false;
		} finally {
			isLoading.value = false;
		}
	};

	const save = async (value: number): Promise<boolean> => {
		if (isSaving.value) return false;

		const previousRating = myRating.value;
		const previousValue = selectedValue.value;
		selectedValue.value = value;
		isSaving.value = true;

		try {
			if (previousRating) {
				const result = await $api.ratings.update({ id: previousRating._id, value });
				myRating.value = { ...previousRating, value };
				summary.value = result.summary;
			} else {
				const result = await $api.ratings.create({ drink_id: toValue(drinkId), value });
				myRating.value = { _id: result.id, value };
				summary.value = result.summary;
			}

			return true;
		} catch (error) {
			console.error(error);
			myRating.value = previousRating;
			selectedValue.value = previousValue;
			return false;
		} finally {
			isSaving.value = false;
		}
	};

	const remove = async (): Promise<boolean> => {
		if (isSaving.value || !myRating.value) return false;

		const previousRating = myRating.value;
		const previousValue = selectedValue.value;
		myRating.value = null;
		selectedValue.value = 0;
		isSaving.value = true;

		try {
			const result = await $api.ratings.delete(previousRating._id);
			summary.value = result.summary;
			return true;
		} catch (error) {
			console.error(error);
			myRating.value = previousRating;
			selectedValue.value = previousValue;
			return false;
		} finally {
			isSaving.value = false;
		}
	};

	return {
		summary,
		myRating,
		selectedValue,
		isAuthenticated,
		isLoading,
		isSaving,
		load,
		save,
		remove
	};
};
