<template>
	<NuxtLayout name="auth">
		<ConfirmPasswordForm />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'guest'
});
</script>
