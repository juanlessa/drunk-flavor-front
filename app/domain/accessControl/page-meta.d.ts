import type { AppActions, AppSubjects } from './accessControl.types';

// Augment Nuxt's PageMeta so `definePageMeta({ can: { action, subject } })` is typed.
// The `auth` middleware reads `to.meta.can` to gate a route by a CASL ability check.
declare module 'nuxt/app' {
	interface PageMeta {
		can?: { action: AppActions; subject: AppSubjects };
	}
}

export {};
