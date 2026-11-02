<template>
	<!-- "Already have an account? Sign in"-style line closing an auth page. -->
	<p class="text-center text-body-sm text-content-muted">
		{{ props.message }}
		<slot>
			<Anchor :to="props.to" :class="AUTH_PROMPT_ACTION_CLASS" @click="emit('navigate')">
				{{ props.linkLabel }}
			</Anchor>
		</slot>
	</p>
</template>
<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';
import { AUTH_PROMPT_ACTION_CLASS } from './AuthPrompt.constants';

const props = defineProps({
	message: { type: String, required: true },
	linkLabel: { type: String, default: '' },
	to: { type: [String, Object] as PropType<RouteLocationRaw>, default: undefined }
});

const emit = defineEmits<{
	(e: 'navigate'): void;
}>();
</script>
