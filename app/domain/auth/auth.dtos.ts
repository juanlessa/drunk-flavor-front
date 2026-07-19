export type Signup = {
	name: string;
	surname: string;
	email: string;
	password: string;
};

export type Login = {
	email: string;
	password: string;
};

export type ForgotPassword = {
	email: string;
};
