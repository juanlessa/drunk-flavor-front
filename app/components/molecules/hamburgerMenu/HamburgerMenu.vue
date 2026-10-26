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
				:align-offset="FLOATING_POSITION_PX.mobileMenuAlignOffset"
				side="bottom"
				:trap-focus="true"
				:side-offset="FLOATING_POSITION_PX.mobileMenuSideOffset"
				class="absolute mobile-menu-envelope bg-surface-overlay border border-stroke shadow-overlay will-change-[transform,opacity]">
				<slot></slot>
			</Popover.Content>
		</Popover.Portal>
	</Popover.Root>
</template>
<script setup lang="ts">
import { Popover } from 'radix-vue/namespaced';
import { FLOATING_POSITION_PX } from '~/constants/floatingPosition.constants';
import MenuIcon from '~/components/icons/MenuIcon.vue';
import CloseIcon from '~/components/icons/CloseIcon.vue';

const _isOpen = ref(false);
</script>
