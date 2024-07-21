import { checkFieldError } from '~/helpers/checkFieldError';
import type { DrinkForm, DrinkFormState } from '~/types/drink';
import { initEmptyDrinkForm } from '~/constants/drink';
import { drinkFormValidator } from '~/validations/drink';

const initState = (): DrinkFormState => ({
	form: initEmptyDrinkForm(),
	cover: undefined,
	thumbnail: undefined,
	errors: [],
	displayErrors: false,
	defaultIngredients: []
});

export const useDrinkForm = () => {
	const { t } = useI18n();

	const state = useState<DrinkFormState>('drinkForm', initState);

	const resetFormState = () => {
		state.value = initState();
	};

	const updateFormState = (newFormValue: DrinkForm) => {
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
		const errors = drinkFormValidator(data);

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
