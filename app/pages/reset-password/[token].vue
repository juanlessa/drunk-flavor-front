<template>
	<NuxtLayout name="auth">
		<ResetPasswordForm />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'guest'
});
</script>
