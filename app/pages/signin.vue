<template>
	<NuxtLayout name="auth">
		<Signin />
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
