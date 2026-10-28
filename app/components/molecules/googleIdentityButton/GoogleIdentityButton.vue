<template>
	<div v-if="isAvailable" class="flex justify-center">
		<div
			ref="containerRef"
			class="w-full max-w-80 min-h-10 flex justify-center tablet:max-w-64">
			<div
				ref="buttonRef"
				:data-testid="props.testId"
				class="overflow-hidden rounded-full"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { loadGoogleIdentityScript } from '~/helpers/loadGoogleIdentityScript';
import type {
	GoogleAccountsId,
	GoogleButtonConfiguration,
	GoogleCredentialResponse,
	GoogleIdConfiguration
} from '~/types/googleIdentity.types';
import type { Locale } from '~/types/i18n.types';

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
	testId: { type: String, default: 'google-identity-button' }
});

const emit = defineEmits<{
	(e: 'available', value: boolean): void;
	(e: 'credential', value: string): void;
	(e: 'error'): void;
}>();

const config = useRuntimeConfig();
const { $theme } = useNuxtApp();
const { locale } = useI18n();
const clientId = config.public.googleClientId;
const containerRef = ref<HTMLElement | null>(null);
const buttonRef = ref<HTMLElement | null>(null);
const isAvailable = ref(Boolean(clientId));

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
	accountsId.renderButton(buttonRef.value, {
		type: 'standard',
		theme: $theme.isDark.value ? 'filled_black' : 'outline',
		size: 'large',
		text: props.text,
		shape: 'pill',
		logo_alignment: 'center',
		width: String(width),
		locale: GOOGLE_BUTTON_LOCALES[locale.value]
	});
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
watch(() => $theme.isDark.value, renderButton);

onBeforeUnmount(() => {
	isUnmounted = true;
	resizeObserver?.disconnect();
	if (resizeFrame !== undefined) cancelAnimationFrame(resizeFrame);
});
</script>
