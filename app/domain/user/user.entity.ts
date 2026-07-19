import type { DatabaseCommonInfo } from '../shared/database.types';
import type { Role } from './user.types';

export type User = DatabaseCommonInfo & {
	name: string;
	surname: string;
	email: string;
	role: Role;
};
