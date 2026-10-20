<template>
	<Form :title="$t('organisms.resetPasswordForm.title')" @submit="handleSubmitButton">
		<InputWrapper>
			<template #label>
				<Label for="password">
					{{ $t('organisms.resetPasswordForm.passwordInput.label') }}
				</Label>
			</template>
			<InputPassword
				id="password"
				v-model="formState.form.password"
				name="password"
				placeholder=""
				:has-error="!!checkError('password')"
				:error-message="checkError('password')"
				@blur="validateForm" />
			<template #error>
				<ErrorMessage :value="checkError('password')" />
			</template>
		</InputWrapper>
		<InputWrapper>
			<template #label>
				<Label for="confirmPassword">
					{{ $t('organisms.resetPasswordForm.confirmPasswordInput.label') }}
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
			<template #error>
				<ErrorMessage :value="checkError('confirmPassword')" />
			</template>
		</InputWrapper>
		<template #buttons>
			<Box direction="col" class="gap-6">
				<ButtonGroup direction="column" :has-cancel-button="false">
					<Button variant="primary" type="submit">
						{{ $t('organisms.resetPasswordForm.submitButton.value') }}
					</Button>
				</ButtonGroup>
				<Box direction="row" class="gap-1 justify-center items-center">
					<Text as="span" class="text-content-subtle">
						{{ $t('organisms.resetPasswordForm.backToSignin.message') }}
					</Text>
					<Anchor :to="localePath('/signin')">
						{{ $t('organisms.resetPasswordForm.backToSignin.link') }}
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
const route = useRoute('reset-password-token');
const { t } = useI18n();
const { formState, resetFormState, checkError, validateForm } = useResetPasswordForm();

const handleSubmitButton = async () => {
	formState.value.displayErrors = true;
	validateForm();
	if (formState.value.errors.length !== 0) {
		return;
	}

	try {
		await $api.auth.resetPassword({
			token: String(route.params.token),
			password: formState.value.form.password,
			confirmPassword: formState.value.form.confirmPassword
		});
		resetFormState();
		addToast({
			type: 'success',
			title: t('organisms.resetPasswordForm.toast.successTitle'),
			message: t('organisms.resetPasswordForm.toast.successMessage')
		});
		$router.push(localePath('/signin'));
	} catch (error) {
		console.error(error);
		addToast({
			type: 'error',
			title: t('organisms.resetPasswordForm.toast.errorTitle'),
			message: t('organisms.resetPasswordForm.toast.errorMessage')
		});
	}
};
</script>
