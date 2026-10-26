<template>
	<NuxtLayout name="auth">
		<Signin />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'guest'
});
</script>
