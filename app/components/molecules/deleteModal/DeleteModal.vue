<template>
	<AlertDialog.Root :open="_isOpen" @update:open="handleUpdateIsOpen">
		<AlertDialog.Portal>
			<AlertDialog.Overlay
				class="bg-surface-scrim data-[state=open]:animate-overlay-enter fixed inset-0 z-overlay" />
			<AlertDialog.Content
				class="p-6 z-modal flex flex-col gap-8 data-[state=open]:animate-dialog-enter fixed dialog-envelope rounded-overlay bg-surface-elevated border border-stroke shadow-overlay focus-visible:outline-hidden focus-visible:shadow-focus-ring">
				<Box direction="col">
					<AlertDialog.Title as-child>
						<Heading as="h2" class="text-title-sm">
							<slot name="title">{{ props.title }}</slot>
						</Heading>
					</AlertDialog.Title>
					<AlertDialog.Description as-child>
						<Text class="text-content-secondary">
							<slot name="description">{{ props.description }}</slot>
						</Text>
					</AlertDialog.Description>
				</Box>
				<ButtonGroup>
					<AlertDialog.Cancel as-child @click="handleCancel">
						<Button variant="secondary">
							{{ $t('molecules.deleteModal.cancelButton.value') }}
						</Button>
					</AlertDialog.Cancel>
					<AlertDialog.Action as-child @click="handleDelete">
						<Button variant="delete">
							{{ $t('molecules.deleteModal.deleteButton.value') }}
						</Button>
					</AlertDialog.Action>
				</ButtonGroup>
			</AlertDialog.Content>
		</AlertDialog.Portal>
	</AlertDialog.Root>
</template>
<script setup lang="ts">
import { AlertDialog } from 'radix-vue/namespaced';

const props = defineProps({
	open: { type: Boolean, default: false },
	title: { type: String, default: '' },
	description: { type: String, default: '' }
});
const emit = defineEmits<{
	(e: 'update:open', value: boolean): void;
	(e: 'delete' | 'cancel'): void;
}>();

const _isOpen = ref(props.open);

const handleUpdateIsOpen = (value: boolean) => {
	_isOpen.value = value;
	emit('update:open', value);
};
const handleCancel = () => {
	emit('cancel');
};
const handleDelete = () => {
	emit('delete');
};

watch(
	() => props.open,
	(newValue) => (_isOpen.value = newValue)
);
</script>
