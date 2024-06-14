import type { DatabaseCommonInfo } from './database';

export enum RolesEnum {
	admin = 'admin',
	partner = 'partner'
}

export type Role = keyof typeof RolesEnum;

export type IUser = DatabaseCommonInfo & {
	name: string;
	surname: string;
	email: string;
	role: Role;
};

export type ICreateUser = {
	name: string;
	surname: string;
	email: string;
	password: string;
	role: Role;
};

export type IUpdateUser = {
	name: string;
	surname: string;
	email: string;
	password: string;
};

export type IDeleteUser = {
	id: string;
};

export type IUpdateUserRole = {
	user_id: string;
	role: Role;
};

export type IUserProfile = DatabaseCommonInfo & {
	name: string;
	surname: string;
	email: string;
	role: Role;
};
