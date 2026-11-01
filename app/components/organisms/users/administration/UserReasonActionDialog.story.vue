<template>
	<Story title="Organisms/Users/UserReasonActionDialog">
		<Variant v-for="action in actions" :key="action" :title="action">
			<UserReasonActionDialog v-model:open="open" user-id="story-user" :action="action" />
		</Variant>
	</Story>
</template>
<script setup lang="ts">
import type { UserReasonAction } from '~/types/user.types';

const actions: UserReasonAction[] = ['suspend', 'reactivate', 'close', 'revokeSessions'];
const open = ref(true);
</script>
