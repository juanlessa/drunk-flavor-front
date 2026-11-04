<template>
	<div class="flex flex-col gap-6">
		<AuthPageHeader
			:title="$t('organisms.completeProfileForm.title')"
			:description="$t('organisms.completeProfileForm.description')" />
		<form class="flex flex-col gap-6" novalidate @submit.prevent="handleSubmitButton">
			<!-- Name and surname share a row from tablet up. -->
			<div class="grid grid-cols-1 gap-4 tablet:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
				<InputWrapper>
					<template #label>
						<Label for="name">
							{{ $t('organisms.completeProfileForm.nameInput.label') }}
						</Label>
					</template>
					<InputText
						id="name"
						v-model="formState.form.name"
						name="name"
						placeholder=""
						:has-error="!!checkError('name')"
						@blur="validateForm" />
					<template #error>
						<ErrorMessage :value="checkError('name')" />
					</template>
				</InputWrapper>
				<InputWrapper>
					<template #label>
						<Label for="surname">
							{{ $t('organisms.completeProfileForm.surnameInput.label') }}
						</Label>
					</template>
					<InputText
						id="surname"
						v-model="formState.form.surname"
						name="surname"
						placeholder=""
						:has-error="!!checkError('surname')"
						@blur="validateForm" />
					<template #error>
						<ErrorMessage :value="checkError('surname')" />
					</template>
				</InputWrapper>
			</div>
			<Button type="submit" class="max-w-none!" :disabled="isSubmitting">
				{{ $t('organisms.completeProfileForm.submitButton.value') }}
			</Button>
		</form>
		<AuthPrompt :message="$t('organisms.completeProfileForm.signoutPrompt.message')">
			<button
				type="button"
				:class="AUTH_PROMPT_ACTION_CLASS"
				:disabled="isSubmitting"
				@click="handleSignout">
				{{ $t('organisms.completeProfileForm.signoutPrompt.link') }}
			</button>
		</AuthPrompt>
	</div>
</template>

<script setup lang="ts">
import { AUTH_PROMPT_ACTION_CLASS } from '~/components/organisms/auth/prompt/AuthPrompt.constants';

const { $api, $auth, $router } = useNuxtApp();
const { t } = useI18n();
const { addToast } = useToast();
const localePath = useLocalePath();
const { formState, checkError, validateForm } = useCompleteProfileForm();

const isSubmitting = ref(false);

const handleSubmitButton = async () => {
	formState.value.displayErrors = true;
	validateForm();

	if (formState.value.errors.length !== 0 || isSubmitting.value) {
		return;
	}

	isSubmitting.value = true;
	try {
		await $api.profile.update(formState.value.form);
		await $auth.authenticate();
		$router.push(localePath('/'));
	} catch (error) {
		console.error(error);
		addToast({
			type: 'error',
			title: t('organisms.completeProfileForm.error.title'),
			message: t('organisms.completeProfileForm.error.message')
		});
	} finally {
		isSubmitting.value = false;
	}
};

const handleSignout = async () => {
	try {
		await $auth.signout();
	} catch (error) {
		console.error(error);
	}
	$router.push(localePath('/signin'));
};
</script>
