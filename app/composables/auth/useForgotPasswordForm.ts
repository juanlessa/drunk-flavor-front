import { initEmptyForgotPasswordForm } from '~/factories/auth.factory';
import { checkFieldError } from '~/helpers/checkFieldError';
import type { ForgotPasswordFormState } from '~/types/auth.types';
import { forgotPasswordFormValidator } from '~/validations/authentication';

const initState = (): ForgotPasswordFormState => ({
	form: initEmptyForgotPasswordForm(),
	errors: [],
	displayErrors: false
});

export const useForgotPasswordForm = () => {
	const { t } = useI18n();

	// Local to the calling component: the state is discarded on unmount, so it needs no manual reset.
	const state = ref<ForgotPasswordFormState>(initState());

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
		const errors = forgotPasswordFormValidator(data);

		state.value.errors = errors;
	};

	return {
		formState: state,
		checkError,
		validateForm
	};
};
