import type { User } from '../user/user.entity';

export type AuthenticationProvider = 'google';

/**
 * `password.removable` and `disconnectableProviders` are the removals the backend allows right now: an account must
 * keep one way to sign in, so the password can only go while a provider is connected, and the reverse.
 */
export type ProfileAuthenticationMethods = {
	password: {
		enabled: boolean;
		removable: boolean;
	};
	providers: AuthenticationProvider[];
	disconnectableProviders: AuthenticationProvider[];
};

/** Authenticated account view returned by GET /me. */
export type Profile = User & {
	authenticationMethods: ProfileAuthenticationMethods;
};
