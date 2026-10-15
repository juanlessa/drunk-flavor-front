<template>
	<Box direction="col" class="gap-6">
		<Form :title="$t('organisms.signupForm.title')" @submit="handleSubmitButton">
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
			<!-- Single action, so no cancel, and the generic "done" label is replaced
			     by the one that names what the button actually does. -->
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

		<!-- Outside the form on purpose: the form owns account creation only.
		     Alternative ways in (signin now, social providers later) live here. -->
		<Box direction="row" class="gap-1 justify-center items-center">
			<Text as="span" class="text-content-subtle">
				{{ $t('organisms.signupForm.hasAccount.message') }}
			</Text>
			<Anchor :to="localePath('/signin')">
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

const handleSubmitButton = async () => {
	formState.value.displayErrors = true;
	validateForm();
	if (formState.value.errors.length !== 0) {
		return;
	}

	try {
		await $api.auth.signup(formState.value.form);
		// The form lives in shared useState, so the typed password would survive the
		// redirect and be waiting here on the next visit.
		resetFormState();
		addToast({ type: 'success', title: 'Success', message: 'Account created successfully' });
		$router.push(localePath('/signin'));
	} catch (error) {
		console.error(error);
		addToast({ type: 'error', title: 'Error', message: 'error to signup' });
	}
};
</script>
