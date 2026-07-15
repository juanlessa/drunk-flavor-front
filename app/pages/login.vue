<template>
	<NuxtLayout name="auth">
		<LoginForm />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'guest'
});
</script>
