import type { CategoryForm, CategoryFormState } from '~/types/category.types';
import { categoryFormValidator } from '@/validations/category';
import { initEmptyCategoryForm } from '~/factories/category.factory';
import { checkFieldError } from '~/helpers/checkFieldError';

const initState = (): CategoryFormState => ({
	form: initEmptyCategoryForm(),
	errors: [],
	displayErrors: false
});

export const useCategoryForm = () => {
	const { t } = useI18n();

	const state = useState<CategoryFormState>('categoryForm', initState);

	const resetFormState = () => {
		state.value = initState();
	};

	const updateFormState = (newFormValue: CategoryForm) => {
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
		const errors = categoryFormValidator(data);

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
