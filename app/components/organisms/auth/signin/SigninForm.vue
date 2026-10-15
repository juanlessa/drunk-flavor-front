<template>
	<Box direction="col" class="gap-6">
		<Form :title="$t('organisms.signinForm.title')" @submit="handleSubmitButton">
			<Box direction="col" class="gap-4">
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
			</Box>
			<Box direction="row" class="pt-2 justify-end">
				<Anchor :to="localePath('/forgot-password')">
					{{ $t('organisms.signinForm.forgotPasswordLink.value') }}
				</Anchor>
			</Box>

			<template #buttons>
				<ButtonGroup
					:has-cancel-button="false"
					:action-button-props="{
						variant: 'primary',
						type: 'submit',
						value: $t('organisms.signinForm.submitButton.value')
					}" />
			</template>
		</Form>

		<Box direction="row" class="gap-1 items-center justify-center">
			<Text as="span" class="text-content-subtle">{{
				$t('organisms.signinForm.signupPrompt.message')
			}}</Text>

			<Anchor :to="localePath('/signup')">
				{{ $t('organisms.signinForm.signupPrompt.link') }}
			</Anchor>
		</Box>
	</Box>
</template>

<script setup lang="ts">
const { $api, $router } = useNuxtApp();
const { addToast } = useToast();
const localePath = useLocalePath();
const { formState, checkError, resetFormState, validateForm } = useSigninForm();

const handleSubmitButton = async () => {
	formState.value.displayErrors = true;
	validateForm();
	if (formState.value.errors.length !== 0) {
		return;
	}

	try {
		await $api.auth.signin(formState.value.form);
		// The form lives in shared useState, so the typed password would survive the
		// redirect and be waiting here on the next visit.
		resetFormState();
		$router.push(localePath('/'));
	} catch (error) {
		console.error(error);
		addToast({ type: 'error', title: 'ERROR', message: 'error to signin' });
	}
};
</script>
