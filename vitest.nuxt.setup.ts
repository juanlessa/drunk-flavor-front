import { registerEndpoint, mockNuxtImport } from '@nuxt/test-utils/runtime';

// Mock external API endpoints that fire during app initialization.
// The auth plugin calls GET /me via the guest middleware on every route navigation.
registerEndpoint('/me', {
	method: 'GET',
	handler: () => ({ statusCode: 401, body: { message: 'Unauthorized' } })
});

// Mock useI18n for composable tests that call it outside component setup context.
mockNuxtImport('useI18n', () => {
	return () => ({ t: (key: string) => key, locale: { value: 'en' } });
});
