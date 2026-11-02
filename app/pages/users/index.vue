<template>
	<NuxtLayout>
		<UsersControlOverview />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'auth',
	can: { action: 'manage', subject: 'User' }
});
</script>
