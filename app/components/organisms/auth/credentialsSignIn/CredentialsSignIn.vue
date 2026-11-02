<template>
	<form class="flex flex-col gap-6" novalidate @submit.prevent="handleSubmitButton">
		<div class="flex flex-col gap-4">
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
					:placeholder="$t('organisms.credentialsSignIn.emailInput.placeholder')"
					:has-error="!!checkError('email')"
					@blur="validateForm" />
				<template #error>
					<ErrorMessage :value="checkError('email')" />
				</template>
			</InputWrapper>
			<InputWrapper>
				<template #label>
					<!-- The recovery link sits next to the label it relates to. -->
					<div class="flex items-baseline justify-between gap-3">
						<Label for="password">
							{{ $t('organisms.credentialsSignIn.passwordInput.label') }}
						</Label>
						<Anchor :to="localePath('/forgot-password')" :class="AUTH_FIELD_LINK_CLASS">
							{{ $t('organisms.credentialsSignIn.forgotPasswordLink.value') }}
						</Anchor>
					</div>
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
		</div>
		<Button type="submit" class="max-w-none!" :disabled="isSubmitting">
			{{ $t('organisms.credentialsSignIn.submitButton.value') }}
		</Button>
	</form>
</template>

<script setup lang="ts">
import { AUTH_FIELD_LINK_CLASS } from '~/components/organisms/auth/prompt/AuthPrompt.constants';

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
