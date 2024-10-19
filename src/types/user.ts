import type { DatabaseCommonInfo } from './database';

export enum RolesEnum {
	admin = 'admin',
	partner = 'partner'
}

export type Role = keyof typeof RolesEnum;

export type User = DatabaseCommonInfo & {
	name: string;
	surname: string;
	email: string;
	role: Role;
};

export type CreateUser = {
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

export type UpdateRole = {
	user_id: string;
	role: Role;
};
