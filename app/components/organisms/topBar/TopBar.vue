<template>
	<Box direction="col" class="bg-surface-chrome w-full items-center border-b border-stroke-muted">
		<!--
			56px on mobile, 64px from tablet up (--size-top-bar-block adds the border).
			The logo keeps about half of that height.
		-->
		<header
			class="h-14 tablet:h-16 w-full max-w-screen-desktop px-4 tablet:px-6 flex items-center gap-4 desktop:gap-8">
			<NuxtLink
				:to="localePath('/')"
				class="shrink-0 rounded-option focus-visible:outline-hidden focus-visible:shadow-focus-ring">
				<!-- Width/height attributes reserve the box before the SVG loads (443×90 viewBox). -->
				<img
					src="/logos/logo-outfit-light.svg"
					alt="DrunkFlavor"
					width="443"
					height="90"
					class="block h-7 w-auto tablet:h-8 dark:hidden" />
				<img
					src="/logos/logo-outfit-dark.svg"
					alt="DrunkFlavor"
					width="443"
					height="90"
					class="hidden h-7 w-auto tablet:h-8 dark:block" />
			</NuxtLink>

			<!--
				From tablet: the public pages beside the logo. From desktop: also the management links inline, then
				the global controls and the account. The menu panel keeps the public pages only below tablet.
			-->
			<nav
				class="hidden tablet:flex items-center gap-1"
				:aria-label="$t('organisms.topBar.publicNav.label')">
				<template v-for="link in PUBLIC_LINKS" :key="link.path">
					<span
						v-if="isCurrentPage(link)"
						aria-current="page"
						class="h-9 px-3.5 inline-flex items-center rounded-full bg-accent-subtle text-body-sm font-bold text-accent-content">
						{{ $t(link.i18nKey) }}
					</span>
					<NuxtLink
						v-else
						:to="localePath(link.path)"
						class="h-9 px-3.5 inline-flex items-center rounded-full text-body-sm font-medium text-content-secondary hover:bg-surface-hover hover:text-content focus-visible:outline-hidden focus-visible:shadow-focus-ring">
						{{ $t(link.i18nKey) }}
					</NuxtLink>
				</template>
			</nav>
			<span
				v-if="manageGroups.length"
				class="hidden desktop:block h-6 w-px bg-stroke"
				aria-hidden="true"></span>
			<!-- The catalog areas, then the administration, apart behind a divider. -->
			<nav
				v-if="manageGroups.length"
				class="hidden desktop:flex items-center gap-1"
				:aria-label="$t('organisms.topBar.primaryNav.label')">
				<template v-for="(group, groupIndex) in manageGroups" :key="groupIndex">
					<span
						v-if="groupIndex > 0"
						class="mx-1 h-6 w-px bg-stroke"
						aria-hidden="true"
						data-testid="manage-group-divider"></span>
					<template v-for="link in group" :key="link.path">
						<span
							v-if="isCurrentPage(link)"
							aria-current="page"
							class="h-9 px-3.5 inline-flex items-center rounded-full bg-accent-subtle text-body-sm font-bold text-accent-content">
							{{ $t(link.i18nKey) }}
						</span>
						<NuxtLink
							v-else
							:to="localePath(link.path)"
							class="h-9 px-3.5 inline-flex items-center rounded-full text-body-sm font-medium text-content-secondary hover:bg-surface-hover hover:text-content focus-visible:outline-hidden focus-visible:shadow-focus-ring">
							{{ $t(link.i18nKey) }}
						</NuxtLink>
					</template>
				</template>
			</nav>

			<div class="ml-auto hidden desktop:flex items-center gap-2">
				<LanguageSwitcher />
				<ThemeSwitcher />
				<span class="mx-2 h-7 w-px bg-stroke" aria-hidden="true"></span>
				<UserMenu
					v-if="user"
					:user="user"
					:is-signing-out="isSigningOut"
					@signout="handleSignout" />
				<NuxtLink
					v-else-if="isSessionKnown"
					:to="localePath('/signin')"
					:class="signInButtonClass">
					{{ $t('organisms.topBar.signin') }}
				</NuxtLink>
				<span v-else class="block h-10 w-20" aria-hidden="true"></span>
			</div>

			<!-- Mobile and tablet: a shortcut to the account and the menu panel. -->
			<div class="ml-auto flex desktop:hidden items-center gap-1">
				<NuxtLink
					v-if="user"
					:to="localePath('/profile')"
					class="size-11 inline-flex items-center justify-center rounded-full focus-visible:outline-hidden focus-visible:shadow-focus-ring"
					:aria-label="$t('organisms.topBar.profileShortcut')">
					<Avatar
						size="xs"
						:src="user.avatarUrl ?? ''"
						:alt="userName"
						:fallback-delay="0" />
				</NuxtLink>
				<NuxtLink
					v-else-if="isSessionKnown"
					:to="localePath('/signin')"
					:class="[signInButtonClass, 'h-9 px-4']">
					{{ $t('organisms.topBar.signin') }}
				</NuxtLink>
				<span v-else class="block size-11" aria-hidden="true"></span>
				<HamburgerMenu
					v-model:open="isMenuOpen"
					:title="$t('organisms.topBar.menu.title')"
					:open-label="$t('organisms.topBar.menu.open')"
					:close-label="$t('organisms.topBar.menu.close')">
					<div class="mx-auto w-full max-w-xl flex flex-col gap-2 px-4 py-4 tablet:px-6">
						<div v-if="user" class="flex items-center gap-3 px-2 py-2">
							<Avatar
								size="sm"
								:src="user.avatarUrl ?? ''"
								:alt="userName"
								:fallback-delay="0" />
							<div class="min-w-0">
								<p class="truncate text-body font-bold text-content">
									{{ userName }}
								</p>
								<p class="truncate text-body-sm text-content-muted">
									{{ user.email }}
								</p>
							</div>
						</div>

						<nav
							class="flex flex-col tablet:hidden"
							:aria-label="$t('organisms.topBar.publicNav.label')">
							<template v-for="link in PUBLIC_LINKS" :key="link.path">
								<span
									v-if="isCurrentPage(link)"
									aria-current="page"
									:class="[
										menuItemClass,
										'bg-accent-subtle font-bold text-accent-content'
									]">
									{{ $t(link.i18nKey) }}
								</span>
								<NuxtLink
									v-else
									:to="localePath(link.path)"
									:class="[
										menuItemClass,
										'text-content-secondary hover:bg-surface-hover'
									]">
									{{ $t(link.i18nKey) }}
								</NuxtLink>
							</template>
						</nav>
						<nav
							v-if="manageLinks.length"
							class="flex flex-col"
							:aria-labelledby="manageHeadingId">
							<h2 :id="manageHeadingId" :class="sectionHeadingClass">
								{{ $t('organisms.topBar.manageSection') }}
							</h2>
							<template v-for="link in manageLinks" :key="link.path">
								<span
									v-if="isCurrentPage(link)"
									aria-current="page"
									:class="[
										menuItemClass,
										'bg-accent-subtle font-bold text-accent-content'
									]">
									{{ $t(link.i18nKey) }}
								</span>
								<NuxtLink
									v-else
									:to="localePath(link.path)"
									:class="[
										menuItemClass,
										'text-content-secondary hover:bg-surface-hover'
									]">
									{{ $t(link.i18nKey) }}
								</NuxtLink>
							</template>
						</nav>
						<!-- Administration: its own section, divided from the catalog above it. -->
						<nav
							v-if="adminLinks.length"
							class="flex flex-col border-t border-stroke pt-2"
							:aria-labelledby="adminHeadingId">
							<h2 :id="adminHeadingId" :class="sectionHeadingClass">
								{{ $t('organisms.topBar.adminSection') }}
							</h2>
							<template v-for="link in adminLinks" :key="link.path">
								<span
									v-if="isCurrentPage(link)"
									aria-current="page"
									:class="[
										menuItemClass,
										'bg-accent-subtle font-bold text-accent-content'
									]">
									{{ $t(link.i18nKey) }}
								</span>
								<NuxtLink
									v-else
									:to="localePath(link.path)"
									:class="[
										menuItemClass,
										'text-content-secondary hover:bg-surface-hover'
									]">
									{{ $t(link.i18nKey) }}
								</NuxtLink>
							</template>
						</nav>

						<!-- Guests already have the sign-in button in the bar. -->
						<nav v-if="user" class="flex flex-col" :aria-labelledby="accountHeadingId">
							<h2 :id="accountHeadingId" :class="sectionHeadingClass">
								{{ $t('organisms.topBar.accountSection') }}
							</h2>
							<template v-if="user">
								<span
									v-if="isCurrentPage(PROFILE_LINK)"
									aria-current="page"
									:class="[
										menuItemClass,
										'bg-accent-subtle font-bold text-accent-content'
									]">
									{{ $t(PROFILE_LINK.i18nKey) }}
								</span>
								<NuxtLink
									v-else
									:to="localePath(PROFILE_LINK.path)"
									:class="[
										menuItemClass,
										'text-content-secondary hover:bg-surface-hover'
									]">
									{{ $t(PROFILE_LINK.i18nKey) }}
								</NuxtLink>
								<button
									type="button"
									:class="[
										menuItemClass,
										'w-full text-left text-danger hover:bg-surface-hover'
									]"
									:disabled="isSigningOut"
									@click="handleSignout">
									{{ $t('organisms.topBar.logout') }}
								</button>
							</template>
						</nav>

						<!-- Divided from the navigation above it; guests only get these settings. -->
						<div
							class="grid grid-cols-1 gap-3 tablet:grid-cols-2"
							:class="user ? 'mt-2 border-t border-stroke pt-4' : ''">
							<LanguageSwitcher labelled />
							<ThemeSwitcher labelled />
						</div>
					</div>
				</HamburgerMenu>
			</div>
		</header>
	</Box>
