<template>
	<Story title="Organisms/Profile/GoogleConnectionDialog"
		><Variant title="Open"><GoogleConnectionDialog v-model:open="open" /></Variant
	></Story>
</template>
<script setup lang="ts">
const open = ref(true);
</script>
