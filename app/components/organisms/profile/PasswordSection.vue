<template>
	<ProfileSection :title="title" :description="description">
		<template #icon><LockIcon /></template>
		<template #action>
			<Button variant="outline" @click="isOpen = true">{{ actionLabel }}</Button>
		</template>
	</ProfileSection>

	<UpdatePasswordDialog v-if="props.hasPassword" v-model:open="isOpen" />
	<CreatePasswordDialog v-else v-model:open="isOpen" :providers="props.providers" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import LockIcon from '~/components/icons/LockIcon.vue';
import type { AuthenticationProvider } from '~/domain/profile/profile.entity';

const props = defineProps({
	hasPassword: { type: Boolean, required: true },
	providers: { type: Array as PropType<AuthenticationProvider[]>, default: () => [] }
});
const { t } = useI18n();
const isOpen = ref(false);
const mode = computed(() => (props.hasPassword ? 'update' : 'create'));
const title = computed(() => t(`organisms.profile.password.${mode.value}.title`));
const description = computed(() => t(`organisms.profile.password.${mode.value}.description`));
const actionLabel = computed(() => t(`organisms.profile.password.${mode.value}.openButton`));
</script>
