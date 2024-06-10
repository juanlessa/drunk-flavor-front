import type { CategoryFormState } from '@/types/category';
import { categoryFormValidator } from '@/validations/category';
import { initEmptyCategoryForm } from '@/constants/category';
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
		checkError,
		validateForm
	};
};
