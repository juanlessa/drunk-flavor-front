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
