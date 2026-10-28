<template>
	<NuxtLayout>
		<ProfileOverview v-if="profile" :profile="profile" />
	</NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: ['auth']
});

const { $auth } = useNuxtApp();
const profile = computed(() => $auth.state.value.user);
</script>
