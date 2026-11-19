import { parseRuntimeEnvs } from '../../env/index';
import { buildOriginCspDirectives } from '../../config/csp';

/**
 * Validates the public environment when the server starts and applies the runtime origins to the
 * Content Security Policy.
 *
 * The build does not need these values (the build-time CSP only holds placeholders), so a missing or
 * malformed variable surfaces here: the plugin throws synchronously, the process exits and the
 * deploy health check rolls the release back.
 *
 * The file name starts with `00-` so the hook below is registered before `nuxt-security` reads the
 * rules and signals that they are ready.
 */
export default defineNitroPlugin((nitroApp) => {
	const envs = parseRuntimeEnvs(process.env);
	if (envs.NODE_ENV !== 'production') return;

	const origins = buildOriginCspDirectives({
		apiBase: envs.NUXT_PUBLIC_API_BASE,
		imageHost: envs.NUXT_PUBLIC_IMAGE_HOST
	});

	nitroApp.hooks.hook('nuxt-security:routeRules', (rules) => {
		const csp = rules['/**']?.headers?.contentSecurityPolicy;
		if (!csp || typeof csp !== 'object') {
			throw new Error(
				'Content Security Policy rules not found; cannot apply runtime origins'
			);
		}
		Object.assign(csp, origins);
	});
});
