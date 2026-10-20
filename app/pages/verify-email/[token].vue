<template>
	<NuxtLayout name="auth">
		<VerifyEmail />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'guest'
});
</script>
