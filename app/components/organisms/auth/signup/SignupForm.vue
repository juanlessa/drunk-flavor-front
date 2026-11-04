<template>
	<div class="flex flex-col gap-6">
		<AuthPageHeader
			:title="$t('organisms.signupForm.title')"
			:description="$t('organisms.signupForm.subtitle')" />
		<form class="flex flex-col gap-6" novalidate @submit.prevent="handleSubmitButton">
			<div class="flex flex-col gap-4">
				<!-- Name and surname share a row from tablet up. -->
				<div class="grid grid-cols-1 gap-4 tablet:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
					<InputWrapper>
						<template #label>
							<Label for="name">{{
								$t('organisms.signupForm.nameInput.label')
							}}</Label>
						</template>
						<InputText
							id="name"
							v-model="formState.form.name"
							name="name"
							:has-error="!!checkError('name')"
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
							:has-error="!!checkError('surname')"
							@blur="validateForm" />
						<template #error>
							<ErrorMessage :value="checkError('surname')" />
						</template>
					</InputWrapper>
				</div>
				<InputWrapper>
					<template #label>
						<Label for="email">{{ $t('organisms.signupForm.emailInput.label') }}</Label>
					</template>
					<InputText
						id="email"
						v-model="formState.form.email"
						name="email"
						type="email"
						:placeholder="$t('organisms.signupForm.emailInput.placeholder')"
						:has-error="!!checkError('email')"
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
				<PasswordStrength
					:password="formState.form.password"
					:confirm-password="formState.form.confirmPassword"
					:active="isPasswordActive" />
			</div>
			<Button type="submit" class="max-w-none!">
				{{ $t('organisms.signupForm.submitButton.value') }}
			</Button>
		</form>
		<AuthPrompt
			:message="$t('organisms.signupForm.hasAccount.message')"
			:link-label="$t('organisms.signupForm.hasAccount.link')"
			:to="localePath('/signin')" />
	</div>
</template>

<script setup lang="ts">
const { $api, $router } = useNuxtApp();
const { addToast } = useToast();
const localePath = useLocalePath();
const { formState, checkError, validateForm } = useSignupForm();

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
		addToast({ type: 'success', title: 'Success', message: 'Account created successfully' });
		$router.push(localePath('/signin'));
	} catch (error) {
		console.error(error);
		addToast({ type: 'error', title: 'Error', message: 'error to signup' });
	}
};
</script>
