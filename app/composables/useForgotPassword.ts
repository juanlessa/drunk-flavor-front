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

	const state = useState<ForgotPasswordFormState>('forgotPasswordForm', initState);

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
		const errors = forgotPasswordFormValidator(data);

		state.value.errors = errors;
	};

	return {
		formState: state,
		resetFormState,
		checkError,
		validateForm
	};
};
