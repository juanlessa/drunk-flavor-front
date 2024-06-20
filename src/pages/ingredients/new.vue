<template>
	<NuxtLayout :bg-primary="true">
		<CreateIngredient />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'auth'
});
</script>
