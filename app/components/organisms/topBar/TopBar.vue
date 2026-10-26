<template>
	<Box direction="col" class="bg-surface w-screen items-center">
		<Box
			as="header"
			direction="row"
			class="h-20 w-full max-w-screen-desktop px-4 desktop:px-0 items-center justify-between">
			<Anchor :to="localePath('/')">
				<Image :src="'/logo.png'" alt="DrunkFlavor" class="h-12" />
			</Anchor>
			<Box direction="row" class="hidden desktop:flex gap-8">
				<Box direction="row" class="gap-8 items-center">
					<LanguageSwitcher />
					<ThemeSwitcher />
				</Box>
				<Box
					as="nav"
					direction="row"
					class="gap-2 items-center"
					:aria-label="$t('organisms.topBar.primaryNav.label')">
					<Anchor
						v-for="link in links"
						:key="link.path"
						:to="localePath(link.path)"
						class="px-2 inline-flex justify-between items-center">
						<Text as="span">{{ $t(link.i18nKey) }}</Text>
					</Anchor>
					<Button
						v-if="isAuthenticated"
						variant="plain"
						class="px-2 inline-flex gap-2 justify-between items-center"
						:disabled="isSigningOut"
						@click="handleSignout">
						<Text as="span">{{ $t('organisms.topBar.logout') }}</Text>
					</Button>
				</Box>
			</Box>
			<Box direction="row" class="desktop:hidden">
				<HamburgerMenu>
					<Box direction="col" class="p-6 gap-8">
						<Box direction="row" class="gap-6 justify-center items-center">
							<LanguageSwitcher />
							<ThemeSwitcher />
						</Box>
						<Box
							as="nav"
							direction="col"
							class="gap-2"
							:aria-label="$t('organisms.topBar.mobileNav.label')">
							<Anchor
								v-for="link in links"
								:key="link.path"
								:to="localePath(link.path)"
								class="px-2 inline-flex justify-between items-center">
								<Text as="span">{{ $t(link.i18nKey) }}</Text>
								<component
									:is="link.path === '/signin' ? SigninIcon : ArrowRightIcon"
									class="size-4" />
							</Anchor>
							<Button
								v-if="isAuthenticated"
								variant="plain"
								class="w-full px-2 inline-flex gap-2 justify-between items-center"
								:disabled="isSigningOut"
								@click="handleSignout">
								<Text as="span">{{ $t('organisms.topBar.logout') }}</Text>
								<LogoutIcon class="size-4" />
							</Button>
						</Box>
					</Box>
				</HamburgerMenu>
			</Box>
		</Box>
	</Box>
</template>
<script setup lang="ts">
import ArrowRightIcon from '~/components/icons/ArrowRightIcon.vue';
import LogoutIcon from '~/components/icons/LogoutIcon.vue';
import SigninIcon from '~/components/icons/SigninIcon.vue';

import type {
	AppActions,
	AppCanParameters,
	AppSubjects
} from '~/domain/accessControl/accessControl.types';

type ILink = {
	i18nKey: string;
	path: string;
	can?: { action: AppActions; subject: AppSubjects };
};

const { $auth } = useNuxtApp();
const { t } = useI18n();
const { addToast } = useToast();
const localePath = useLocalePath();
const { can } = useAppAbility();
const isSigningOut = ref(false);

const isAuthenticated = computed(() => $auth.state.value.isAuthenticated);
const links = computed<ILink[]>(() => getLinksBasedOnPermissions(isAuthenticated.value));

const handleSignout = async () => {
	if (isSigningOut.value) return;

	isSigningOut.value = true;
	try {
		await $auth.signout();
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

function getLinksBasedOnPermissions(isAuthenticated: boolean): ILink[] {
	if (!isAuthenticated) {
		return [{ i18nKey: 'organisms.topBar.signin', path: '/signin' }];
	}

	const managementLinks: ILink[] = [
		{
			i18nKey: 'organisms.topBar.categories',
			path: '/categories',
			can: { action: 'manage', subject: 'Category' }
		},
		{
			i18nKey: 'organisms.topBar.units',
			path: '/units',
			can: { action: 'manage', subject: 'Unit' }
		},
		{
			i18nKey: 'organisms.topBar.ingredients',
			path: '/ingredients',
			can: { action: 'manage', subject: 'Ingredient' }
		},
		{
			i18nKey: 'organisms.topBar.drinks',
			path: '/drinks',
			can: { action: 'manage', subject: 'Drink' }
		}
	];

	return managementLinks.filter(
		(link) => !link.can || can(...([link.can.action, link.can.subject] as AppCanParameters))
	);
}
</script>
