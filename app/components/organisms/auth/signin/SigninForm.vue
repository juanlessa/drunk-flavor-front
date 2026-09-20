<template>
	<Form @submit="handleSubmitButton">
		<Box direction="row" class="justify-center">
			<Image
				src="/light-logo.png"
				alt="Drunk Flavor logo"
				width="var(--size-auth-logo)"
				height="auto"
				rounded="none" />
		</Box>
		<InputWrapper>
			<template #label>
				<Label for="email">
					{{ $t('organisms.signinForm.emailInput.label') }}
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
		<InputWrapper>
			<template #label>
				<Label for="password">
					{{ $t('organisms.signinForm.passwordInput.label') }}
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
const { formState, checkError, resetFormState, validateForm } = useSigninForm();

const handleCancelButton = async () => {
	resetFormState();
	return $router.push(localePath('/'));
};
const handleSubmitButton = async () => {
	formState.value.displayErrors = true;
	validateForm();
	if (formState.value.errors.length !== 0) {
		return;
	}

	try {
		await $api.auth.signin(formState.value.form);
		$router.push(localePath('/'));
	} catch (error) {
		console.error(error);
		addToast({ type: 'error', title: 'ERROR', message: 'error to signin' });
	}
};
</script>
