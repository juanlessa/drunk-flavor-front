<template>
	<NuxtLayout>
		<CreateDrink />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'auth',
	can: { action: 'create', subject: 'Drink' }
});
</script>
