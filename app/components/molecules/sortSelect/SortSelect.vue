<template>
	<Select.Root :model-value="modelValue" :name="props.name" @update:model-value="handleUpdate">
		<Select.Trigger
			:id="props.id"
			:aria-labelledby="labelId"
			class="w-full inline-flex items-center gap-2 rounded-control border border-stroke bg-surface px-3 py-2 text-body text-content cursor-pointer outline-hidden control-border-width transition-colors duration-short hover:bg-surface-hover focus-visible:border-focus-ring data-[state=open]:border-accent">
			<SortIcon class="size-4 shrink-0 text-content-muted" />
			<!-- Hidden on mobile to keep the control compact; still names the trigger. -->
			<span
				:id="labelId"
				class="hidden tablet:inline shrink-0 whitespace-nowrap text-content-muted">
				{{ props.label }}
			</span>
			<Select.Value class="min-w-0 flex-1 truncate text-left font-bold" />
			<Select.Icon as-child>
				<ChevronDownIcon class="shrink-0" />
			</Select.Icon>
		</Select.Trigger>
		<Select.Portal>
			<Select.Content
				class="w-[var(--radix-select-trigger-width)] bg-surface-overlay rounded-overlay shadow-overlay will-change-[opacity,transform] data-[side=bottom]:animate-floating-enter-from-bottom data-[side=top]:animate-floating-enter-from-top z-popover"
				side="bottom"
				align="end"
				:side-offset="FLOATING_POSITION_PX.selectSideOffset"
				position="popper">
				<Select.Viewport class="p-1 flex flex-col gap-0.5">
					<Select.Item
						v-for="option in props.options"
						:key="option.value"
						:value="option.value"
						class="group flex items-center gap-3 rounded-option px-3 py-2 cursor-pointer select-none text-content outline-hidden data-[highlighted]:bg-accent-subtle data-[state=checked]:bg-accent-subtle">
						<Select.ItemText class="min-w-0 flex-1 text-body font-bold">
							{{ option.label }}
						</Select.ItemText>
						<Select.ItemIndicator class="shrink-0 text-accent-content">
							<CheckIcon class="size-4 fill-current" aria-hidden="true" />
						</Select.ItemIndicator>
					</Select.Item>
				</Select.Viewport>
			</Select.Content>
		</Select.Portal>
	</Select.Root>
</template>
<script setup lang="ts">
import { useId } from 'vue';
import { Select } from 'radix-vue/namespaced';
import { FLOATING_POSITION_PX } from '~/constants/floatingPosition.constants';
import type { InputSelectOption } from '~/components/atoms/inputSelect/InputSelect.types';

const props = defineProps({
	modelValue: { type: String, required: true },
	/** Options to pick from. */
	options: { type: Array as PropType<InputSelectOption[]>, required: true },
	/** Visible label inside the trigger, e.g. "Sort by". */
	label: { type: String, required: true },
	id: { type: String, default: '' },
	name: { type: String, default: '' }
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: string): void;
}>();

const labelId = useId();

const handleUpdate = (value: string) => emit('update:modelValue', value);
</script>
