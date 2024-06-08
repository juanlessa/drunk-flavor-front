<template>
	<div
		class="bg-gray-200 dark:bg-gray-800 w-16 h-8 rounded-full px-1 relative flex items-center cursor-pointer"
		@click="handleToggleTheme">
		<ClientOnly>
			<div
				class="w-6 h-6 rounded-full absolute transition-[transform_0.3s_ease] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.2)] dark:bg-black dark:translate-x-8 dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
				<div class="w-full h-full flex justify-center items-center">
					<component
						:is="$theme.get() === 'dark' ? MoonIcon : SunIcon"
						:class="[
							{ 'animate-[spin_0.5s_linear_infinite]': isAnimated },
							'size-4 fill-blue-700'
						]" />
				</div>
			</div>
		</ClientOnly>
	</div>
</template>
<script setup lang="ts">
import SunIcon from '~/components/icons/SunIcon.vue';
import MoonIcon from '~/components/icons/MoonIcon.vue';

const { $theme } = useNuxtApp();

const isAnimated = ref<boolean>(false);

const handleToggleTheme = () => {
	isAnimated.value = true;
	$theme.toggle();
	setTimeout(() => {
		isAnimated.value = false;
	}, 500);
};
</script>
<style scoped></style>
