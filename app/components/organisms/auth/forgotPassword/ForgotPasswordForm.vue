<template>
	<div class="flex flex-col gap-6">
		<AuthPageHeader
			:title="$t('organisms.forgotPasswordForm.title')"
			:description="$t('organisms.forgotPasswordForm.description')" />
		<form class="flex flex-col gap-6" novalidate @submit.prevent="handleSubmitButton">
			<InputWrapper>
				<template #label>
					<Label for="email">
						{{ $t('organisms.forgotPasswordForm.emailInput.label') }}
					</Label>
				</template>
				<InputText
					id="email"
					v-model="formState.form.email"
					name="email"
					type="email"
					:placeholder="$t('organisms.forgotPasswordForm.emailInput.placeholder')"
					:has-error="!!checkError('email')"
					@blur="validateForm" />
				<template #error>
					<ErrorMessage :value="checkError('email')" />
				</template>
			</InputWrapper>
			<Button type="submit" class="max-w-none!">
				{{ $t('organisms.forgotPasswordForm.submitButton.value') }}
			</Button>
		</form>
		<AuthPrompt
			:message="$t('organisms.forgotPasswordForm.rememberPassword.message')"
			:link-label="$t('organisms.forgotPasswordForm.rememberPassword.link')"
			:to="localePath('/signin')"
			@navigate="resetFormState" />
	</div>
</template>

<script setup lang="ts">
const { $api, $router } = useNuxtApp();
const { addToast } = useToast();
const localePath = useLocalePath();
const { formState, checkError, validateForm, resetFormState } = useForgotPasswordForm();

const handleSubmitButton = async () => {
	formState.value.displayErrors = true;
	validateForm();
	if (formState.value.errors.length !== 0) {
		return;
	}

	try {
		await $api.auth.requestPasswordReset(formState.value.form);
		addToast({ type: 'success', title: 'Success', message: 'Recovery email sent' });
		$router.push(localePath('/signin'));
	} catch (error) {
		console.error(error);
		addToast({ type: 'error', title: 'Error', message: 'error to send recovery email' });
	}
};
</script>
