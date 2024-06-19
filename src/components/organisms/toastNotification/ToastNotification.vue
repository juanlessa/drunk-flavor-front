<template>
	<Toast.Provider
		:duration="toastConfig.duration"
		:label="$t(toastConfig.labelI18nKey)"
		:swipe-threshold="toastConfig.swipeThreshold">
		<Toast.Root
			v-for="toast in state.displayingToasts"
			:key="toast.id"
			:duration="toast.duration"
			class="relative px-4 py-2 rounded-md flex flex-col shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out]"
			:class="toastColorsStyle({ type: toast.type })"
			@update:open="(_value) => removeToast(toast)">
			<Toast.Title as-child>
				<Text size="lg" weight="medium">{{ toast.title }}</Text>
			</Toast.Title>
			<Toast.Description as-child>
				<Text size="sm">{{ toast.message }}</Text>
			</Toast.Description>
			<Toast.Close class="absolute top-1 right-2 p-1 cursor-pointer">
				<CloseIcon class="fill-gray-700 dark:fill-gray-200" />
			</Toast.Close>
		</Toast.Root>

		<Toast.Viewport
			:hotkey="toastConfig.hotkey"
			class="fixed top-0 right-0 flex flex-col p-4 gap-2 w-[390px] max-w-[100vw] m-0 list-none z-[10000] outline-none" />
	</Toast.Provider>
</template>
<script setup lang="ts">
import { tv } from 'tailwind-variants';
import { Toast } from 'radix-vue/namespaced';
import { toastConfig } from '~/constants/toastNotification';

const { state, removeToast } = useToast();

const toastColorsStyle = tv({
	variants: {
		type: {
			info: 'bg-white dark:bg-gray-900',
			success: 'bg-green-300  dark:bg-green-600',
			error: 'bg-red-300 dark:bg-red-600'
		}
	}
});
</script>
