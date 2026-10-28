<template>
	<Story title="Organisms/Profile/ProfileOverview">
		<Variant title="Hybrid account">
			<div class="min-h-screen bg-surface-sunken">
				<ProfileOverview :profile="hybridProfile" />
			</div>
		</Variant>
		<Variant title="Google-only account">
			<div class="min-h-screen bg-surface-sunken">
				<ProfileOverview :profile="providerOnlyProfile" />
			</div>
		</Variant>
		<Variant title="Local account">
			<div class="min-h-screen bg-surface-sunken">
				<ProfileOverview :profile="localProfile" />
			</div>
		</Variant>
	</Story>
</template>

<script setup lang="ts">
import type { Profile } from '~/domain/profile/profile.entity';

const baseProfile = {
	_id: 'story-user',
	name: 'Juan',
	surname: 'Lessa',
	email: 'juan@example.com',
	email_verified: true,
	role: 'member',
	status: 'active',
	created_at: new Date(),
	updated_at: new Date()
} as const;
const hybridProfile: Profile = {
	...baseProfile,
	authentication_methods: { password: { enabled: true }, providers: ['google'] }
};
const providerOnlyProfile: Profile = {
	...baseProfile,
	authentication_methods: { password: { enabled: false }, providers: ['google'] }
};
const localProfile: Profile = {
	...baseProfile,
	authentication_methods: { password: { enabled: true }, providers: [] }
};
</script>
