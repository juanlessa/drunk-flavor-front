<template>
	<div class="bg-white dark:bg-gray-900 w-screen">
		<footer class="h-12 w-full max-w-screen-desktop mx-auto px-6 flex gap-8 items-center">
			<Anchor
				to="https://www.linkedin.com/in/juanlessa"
				class="inline-flex items-center gap-2">
				<CopyrightIcon />
				<Text>{{ $t('organisms.footer.author') }}</Text>
			</Anchor>

			<Anchor
				to="https://github.com/juanlessa/drunk-flavor-front"
				class="inline-flex items-center gap-2">
				<GithubIcon />
				<Text>{{ $t('organisms.footer.githubProject') }}</Text>
			</Anchor>
		</footer>
	</div>
</template>
<script setup lang="ts"></script>
