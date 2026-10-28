<template>
	<Story title="Organisms/Profile/ProfileDetailsForm">
		<Variant title="With avatar">
			<div class="max-w-3xl p-4"><ProfileDetailsForm :profile="profile" /></div>
		</Variant>
		<Variant title="Placeholder avatar">
			<div class="max-w-3xl p-4">
				<ProfileDetailsForm :profile="{ ...profile, avatar_url: undefined }" />
			</div>
		</Variant>
	</Story>
</template>

<script setup lang="ts">
import type { Profile } from '~/domain/profile/profile.entity';

const profile: Profile = {
	_id: 'story-user',
	name: 'Juan',
	surname: 'Lessa',
	email: 'juan@example.com',
	email_verified: true,
	avatar_url: 'https://i.pravatar.cc/160',
	role: 'member',
	status: 'active',
	created_at: new Date(),
	updated_at: new Date(),
	authentication_methods: { password: { enabled: true }, providers: ['google'] }
};
</script>
