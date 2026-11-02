<template>
	<!-- Shown under forms that create or open an account (sign-in, sign-up). -->
	<i18n-t
		keypath="organisms.authLegalNotice.message"
		tag="p"
		scope="global"
		class="mx-auto max-w-auth-panel text-caption text-content-muted">
		<template #terms>
			<NuxtLink
				:to="localePath('/terms')"
				class="underline underline-offset-2 hover:text-content focus-visible:outline-hidden focus-visible:shadow-focus-ring">
				{{ $t('organisms.authLegalNotice.terms') }}
			</NuxtLink>
		</template>
		<template #privacy>
			<NuxtLink
				:to="localePath('/privacy')"
				class="underline underline-offset-2 hover:text-content focus-visible:outline-hidden focus-visible:shadow-focus-ring">
				{{ $t('organisms.authLegalNotice.privacy') }}
			</NuxtLink>
		</template>
	</i18n-t>
</template>
<script setup lang="ts">
const localePath = useLocalePath();
</script>
