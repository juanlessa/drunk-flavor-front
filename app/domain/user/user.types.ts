export enum RolesEnum {
	admin = 'admin',
	partner = 'partner',
	member = 'member'
}

export type Role = keyof typeof RolesEnum;
