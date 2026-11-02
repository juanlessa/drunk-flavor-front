<template>
	<NuxtLayout>
		<CreateUnit />
	</NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: 'auth',
	can: { action: 'create', subject: 'Unit' }
});
</script>