</template>
<script setup lang="ts">
import { onBeforeMount, onMounted, useId } from 'vue';
import type {
	AppActions,
	AppCanParameters,
	AppSubjects
} from '~/domain/accessControl/accessControl.types';
import { getUserFullName } from '~/helpers/user.helpers';

type ILink = {
	i18nKey: string;
	path: string;
	can?: { action: AppActions; subject: AppSubjects };
};

/** Pages for everyone, signed in or not, in display order. */
const PUBLIC_LINKS: ILink[] = [{ i18nKey: 'organisms.topBar.myBar', path: '/bar' }];
/*
 * Management areas, in display order. Each one shows when the user passes the same check that guards
 * its page (`definePageMeta({ can })`), so a link never leads to a page that sends the user away.
 */
/** The catalog: the drinks and what they are made of. */
const CATALOG_LINKS: ILink[] = [
	{
		i18nKey: 'organisms.topBar.drinks',
		path: '/drinks',
		can: { action: 'listWithAuthorship', subject: 'Drink' }
	},
	{
		i18nKey: 'organisms.topBar.ingredients',
		path: '/ingredients',
		can: { action: 'listWithAuthorship', subject: 'Ingredient' }
	},
	{
		i18nKey: 'organisms.topBar.categories',
		path: '/categories',
		can: { action: 'listWithAuthorship', subject: 'Category' }
	},
	{
		i18nKey: 'organisms.topBar.units',
		path: '/units',
		can: { action: 'listWithAuthorship', subject: 'Unit' }
	}
];
/** The administration of the platform, shown apart from the catalog. */
const ADMIN_LINKS: ILink[] = [
	{
		i18nKey: 'organisms.topBar.users',
		path: '/users',
		can: { action: 'manage', subject: 'User' }
	}
];
const PROFILE_LINK: ILink = { i18nKey: 'organisms.topBar.profile', path: '/profile' };

