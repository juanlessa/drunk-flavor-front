<template>
	<Box direction="col" class="gap-6">
		<Form :title="$t('organisms.signupForm.title')" @submit="handleSubmitButton">
			<Box direction="col" class="gap-4">
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
						@focus="isPasswordActive = true"
						@blur="handlePasswordBlur" />
				</InputWrapper>
				<InputWrapper>
					<template #label>
						<Label for="confirmPassword">
							{{ $t('organisms.signupForm.confirmPasswordInput.label') }}
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
			</Box>
			<PasswordStrength
				class="mt-4"
				:password="formState.form.password"
				:confirm-password="formState.form.confirmPassword"
				:active="isPasswordActive" />

			<template #buttons>
				<ButtonGroup
					:has-cancel-button="false"
					:action-button-props="{
						variant: 'primary',
						type: 'submit',
						value: $t('organisms.signupForm.submitButton.value')
					}" />
			</template>
		</Form>

		<Box direction="row" class="gap-1 justify-center items-center">
			<Text as="span" class="text-content-subtle">
				{{ $t('organisms.signupForm.hasAccount.message') }}
			</Text>
			<Anchor :to="localePath('/signin')" @click="resetFormState">
				{{ $t('organisms.signupForm.hasAccount.link') }}
			</Anchor>
		</Box>
	</Box>
</template>

<script setup lang="ts">
const { $api, $router } = useNuxtApp();
const { addToast } = useToast();
const localePath = useLocalePath();
const { formState, checkError, resetFormState, validateForm } = useSignupForm();

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
		await $api.auth.signup(formState.value.form);
		resetFormState();
		addToast({ type: 'success', title: 'Success', message: 'Account created successfully' });
		$router.push(localePath('/signin'));
	} catch (error) {
		console.error(error);
		addToast({ type: 'error', title: 'Error', message: 'error to signup' });
	}
};
</script>
