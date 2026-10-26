<template>
	<HoverCard.Root
		:open="_open"
		:open-delay="props.openDelay"
		:close-delay="props.closeDelay"
		@update:open="handleUpdateOpen">
		<HoverCard.Trigger as-child>
			<slot name="trigger"></slot>
		</HoverCard.Trigger>
		<HoverCard.Portal>
			<HoverCard.Content
				class="z-popover rounded-overlay bg-surface-elevated border border-stroke shadow-overlay"
				:side="props.side"
				:side-offset="props.sideOffset"
				:align="props.align"
				:align-offset="props.alignOffset"
				:avoid-collisions="props.avoidCollisions">
				<slot></slot>
				<HoverCard.Arrow v-if="props.arrow" :width="10" :height="5" />
			</HoverCard.Content>
		</HoverCard.Portal>
	</HoverCard.Root>
</template>
<script setup lang="ts">
import { HoverCard } from 'radix-vue/namespaced';
import { INTERACTION_TIMING_MS } from '~/constants/durations.constants';

type Side = 'top' | 'right' | 'bottom' | 'left';
type Align = 'start' | 'center' | 'end';

const props = defineProps({
	open: {
		type: Boolean,
		default: undefined
	},
	side: {
		type: String as PropType<Side>,
		default: 'bottom'
	},
	sideOffset: {
		type: Number,
		default: 5
	},
	align: {
		type: String as PropType<Align>,
		default: 'center'
	},
	alignOffset: {
		type: Number,
		default: 0
	},
	openDelay: {
		type: Number,
		default: INTERACTION_TIMING_MS.hoverCardOpenDelay
	},
	closeDelay: {
		type: Number,
		default: INTERACTION_TIMING_MS.hoverCardCloseDelay
	},
	avoidCollisions: {
		type: Boolean,
		default: true
	},
	arrow: {
		type: Boolean,
		default: false
	}
});

const emit = defineEmits<{
	(e: 'update:open', value: boolean): void;
}>();

const _open = ref<boolean | undefined>(props.open);

const handleUpdateOpen = (value: boolean) => {
	_open.value = value;
	emit('update:open', value);
};

watch(
	() => props.open,
	(newValue) => (_open.value = newValue)
);
</script>
