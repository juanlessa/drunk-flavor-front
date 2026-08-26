<template>
	<AlertDialog.Root :open="_isOpen" @update:open="handleUpdateIsOpen">
		<AlertDialog.Portal>
			<AlertDialog.Overlay
				class="bg-black opacity-70 data-[state=open]:animate-overlayShow fixed inset-0 z-30" />
			<AlertDialog.Content
				class="p-6 z-100 flex flex-col gap-8 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-white dark:bg-gray-900 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-hidden">
				<div class="flex flex-col">
					<AlertDialog.Title as-child>
						<Heading type="h2" size="sm">
							<slot name="title">{{ props.title }}</slot>
						</Heading>
					</AlertDialog.Title>
					<AlertDialog.Description as-child>
						<Text size="md">
							<slot name="description">{{ props.description }}</slot>
						</Text>
					</AlertDialog.Description>
				</div>
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
