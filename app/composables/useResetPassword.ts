import { initEmptyResetPasswordForm } from '~/factories/auth.factory';
import { checkFieldError } from '~/helpers/checkFieldError';
import type { ResetPasswordFormState } from '~/types/auth.types';
import { resetPasswordFormValidator } from '~/validations/authentication';

const initState = (): ResetPasswordFormState => ({
	form: initEmptyResetPasswordForm(),
	errors: [],
	displayErrors: false
});

export const useResetPasswordForm = () => {
	const { t } = useI18n();

	const state = useState<ResetPasswordFormState>('resetPasswordForm', initState);

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
		const errors = resetPasswordFormValidator(data);

		state.value.errors = errors;
	};

	return {
		formState: state,
		resetFormState,
		checkError,
		validateForm
	};
};
