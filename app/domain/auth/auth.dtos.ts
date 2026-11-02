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

/** Authorization code from the Google popup; the API exchanges it with the client secret. */
export type GoogleAuth = {
	code: string;
};

export type SignoutResponse = {
	ok: boolean;
};
