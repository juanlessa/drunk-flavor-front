<template>
	<NuxtLayout>
		<Button @click="handleCreateCategory">Create Category</Button>
	</NuxtLayout>
</template>
<script setup lang="ts">
const { $router } = useNuxtApp();
const localePath = useLocalePath();

const handleCreateCategory = () => {
	$router.push(localePath('/categories/new'));
};
</script>
