export type UpdateProfile = {
	name: string;
	surname: string;
};

export type CreatePassword = {
	password: string;
};

export type UpdatePassword = {
	currentPassword: string;
	newPassword: string;
};

export type LinkGoogleIdentity = {
	currentPassword: string;
	idToken: string;
};

export type ReauthenticateGoogle = {
	idToken: string;
};
