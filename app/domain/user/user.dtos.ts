import type { Role } from './user.types';

export type CreateUser = {
	name: string;
	surname: string;
	email: string;
	password: string;
	role: Role;
};

export type UpdateRole = {
	userId: string;
	role: Role;
};
