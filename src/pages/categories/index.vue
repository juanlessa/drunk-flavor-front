<template>
	<NuxtLayout>
		<Button @click="handleCreateCategory">Create Category</Button>
		<CategoriesControlOverview />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'auth'
});

const { $router } = useNuxtApp();
const localePath = useLocalePath();

const handleCreateCategory = () => {
	$router.push(localePath('/categories/new'));
};
</script>
