<template>
	<Box
		direction="col"
		class="bg-surface-chrome w-screen items-center border-t border-stroke-muted">
		<Box
			as="footer"
			direction="row"
			class="min-h-12 w-full max-w-screen-desktop px-6 items-center">
			<Box
				as="nav"
				direction="wrap"
				class="gap-x-8 gap-y-2 items-center py-3"
				:aria-label="$t('organisms.footer.legalNav.label')">
				<Anchor :to="localePath('/privacy')" class="underline-offset-4 hover:underline">
					{{ $t('organisms.footer.privacyPolicy') }}
				</Anchor>

				<Anchor :to="localePath('/terms')" class="underline-offset-4 hover:underline">
					{{ $t('organisms.footer.termsOfService') }}
				</Anchor>
			</Box>
		</Box>
	</Box>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
</script>
