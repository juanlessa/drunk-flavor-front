<template>
	<!--
		Non-modal dialog: the top bar (and this toggle) stays usable while the panel is open, and
		Radix keeps a click on the trigger from counting as an outside click. The panel fills the
		viewport from the bottom edge of the bar that holds the trigger down to the screen bottom.
	-->
	<Dialog.Root v-model:open="isOpen" :modal="false">
		<Dialog.Trigger
			ref="triggerRef"
			class="size-11 shrink-0 inline-flex items-center justify-center rounded-full text-content cursor-pointer hover:bg-surface-hover focus-visible:outline-hidden focus-visible:shadow-focus-ring"
			:aria-label="isOpen ? props.closeLabel : props.openLabel">
			<component :is="isOpen ? CloseIcon : MenuIcon" class="size-5!" aria-hidden="true" />
		</Dialog.Trigger>
		<Dialog.Portal>
			<Dialog.Content
				class="fixed inset-x-0 bottom-0 z-overlay overflow-y-auto overscroll-contain border-t border-stroke-muted bg-surface-chrome data-[state=open]:animate-overlay-enter focus-visible:outline-hidden"
				:style="{ top: `${panelTop}px` }"
				:aria-describedby="undefined"
				@open-auto-focus.prevent>
				<Dialog.Title class="sr-only">{{ props.title }}</Dialog.Title>
				<slot></slot>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
</template>
<script setup lang="ts">
import { Dialog } from 'radix-vue/namespaced';
import MenuIcon from '~/components/icons/MenuIcon.vue';
import CloseIcon from '~/components/icons/CloseIcon.vue';

/** Mobile bar height, used until the real bar edge is measured. */
const DEFAULT_PANEL_TOP_PX = 56;

const props = defineProps({
	/** Accessible name of the panel. */
	title: { type: String, required: true },
	openLabel: { type: String, required: true },
	closeLabel: { type: String, required: true }
});

const isOpen = defineModel<boolean>('open', { default: false });
const triggerRef = ref<{ $el: HTMLElement } | null>(null);
const panelTop = ref(DEFAULT_PANEL_TOP_PX);

// Measured on open so the panel meets the bar even when the page is scrolled a little.
watch(isOpen, (open) => {
	const bar = triggerRef.value?.$el?.closest('header');
	if (open && bar) panelTop.value = Math.max(0, bar.getBoundingClientRect().bottom);
});
</script>
