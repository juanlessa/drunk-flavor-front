<template>
	<div class="bg-surface-input border border-stroke-input w-16 h-8 rounded-full">
		<ClientOnly>
			<Switch.Root
				id="themeMode"
				class="size-full rounded-full px-1 focus-within:outline focus-within:outline-focus-ring flex shadow-switch-track relative cursor-default"
				:checked="$theme.isDark.value"
				@update:checked="handleToggleTheme">
				<Switch.Thumb
					class="block size-6 my-auto bg-surface shadow-switch-thumb rounded-full transition-transform duration-short ease-move will-change-transform data-[state=checked]:translate-x-8"
					@animationend="handleThemeIconAnimation"
					@animationcancel="handleThemeIconAnimation">
					<Box direction="row" class="w-full h-full justify-center items-center">
						<component
							:is="$theme.isDark.value ? MoonIcon : SunIcon"
							:class="[
								{ 'animate-theme-icon': isAnimated },
								'size-4 text-accent-content'
							]" />
					</Box>
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

const isAnimated = ref(false);

const handleToggleTheme = (value: boolean) => {
	isAnimated.value = true;
	$theme.isDark.value = value;
};

const handleThemeIconAnimation = (event: AnimationEvent) => {
	if (event.animationName === 'theme-icon-spin') {
		isAnimated.value = false;
	}
};
</script>
<style scoped></style>
