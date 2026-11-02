<template>
	<Story title="Organisms/Profile/ProfileDetailsForm">
		<Variant title="With avatar">
			<div class="max-w-3xl p-4"><ProfileDetailsForm :profile="profile" /></div>
		</Variant>
		<Variant title="Placeholder avatar">
			<div class="max-w-3xl p-4">
				<ProfileDetailsForm :profile="{ ...profile, avatarUrl: undefined }" />
			</div>
		</Variant>
	</Story>
</template>

<script setup lang="ts">
import type { Profile } from '~/domain/profile/profile.entity';

const profile: Profile = {
	id: 'story-user',
	name: 'Juan',
	surname: 'Lessa',
	email: 'juan@example.com',
	emailVerified: true,
	avatarUrl: 'https://i.pravatar.cc/160',
	role: 'member',
	status: 'active',
	createdAt: new Date(),
	updatedAt: new Date(),
	authenticationMethods: { password: { enabled: true }, providers: ['google'] }
};
</script>
