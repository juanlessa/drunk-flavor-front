<template>
	<Form @cancel="handleCancelButton" @submit="handleSubmitButton">
		<InputGroup
			id="email"
			v-model="formState.form.email"
			name="email"
			type="text"
			label="email"
			placeholder=""
			:has-error="!!checkError('email')"
			:error-message="checkError('email')"
			@blur="validateForm" />

		<InputGroup
			id="password"
			v-model="formState.form.password"
			name="password"
			type="text"
			label="password"
			placeholder=""
			:has-error="!!checkError('password')"
			:error-message="checkError('password')"
			@blur="validateForm" />
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
		addToast({ type: 'error', title: 'ERROR', message: 'error to login' });
	}
};
</script>
