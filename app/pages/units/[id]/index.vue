<template>
	<NuxtLayout>
		<ViewUnit :unit-id="unitId" />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'auth',
	can: { action: 'getWithAuthorship', subject: 'Unit' }
});

const route = useRoute('units-id');
const unitId = String(route.params.id);
</script>
