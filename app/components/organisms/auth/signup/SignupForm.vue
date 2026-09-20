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
				<Label for="name">
					{{ $t('organisms.signupForm.nameInput.label') }}
				</Label>
			</template>
			<InputText
				id="name"
				v-model="formState.form.name"
				name="name"
				placeholder=""
				:has-error="!!checkError('name')"
				:error-message="checkError('name')"
				@blur="validateForm" />
			<template #error>
				<ErrorMessage :value="checkError('name')" />
			</template>
		</InputWrapper>
		<InputWrapper>
			<template #label>
				<Label for="surname">
					{{ $t('organisms.signupForm.surnameInput.label') }}
				</Label>
			</template>
			<InputText
				id="surname"
				v-model="formState.form.surname"
				name="surname"
				placeholder=""
				:has-error="!!checkError('surname')"
				:error-message="checkError('surname')"
				@blur="validateForm" />
			<template #error>
				<ErrorMessage :value="checkError('surname')" />
			</template>
		</InputWrapper>
		<InputWrapper>
			<template #label>
				<Label for="email">
					{{ $t('organisms.signupForm.emailInput.label') }}
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
					{{ $t('organisms.signupForm.passwordInput.label') }}
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
const { formState, checkError, resetFormState, validateForm } = useSignupForm();

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
		await $api.auth.signup(formState.value.form);
		addToast({ type: 'success', title: 'Success', message: 'Account created successfully' });
		$router.push(localePath('/signin'));
	} catch (error) {
		console.error(error);
		addToast({ type: 'error', title: 'Error', message: 'error to signup' });
	}
};
</script>
