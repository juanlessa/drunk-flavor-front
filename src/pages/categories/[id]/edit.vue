<template>
	<NuxtLayout :bg-primary="true">
		<UpdateCategory :category-id="categoryId" />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'auth'
});

const route = useRoute('categories-id-edit');
const categoryId = route.params.id;
</script>
