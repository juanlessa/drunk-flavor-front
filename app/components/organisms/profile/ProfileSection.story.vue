<template>
	<Story title="Organisms/Profile/ProfileSection">
		<Variant title="Default">
			<div class="max-w-3xl p-4">
				<ProfileSection
					title="Password"
					description="Use a strong, unique password to protect your account.">
					<template #icon><LockIcon /></template>
					<template #action><Button variant="outline">Update password</Button></template>
				</ProfileSection>
			</div>
		</Variant>
		<Variant title="Danger">
			<div class="max-w-3xl p-4">
				<ProfileSection
					tone="danger"
					title="Delete account"
					description="Permanently delete your account. This action cannot be undone.">
					<template #icon><TrashIcon /></template>
					<template #action><Button variant="outline">Delete account</Button></template>
				</ProfileSection>
			</div>
		</Variant>
	</Story>
</template>

<script setup lang="ts">
import LockIcon from '~/components/icons/LockIcon.vue';
import TrashIcon from '~/components/icons/TrashIcon.vue';
</script>
