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

	// Local to the calling component: the state is discarded on unmount, so it needs no manual reset.
	const state = ref<CategoryFormState>(initState());

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
		updateFormState,
		checkError,
		validateForm
	};
};
