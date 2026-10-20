<template>
	<Story title="Atoms/PasswordStrength">
		<template #controls>
			<HstText v-model="state.password" title="password" />
			<HstText v-model="state.confirmPassword" title="confirmPassword" />
			<HstCheckbox v-model="state.active" title="active" />
		</template>

		<Variant title="empty">
			<div class="p-4">
				<PasswordStrength :password="''" :confirm-password="''" :active="false" />
			</div>
		</Variant>

		<Variant title="weak">
			<div class="p-4">
				<PasswordStrength :password="'abc'" :confirm-password="''" :active="true" />
			</div>
		</Variant>

		<Variant title="strong">
			<div class="p-4">
				<PasswordStrength
					:password="'Password123!'"
					:confirm-password="'Password123!'"
					:active="true" />
			</div>
		</Variant>

		<Variant title="mismatch">
			<div class="p-4">
				<PasswordStrength
					:password="'Password123!'"
					:confirm-password="'Password456!'"
					:active="true" />
			</div>
		</Variant>

		<Variant title="playground">
			<div class="p-4">
				<PasswordStrength
					:password="state.password"
					:confirm-password="state.confirmPassword"
					:active="state.active" />
			</div>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const state = reactive({
	password: '',
	confirmPassword: '',
	active: true
});
</script>