const nuxtApp = useNuxtApp();
const { $auth } = nuxtApp;
const { t } = useI18n();
const { addToast } = useToast();
const localePath = useLocalePath();
const route = useRoute();
const { can } = useAppAbility();
const manageHeadingId = useId();
const adminHeadingId = useId();
const accountHeadingId = useId();

const isSigningOut = ref(false);
const isMenuOpen = ref(false);

/**
 * Whether the account area can show the real session. The session cookies belong to the API host, so
 * the Nuxt server never sees them: the server-rendered HTML always describes a guest, while the browser
 * already knows the user by the time it hydrates. Rendering the real state in that first pass would not
 * match the server HTML (a sign-in button wrapping the avatar), so while hydrating the account area is
 * a neutral placeholder and the real state appears right after mount. Later navigations remount the
 * bar with the state known from the start, so nothing flickers.
 */
const isSessionKnown = ref(false);
onBeforeMount(() => {
	isSessionKnown.value = !nuxtApp.isHydrating;
});
onMounted(() => {
	isSessionKnown.value = true;
});

const user = computed(() =>
	isSessionKnown.value && $auth.state.value.isAuthenticated ? $auth.state.value.user : undefined
);
const userName = computed(() =>
	user.value ? getUserFullName(user.value) || user.value.email : ''
);

const allowedLinks = (links: ILink[]) =>
	user.value
		? links.filter(
				(link) =>
					!link.can || can(...([link.can.action, link.can.subject] as AppCanParameters))
			)
		: [];
const manageLinks = computed(() => allowedLinks(CATALOG_LINKS));
const adminLinks = computed(() => allowedLinks(ADMIN_LINKS));
/** The non-empty groups, in display order, for the desktop bar that divides them. */
const manageGroups = computed(() => [manageLinks.value, adminLinks.value].filter((g) => g.length));

// Only the exact page is "current": from /users/:id the users link still leads back to the list.
const isCurrentPage = (link: ILink) => route.path === localePath(link.path).toString();

// The menu panel closes as soon as the user moves to another page.
watch(
	() => route.path,
	() => {
		isMenuOpen.value = false;
	}
);

const handleSignout = async () => {
	if (isSigningOut.value) return;
	isSigningOut.value = true;
	try {
		await $auth.signout();
		isMenuOpen.value = false;
		await navigateTo(localePath('/'));
	} catch (error) {
		console.error(error);
		addToast({
			type: 'error',
			title: 'ERROR',
			message: t('organisms.topBar.logoutError')
		});
	} finally {
		isSigningOut.value = false;
	}
};

const signInButtonClass =
	'h-10 px-5 inline-flex items-center rounded-full bg-accent text-body-sm font-medium text-content-on-accent hover:bg-accent-hover focus-visible:outline-hidden focus-visible:shadow-focus-ring';
const sectionHeadingClass =
	'px-3 pt-3 pb-1 text-caption font-bold uppercase tracking-wide text-content-muted';
const menuItemClass =
	'min-h-11 px-3 flex items-center rounded-option text-body focus-visible:outline-hidden focus-visible:shadow-focus-ring disabled:cursor-not-allowed disabled:opacity-disabled';
</script>
