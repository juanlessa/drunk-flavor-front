<template>
	<Popover.Root v-model:open="_isOpen">
		<Popover.Trigger
			class="rounded-full size-8 inline-flex items-center justify-center hover:bg-surface-hover focus-visible:shadow-focus-ring focus-visible:outline-hidden cursor-default"
			aria-label="menu">
			<component :is="_isOpen ? CloseIcon : MenuIcon" />
		</Popover.Trigger>
		<Popover.Portal>
			<Popover.Content
				:align="'end'"
				:align-offset="16"
				side="bottom"
				:trap-focus="true"
				:side-offset="24"
				class="absolute right-[-2rem] w-screen bg-surface shadow-card will-change-[transform,opacity]">
				<slot></slot>
			</Popover.Content>
		</Popover.Portal>
	</Popover.Root>
</template>
<script setup lang="ts">
import { Popover } from 'radix-vue/namespaced';
import MenuIcon from '~/components/icons/MenuIcon.vue';
import CloseIcon from '~/components/icons/CloseIcon.vue';

const _isOpen = ref(false);
</script>
