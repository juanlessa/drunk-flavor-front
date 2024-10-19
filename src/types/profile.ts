import type { DatabaseCommonInfo } from './database';
import type { Role } from './user';

export type Profile = DatabaseCommonInfo & {
	name: string;
	surname: string;
	email: string;
	role: Role;
};
