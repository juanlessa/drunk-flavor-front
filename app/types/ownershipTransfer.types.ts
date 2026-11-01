import type { FieldError } from './form.types';

/** The target comes from the selected user, so the form only collects the audit reason. */
export type RequestOwnershipTransferForm = {
	reason: string;
};

export type RequestOwnershipTransferFormState = {
	form: RequestOwnershipTransferForm;
	errors: FieldError[];
	displayErrors: boolean;
};
