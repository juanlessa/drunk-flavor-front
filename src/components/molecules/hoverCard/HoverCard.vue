<template>
	<HoverCard.Root :open="_open" @update:open="handleUpdateOpen">
		<HoverCard.Trigger class="inline-flex">
			<slot name="trigger"></slot>
		</HoverCard.Trigger>
		<HoverCard.Portal>
			<HoverCard.Content class="data-[state=open]:transition-all" :side-offset="5">
				<slot></slot>
			</HoverCard.Content>
		</HoverCard.Portal>
	</HoverCard.Root>
</template>
<script setup lang="ts">
import { HoverCard } from 'radix-vue/namespaced';

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
