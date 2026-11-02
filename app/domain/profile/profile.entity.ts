import type { User } from '../user/user.entity';

export type AuthenticationProvider = 'google';

export type ProfileAuthenticationMethods = {
	password: {
		enabled: boolean;
	};
	providers: AuthenticationProvider[];
};

/** Authenticated account view returned by GET /me. */
export type Profile = User & {
	authenticationMethods: ProfileAuthenticationMethods;
};
