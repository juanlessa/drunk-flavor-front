<template>
	<Story title="Organisms/OwnershipTransfer/RequestOwnershipTransferDialog">
		<Variant title="Open">
			<RequestOwnershipTransferDialog v-model:open="open" target-user-id="story-admin" />
		</Variant>
	</Story>
</template>
<script setup lang="ts">
const open = ref(true);
</script>
