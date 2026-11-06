import { checkFieldError } from '~/helpers/checkFieldError';
import type { IngredientForm, IngredientFormState } from '~/types/ingredient.types';
import { initEmptyIngredientForm } from '~/factories/ingredient.factory';
import { ingredientFormValidator } from '~/validations/ingredient';

const initState = (): IngredientFormState => ({
	form: initEmptyIngredientForm(),
	errors: [],
	displayErrors: false
});

export const useIngredientForm = () => {
	const { t } = useI18n();

	// Local to the calling component: the state is discarded on unmount, so it needs no manual reset.
	const state = ref<IngredientFormState>(initState());

	const updateFormState = (newFormValue: IngredientForm) => {
		state.value.form = newFormValue;
	};

	const checkError = (field: string) => {
		const error = checkFieldError(state.value.errors, field);
		if (!error) {
			return '';
		}
		return t(error);
	};

	const validateForm = () => {
		if (!state.value.displayErrors) {
			return;
		}
		const data = state.value.form;
		const errors = ingredientFormValidator(data);

		state.value.errors = errors;
	};

	return {
		formState: state,
		updateFormState,
		checkError,
		validateForm
	};
};
