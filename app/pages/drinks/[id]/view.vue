<template>
	<NuxtLayout>
		<ViewDrink :drink-id="drinkId" />
	</NuxtLayout>
</template>
<script setup lang="ts">
// Read-only view of a drink for who cannot edit it. `/drinks/:id` is the public page, so it lives here.
definePageMeta({
	middleware: 'auth',
	can: { action: 'getWithAuthorship', subject: 'Drink' }
});

const route = useRoute('drinks-id-view');
const drinkId = route.params.id;
</script>
