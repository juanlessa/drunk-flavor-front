<template>
	<NuxtLayout name="auth">
		<ForgotPasswordForm />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'guest'
});
</script>
