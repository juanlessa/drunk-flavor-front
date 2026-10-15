import { initEmptySignupForm } from '~/factories/auth.factory';
import { checkFieldError } from '~/helpers/checkFieldError';
import type { SignupFormState } from '~/types/auth.types';
import { signupFormValidator } from '~/validations/authentication';

const initState = (): SignupFormState => ({
	form: initEmptySignupForm(),
	errors: [],
	displayErrors: false
});

export const useSignupForm = () => {
	const { t } = useI18n();

	const state = useState<SignupFormState>('signupForm', initState);

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
		const errors = signupFormValidator(data);

		state.value.errors = errors;
	};

	return {
		formState: state,
		resetFormState,
		checkError,
		validateForm
	};
};
