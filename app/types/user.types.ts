import type { Filter } from '~/domain/shared/filters.types';
import type { User } from '~/domain/user/user.entity';
import type { NonOwnerRole } from '~/domain/user/user.types';
import type { FieldError } from './form.types';

export type UsersOverviewState = {
	users: User[];
	filter: Filter;
	/** Raw input; applied to `filter.search` after the debounce. */
	searchTerm: string;
	loading: boolean;
};

/** Administrative actions that require an audit reason and share the same dialog. */
export type UserReasonAction = 'suspend' | 'reactivate' | 'close' | 'revokeSessions';

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
