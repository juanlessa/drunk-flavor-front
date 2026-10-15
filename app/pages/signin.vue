<template>
	<NuxtLayout name="auth">
		<SigninForm />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'guest'
});
</script>
