<template>
	<NuxtLayout name="primary">
		<CreateUnit />
	</NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: 'auth',
	can: { action: 'create', subject: 'Unit' }
});
</script>
