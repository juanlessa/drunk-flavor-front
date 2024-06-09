<template>
	<PopoverRoot v-model:open="_isOpen">
		<PopoverTrigger
			class="rounded-full size-8 inline-flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-800 focus:shadow-[0_0_0_2px] focus:shadow-black dark:focus:shadow-white cursor-default outline-none"
			aria-label="menu">
			<component :is="_isOpen ? CloseIcon : MenuIcon" />
		</PopoverTrigger>
		<PopoverPortal>
			<PopoverContent
				:align="'end'"
				:align-offset="16"
				side="bottom"
				:trap-focus="true"
				:side-offset="24"
				class="absolute right-[-2rem] w-screen bg-white dark:bg-gray-900 shadow-light-card dark:shadow-dark-card will-change-[transform,opacity]">
				<slot></slot>
			</PopoverContent>
		</PopoverPortal>
	</PopoverRoot>
</template>
<script setup lang="ts">
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'radix-vue';
import MenuIcon from '~/components/icons/MenuIcon.vue';
import CloseIcon from '~/components/icons/CloseIcon.vue';

const _isOpen = ref(false);
</script>
