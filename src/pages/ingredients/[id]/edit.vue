<template>
	<NuxtLayout :bg-primary="true">
		<UpdateIngredient :ingredient-id="ingredientId" />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'auth'
});

const route = useRoute('ingredients-id-edit');
const ingredientId = route.params.id;
</script>
