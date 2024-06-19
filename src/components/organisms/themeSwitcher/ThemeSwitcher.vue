<template>
	<div class="bg-gray-200 dark:bg-gray-800 w-16 h-8 rounded-full">
		<ClientOnly>
			<Switch.Root
				id="themeMode"
				class="size-full rounded-full px-1 focus-within:outline focus-within:outline-black dark:focus-within:outline-white flex shadow-sm relative cursor-default"
				:checked="_isDark"
				@update:checked="handleToggleTheme">
				<Switch.Thumb
					class="block size-6 my-auto bg-white dark:bg-gray-900 shadow-sm rounded-full transition-transform duration-500 will-change-transform data-[state=checked]:translate-x-8">
					<div class="w-full h-full flex justify-center items-center">
						<component
							:is="$theme.isDark.value ? MoonIcon : SunIcon"
							:class="[
								{ 'animate-[spin_0.5s_linear_infinite]': isAnimated },
								'size-4 fill-blue-700'
							]" />
					</div>
				</Switch.Thumb>
			</Switch.Root>
		</ClientOnly>
	</div>
</template>
<script setup lang="ts">
import { Switch } from 'radix-vue/namespaced';
import SunIcon from '~/components/icons/SunIcon.vue';
import MoonIcon from '~/components/icons/MoonIcon.vue';

const { $theme } = useNuxtApp();

const _isDark = ref($theme.isDark.value);
const isAnimated = ref<boolean>(false);

const handleToggleTheme = (value: boolean) => {
	isAnimated.value = true;
	$theme.toggle();
	_isDark.value = value;
	setTimeout(() => {
		isAnimated.value = false;
	}, 500);
};
</script>
<style scoped></style>
