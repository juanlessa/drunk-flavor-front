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

export type ForgotPassword = {
	email: string;
};

export type ResetPassword = {
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
