<template>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger as-child>
			<button
				type="button"
				class="h-10 pl-1 pr-2.5 inline-flex items-center gap-1.5 rounded-full border border-stroke cursor-pointer hover:bg-surface-hover data-[state=open]:bg-surface-hover focus-visible:outline-hidden focus-visible:shadow-focus-ring"
				:aria-label="$t('organisms.topBar.userMenu.label')">
				<Avatar
					size="xs"
					:src="props.user.avatarUrl ?? ''"
					:alt="displayName"
					:fallback-delay="0" />
				<ChevronDownIcon
					class="size-2.5 fill-current! text-content-muted"
					aria-hidden="true" />
			</button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Portal>
			<DropdownMenu.Content
				class="z-dropdown w-64 p-1 flex flex-col rounded-overlay bg-surface-elevated border border-stroke shadow-overlay"
				align="end"
				:side-offset="8"
				:collision-padding="8">
				<div class="flex items-center gap-3 px-3 py-3">
					<Avatar
						size="sm"
						:src="props.user.avatarUrl ?? ''"
						:alt="displayName"
						:fallback-delay="0" />
					<div class="min-w-0">
						<p class="truncate text-body-sm font-bold text-content">
							{{ displayName }}
						</p>
						<p class="truncate text-caption text-content-muted">
							{{ props.user.email }}
						</p>
					</div>
				</div>
				<DropdownMenu.Separator class="-mx-1 my-1 h-px bg-stroke" />
				<DropdownMenu.Item as-child :class="itemClass">
					<NuxtLink :to="localePath('/profile')">
						<ProfileIcon
							class="size-4 shrink-0 fill-current! text-content-muted"
							aria-hidden="true" />
						{{ $t('organisms.topBar.profile') }}
					</NuxtLink>
				</DropdownMenu.Item>
				<DropdownMenu.Item
					:class="[itemClass, 'text-danger']"
					:disabled="props.isSigningOut"
					@select="emit('signout')">
					<LogoutIcon
						class="size-4 shrink-0 fill-current! text-danger"
						aria-hidden="true" />
					{{ $t('organisms.topBar.logout') }}
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Portal>
	</DropdownMenu.Root>
</template>
<script setup lang="ts">
import { DropdownMenu } from 'radix-vue/namespaced';
import ChevronDownIcon from '~/components/icons/ChevronDownIcon.vue';
import LogoutIcon from '~/components/icons/LogoutIcon.vue';
import ProfileIcon from '~/components/icons/ProfileIcon.vue';
import type { User } from '~/domain/user/user.entity';
import { getUserFullName } from '~/helpers/user.helpers';

const props = defineProps({
	user: { type: Object as PropType<User>, required: true },
	isSigningOut: { type: Boolean, default: false }
});

const emit = defineEmits<{
	(e: 'signout'): void;
}>();

const localePath = useLocalePath();
const displayName = computed(() => getUserFullName(props.user) || props.user.email);

const itemClass =
	'min-h-11 px-3 flex items-center gap-3 rounded-option text-body text-content cursor-pointer select-none outline-hidden data-[highlighted]:bg-surface-hover data-[disabled]:cursor-not-allowed data-[disabled]:opacity-disabled';
</script>
