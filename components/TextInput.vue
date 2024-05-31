<template>
	<div class="w-full flex items-center gap-3">
		<div :class="textInputContainerStyle({ hasError: props.hasError, border: props.border })">
			<input
				:id="props.id"
				:value="props.modelValue"
				class="flex-1 py-2 text-lg leading-6 font-normal outline-none border-none text-black bg-transparent placeholder-gray-600"
				:type="props.type"
				:name="props.name"
				:placeholder="props.placeholder"
				:pattern="`${props.pattern}`"
				@input="handleUpdateInput"
				@blur="handleBlurInput" />
			<div
				v-if="props.suffix && !props.suffixOutside"
				class="text-base text-normal text-white dark:text-black">
				{{ props.suffix }}
			</div>
		</div>
		<div
			v-if="props.suffix && props.suffixOutside"
			class="text-base text-normal text-black dark:text-white">
			{{ props.suffix }}
		</div>
	</div>
</template>
<script setup lang="ts">
import { type PropType } from 'vue';
import { tv } from 'tailwind-variants';

const textInputContainerStyle = tv({
	base: 'flex-1 flex items-center gap-2 bg-white  px-3 rounded-md box-border border-2 border-white input-container-focus-border',
	variants: {
		border: {
			true: 'border-gray-600'
		},
		hasError: {
			true: 'border-red-500'
		}
	}
});

const props = defineProps({
	modelValue: {
		type: [String, Number],
		required: true
	},
	type: {
		type: String as PropType<'text' | 'number'>,
		default: 'text'
	},
	name: {
		type: String,
		default: ''
	},
	id: {
		type: String,
		default: ''
	},
	placeholder: {
		type: String,
		default: ''
	},
	pattern: {
		type: String,
		default: ''
	},
	suffix: {
		type: String,
		default: ''
	},
	suffixOutside: {
		type: Boolean,
		default: false
	},
	border: {
		type: Boolean,
		default: false
	},
	hasError: {
		type: Boolean,
		default: false
	}
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: string): void;
	(e: 'blur'): void;
}>();

const handleUpdateInput = (event: Event) => {
	const inputElement = event.target as HTMLInputElement;
	emit('update:modelValue', inputElement.value);
};

const handleBlurInput = (event: Event) => {
	const inputElement = event.target as HTMLInputElement;
	emit('update:modelValue', inputElement.value);
	emit('blur');
};
</script>
<style scoped>
.input-container-focus-border:has(> input:focus) {
	border-color: black;
}

/* remove arrows or spinners */
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}
/* end remove arrows or spinners */
</style>
