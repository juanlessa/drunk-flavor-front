<template>
	<Form @submit="handleSubmitButton">
		<Box direction="row" class="justify-center">
			<Image src="/light-logo.png" alt="Drunk Flavor logo" width="8rem" height="auto" rounded="none" />
		</Box>
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
				placeholder=""
				:has-error="!!checkError('email')"
				:error-message="checkError('email')"
				@blur="validateForm" />
			<template #error>
				<ErrorMessage :value="checkError('email')" />
			</template>
		</InputWrapper>
		<template #buttons>
			<ButtonGroup
				direction="column"
				:cancel-button-props="{ variant: 'secondary' }"
				:action-button-props="{ variant: 'primary', type: 'submit' }"
				@cancel="handleCancelButton" />
		</template>
	</Form>
</template>

<script setup lang="ts">
const { $api, $router } = useNuxtApp();
const { addToast } = useToast();
const localePath = useLocalePath();
const { formState, checkError, resetFormState, validateForm } = useForgotPasswordForm();

const handleCancelButton = async () => {
	resetFormState();
	return $router.push(localePath('/signin'));
};
const handleSubmitButton = async () => {
	formState.value.displayErrors = true;
	validateForm();
	if (formState.value.errors.length !== 0) {
		return;
	}

	try {
		await $api.auth.forgotPassword(formState.value.form);
		addToast({ type: 'success', title: 'Success', message: 'Recovery email sent' });
		$router.push(localePath('/signin'));
	} catch (error) {
		console.error(error);
		addToast({ type: 'error', title: 'Error', message: 'error to send recovery email' });
	}
};
</script>
