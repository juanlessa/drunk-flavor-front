import type { CategoryFormState } from '@/types/category';
import { categoryFormValidator } from '@/validations/category';
import { initEmptyCategoryForm } from '@/constants/category';

const initState = (): CategoryFormState => ({
	form: initEmptyCategoryForm(),
	errors: [],
	displayErrors: false
});

export const useCategoryForm = () => {
	const state = useState<CategoryFormState>('categoryForm', initState);

	const getCategoryFormState = () => state;

	const resetCategoryFormState = () => {
		state.value = initState();
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
		getCategoryFormState,
		resetCategoryFormState,
		validateForm
	};
};
