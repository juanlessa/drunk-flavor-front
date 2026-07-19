import { initEmptyLoginForm } from '~/factories/authentication';
import { checkFieldError } from '~/helpers/checkFieldError';
import type { LoginFormState } from '~/types/authentication';
import { loginFormValidator } from '~/validations/authentication';

const initState = (): LoginFormState => ({
	form: initEmptyLoginForm(),
	errors: [],
	displayErrors: false
});

export const useLoginForm = () => {
	const { t } = useI18n();

	const state = useState<LoginFormState>('loginForm', initState);

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
		const errors = loginFormValidator(data);

		state.value.errors = errors;
	};

	return {
		formState: state,
		resetFormState,
		checkError,
		validateForm
	};
};
