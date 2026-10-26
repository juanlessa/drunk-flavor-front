<template>
	<NuxtLayout>
		<UnitsControlOverview />
	</NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: 'auth',
	can: { action: 'manage', subject: 'Unit' }
});
</script>
