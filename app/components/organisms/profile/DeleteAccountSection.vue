<template>
	<ProfileSection
		tone="danger"
		:title="$t('organisms.profile.deletion.title')"
		:description="$t('organisms.profile.deletion.description')">
		<template #icon><TrashIcon /></template>
		<template #action>
			<Button
				variant="outline"
				class="border-danger-stroke text-danger"
				:disabled="isDeleting"
				@click="isOpen = true">
				{{ $t('organisms.profile.deletion.openButton') }}
			</Button>
		</template>
	</ProfileSection>

	<DeleteModal
		v-model:open="isOpen"
		:title="$t('organisms.profile.deletion.dialogTitle')"
		:description="$t('organisms.profile.deletion.dialogDescription')"
		@delete="handleDelete" />

	<ReauthenticationDialog
		:open="requiresReauthentication"
		@reauthenticated="handleReauthenticated"
		@cancel="cancelReauthentication" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import TrashIcon from '~/components/icons/TrashIcon.vue';

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
const isOpen = ref(false);
const isDeleting = ref(false);

const deleteAccount = async () => {
	await $api.profile.delete();
	$auth.clear();
	await navigateTo(localePath('/'));
};

const submit = async (execute: () => Promise<void>) => {
	if (isDeleting.value) return;
	isDeleting.value = true;
	try {
		await execute();
	} catch (error) {
		console.error(error);
		isOpen.value = true;
		addToast({
			type: 'error',
			title: t('organisms.profile.toast.errorTitle'),
			message: t('organisms.profile.deletion.errorMessage')
		});
	} finally {
		isDeleting.value = false;
	}
};

const handleDelete = () => submit(() => run(deleteAccount));
const handleReauthenticated = () => submit(confirm);
</script>
