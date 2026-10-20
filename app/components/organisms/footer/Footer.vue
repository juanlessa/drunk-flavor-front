<template>
	<Box direction="col" class="bg-surface w-screen items-center">
		<Box as="footer" direction="row" class="h-12 w-full max-w-screen-desktop px-6 items-center">
			<Box
				as="nav"
				direction="row"
				class="gap-8 items-center"
				:aria-label="$t('organisms.footer.socialNav.label')">
				<Anchor
					to="https://www.linkedin.com/in/juanlessa"
					class="inline-flex items-center gap-2">
					<CopyrightIcon />
					<Text as="span">{{ $t('organisms.footer.author') }}</Text>
				</Anchor>

				<Anchor
					to="https://github.com/juanlessa/drunk-flavor-front"
					class="inline-flex items-center gap-2">
					<GithubIcon />
					<Text as="span">{{ $t('organisms.footer.githubProject') }}</Text>
				</Anchor>
			</Box>
		</Box>
	</Box>
</template>
<script setup lang="ts"></script>
