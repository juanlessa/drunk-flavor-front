<template>
	<NuxtLayout name="primary">
		<UpdateCategory :category-id="categoryId" />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'auth',
	can: { action: 'update', subject: 'Category' }
});

const route = useRoute('categories-id-edit');
const categoryId = route.params.id;
</script>
