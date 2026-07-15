<template>
	<div class="bg-white dark:bg-gray-900 w-screen">
		<header
			class="h-20 w-full max-w-screen-desktop mx-auto px-4 desktop:px-0 flex items-center justify-between">
			<Anchor :to="localePath('/')">
				<img :src="'/logo.png'" alt="DrunkFlavor" />
			</Anchor>
			<div class="hidden desktop:block">
				<div class="flex gap-8">
					<div class="flex gap-8 items-center">
						<LanguageSwitcher />
						<ThemeSwitcher />
					</div>
					<nav class="inline-flex gap-2 items-center">
						<Anchor
							v-for="link in links"
							:key="link.path"
							:to="localePath(link.path)"
							class="px-2 inline-flex justify-between items-center">
							<Text>{{ $t(link.i18nKey) }}</Text>
						</Anchor>
					</nav>
				</div>
			</div>
			<div class="desktop:hidden">
				<HamburgerMenu>
					<div class="p-6 flex flex-col gap-8">
						<div class="flex gap-6 justify-center items-center">
							<LanguageSwitcher />
							<ThemeSwitcher />
						</div>
						<nav class="flex flex-col gap-2">
							<Anchor
								v-for="link in links"
								:key="link.path"
								:to="localePath(link.path)"
								class="px-2 inline-flex justify-between items-center">
								<Text>{{ $t(link.i18nKey) }}</Text>
								<component
									:is="link.path === '/login' ? LoginIcon : ArrowRightIcon"
									class="size-4" />
							</Anchor>
						</nav>
					</div>
				</HamburgerMenu>
			</div>
		</header>
	</div>
</template>
<script setup lang="ts">
import ArrowRightIcon from '~/components/icons/ArrowRightIcon.vue';
import LoginIcon from '~/components/icons/LoginIcon.vue';
import type { ILink } from '~/types/TopBar';

const { $auth } = useNuxtApp();
const localePath = useLocalePath();

const links = computed<ILink[]>(() =>
	getLinksBasedOnPermissions($auth.state.value.isAuthenticated)
);

function getLinksBasedOnPermissions(isAuthenticated: boolean) {
	if (isAuthenticated) {
		return [
			{ i18nKey: 'organisms.topBar.categories', path: '/categories' },
			{ i18nKey: 'organisms.topBar.ingredients', path: '/ingredients' },
			{ i18nKey: 'organisms.topBar.drinks', path: '/drinks' }
		];
	}
	return [{ i18nKey: 'organisms.topBar.login', path: '/login' }];
}
</script>
