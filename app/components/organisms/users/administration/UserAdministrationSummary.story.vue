<template>
	<Story title="Organisms/Users/UserAdministrationSummary">
		<Variant title="Active partner">
			<div class="max-w-3xl p-4">
				<UserAdministrationSummary :user="user" />
			</div>
		</Variant>
		<Variant title="Suspended, not verified">
			<div class="max-w-3xl p-4">
				<UserAdministrationSummary
					:user="{ ...user, status: 'suspended', emailVerified: false }" />
			</div>
		</Variant>
	</Story>
</template>
<script setup lang="ts">
import type { User } from '~/domain/user/user.entity';

const user: User = {
	id: 'user-1',
	name: 'Bruno',
	surname: 'Costa',
	email: 'bruno.costa@example.com',
	emailVerified: true,
	role: 'partner',
	status: 'active',
	createdAt: new Date(),
	updatedAt: new Date()
};
</script>
