<template>
	<ProfileSection :title="$t('organisms.profile.google.title')" :description="description">
		<template #icon><GoogleIcon /></template>
		<template #action>
			<div
				v-if="props.connected"
				class="inline-flex items-center justify-center gap-2 rounded-full bg-accent-subtle px-4 py-2 text-accent-content">
				<CheckIcon class="size-4 fill-current" />
				<Text as="span" class="text-body-sm font-medium">{{
					$t('organisms.profile.google.connectedLabel')
				}}</Text>
			</div>
			<Button v-else variant="outline" @click="isOpen = true">{{
				$t('organisms.profile.google.connectButton')
			}}</Button>
		</template>
	</ProfileSection>

	<GoogleConnectionDialog v-if="!props.connected" v-model:open="isOpen" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import CheckIcon from '~/components/icons/CheckIcon.vue';
import GoogleIcon from '~/components/icons/GoogleIcon.vue';

const props = defineProps({ connected: { type: Boolean, required: true } });
const { t } = useI18n();
const isOpen = ref(false);
const description = computed(() =>
	t(`organisms.profile.google.${props.connected ? 'connectedDescription' : 'description'}`)
);
</script>
