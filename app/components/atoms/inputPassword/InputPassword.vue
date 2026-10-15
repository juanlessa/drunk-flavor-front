<template>
	<div :class="inputPasswordContainerStyle({ hasError: props.hasError, border: props.border })">
		<input
			:id="props.id"
			:value="props.modelValue"
			class="flex-1 py-1 text-body font-regular outline-hidden border-none text-content bg-transparent placeholder-content-muted"
			:type="_isPasswordVisible ? 'text' : 'password'"
			:name="props.name"
			:placeholder="props.placeholder"
			:pattern="`${props.pattern}`"
			@input="handleUpdateInput"
			@blur="handleBlurInput" />
		<Button
			variant="icon"
			class="text-content-muted"
			:aria-label="$t('atoms.inputPassword.toggleVisibilityButton.label')"
			@click="togglePasswordVisibility">
			<HideIcon v-if="_isPasswordVisible" />
			<ShowIcon v-else />
		</Button>
	</div>
</template>
<script setup lang="ts">
import { tv } from '~/utils/tv';
import HideIcon from '~/components/icons/HideIcon.vue';
import ShowIcon from '~/components/icons/ShowIcon.vue';

const props = defineProps({
	modelValue: { type: [String, Number], default: '' },
	name: { type: String, default: undefined },
	id: { type: String, default: undefined },
	placeholder: { type: String, default: undefined },
	pattern: { type: String, default: undefined },
	border: { type: Boolean, default: false },
	hasError: { type: Boolean, default: false }
});
const emit = defineEmits<{
	(e: 'update:modelValue', value: string): void;
	(e: 'blur'): void;
}>();

const _isPasswordVisible = ref(false);

const handleUpdateInput = (event: Event) => {
	const target = event?.target as HTMLInputElement;
	emit('update:modelValue', target.value);
};

const handleBlurInput = (event: Event) => {
	const target = event?.target as HTMLInputElement;
	emit('update:modelValue', target.value);
	emit('blur');
};

const togglePasswordVisibility = () => {
	_isPasswordVisible.value = !_isPasswordVisible.value;
};

const inputPasswordContainerStyle = tv({
	base: 'flex-1 flex items-center gap-2 px-3 rounded-control box-border control-border-width bg-surface-input border-surface-input input-container-focus-border',
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
	@apply border-stroke-strong;
}
</style>
