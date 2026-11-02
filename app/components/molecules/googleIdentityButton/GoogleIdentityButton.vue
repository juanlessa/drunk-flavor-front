<template>
	<div v-if="isAvailable" class="flex justify-center">
		<button
			type="button"
			:data-testid="props.testId"
			:class="googleButtonStyle({ block: props.block })"
			:disabled="!isReady || props.disabled"
			@click="handleClick">
			<!--
				Branding guidelines: always the standard colour "G", never monochrome or recoloured.
				It sits directly on the button surface, which stays a light or dark neutral per theme.
			-->
			<GoogleIcon class="size-5 shrink-0" />
			<span class="truncate">{{ label }}</span>
		</button>
	</div>
</template>
<script setup lang="ts">
/**
 * Sign in with Google through our own button and the GIS authorization code model.
 *
 * Google's rendered button lives in a cross-origin iframe that cannot follow our design,
 * and desktop Chrome ignores clicks on it once it is made transparent. So the button is
 * ours, following the custom button branding guidelines, and a click opens the Google
 * popup with `requestCode()` (a new tab on mobile browsers, closed automatically once an
 * account is chosen). The resulting authorization code is emitted for the backend, which
 * exchanges it with the client secret and verifies the returned ID token.
 *
 * - https://developers.google.com/identity/oauth2/web/guides/use-code-model
 * - https://developers.google.com/identity/branding-guidelines#custom-button
 */
import { useI18n } from 'vue-i18n';
import GoogleIcon from '~/components/icons/GoogleIcon.vue';
import { loadGoogleIdentityScript } from '~/helpers/loadGoogleIdentityScript';
import type {
	GoogleCodeClient,
	GoogleCodeClientError,
	GoogleCodeResponse
} from '~/types/googleIdentity.types';
import type { Locale } from '~/types/i18n.types';
import { tv } from '~/utils/tv';
import type { GoogleButtonText } from './GoogleIdentityButton.types';

/** Authentication-only scopes: the backend only needs the ID token claims. */
const GOOGLE_SCOPES = 'openid email profile';
const GOOGLE_LOCALES: Record<Locale, string> = { en: 'en', pt: 'pt_BR' };

const props = defineProps({
	text: {
		type: String as PropType<GoogleButtonText>,
		default: 'continue_with'
	},
	/** Fills its container instead of the pill button widths. */
	block: {
		type: Boolean,
		default: false
	},
	disabled: {
		type: Boolean,
		default: false
	},
	/** Email of the expected Google account; skips the account chooser when it matches. */
	loginHint: {
		type: String,
		default: undefined
	},
	testId: { type: String, default: 'google-identity-button' }
});

const emit = defineEmits<{
	(e: 'available', value: boolean): void;
	(e: 'code', value: string): void;
	(e: 'error'): void;
}>();

// Mirrors the outline variant of the Button atom, at Google's "large" height (40px).
const googleButtonStyle = tv({
	base: 'h-10 w-full inline-flex items-center justify-center gap-2 px-4 rounded-full border-2 border-stroke-strong bg-surface-transparent text-body font-regular text-content transition-colors duration-short enabled:cursor-pointer enabled:hover:bg-surface-hover enabled:active:bg-surface-control disabled:cursor-not-allowed disabled:opacity-disabled focus-visible:outline-hidden focus-visible:shadow-focus-ring',
	variants: {
		block: {
			true: '',
			false: 'max-w-80 tablet:max-w-64'
		}
	}
});

const config = useRuntimeConfig();
const { t, locale } = useI18n();
const clientId = config.public.googleClientId;
const isAvailable = ref(Boolean(clientId));
const isReady = ref(false);

const label = computed(() => t(`molecules.googleIdentityButton.text.${props.text}`));

let codeClient: GoogleCodeClient | undefined;
let setupRun = 0;
let isUnmounted = false;
let hasReportedAvailable = false;

const handleCodeResponse = ({ code, error }: GoogleCodeResponse) => {
	// `access_denied` means the user declined on Google's side: nothing to report.
	if (code) emit('code', code);
	else if (error !== 'access_denied') emit('error');
};

const handleCodeClientError = ({ type }: GoogleCodeClientError) => {
	// Closing the popup is a deliberate cancel, not a failure.
	if (type !== 'popup_closed') emit('error');
};

/** Creates the code client ahead of the click, so `requestCode` can run synchronously in it. */
const setupCodeClient = async () => {
	if (!clientId) {
		emit('available', false);
		return;
	}
	const run = ++setupRun;
	isReady.value = false;
	try {
		const oauth2 = await loadGoogleIdentityScript(GOOGLE_LOCALES[locale.value]);
		if (run !== setupRun || isUnmounted) return;
		codeClient = oauth2.initCodeClient({
			client_id: clientId,
			scope: GOOGLE_SCOPES,
			ux_mode: 'popup',
			callback: handleCodeResponse,
			error_callback: handleCodeClientError,
			...(props.loginHint ? { login_hint: props.loginHint } : { select_account: true })
		});
		isReady.value = true;
		if (!hasReportedAvailable) {
			hasReportedAvailable = true;
			emit('available', true);
		}
	} catch (error) {
		console.error(error);
		if (run === setupRun) {
			isAvailable.value = false;
			emit('available', false);
			emit('error');
		}
	}
};

// No `await` before `requestCode`: Safari only opens popups inside the click's user activation.
const handleClick = () => codeClient?.requestCode();

onMounted(setupCodeClient);

watch([locale, () => props.loginHint], setupCodeClient);

onBeforeUnmount(() => {
	isUnmounted = true;
});
</script>
