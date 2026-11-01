<template>
	<Story title="Organisms/Users/ChangeUserRoleDialog">
		<Variant title="Open">
			<ChangeUserRoleDialog
				v-model:open="open"
				user-id="story-user"
				:role-transitions="['admin', 'member']" />
		</Variant>
	</Story>
</template>
<script setup lang="ts">
const open = ref(true);
</script>
