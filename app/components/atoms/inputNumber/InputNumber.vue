<template>
	<div class="flex items-center gap-3">
		<div :class="inputNumberContainerStyle({ hasError: props.hasError, border: props.border })">
			<input
				:id="props.id"
				:value="props.modelValue"
				:class="[
					'py-1 text-body font-regular outline-hidden border-none text-content bg-transparent placeholder-content-muted',
					!props.inputWidth && 'flex-1'
				]"
				:style="props.inputWidth ? { width: props.inputWidth } : undefined"
				type="number"
				:name="props.name"
				:placeholder="props.placeholder"
				:pattern="`${props.pattern}`"
				@input="handleUpdateInput"
				@blur="handleBlurInput" />
			<div v-if="props.suffix && !props.suffixOutside" class="text-body text-content-muted">
				{{ props.suffix }}
			</div>
		</div>
		<div
			v-if="props.suffix && props.suffixOutside"
			class="text-body text-content-muted"
			:style="
				props.suffixWidth ? { inlineSize: props.suffixWidth, flex: 'none' } : undefined
			">
			{{ props.suffix }}
		</div>
	</div>
</template>
<script setup lang="ts">
import { tv } from '~/utils/tv';

const props = defineProps({
	modelValue: { type: [String, Number], default: '' },
	name: { type: String, default: undefined },
	id: { type: String, default: undefined },
	placeholder: { type: String, default: undefined },
	pattern: { type: String, default: undefined },
	suffix: { type: String, default: '' },
	suffixOutside: { type: Boolean, default: false },
	/** CSS inline size reserved for an outside suffix (e.g. '7ch', '4rem') */
	suffixWidth: { type: String, default: undefined },
	border: { type: Boolean, default: false },
	hasError: { type: Boolean, default: false },
	/** CSS width value (e.g. '5ch', '4rem', '60px') */
	inputWidth: { type: String, default: undefined }
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: number): void;
	(e: 'blur'): void;
}>();

const handleUpdateInput = (event: Event) => {
	const target = event?.target as HTMLInputElement;
	const value = Number(target.value);
	emit('update:modelValue', value);
};

const handleBlurInput = (event: Event) => {
	const target = event?.target as HTMLInputElement;
	const value = Number(target.value);
	emit('update:modelValue', value);
	emit('blur');
};

const inputNumberContainerStyle = tv({
	base: 'flex-1 flex items-center gap-2 px-3 rounded-control box-border control-border-width bg-surface-input border-stroke-input input-container-focus-border',
	variants: {
		border: {
			true: 'border-stroke-control'
		},
		hasError: {
			true: 'border-danger-stroke'
		}
	}
});
</script>
<style scoped>
@reference "~/styles/global.css";

.input-container-focus-border:has(> input:focus) {
	@apply border-focus-ring;
}

/* remove arrows or spinners */
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}
/* end remove arrows or spinners */
</style>
