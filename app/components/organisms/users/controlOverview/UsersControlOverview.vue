<template>
	<div class="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 tablet:px-6">
		<header>
			<Heading as="h1" size="headlineSm">
				{{ $t('organisms.usersControlOverview.title') }}
			</Heading>
			<Text class="mt-2 text-content-muted">
				{{ $t('organisms.usersControlOverview.description') }}
			</Text>
		</header>

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
				<UserCard :user="user" @click="handleOpenUser(user.id)" />
			</li>
		</ul>

		<ul v-if="overviewState.loading" class="flex flex-col gap-3" aria-hidden="true">
			<li
				v-for="index in SKELETON_ROWS"
				:key="index"
				class="flex items-center gap-4 p-4 bg-surface border border-stroke shadow-card rounded-card">
				<AnimatedPlaceHolder class="size-10 rounded-full" />
				<div class="flex-1 flex flex-col gap-2">
					<AnimatedPlaceHolder class="w-40 h-4 rounded-xs" />
					<AnimatedPlaceHolder class="w-56 h-3 rounded-xs" />
				</div>
			</li>
		</ul>

		<Text v-if="isEmpty" class="text-center text-content-muted">
			{{ $t('organisms.usersControlOverview.emptyMessage') }}
		</Text>
	</div>
</template>

<script setup lang="ts">
import { useInfiniteScroll } from '@vueuse/core';

const SKELETON_ROWS = 3;
const SCROLL_DISTANCE_PX = 200;

const { $router } = useNuxtApp();
const localePath = useLocalePath();
const { overviewState, searchTerm, isEmpty, loadNextPage } = useUsersOverview();

// The whole page scrolls (header and search included), so the window is the scroll container.
useInfiniteScroll(import.meta.client ? window : undefined, loadNextPage, {
	distance: SCROLL_DISTANCE_PX,
	canLoadMore: () => !overviewState.value.filter.isLastPage
});

const handleOpenUser = (id: string) => {
	$router.push(localePath(`/users/${id}`));
};
</script>
