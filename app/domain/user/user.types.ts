export enum RolesEnum {
	owner = 'owner',
	admin = 'admin',
	partner = 'partner',
	member = 'member'
}

export type Role = keyof typeof RolesEnum;
