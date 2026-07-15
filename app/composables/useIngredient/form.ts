import { checkFieldError } from '~/helpers/checkFieldError';
import type { IngredientForm, IngredientFormState } from '~/types/ingredient';
import { initEmptyIngredientForm } from '~/constants/ingredient';
import { ingredientFormValidator } from '~/validations/ingredient';

const initState = (): IngredientFormState => ({
	form: initEmptyIngredientForm(),
	errors: [],
	displayErrors: false
});

export const useIngredientForm = () => {
	const { t } = useI18n();

	const state = useState<IngredientFormState>('ingredientForm', initState);

	const resetFormState = () => {
		state.value = initState();
	};

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
		resetFormState,
		updateFormState,
		checkError,
		validateForm
	};
};
