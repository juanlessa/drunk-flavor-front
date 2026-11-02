import type { GoogleAuth } from '../auth/auth.dtos';

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

export type LinkGoogleIdentity = GoogleAuth;

export type ReauthenticateGoogle = GoogleAuth;

export type ReauthenticatePassword = {
	password: string;
};
