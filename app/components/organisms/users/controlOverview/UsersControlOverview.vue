<template>
	<div ref="root" class="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 tablet:px-6">
		<div>
			<Label for="users-search" class="sr-only">
				{{ $t('organisms.usersControlOverview.searchLabel') }}
			</Label>
			<InputText
				id="users-search"
				v-model="searchTerm"
				name="search"
				:placeholder="$t('organisms.usersControlOverview.searchPlaceholder')" />
		</div>

		<ul class="flex flex-col gap-3" data-testid="users-list">
			<li v-for="user in overviewState.users" :key="user.id">
				<UserCard
					:user="user"
					:ownership-invitee="isInvitee(user.id)"
					@click="handleOpenUser(user.id)" />
			</li>
		</ul>

		<ul v-if="overviewState.loading" class="flex flex-col gap-3" aria-hidden="true">
			<li v-for="index in SKELETON_ROWS" :key="index">
				<UserCardSkeleton />
			</li>
		</ul>

		<Text v-if="isEmpty" class="text-center text-content-muted">
			{{ $t('organisms.usersControlOverview.emptyMessage') }}
		</Text>
	</div>
</template>

<script setup lang="ts">
import { useInfiniteScroll } from '@vueuse/core';
import { findScrollParent } from '~/helpers/scroll.helpers';

const SKELETON_ROWS = 3;
const SCROLL_DISTANCE_PX = 200;

const { $router } = useNuxtApp();
const localePath = useLocalePath();
const { overviewState, searchTerm, isEmpty, loadNextPage } = useUsersOverview();
// One request for the whole list (owner only) marks the invitee of a pending transfer.
const { isInvitee, load: loadPendingTransfer } = usePendingOwnershipTransfer();
onMounted(loadPendingTransfer);

// The content area of the layout scrolls (search included), so it is the scroll container; the window
// is the fallback when no ancestor scrolls.
const root = ref<HTMLElement | null>(null);
const scrollTarget = shallowRef<HTMLElement | Window | undefined>(undefined);
onMounted(() => {
	scrollTarget.value = findScrollParent(root.value) ?? window;
});
useInfiniteScroll(scrollTarget, loadNextPage, {
	distance: SCROLL_DISTANCE_PX,
	canLoadMore: () => !overviewState.value.filter.isLastPage
});

const handleOpenUser = (id: string) => {
	$router.push(localePath(`/users/${id}`));
};
</script>
