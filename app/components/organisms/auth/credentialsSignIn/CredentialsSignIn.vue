<template>
	<Form @submit="handleSubmitButton">
		<Box direction="col" class="gap-4">
			<InputWrapper>
				<template #label>
					<Label for="email">
						{{ $t('organisms.credentialsSignIn.emailInput.label') }}
					</Label>
				</template>
				<InputText
					id="email"
					v-model="formState.form.email"
					name="email"
					type="email"
					placeholder=""
					:has-error="!!checkError('email')"
					@blur="validateForm" />
				<template #error>
					<ErrorMessage :value="checkError('email')" />
				</template>
			</InputWrapper>
			<InputWrapper>
				<template #label>
					<Label for="password">
						{{ $t('organisms.credentialsSignIn.passwordInput.label') }}
					</Label>
				</template>
				<InputPassword
					id="password"
					v-model="formState.form.password"
					name="password"
					placeholder=""
					:has-error="!!checkError('password')"
					@blur="validateForm" />
				<template #error>
					<ErrorMessage :value="checkError('password')" />
				</template>
			</InputWrapper>
		</Box>
		<Box direction="row" class="pt-2 justify-end">
			<Anchor :to="localePath('/forgot-password')">
				{{ $t('organisms.credentialsSignIn.forgotPasswordLink.value') }}
			</Anchor>
		</Box>
		<template #buttons>
			<ButtonGroup
				:has-cancel-button="false"
				:action-button-props="{
					variant: 'primary',
					type: 'submit',
					disabled: isSubmitting,
					value: $t('organisms.credentialsSignIn.submitButton.value')
				}" />
		</template>
	</Form>
</template>

<script setup lang="ts">
const emit = defineEmits<{
	(e: 'success'): void;
	(e: 'error', message: string): void;
}>();

const { $api } = useNuxtApp();
const { t } = useI18n();
const localePath = useLocalePath();
const { formState, checkError, resetFormState, validateForm } = useSigninForm();

const isSubmitting = ref(false);

const handleSubmitButton = async () => {
	formState.value.displayErrors = true;
	validateForm();

	if (formState.value.errors.length !== 0 || isSubmitting.value) {
		return;
	}

	isSubmitting.value = true;
	try {
		await $api.auth.signin(formState.value.form);
		emit('success');
	} catch (error) {
		console.error(error);
		emit('error', t('organisms.credentialsSignIn.error.message'));
	} finally {
		isSubmitting.value = false;
	}
};

onBeforeUnmount(resetFormState);
</script>
