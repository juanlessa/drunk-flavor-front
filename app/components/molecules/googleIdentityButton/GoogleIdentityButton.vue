<template>
	<div v-if="isAvailable" class="flex justify-center">
		<div
			ref="containerRef"
			class="group relative w-full"
			:class="props.block ? '' : 'max-w-80 tablet:max-w-64'">
			<!--
				Design-system face of the button. It is not interactive: the real control is
				Google's button, rendered invisibly on top of it (see the note in the script).
			-->
			<div aria-hidden="true" :class="googleButtonFaceStyle({ ready: isRendered })">
				<GoogleIcon class="size-5 shrink-0" />
				<span class="truncate">{{ label }}</span>
			</div>
			<div
				ref="buttonRef"
				:data-testid="props.testId"
				class="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full opacity-0"></div>
		</div>
	</div>
</template>
<script setup lang="ts">
/**
 * Sign in with Google, styled as the design-system outline button.
 *
 * Google's button lives in a cross-origin iframe whose colours cannot be changed
 * (its dark theme clashes with our surfaces). Keeping that iframe is what gives
 * the browser integration: FedCM's native account chooser where supported, the
 * Google popup elsewhere, and an ID token for the backend. So the official button
 * is still rendered and receives every click, but with `opacity: 0`, on top of
 * our own face. Hover, press and keyboard focus reach the face through
 * `group-hover`, `group-active` and `group-focus-within`.
 *
 * This relies on GIS accepting clicks on a transparent iframe, which Google does
 * not document. If sign-in stops opening, render the iframe visibly again.
 */
import { useI18n } from 'vue-i18n';
import GoogleIcon from '~/components/icons/GoogleIcon.vue';
import { loadGoogleIdentityScript } from '~/helpers/loadGoogleIdentityScript';
import type {
	GoogleAccountsId,
	GoogleButtonConfiguration,
	GoogleCredentialResponse,
	GoogleIdConfiguration
} from '~/types/googleIdentity.types';
import type { Locale } from '~/types/i18n.types';
import { tv } from '~/utils/tv';

const GOOGLE_BUTTON_MAX_WIDTH_PX = 400;
const GOOGLE_BUTTON_LOCALES: Record<Locale, string> = { en: 'en', pt: 'pt_BR' };

const props = defineProps({
	context: {
		type: String as PropType<NonNullable<GoogleIdConfiguration['context']>>,
		default: 'use'
	},
	text: {
		type: String as PropType<NonNullable<GoogleButtonConfiguration['text']>>,
		default: 'continue_with'
	},
	/** Fills its container (up to Google's 400px button limit) instead of the pill button widths. */
	block: {
		type: Boolean,
		default: false
	},
	testId: { type: String, default: 'google-identity-button' }
});

const emit = defineEmits<{
	(e: 'available', value: boolean): void;
	(e: 'credential', value: string): void;
	(e: 'error'): void;
}>();

// Mirrors the outline variant of the Button atom, at Google's "large" height (40px).
const googleButtonFaceStyle = tv({
	base: 'h-10 w-full inline-flex items-center justify-center gap-2 px-4 rounded-full border-2 border-stroke-strong bg-surface-transparent text-body font-regular text-content transition-colors duration-short group-hover:bg-surface-hover group-active:bg-surface-control group-focus-within:shadow-focus-ring',
	variants: {
		// Until Google's button is in place there is nothing to click.
		ready: {
			false: 'opacity-disabled'
		}
	}
});

const config = useRuntimeConfig();
const { t, locale } = useI18n();
const clientId = config.public.googleClientId;
const containerRef = ref<HTMLElement | null>(null);
const buttonRef = ref<HTMLElement | null>(null);
const isAvailable = ref(Boolean(clientId));
const isRendered = ref(false);

const label = computed(() => t(`molecules.googleIdentityButton.text.${props.text}`));

let accountsId: GoogleAccountsId | undefined;
let renderedWidth = 0;
let resizeObserver: ResizeObserver | undefined;
let resizeFrame: number | undefined;
let setupRun = 0;
let isUnmounted = false;
let hasReportedAvailable = false;

const handleCredential = ({ credential }: GoogleCredentialResponse) =>
	emit('credential', credential);

const renderButton = () => {
	if (!accountsId || !containerRef.value || !buttonRef.value) return;
	const width = Math.floor(Math.min(containerRef.value.clientWidth, GOOGLE_BUTTON_MAX_WIDTH_PX));
	if (width <= 0) return;
	renderedWidth = width;
	buttonRef.value.replaceChildren();
	// The theme is irrelevant while invisible; "large" matches the 40px face.
	accountsId.renderButton(buttonRef.value, {
		type: 'standard',
		theme: 'outline',
		size: 'large',
		text: props.text,
		shape: 'pill',
		logo_alignment: 'center',
		width: String(width),
		locale: GOOGLE_BUTTON_LOCALES[locale.value]
	});
	isRendered.value = true;
};

const setupGoogleButton = async () => {
	if (!clientId) {
		emit('available', false);
		return;
	}
	const run = ++setupRun;
	try {
		const loaded = await loadGoogleIdentityScript(GOOGLE_BUTTON_LOCALES[locale.value]);
		if (run !== setupRun || isUnmounted) return;
		accountsId = loaded;
		accountsId.initialize({
			client_id: clientId,
			callback: handleCredential,
			ux_mode: 'popup',
			context: props.context,
			use_fedcm_for_button: true,
			itp_support: true
		});
		if (!hasReportedAvailable) {
			hasReportedAvailable = true;
			emit('available', true);
		}
		renderButton();
	} catch (error) {
		console.error(error);
		if (run === setupRun) {
			isAvailable.value = false;
			emit('available', false);
			emit('error');
		}
	}
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

onMounted(async () => {
	await setupGoogleButton();
	if (containerRef.value && accountsId) {
		resizeObserver = new ResizeObserver(handleResize);
		resizeObserver.observe(containerRef.value);
	}
});

watch(locale, setupGoogleButton);

onBeforeUnmount(() => {
	isUnmounted = true;
	resizeObserver?.disconnect();
	if (resizeFrame !== undefined) cancelAnimationFrame(resizeFrame);
});
</script>
