<template>
	<NuxtLayout :bg-primary="true">
		<CreateCategory />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'auth'
});
</script>
