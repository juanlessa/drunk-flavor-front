<template>
	<div class="flex flex-col gap-6">
		<template v-if="isInvalid">
			<AuthPageHeader
				tone="danger"
				:title="$t('organisms.ownershipTransfer.acceptance.invalidTitle')"
				:description="$t('organisms.ownershipTransfer.acceptance.invalidMessage')">
				<template #icon><ClockIcon /></template>
			</AuthPageHeader>
			<Anchor :to="localePath('/')" :class="['self-center', AUTH_PROMPT_ACTION_CLASS]">
				{{ $t('organisms.ownershipTransfer.acceptance.homeLink') }}
			</Anchor>
		</template>

		<template v-else>
			<AuthPageHeader
				:title="$t('organisms.ownershipTransfer.acceptance.title')"
				:description="$t('organisms.ownershipTransfer.acceptance.invitedMessage')">
				<template #icon><CrownIcon /></template>
			</AuthPageHeader>
			<section
				class="w-full flex flex-col gap-2 rounded-card bg-surface-sunken p-4 text-left"
				:aria-labelledby="changesId">
				<h2
					:id="changesId"
					class="text-caption font-bold uppercase tracking-wide text-content-muted">
					{{ $t('organisms.ownershipTransfer.acceptance.changesTitle') }}
				</h2>
				<ul class="flex flex-col gap-1.5">
					<li
						v-for="change in CHANGES"
						:key="change"
						class="flex items-baseline gap-2.5 text-body-sm text-content-secondary">
						<span
							class="size-1.5 shrink-0 translate-y-[-0.15em] rounded-full bg-accent"
							aria-hidden="true"></span>
						{{ $t(`organisms.ownershipTransfer.acceptance.changes.${change}`) }}
					</li>
				</ul>
			</section>
			<div class="flex flex-col items-center gap-2">
				<Button
					variant="primary"
					class="max-w-none!"
					data-testid="accept-ownership-button"
					:disabled="isSubmitting"
					@click="handleAccept">
					{{ $t('organisms.ownershipTransfer.acceptance.confirmButton') }}
				</Button>
				<Text class="text-center text-caption text-content-muted">
					{{ $t('organisms.ownershipTransfer.acceptance.reauthenticationHint') }}
				</Text>
			</div>
		</template>

		<ReauthenticationDialog
			:open="requiresReauthentication"
			@reauthenticated="handleReauthenticated"
			@cancel="cancelReauthentication" />
	</div>
</template>

<script setup lang="ts">
import { useId } from 'vue';
import ClockIcon from '~/components/icons/ClockIcon.vue';
import CrownIcon from '~/components/icons/CrownIcon.vue';
import { AUTH_PROMPT_ACTION_CLASS } from '~/components/organisms/auth/prompt/AuthPrompt.constants';
import { ApiErrorCodes } from '~/domain/shared/api.constants';
import { readApiErrorCode } from '~/domain/shared/api.helpers';

/** What accepting changes, in display order (keys under `acceptance.changes`). */
const CHANGES = ['newOwner', 'previousOwner', 'signInAgain'] as const;
const changesId = useId();

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
