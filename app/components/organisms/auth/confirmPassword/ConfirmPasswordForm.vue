<template>
	<Form :title="$t('organisms.confirmPasswordForm.title')" @submit="handleSubmitButton">
		<InputWrapper>
			<template #label>
				<Label for="password">
					{{ $t('organisms.confirmPasswordForm.passwordInput.label') }}
				</Label>
			</template>
			<InputPassword
				id="password"
				v-model="formState.form.password"
				name="password"
				placeholder=""
				:has-error="!!checkError('password')"
				:error-message="checkError('password')"
				@focus="isPasswordActive = true"
				@blur="handlePasswordBlur" />
		</InputWrapper>
		<InputWrapper>
			<template #label>
				<Label for="confirmPassword">
					{{ $t('organisms.confirmPasswordForm.confirmPasswordInput.label') }}
				</Label>
			</template>
			<InputPassword
				id="confirmPassword"
				v-model="formState.form.confirmPassword"
				name="confirmPassword"
				placeholder=""
				:has-error="!!checkError('confirmPassword')"
				:error-message="checkError('confirmPassword')"
				@blur="validateForm" />
		</InputWrapper>
		<PasswordStrength
			:password="formState.form.password"
			:confirm-password="formState.form.confirmPassword"
			:active="isPasswordActive" />
		<template #buttons>
			<Box direction="col" class="gap-6">
				<ButtonGroup direction="column" :has-cancel-button="false">
					<Button variant="primary" type="submit">
						{{ $t('organisms.confirmPasswordForm.submitButton.value') }}
					</Button>
				</ButtonGroup>
				<Box direction="row" class="gap-1 justify-center items-center">
					<Text as="span" class="text-content-subtle">
						{{ $t('organisms.confirmPasswordForm.backToSignin.message') }}
					</Text>
					<Anchor :to="localePath('/signin')" @click="resetFormState">
						{{ $t('organisms.confirmPasswordForm.backToSignin.link') }}
					</Anchor>
				</Box>
			</Box>
		</template>
	</Form>
</template>

<script setup lang="ts">
const { $api, $router } = useNuxtApp();
const { addToast } = useToast();
const localePath = useLocalePath();
const route = useRoute('confirm-password-token');
const { t } = useI18n();
const { formState, resetFormState, checkError, validateForm } = useConfirmPasswordForm();

const isPasswordActive = ref(false);

const handlePasswordBlur = () => {
	isPasswordActive.value = false;
	validateForm();
};

const handleSubmitButton = async () => {
	formState.value.displayErrors = true;
	validateForm();
	if (formState.value.errors.length !== 0) {
		return;
	}

	try {
		await $api.auth.confirmPassword({
			token: String(route.params.token),
			password: formState.value.form.password,
			confirmPassword: formState.value.form.confirmPassword
		});
		resetFormState();
		addToast({
			type: 'success',
			title: t('organisms.confirmPasswordForm.toast.successTitle'),
			message: t('organisms.confirmPasswordForm.toast.successMessage')
		});
		$router.push(localePath('/signin'));
	} catch (error) {
		console.error(error);
		addToast({
			type: 'error',
			title: t('organisms.confirmPasswordForm.toast.errorTitle'),
			message: t('organisms.confirmPasswordForm.toast.errorMessage')
		});
	}
};
</script>
