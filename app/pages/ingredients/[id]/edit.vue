<template>
	<NuxtLayout name="primary">
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
