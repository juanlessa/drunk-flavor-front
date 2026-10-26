<template>
	<NuxtLayout name="auth">
		<CompleteProfileForm />
	</NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: ['auth', 'incomplete-profile']
});
</script>
