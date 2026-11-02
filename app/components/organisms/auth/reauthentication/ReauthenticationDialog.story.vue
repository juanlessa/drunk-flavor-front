<template>
	<Story title="Organisms/Auth/ReauthenticationDialog"
		><Variant title="Open"
			><ReauthenticationDialog :open="open" @cancel="open = false" /></Variant
	></Story>
</template>
<script setup lang="ts">
const open = ref(true);
</script>
