export type Signup = {
	name: string;
	surname: string;
	email: string;
	password: string;
};

export type Signin = {
	email: string;
	password: string;
};

export type RequestPasswordReset = {
	email: string;
};

export type ConfirmPassword = {
	token: string;
	password: string;
	confirmPassword: string;
};

export type ConfirmEmail = {
	token: string;
};

export type ResendEmailVerification = {
	email: string;
};

export type GoogleAuth = {
	idToken: string;
};
