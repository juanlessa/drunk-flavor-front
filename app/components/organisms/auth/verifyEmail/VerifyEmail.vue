<template>
	<Box direction="col" class="gap-6 items-center text-center">
		<template v-if="status === 'pending'">
			<Heading as="h1" :value="$t('organisms.verifyEmail.pending.title')" />
			<Text
				:value="$t('organisms.verifyEmail.pending.message')"
				class="text-content-subtle" />
		</template>
		<template v-else-if="status === 'success'">
			<Heading as="h1" :value="$t('organisms.verifyEmail.success.title')" />
			<Text
				:value="$t('organisms.verifyEmail.success.message')"
				class="text-content-subtle" />
			<Anchor :to="localePath('/signin')">
				{{ $t('organisms.verifyEmail.success.signinLink') }}
			</Anchor>
		</template>
		<template v-else>
			<Heading as="h1" :value="$t('organisms.verifyEmail.error.title')" />
			<Text :value="$t('organisms.verifyEmail.error.message')" class="text-content-subtle" />
			<Anchor :to="localePath('/signin')">
				{{ $t('organisms.verifyEmail.error.signinLink') }}
			</Anchor>
		</template>
	</Box>
</template>

<script setup lang="ts">
const { $api } = useNuxtApp();
const localePath = useLocalePath();
const route = useRoute('verify-email-token');

const status = ref<'pending' | 'success' | 'error'>('pending');

onMounted(async () => {
	const token = String(route.params.token);
	if (!token) {
		status.value = 'error';
		return;
	}

	try {
		await $api.auth.confirmEmail({ token });
		status.value = 'success';
	} catch (error) {
		console.error(error);
		status.value = 'error';
	}
});
</script>
