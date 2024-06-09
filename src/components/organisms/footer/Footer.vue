<template>
	<footer class="h-12 px-6 flex gap-8 items-center">
		<Anchor to="https://www.linkedin.com/in/juanlessa" class="inline-flex items-center gap-2">
			<CopyrightIcon />
			<Text>{{ $t('footer.author') }}</Text>
		</Anchor>

		<Anchor
			to="https://github.com/juanlessa/drunk-flavor-front"
			class="inline-flex items-center gap-2">
			<GithubIcon />
			<Text>{{ $t('footer.githubProject') }}</Text>
		</Anchor>
	</footer>
</template>
<script setup lang="ts"></script>
<style scoped></style>
