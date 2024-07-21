<template>
	<Form @cancel="handleCancelButton" @submit="handleSubmitButton">
		<InputWrapper>
			<template #label>
				<Label for="email">
					{{ $t('organisms.loginForm.emailInput.label') }}
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
				<Label for="email">
					{{ $t('organisms.loginForm.passwordInput.label') }}
				</Label>
			</template>
			<InputText
				id="password"
				v-model="formState.form.password"
				name="password"
				type="text"
				placeholder=""
				:has-error="!!checkError('password')"
				:error-message="checkError('password')"
				@blur="validateForm" />
			<template #error>
				<ErrorMessage :value="checkError('password')" />
			</template>
		</InputWrapper>
	</Form>
</template>

<script setup lang="ts">
const { $api, $router } = useNuxtApp();
const { addToast } = useToast();
const localePath = useLocalePath();
const { formState, checkError, resetFormState, validateForm } = useLoginForm();

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
		await $api.auth.login(formState.value.form);
		$router.push(localePath('/'));
	} catch (error) {
		console.error(error);
		addToast({ type: 'error', title: 'ERROR', message: 'error to login' });
	}
};
</script>
