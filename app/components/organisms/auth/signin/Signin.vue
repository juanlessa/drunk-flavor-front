<template>
	<div class="flex flex-col gap-6">
		<AuthPageHeader
			:title="$t('organisms.signin.title')"
			:description="$t('organisms.signin.subtitle')" />
		<!-- Google first: a single tap for most people; the divider only shows when it is there. -->
		<ClientOnly>
			<GoogleSignIn
				@available="setProviderAvailability('google', $event)"
				@success="handleSuccess"
				@error="handleError" />
		</ClientOnly>
		<div v-if="hasAvailableProvider" class="flex items-center gap-3">
			<Separator />
			<Text as="span" class="text-body-sm text-content-muted">
				{{ $t('organisms.signin.divider') }}
			</Text>
			<Separator />
		</div>
		<CredentialsSignIn @success="handleSuccess" @error="handleError" />
		<AuthPrompt
			:message="$t('organisms.signin.signupPrompt.message')"
			:link-label="$t('organisms.signin.signupPrompt.link')"
			:to="localePath('/signup')" />
	</div>
</template>

<script setup lang="ts">
const { $auth, $router } = useNuxtApp();
const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();
const { addToast } = useToast();

type Provider = 'google';

/** Actions a page asked to resume once the visitor is signed in. */
const POST_SIGNIN_INTENTS = ['rate', 'comment'];

const providerAvailability = ref<Record<Provider, boolean>>({ google: false });
const hasAvailableProvider = computed(() =>
	Object.values(providerAvailability.value).some(Boolean)
);

const setProviderAvailability = (provider: Provider, isAvailable: boolean) => {
	providerAvailability.value[provider] = isAvailable;
};

const getPostSigninTarget = (): string => {
	const fallback = localePath('/').toString();
	const redirect = route.query.redirect;
	if (typeof redirect !== 'string' || !redirect.startsWith('/')) return fallback;

	try {
		const baseUrl = new URL('https://drunk-flavor.local');
		const targetUrl = new URL(redirect, baseUrl);
		if (targetUrl.origin !== baseUrl.origin) return fallback;

		// Only known intents travel back, so the target page can resume the action (rate or comment).
		const intent = route.query.intent;
		if (typeof intent === 'string' && POST_SIGNIN_INTENTS.includes(intent)) {
			targetUrl.searchParams.set('intent', intent);
		}

		return `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`;
	} catch {
		return fallback;
	}
};

const handleSuccess = async () => {
	await $auth.authenticate();
	await $router.push(getPostSigninTarget());
};

const handleError = (message: string) => {
	addToast({ type: 'error', title: t('organisms.signin.error.title'), message });
};
</script>
