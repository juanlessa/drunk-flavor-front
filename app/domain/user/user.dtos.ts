import type { Role } from './user.types';

export type CreateUser = {
	name: string;
	surname: string;
	email: string;
	password: string;
	role: Role;
};

export type UpdateUser = {
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
