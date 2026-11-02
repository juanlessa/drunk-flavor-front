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
								$t(`${textKey}.title`)
							}}</Heading></Dialog.Title
						>
						<Dialog.Description as-child
							><Text class="mt-1 text-body-sm text-content-muted">{{
								$t(`${textKey}.description`)
							}}</Text></Dialog.Description
						>
					</div>

					<InputWrapper>
						<template #label
							><Label for="user-administration-reason">{{
								$t('organisms.userAdministration.reasonDialog.reasonLabel')
							}}</Label></template
						>
						<InputTextArea
							id="user-administration-reason"
							v-model="form.reason"
							name="reason"
							:rows="4"
							:has-error="!!checkError('reason')"
							@blur="validate" />
						<template #error><ErrorMessage :value="checkError('reason')" /></template>
					</InputWrapper>
					<Text class="-mt-4 text-body-sm text-content-muted">
						{{ $t('organisms.userAdministration.reasonDialog.reasonHelp') }}
					</Text>

					<ButtonGroup>
						<Dialog.Close as-child
							><Button variant="secondary" :disabled="isSubmitting">{{
								$t('organisms.userAdministration.reasonDialog.cancelButton')
							}}</Button></Dialog.Close
						>
						<Button
							type="submit"
							:variant="isDestructive ? 'delete' : 'primary'"
							:disabled="isSubmitting"
							>{{ $t(`${textKey}.confirmButton`) }}</Button
						>
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
import { checkFieldError } from '~/helpers/checkFieldError';
import type { UserAdministrationReason } from '~/domain/user/user.dtos';
import type { FieldError } from '~/types/form.types';
import type { UserReasonAction } from '~/types/user.types';
import { userAdministrationReasonFormValidator } from '~/validations/user';

const DESTRUCTIVE_ACTIONS: UserReasonAction[] = ['suspend', 'close'];

const props = defineProps({
	userId: { type: String, required: true },
	action: { type: String as PropType<UserReasonAction>, required: true }
});
const emit = defineEmits<{
	(e: 'completed', action: UserReasonAction): void;
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

const form = reactive({ reason: '' });
// Errors only show after the first submit attempt, then follow every change.
const errors = ref<FieldError[]>([]);
const displayErrors = ref(false);
const isSubmitting = ref(false);

const textKey = computed(() => `organisms.userAdministration.reasonDialog.${props.action}`);
const isDestructive = computed(() => DESTRUCTIVE_ACTIONS.includes(props.action));

const requests: Record<UserReasonAction, (body: UserAdministrationReason) => Promise<unknown>> = {
	suspend: (body) => $api.users.suspend(props.userId, body),
	reactivate: (body) => $api.users.reactivate(props.userId, body),
	close: (body) => $api.users.close(props.userId, body),
	revokeSessions: (body) => $api.users.revokeSessions(props.userId, body)
};

const validate = () => {
	if (displayErrors.value) errors.value = userAdministrationReasonFormValidator(form);
};
const checkError = (field: string) => {
	const error = checkFieldError(errors.value, field);
	return error ? t(error) : '';
};
const reset = () => {
	form.reason = '';
	errors.value = [];
	displayErrors.value = false;
	cancelReauthentication();
};

const performAction = async () => {
	const action = props.action;
	await requests[action]({ reason: form.reason.trim() });
	reset();
	isOpen.value = false;
	addToast({
		type: 'success',
		title: t('organisms.userAdministration.toast.successTitle'),
		message: t(`organisms.userAdministration.reasonDialog.${action}.successMessage`)
	});
	emit('completed', action);
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
			message: t(`${textKey.value}.errorMessage`)
		});
	} finally {
		isSubmitting.value = false;
	}
};

const handleSubmit = async () => {
	displayErrors.value = true;
	errors.value = userAdministrationReasonFormValidator(form);
	if (errors.value.length || isSubmitting.value) return;
	await submit(() => run(performAction));
};

const handleReauthenticated = () => submit(confirm);

watch(() => form.reason, validate);
watch(isOpen, (open) => {
	if (!open && !isSubmitting.value) reset();
});
</script>
