<template>
	<NuxtLayout>
		<ViewCategory :category-id="categoryId" />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'auth',
	can: { action: 'getWithAuthorship', subject: 'Category' }
});

const route = useRoute('categories-id');
const categoryId = route.params.id;
</script>
