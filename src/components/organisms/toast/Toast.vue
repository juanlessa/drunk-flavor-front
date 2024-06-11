<template>
	<ToastProvider>
		<ToastRoot
			v-for="toast in state.displayingToasts"
			:key="toast.id"
			class="relative px-4 py-2 rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out]"
			:class="toastColorsStyle({ type: toast.type })"
			@update:open="(_value) => removeToast(toast)">
			<ToastTitle class="mb-1 font-medium text-black dark:text-white text-lg">
				{{ toast.title }}
			</ToastTitle>
			<ToastDescription as-child>
				<Text class="[grid-area:_description] m-0 text-md leading-base">
					{{ toast.message }}
				</Text>
			</ToastDescription>
			<ToastClose class="absolute top-1 right-2 p-1 cursor-pointer">
				<CloseIcon class="fill-gray-700 dark:fill-gray-200" />
			</ToastClose>
		</ToastRoot>

		<ToastViewport
			class="fixed top-0 right-0 flex flex-col p-4 gap-2 w-[390px] max-w-[100vw] m-0 list-none z-[10000] outline-none" />
	</ToastProvider>
</template>
<script setup lang="ts">
import { tv } from 'tailwind-variants';
import {
	ToastProvider,
	ToastViewport,
	ToastTitle,
	ToastDescription,
	ToastClose,
	ToastRoot
} from 'radix-vue';

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
