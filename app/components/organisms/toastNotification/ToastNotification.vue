<template>
	<Toast.Provider
		:duration="toastConfig.duration"
		:label="$t(toastConfig.labelI18nKey)"
		:swipe-threshold="toastConfig.swipeThreshold">
		<Toast.Root
			v-for="toast in state.displayingToasts"
			:key="toast.id"
			:duration="toast.duration"
			class="relative px-4 py-2 rounded-overlay flex flex-col shadow-overlay data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform data-[swipe=cancel]:duration-short data-[swipe=cancel]:ease-exit"
			:class="toastColorsStyle({ type: toast.type })"
			@update:open="(_value) => removeToast(toast)">
			<Toast.Title as-child>
				<Text as="span" class="text-body-lg font-medium">{{ toast.title }}</Text>
			</Toast.Title>
			<Toast.Description as-child>
				<Text as="span" class="text-body-sm">{{ toast.message }}</Text>
			</Toast.Description>
			<Toast.Close class="absolute top-1 right-2 p-1 cursor-pointer">
				<CloseIcon class="fill-content" />
			</Toast.Close>
		</Toast.Root>

		<Toast.Viewport
			:hotkey="toastConfig.hotkey"
			class="fixed top-0 right-0 flex flex-col p-4 gap-2 w-toast-viewport max-w-[100vw] m-0 list-none z-toast outline-hidden" />
	</Toast.Provider>
</template>
<script setup lang="ts">
import { tv } from 'tailwind-variants';
import { Toast } from 'radix-vue/namespaced';
import { toastConfig } from './ToastNotification.constants';

const { state, removeToast } = useToast();

const toastColorsStyle = tv({
	variants: {
		type: {
			info: 'bg-info-surface',
			success: 'bg-success-surface',
			error: 'bg-danger-surface'
		}
	}
});
</script>
