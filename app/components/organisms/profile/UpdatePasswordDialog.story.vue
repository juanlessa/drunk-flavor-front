<template>
	<Story title="Organisms/Profile/UpdatePasswordDialog"
		><Variant title="Open"><UpdatePasswordDialog v-model:open="open" /></Variant
	></Story>
</template>
<script setup lang="ts">
const open = ref(true);
</script>
