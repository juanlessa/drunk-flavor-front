<template>
	<Story title="Organisms/Profile/CreatePasswordDialog"
		><Variant title="Open"><CreatePasswordDialog v-model:open="open" /></Variant
	></Story>
</template>
<script setup lang="ts">
const open = ref(true);
</script>
