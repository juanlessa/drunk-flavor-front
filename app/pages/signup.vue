<template>
	<NuxtLayout name="auth">
		<SignupForm />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'guest'
});
</script>
