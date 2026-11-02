<template>
	<Dialog.Root v-model:open="isOpen">
		<Dialog.Portal>
			<Dialog.Overlay
				class="fixed inset-0 z-overlay bg-surface-scrim data-[state=open]:animate-overlay-enter" />
			<Dialog.Content
				class="dialog-envelope fixed z-modal overflow-y-auto rounded-overlay border border-stroke bg-surface-elevated p-6 shadow-overlay focus-visible:outline-hidden focus-visible:shadow-focus-ring data-[state=open]:animate-dialog-enter">
				<form class="flex flex-col gap-6" novalidate @submit.prevent="handleSubmit">
					<div>
						<Dialog.Title as-child
							><Heading as="h2" size="titleSm">{{
								$t('organisms.userAdministration.roleDialog.title')
							}}</Heading></Dialog.Title
						>
						<Dialog.Description as-child
							><Text class="mt-1 text-body-sm text-content-muted">{{
								$t('organisms.userAdministration.roleDialog.description')
							}}</Text></Dialog.Description
						>
					</div>

					<InputWrapper>
						<template #label
							><Label for="user-administration-role">{{
								$t('organisms.userAdministration.roleDialog.roleLabel')
							}}</Label></template
						>
						<InputSelect
							id="user-administration-role"
							name="role"
							:model-value="form.role"
							:options="roleOptions"
							:placeholder="
								$t('organisms.userAdministration.roleDialog.rolePlaceholder')
							"
							:has-error="!!checkError('role')"
							@update:model-value="handleRoleUpdate"
							@blur="validate" />
						<template #error><ErrorMessage :value="checkError('role')" /></template>
					</InputWrapper>

					<ButtonGroup>
						<Dialog.Close as-child
							><Button variant="secondary" :disabled="isSubmitting">{{
								$t('organisms.userAdministration.roleDialog.cancelButton')
							}}</Button></Dialog.Close
						>
						<Button type="submit" :disabled="isSubmitting">{{
							$t('organisms.userAdministration.roleDialog.confirmButton')
						}}</Button>
					</ButtonGroup>
				</form>

				<ReauthenticationDialog
					:open="requiresReauthentication"
					@reauthenticated="handleReauthenticated"
					@cancel="cancelReauthentication" />
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
</template>

<script setup lang="ts">
import { Dialog } from 'radix-vue/namespaced';
import type { InputSelectOption } from '~/components/atoms/inputSelect/InputSelect.types';
import type { NonOwnerRole } from '~/domain/user/user.types';
import { checkFieldError } from '~/helpers/checkFieldError';
import type { FieldError } from '~/types/form.types';
import type { ChangeUserRoleForm } from '~/types/user.types';
import { changeUserRoleFormValidator } from '~/validations/user';

const props = defineProps({
	userId: { type: String, required: true },
	/** Roles the backend allows for this actor and target; the current role is never included. */
	roleTransitions: { type: Array as PropType<NonOwnerRole[]>, required: true }
});
const emit = defineEmits<{
	(e: 'completed'): void;
}>();
const isOpen = defineModel<boolean>('open', { default: false });

const { $api } = useNuxtApp();
const { t } = useI18n();
const { addToast } = useToast();
const {
	isRequired: requiresReauthentication,
	run,
	confirm,
	cancel: cancelReauthentication
} = useReauthentication();

const form = reactive<ChangeUserRoleForm>({ role: '' });
// Errors only show after the first submit attempt, then follow every change.
const errors = ref<FieldError[]>([]);
const displayErrors = ref(false);
const isSubmitting = ref(false);

const roleOptions = computed<InputSelectOption[]>(() =>
	props.roleTransitions.map((role) => ({ label: t(`users.roles.${role}`), value: role }))
);

const isAllowedRole = (value: string): value is NonOwnerRole =>
	(props.roleTransitions as string[]).includes(value);

const handleRoleUpdate = (value: string) => {
	if (isAllowedRole(value)) form.role = value;
};
const validate = () => {
	if (displayErrors.value) errors.value = changeUserRoleFormValidator(form);
};
const checkError = (field: string) => {
	const error = checkFieldError(errors.value, field);
	return error ? t(error) : '';
};
const reset = () => {
	form.role = '';
	errors.value = [];
	displayErrors.value = false;
	cancelReauthentication();
};

const changeRole = async () => {
	if (!form.role) return;
	await $api.users.updateRole({ userId: props.userId, role: form.role });
	reset();
	isOpen.value = false;
	addToast({
		type: 'success',
		title: t('organisms.userAdministration.toast.successTitle'),
		message: t('organisms.userAdministration.roleDialog.successMessage')
	});
	emit('completed');
};

const submit = async (execute: () => Promise<void>) => {
	isSubmitting.value = true;
	try {
		await execute();
	} catch (error) {
		console.error(error);
		addToast({
			type: 'error',
			title: t('organisms.userAdministration.toast.errorTitle'),
			message: t('organisms.userAdministration.roleDialog.errorMessage')
		});
	} finally {
		isSubmitting.value = false;
	}
};

const handleSubmit = async () => {
	displayErrors.value = true;
	errors.value = changeUserRoleFormValidator(form);
	if (errors.value.length || isSubmitting.value) return;
	await submit(() => run(changeRole));
};

const handleReauthenticated = () => submit(confirm);

watch(() => form.role, validate);
watch(isOpen, (open) => {
	if (!open && !isSubmitting.value) reset();
});
</script>
