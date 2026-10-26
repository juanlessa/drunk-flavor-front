<template>
	<div v-if="isAvailable" class="flex justify-center">
		<!-- Same width rules as the filled Button variants (see Button.vue) so it matches the
		     Sign in button. min-h reserves the large GIS button height (40px). -->
		<div
			ref="containerRef"
			class="w-full max-w-80 tablet:max-w-64 min-h-10 flex justify-center">
			<div
				ref="buttonRef"
				data-testid="google-signin-button"
				class="overflow-hidden rounded-full"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { loadGoogleIdentityScript } from '~/helpers/loadGoogleIdentityScript';
import type { GoogleAccountsId, GoogleCredentialResponse } from '~/types/googleIdentity.types';
import type { Locale } from '~/types/i18n.types';

const GOOGLE_BUTTON_MAX_WIDTH_PX = 400;

const GOOGLE_BUTTON_LOCALES: Record<Locale, string> = {
	en: 'en',
	pt: 'pt_BR'
};

const EMAIL_NOT_VERIFIED_LOCALE_KEY = 'apiResponses.auth.googleEmailNotVerified';

/**
 * Google sign-in method. It renders the official GIS button and posts the ID token to
 * the API, then reports to the orchestrator (`Signin`):
 * - `available`: whether the button can be shown (client id configured, script loaded),
 *   so the orchestrator can decide whether to render the providers divider.
 * - `success` / `error`: the outcome of the sign-in attempt.
 */
const emit = defineEmits<{
	(e: 'available', value: boolean): void;
	(e: 'success'): void;
	(e: 'error', message: string): void;
}>();

const config = useRuntimeConfig();
const { $api, $theme } = useNuxtApp();
const { t, locale } = useI18n();

const clientId = config.public.googleClientId;

const containerRef = ref<HTMLElement | null>(null);
const buttonRef = ref<HTMLElement | null>(null);
const isAvailable = ref(Boolean(clientId));
const isSubmitting = ref(false);

let accountsId: GoogleAccountsId | undefined;
let renderedWidth = 0;
let resizeObserver: ResizeObserver | undefined;
let resizeFrame: number | undefined;

const getErrorLocaleKey = (error: unknown): string | undefined =>
	(error as { data?: { localeKey?: string } })?.data?.localeKey;

const handleCredential = async ({ credential }: GoogleCredentialResponse) => {
	if (isSubmitting.value) return;
	isSubmitting.value = true;

	try {
		await $api.auth.googleAuth({ idToken: credential });
		emit('success');
	} catch (error) {
		console.error(error);
		const message =
			getErrorLocaleKey(error) === EMAIL_NOT_VERIFIED_LOCALE_KEY
				? t('organisms.googleSignIn.error.emailNotVerified')
				: t('organisms.googleSignIn.error.message');
		emit('error', message);
	} finally {
		isSubmitting.value = false;
	}
};

const renderButton = () => {
	if (!accountsId || !containerRef.value || !buttonRef.value) return;

	const width = Math.floor(Math.min(containerRef.value.clientWidth, GOOGLE_BUTTON_MAX_WIDTH_PX));
	if (width <= 0) return;

	renderedWidth = width;
	buttonRef.value.replaceChildren();
	accountsId.renderButton(buttonRef.value, {
		type: 'standard',
		theme: $theme.isDark.value ? 'filled_black' : 'outline',
		size: 'large',
		text: 'continue_with',
		shape: 'pill',
		logo_alignment: 'center',
		width: String(width),
		locale: GOOGLE_BUTTON_LOCALES[locale.value]
	});
};

const handleResize = () => {
	if (resizeFrame !== undefined) cancelAnimationFrame(resizeFrame);
	resizeFrame = requestAnimationFrame(() => {
		resizeFrame = undefined;
		const width = Math.floor(
			Math.min(containerRef.value?.clientWidth ?? 0, GOOGLE_BUTTON_MAX_WIDTH_PX)
		);
		if (width !== renderedWidth) renderButton();
	});
};

// Incremented on every setup so a slower load for a previous language cannot win the race.
let setupRun = 0;
let isUnmounted = false;
let hasReportedAvailable = false;

/**
 * Loads GIS for the current app language, initializes it and renders the button. The
 * button text language is fixed by the loaded script (`hl`), so this runs again whenever
 * the app locale changes.
 */
const setupGoogleButton = async () => {
	if (!clientId) return;

	const run = ++setupRun;
	const language = GOOGLE_BUTTON_LOCALES[locale.value];

	let loaded: GoogleAccountsId;
	try {
		loaded = await loadGoogleIdentityScript(language);
	} catch (error) {
		console.error(error);
		if (run === setupRun) {
			isAvailable.value = false;
			emit('available', false);
		}
		return;
	}
	if (run !== setupRun || isUnmounted) return;

	if (!hasReportedAvailable) {
		hasReportedAvailable = true;
		emit('available', true);
	}
	accountsId = loaded;
	accountsId.initialize({
		client_id: clientId,
		callback: handleCredential,
		ux_mode: 'popup',
		context: 'signin',
		use_fedcm_for_button: true,
		itp_support: true
	});
	renderButton();
};

onMounted(async () => {
	await setupGoogleButton();

	if (containerRef.value && accountsId) {
		resizeObserver = new ResizeObserver(handleResize);
		resizeObserver.observe(containerRef.value);
	}
});

watch(locale, setupGoogleButton);
watch(() => $theme.isDark.value, renderButton);

onBeforeUnmount(() => {
	isUnmounted = true;
	resizeObserver?.disconnect();
	if (resizeFrame !== undefined) cancelAnimationFrame(resizeFrame);
});
</script>
