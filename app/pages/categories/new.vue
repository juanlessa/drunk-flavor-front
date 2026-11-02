<template>
	<NuxtLayout>
		<CreateCategory />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'auth',
	can: { action: 'create', subject: 'Category' }
});
</script>
