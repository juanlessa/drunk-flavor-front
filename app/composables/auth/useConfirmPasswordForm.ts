import { initEmptyConfirmPasswordForm } from '~/factories/auth.factory';
import { checkFieldError } from '~/helpers/checkFieldError';
import type { ConfirmPasswordFormState } from '~/types/auth.types';
import { confirmPasswordFormValidator } from '~/validations/authentication';

const initState = (): ConfirmPasswordFormState => ({
	form: initEmptyConfirmPasswordForm(),
	errors: [],
	displayErrors: false
});

export const useConfirmPasswordForm = () => {
	const { t } = useI18n();

	// Local to the calling component: the state is discarded on unmount, so it needs no manual reset.
	const state = ref<ConfirmPasswordFormState>(initState());

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
		const errors = confirmPasswordFormValidator(data);

		state.value.errors = errors;
	};

	return {
		formState: state,
		checkError,
		validateForm
	};
};
