export enum RolesEnum {
	admin = 'admin',
	partner = 'partner'
}

export type Role = keyof typeof RolesEnum;
