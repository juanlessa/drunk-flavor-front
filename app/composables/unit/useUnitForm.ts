import type { UnitForm, UnitFormState } from '~/types/unit.types';
import { unitFormValidator } from '~/validations/unit';
import { initEmptyUnitForm } from '~/factories/unit.factory';
import { checkFieldError } from '~/helpers/checkFieldError';

const initState = (): UnitFormState => ({
	form: initEmptyUnitForm(),
	errors: [],
	displayErrors: false
});

export const useUnitForm = () => {
	const { t } = useI18n();
	// Local to the calling component: the state is discarded on unmount, so it needs no manual reset.
	const state = ref<UnitFormState>(initState());

	const updateFormState = (newFormValue: UnitForm) => {
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
		const errors = unitFormValidator(data);
		state.value.errors = errors;
	};

	return {
		formState: state,
		updateFormState,
		checkError,
		validateForm
	};
};
