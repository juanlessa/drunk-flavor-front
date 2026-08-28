import { initEmptySigninForm } from '~/factories/auth.factory';
import { checkFieldError } from '~/helpers/checkFieldError';
import type { SigninFormState } from '~/types/auth.types';
import { signinFormValidator } from '~/validations/authentication';

const initState = (): SigninFormState => ({
	form: initEmptySigninForm(),
	errors: [],
	displayErrors: false
});

export const useSigninForm = () => {
	const { t } = useI18n();

	const state = useState<SigninFormState>('signinForm', initState);

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
		const errors = signinFormValidator(data);

		state.value.errors = errors;
	};

	return {
		formState: state,
		resetFormState,
		checkError,
		validateForm
	};
};
