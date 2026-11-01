import type { NonOwnerRole } from '~/domain/user/user.types';
import type { FieldError } from './form.types';

export type UserAdministrationReasonForm = {
	reason: string;
};

export type UserAdministrationReasonFormState = {
	form: UserAdministrationReasonForm;
	errors: FieldError[];
	displayErrors: boolean;
};

export type ChangeUserRoleForm = {
	/** Empty until the administrator picks one of the allowed role transitions. */
	role: NonOwnerRole | '';
};

export type ChangeUserRoleFormState = {
	form: ChangeUserRoleForm;
	errors: FieldError[];
	displayErrors: boolean;
};
