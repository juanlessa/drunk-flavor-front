import { initEmptyCompleteProfileForm } from '~/factories/auth.factory';
import { checkFieldError } from '~/helpers/checkFieldError';
import type { CompleteProfileFormState } from '~/types/auth.types';
import { completeProfileFormValidator } from '~/validations/authentication';

const initState = (): CompleteProfileFormState => ({
	form: initEmptyCompleteProfileForm(),
	errors: [],
	displayErrors: false
});

export const useCompleteProfileForm = () => {
	const { t } = useI18n();
	// Local to the calling component: the state is discarded on unmount, so it needs no manual reset.
	const state = ref<CompleteProfileFormState>(initState());

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
		state.value.errors = completeProfileFormValidator(state.value.form);
	};

	return {
		formState: state,
		checkError,
		validateForm
	};
};
