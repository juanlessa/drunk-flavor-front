<template>
	<NuxtLayout>
		<DrinksOverview />
	</NuxtLayout>
</template>
<script setup lang="ts">
import { getLocaleAgnosticPageKey } from '~/helpers/route.helpers';

definePageMeta({
	middleware: 'guest',
	// Switching the language keeps this page mounted, so the loaded drinks and the scroll position stay.
	key: (route) => getLocaleAgnosticPageKey(route)
});
</script>
