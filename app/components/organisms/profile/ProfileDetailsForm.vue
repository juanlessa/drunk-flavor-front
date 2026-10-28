<template>
	<form novalidate @submit.prevent="handleSubmit">
		<ProfileSection
			:title="$t('organisms.profile.details.title')"
			:description="$t('organisms.profile.details.description')">
			<div
				class="grid grid-cols-1 gap-6 tablet:grid-cols-[auto_minmax(0,1fr)] tablet:items-start">
				<div class="flex flex-col gap-2">
					<AvatarInput
						id="profile-avatar"
						v-model="avatarFile"
						:src="props.profile.avatarUrl"
						:alt="$t('organisms.profile.avatar.alt')"
						:button-label="$t('organisms.profile.avatar.changeButton')"
						:help-text="$t('organisms.profile.avatar.help')"
						:disabled="isSubmitting"
						@invalid="handleInvalidAvatar" />
					<ErrorMessage :value="avatarError" />
				</div>

				<div class="flex flex-col gap-6">
					<div class="grid grid-cols-1 tablet:grid-cols-2 gap-4">
						<InputWrapper>
							<template #label>
								<Label for="profile-name">{{
									$t('organisms.profile.details.name')
								}}</Label>
							</template>
							<InputText
								id="profile-name"
								v-model="form.name"
								name="name"
								:disabled="isSubmitting"
								:has-error="!!checkError('name')"
								@blur="validate" />
							<template #error><ErrorMessage :value="checkError('name')" /></template>
						</InputWrapper>

						<InputWrapper>
							<template #label>
								<Label for="profile-surname">{{
									$t('organisms.profile.details.surname')
								}}</Label>
							</template>
							<InputText
								id="profile-surname"
								v-model="form.surname"
								name="surname"
								:disabled="isSubmitting"
								:has-error="!!checkError('surname')"
								@blur="validate" />
							<template #error
								><ErrorMessage :value="checkError('surname')"
							/></template>
						</InputWrapper>

						<InputWrapper class="tablet:col-span-2">
							<template #label>
								<Label for="profile-email">{{
									$t('organisms.profile.details.email')
								}}</Label>
							</template>
							<InputText
								id="profile-email"
								:model-value="props.profile.email"
								name="email"
								:suffix="$t('organisms.profile.details.emailLocked')"
								disabled />
						</InputWrapper>
					</div>

					<div class="flex w-full justify-center tablet:justify-end">
						<div class="flex w-full max-w-80 justify-center tablet:max-w-48">
							<Button type="submit" :disabled="!isDirty || isSubmitting">
								{{ $t('organisms.profile.details.saveButton') }}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</ProfileSection>
	</form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { AvatarInputError } from '~/components/molecules/avatarInput/AvatarInput.vue';
import type { Profile } from '~/domain/profile/profile.entity';
import { checkFieldError } from '~/helpers/checkFieldError';
import { profileDetailsFormValidator } from '~/validations/profile';

const props = defineProps({
	profile: { type: Object as PropType<Profile>, required: true }
});

const { $api, $auth } = useNuxtApp();
const { t } = useI18n();
const { addToast } = useToast();
const form = reactive({ name: props.profile.name ?? '', surname: props.profile.surname ?? '' });
const avatarFile = shallowRef<File>();
const avatarError = ref('');
const errors = ref(profileDetailsFormValidator(form));
const displayErrors = ref(false);
const isSubmitting = ref(false);

const isDirty = computed(
	() =>
		!!avatarFile.value ||
		form.name.trim() !== (props.profile.name ?? '') ||
		form.surname.trim() !== (props.profile.surname ?? '')
);

const validate = () => {
	if (displayErrors.value) errors.value = profileDetailsFormValidator(form);
};

const checkError = (field: string) => {
	const error = checkFieldError(errors.value, field);
	return error ? t(error) : '';
};

const handleInvalidAvatar = (reason: AvatarInputError) => {
	avatarError.value = t(`organisms.profile.avatar.errors.${reason}`);
};

const handleSubmit = async () => {
	displayErrors.value = true;
	errors.value = profileDetailsFormValidator(form);
	if (errors.value.length || !isDirty.value || isSubmitting.value) return;

	isSubmitting.value = true;
	avatarError.value = '';
	try {
		if (
			form.name.trim() !== props.profile.name ||
			form.surname.trim() !== props.profile.surname
		) {
			await $api.profile.update({ name: form.name.trim(), surname: form.surname.trim() });
		}
		if (avatarFile.value) await $api.profile.updateAvatar(avatarFile.value);
		await $auth.authenticate();
		avatarFile.value = undefined;
		addToast({
			type: 'success',
			title: t('organisms.profile.toast.successTitle'),
			message: t('organisms.profile.details.successMessage')
		});
	} catch (error) {
		console.error(error);
		addToast({
			type: 'error',
			title: t('organisms.profile.toast.errorTitle'),
			message: t('organisms.profile.details.errorMessage')
		});
	} finally {
		isSubmitting.value = false;
	}
};

watch(
	() => props.profile,
	(profile) => {
		form.name = profile.name ?? '';
		form.surname = profile.surname ?? '';
	},
	{ deep: true }
);
</script>
