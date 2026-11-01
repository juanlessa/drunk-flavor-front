<template>
	<NuxtLayout name="auth">
		<OwnershipTransferAcceptance :token="token" />
	</NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: ['auth']
});

const route = useRoute('ownership-transfer-token');
const token = computed(() => String(route.params.token));
</script>
