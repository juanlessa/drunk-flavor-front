<template>
	<Box direction="col" class="gap-6">
		<Form :title="$t('organisms.completeProfileForm.title')" @submit="handleSubmitButton">
			<Box direction="col" class="gap-4">
				<Text class="text-center text-content-subtle">
					{{ $t('organisms.completeProfileForm.description') }}
				</Text>
				<InputWrapper>
					<template #label>
						<Label for="name">
							{{ $t('organisms.completeProfileForm.nameInput.label') }}
						</Label>
					</template>
					<InputText
						id="name"
						v-model="formState.form.name"
						name="name"
						placeholder=""
						:has-error="!!checkError('name')"
						@blur="validateForm" />
					<template #error>
						<ErrorMessage :value="checkError('name')" />
					</template>
				</InputWrapper>
				<InputWrapper>
					<template #label>
						<Label for="surname">
							{{ $t('organisms.completeProfileForm.surnameInput.label') }}
						</Label>
					</template>
					<InputText
						id="surname"
						v-model="formState.form.surname"
						name="surname"
						placeholder=""
						:has-error="!!checkError('surname')"
						@blur="validateForm" />
					<template #error>
						<ErrorMessage :value="checkError('surname')" />
					</template>
				</InputWrapper>
			</Box>
			<template #buttons>
				<ButtonGroup
					:has-cancel-button="false"
					:action-button-props="{
						variant: 'primary',
						type: 'submit',
						disabled: isSubmitting,
						value: $t('organisms.completeProfileForm.submitButton.value')
					}" />
			</template>
		</Form>
		<Box direction="row" class="gap-1 items-center justify-center">
			<Text as="span" class="text-content-subtle">
				{{ $t('organisms.completeProfileForm.signoutPrompt.message') }}
			</Text>
			<Button variant="plain" :disabled="isSubmitting" @click="handleSignout">
				{{ $t('organisms.completeProfileForm.signoutPrompt.link') }}
			</Button>
		</Box>
	</Box>
</template>

<script setup lang="ts">
const { $api, $auth, $router } = useNuxtApp();
const { t } = useI18n();
const { addToast } = useToast();
const localePath = useLocalePath();
const { formState, checkError, resetFormState, validateForm } = useCompleteProfileForm();

const isSubmitting = ref(false);

const handleSubmitButton = async () => {
	formState.value.displayErrors = true;
	validateForm();

	if (formState.value.errors.length !== 0 || isSubmitting.value) {
		return;
	}

	isSubmitting.value = true;
	try {
		await $api.profile.update(formState.value.form);
		await $auth.authenticate();
		resetFormState();
		$router.push(localePath('/'));
	} catch (error) {
		console.error(error);
		addToast({
			type: 'error',
			title: t('organisms.completeProfileForm.error.title'),
			message: t('organisms.completeProfileForm.error.message')
		});
	} finally {
		isSubmitting.value = false;
	}
};

const handleSignout = async () => {
	try {
		await $auth.signout();
	} catch (error) {
		console.error(error);
	}
	resetFormState();
	$router.push(localePath('/signin'));
};
</script>
