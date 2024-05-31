<template>
	<HoverCardRoot :open="_open" @update:open="handleUpdateOpen">
		<HoverCardTrigger class="inline-flex">
			<slot name="trigger"></slot>
		</HoverCardTrigger>
		<HoverCardPortal>
			<HoverCardContent class="data-[state=open]:transition-all" :side-offset="5">
				<slot></slot>
			</HoverCardContent>
		</HoverCardPortal>
	</HoverCardRoot>
</template>
<script setup lang="ts">
import { HoverCardContent, HoverCardPortal, HoverCardRoot, HoverCardTrigger } from 'radix-vue';

const props = defineProps({
	open: {
		type: Boolean,
		default: false
	}
});
const emit = defineEmits<{
	(e: 'update:open', value: boolean): void;
}>();

const _open = ref<boolean>(props.open);

const handleUpdateOpen = (value: boolean) => {
	_open.value = value;
	emit('update:open', value);
};

watch(
	() => props.open,
	(newValue) => (_open.value = newValue)
);
</script>
