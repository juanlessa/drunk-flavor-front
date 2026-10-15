<template>
	<Form :title="$t('organisms.forgotPasswordForm.title')" @submit="handleSubmitButton">
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
			<Box direction="col" class="gap-6">
				<ButtonGroup direction="column" :has-cancel-button="false">
					<Button variant="primary" type="submit">
						{{ $t('organisms.forgotPasswordForm.submitButton.value') }}
					</Button>
				</ButtonGroup>
				<Box direction="row" class="gap-1 justify-center items-center">
					<Text as="span" class="text-content-subtle">
						{{ $t('organisms.forgotPasswordForm.rememberPassword.message') }}
					</Text>
					<Anchor :to="localePath('/signin')">
						{{ $t('organisms.forgotPasswordForm.rememberPassword.link') }}
					</Anchor>
				</Box>
			</Box>
		</template>
	</Form>
</template>

<script setup lang="ts">
const { $api, $router } = useNuxtApp();
const { addToast } = useToast();
const localePath = useLocalePath();
const { formState, checkError, validateForm } = useForgotPasswordForm();

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
