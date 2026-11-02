<template>
	<div class="flex flex-col gap-6" aria-live="polite">
		<AuthPageHeader
			v-if="status === 'pending'"
			:title="$t('organisms.verifyEmail.pending.title')"
			:description="$t('organisms.verifyEmail.pending.message')">
			<template #icon>
				<span
					class="size-6 rounded-full border-[3px] border-current border-t-transparent motion-safe:animate-spin"></span>
			</template>
		</AuthPageHeader>
		<template v-else-if="status === 'success'">
			<AuthPageHeader
				tone="success"
				:title="$t('organisms.verifyEmail.success.title')"
				:description="$t('organisms.verifyEmail.success.message')">
				<template #icon><CheckIcon /></template>
			</AuthPageHeader>
			<NuxtLink :to="localePath('/signin')" :class="primaryLinkClass">
				{{ $t('organisms.verifyEmail.success.signinLink') }}
			</NuxtLink>
		</template>
		<template v-else>
			<AuthPageHeader
				tone="danger"
				:title="$t('organisms.verifyEmail.error.title')"
				:description="$t('organisms.verifyEmail.error.message')">
				<template #icon><ClockIcon /></template>
			</AuthPageHeader>
			<NuxtLink :to="localePath('/signin')" :class="primaryLinkClass">
				{{ $t('organisms.verifyEmail.error.signinLink') }}
			</NuxtLink>
		</template>
	</div>
</template>

<script setup lang="ts">
import CheckIcon from '~/components/icons/CheckIcon.vue';
import ClockIcon from '~/components/icons/ClockIcon.vue';

/** A link styled as the full-width primary button of the auth forms. */
const primaryLinkClass =
	'h-10 w-full inline-flex items-center justify-center rounded-full bg-accent px-4 text-body text-content-on-accent hover:bg-accent-hover active:bg-accent-active focus-visible:outline-hidden focus-visible:shadow-focus-ring';

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
