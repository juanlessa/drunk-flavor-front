<template>
	<NuxtLayout name="primary">
		<UpdateUnit :unit-id="unitId" />
	</NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: 'auth',
	can: { action: 'update', subject: 'Unit' }
});

const route = useRoute('units-id-edit');
const unitId = route.params.id;
</script>
