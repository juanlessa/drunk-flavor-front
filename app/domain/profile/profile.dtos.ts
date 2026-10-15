export type ConfirmEmail = {
	token: string;
};

export type ResetPassword = {
	token: string;
	password: string;
};

export type UpdateProfile = {
	name: string;
	surname: string;
};

export type UpdatePassword = {
	currentPassword: string;
	newPassword: string;
};
