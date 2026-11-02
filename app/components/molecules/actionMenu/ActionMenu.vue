<template>
	<DropdownMenu.Root v-model:open="isOpen" :modal="false">
		<DropdownMenu.Trigger as-child>
			<!-- 44px target so the menu stays easy to hit on touch screens. -->
			<button
				type="button"
				class="size-11 shrink-0 inline-flex items-center justify-center rounded-icon-action enabled:cursor-pointer enabled:hover:bg-surface-hover data-[state=open]:bg-surface-hover disabled:opacity-disabled focus-visible:outline-hidden focus-visible:shadow-focus-ring"
				:aria-label="props.label"
				:disabled="props.disabled">
				<MoreIcon class="size-4 fill-current text-content-muted" aria-hidden="true" />
			</button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Portal>
			<DropdownMenu.Content
				class="z-dropdown min-w-48 p-1 flex flex-col rounded-overlay bg-surface-elevated border border-stroke shadow-overlay"
				align="end"
				:side-offset="4"
				:collision-padding="8">
				<DropdownMenu.Item
					v-for="item in props.items"
					:key="item.key"
					:class="itemStyles({ tone: item.tone ?? 'default' })"
					:disabled="item.disabled"
					@select="emit('select', item.key)">
					<component
						:is="item.icon"
						v-if="item.icon"
						class="size-4 shrink-0 fill-current"
						:class="item.tone === 'danger' ? 'text-danger' : 'text-content-muted'"
						aria-hidden="true" />
					<span>{{ item.label }}</span>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Portal>
	</DropdownMenu.Root>
</template>
<script setup lang="ts">
import { DropdownMenu } from 'radix-vue/namespaced';
import MoreIcon from '~/components/icons/MoreIcon.vue';
import { tv } from '~/utils/tv';
import type { ActionMenuItem } from './ActionMenu.types';

const props = defineProps({
	/** Accessible name of the trigger, e.g. "Comment actions". */
	label: { type: String, required: true },
	items: { type: Array as PropType<ActionMenuItem[]>, default: () => [] },
	disabled: { type: Boolean, default: false }
});

const emit = defineEmits<{
	(e: 'select', key: string): void;
}>();

const isOpen = ref(false);

const itemStyles = tv({
	base: 'min-h-11 px-3 flex items-center gap-3 rounded-option text-body cursor-pointer select-none outline-hidden data-[highlighted]:bg-surface-hover data-[disabled]:cursor-not-allowed data-[disabled]:text-content-subtle',
	variants: {
		tone: {
			default: 'text-content',
			danger: 'text-danger'
		}
	}
});
</script>
