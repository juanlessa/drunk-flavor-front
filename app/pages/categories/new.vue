<template>
	<NuxtLayout name="primary">
		<CreateCategory />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'auth'
});
</script>
