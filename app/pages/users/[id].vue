<template>
	<NuxtLayout>
		<UserAdministrationDetail :key="userId" :user-id="userId" />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'auth',
	can: { action: 'manage', subject: 'User' }
});

const route = useRoute('users-id');
const userId = computed(() => String(route.params.id));
</script>
