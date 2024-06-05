import type { DatabaseCommonInfo } from './database';

export enum ROLES {
	admin = 'admin',
	partner = 'partner'
}

export type IUser = DatabaseCommonInfo & {
	name: string;
	surname: string;
	email: string;
	role: ROLES;
};
