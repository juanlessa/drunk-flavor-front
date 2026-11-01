<template>
	<Story title="Organisms/Users/UserCard">
		<Variant title="Active partner">
			<div class="max-w-3xl p-4">
				<UserCard :user="activeUser" />
			</div>
		</Variant>
		<Variant title="Suspended member">
			<div class="max-w-3xl p-4">
				<UserCard :user="{ ...activeUser, role: 'member', status: 'suspended' }" />
			</div>
		</Variant>
		<Variant title="Incomplete profile">
			<div class="max-w-3xl p-4">
				<UserCard :user="incompleteUser" />
			</div>
		</Variant>
	</Story>
</template>
<script setup lang="ts">
import type { User } from '~/domain/user/user.entity';

const activeUser: User = {
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

const incompleteUser: User = {
	id: 'user-2',
	email: 'elisa.rocha@example.com',
	emailVerified: true,
	role: 'member',
	status: 'incomplete_profile',
	createdAt: new Date(),
	updatedAt: new Date()
};
</script>
