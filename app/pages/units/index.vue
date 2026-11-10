<template>
	<NuxtLayout>
		<UnitsControlOverview />
	</NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: 'auth',
	can: { action: 'listWithAuthorship', subject: 'Unit' }
});
</script>
