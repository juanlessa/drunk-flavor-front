import type { Ref } from 'vue';
import { readApiFieldErrors } from '~/domain/shared/api.helpers';
import { mapFormToGenerateMethod } from '~/mappers/drink.mappers';
import type { DrinkForm, PreparationPreviewState } from '~/types/drink.types';

const initState = (): PreparationPreviewState => ({
	loading: false,
	method: undefined,
	sentences: undefined,
	errors: [],
	warnings: [],
	stale: false
});

/**
 * Asks the backend to write the method from the plan of the form, without saving anything, and keeps what it
 * answered: the method in every language, the warnings, or the errors that say where the plan went wrong.
 * Each outcome is also reported with a toast: success, warning when the backend had remarks, error otherwise.
 */
export const usePreparationPreview = (form: Ref<DrinkForm>) => {
	const { $api } = useNuxtApp();
	const { t } = useI18n();
	const { addToast } = useToast();

	// Local to the calling component: the state is discarded on unmount, so it needs no manual reset.
	const state = ref<PreparationPreviewState>(initState());

	const generate = async () => {
		state.value = { ...initState(), loading: true };
		try {
			const result = await $api.drinks.generateMethod(mapFormToGenerateMethod(form.value));
			state.value = {
				loading: false,
				method: result.method,
				sentences: result.sentences,
				errors: [],
				warnings: result.warnings,
				stale: false
			};
			addToast({
				type: 'success',
				title: t('organisms.drinkForm.preview.success.title'),
				message: t('organisms.drinkForm.preview.success.message')
			});
			if (result.warnings.length > 0) {
				addToast({
					type: 'warning',
					title: t('organisms.drinkForm.preview.warning.title'),
					message: t('organisms.drinkForm.preview.warning.message', {
						count: result.warnings.length
					})
				});
			}
		} catch (error) {
			const errors = readApiFieldErrors(error);
			state.value = { ...initState(), errors };
			addToast({
				type: 'error',
				title: t('organisms.drinkForm.preview.error.title'),
				message:
					errors.length > 0
						? t('organisms.drinkForm.preview.error.message', { count: errors.length })
						: t('organisms.drinkForm.preview.error.unknown')
			});
			console.error(error);
		}
	};

	// The preview describes the recipe and the plan it was made from; once either changes it no longer does.
	// The errors stay until the next preview, so they can be read while the plan is being fixed.
	watch(
		() => [form.value.ingredients, form.value.garnishes, form.value.preparation],
		() => {
			if (state.value.method && !state.value.loading) state.value.stale = true;
		},
		{ deep: true }
	);

	return { preview: state, generate };
};
