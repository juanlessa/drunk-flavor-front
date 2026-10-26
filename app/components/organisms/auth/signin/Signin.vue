<template>
	<Box direction="col" class="gap-10">
		<Heading as="h1" class="text-center text-headline-sm">
			{{ $t('organisms.signin.title') }}
		</Heading>
		<Box direction="col" class="gap-6">
			<CredentialsSignIn @success="handleSuccess" @error="handleError" />

			<Box v-if="hasAvailableProvider" direction="row" class="items-center gap-3">
				<Separator />
				<Text as="span" class="text-content-subtle uppercase">
					{{ $t('organisms.signin.divider') }}
				</Text>
				<Separator />
			</Box>
			<ClientOnly>
				<GoogleSignIn
					@available="setProviderAvailability('google', $event)"
					@success="handleSuccess"
					@error="handleError" />
			</ClientOnly>

			<Box direction="row" class="gap-1 items-center justify-center">
				<Text as="span" class="text-content-subtle">
					{{ $t('organisms.signin.signupPrompt.message') }}
				</Text>
				<Anchor :to="localePath('/signup')">
					{{ $t('organisms.signin.signupPrompt.link') }}
				</Anchor>
			</Box>
		</Box>
	</Box>
</template>

<script setup lang="ts">
const { $auth, $router } = useNuxtApp();
const { t } = useI18n();
const localePath = useLocalePath();
const { addToast } = useToast();

type Provider = 'google';

const providerAvailability = ref<Record<Provider, boolean>>({ google: false });
const hasAvailableProvider = computed(() =>
	Object.values(providerAvailability.value).some(Boolean)
);

const setProviderAvailability = (provider: Provider, isAvailable: boolean) => {
	providerAvailability.value[provider] = isAvailable;
};

const handleSuccess = async () => {
	await $auth.authenticate();
	$router.push(localePath('/'));
};

const handleError = (message: string) => {
	addToast({ type: 'error', title: t('organisms.signin.error.title'), message });
};
</script>
