<template>
	<NuxtLayout name="auth">
		<SignupForm />
		<template #footer>
			<AuthLegalNotice />
		</template>
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'guest'
});
</script>
