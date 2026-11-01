<template>
	<Box direction="col" class="gap-6 items-center text-center">
		<Heading as="h1" :value="$t('organisms.ownershipTransfer.acceptance.title')" />

		<template v-if="isInvalid">
			<Text
				:value="$t('organisms.ownershipTransfer.acceptance.invalidMessage')"
				class="text-content-subtle" />
			<Anchor :to="localePath('/')">
				{{ $t('organisms.ownershipTransfer.acceptance.homeLink') }}
			</Anchor>
		</template>

		<template v-else>
			<Text
				:value="$t('organisms.ownershipTransfer.acceptance.description')"
				class="text-content-subtle" />
			<Button
				variant="primary"
				data-testid="accept-ownership-button"
				:disabled="isSubmitting"
				@click="handleAccept">
				{{ $t('organisms.ownershipTransfer.acceptance.confirmButton') }}
			</Button>
		</template>

		<ReauthenticationDialog
			:open="requiresReauthentication"
			@reauthenticated="handleReauthenticated"
			@cancel="cancelReauthentication" />
	</Box>
</template>

<script setup lang="ts">
import { ApiErrorCodes } from '~/domain/shared/api.constants';
import { readApiErrorCode } from '~/domain/shared/api.helpers';

// Responses meaning this invitation cannot be accepted: invalid, expired, meant for another account,
// already consumed, or a target that is no longer eligible.
const REJECTED_INVITATION_CODES: string[] = [
	ApiErrorCodes.badRequest,
	ApiErrorCodes.validationFailed,
	ApiErrorCodes.notFound,
	ApiErrorCodes.conflict
];

const props = defineProps({
	token: { type: String, required: true }
});

const { $api, $auth } = useNuxtApp();
const { t } = useI18n();
const { addToast } = useToast();
const localePath = useLocalePath();
const {
	isRequired: requiresReauthentication,
	run,
	confirm,
	cancel: cancelReauthentication
} = useReauthentication();

const isSubmitting = ref(false);
const isInvalid = ref(false);

// The backend signs out both participants after the transfer, so the new owner signs in again.
const acceptOwnership = async () => {
	await $api.ownershipTransfer.accept({ token: props.token });
	$auth.clear();
	addToast({
		type: 'success',
		title: t('organisms.ownershipTransfer.toast.successTitle'),
		message: t('organisms.ownershipTransfer.acceptance.successMessage')
	});
	await navigateTo(localePath('/signin'));
};

const submit = async (execute: () => Promise<void>) => {
	if (isSubmitting.value) return;
	isSubmitting.value = true;
	try {
		await execute();
	} catch (error) {
		console.error(error);
		const code = readApiErrorCode(error);
		if (code && REJECTED_INVITATION_CODES.includes(code)) {
			isInvalid.value = true;
			return;
		}
		addToast({
			type: 'error',
			title: t('organisms.ownershipTransfer.toast.errorTitle'),
			message: t('organisms.ownershipTransfer.acceptance.errorMessage')
		});
	} finally {
		isSubmitting.value = false;
	}
};

const handleAccept = () => submit(() => run(acceptOwnership));
const handleReauthenticated = () => submit(confirm);
</script>
