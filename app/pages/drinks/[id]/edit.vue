<template>
	<NuxtLayout name="primary">
		<UpdateDrink :drink-id="drinkId" />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'auth',
	can: { action: 'update', subject: 'Drink' }
});

const route = useRoute('drinks-id-edit');
const drinkId = route.params.id;
</script>
