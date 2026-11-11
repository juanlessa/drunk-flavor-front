<template>
	<Box direction="col" class="w-full min-h-dvh gap-2 bg-surface-sunken">
		<!--
			The page itself scrolls (not an inner box), so mobile browsers can collapse their own bars and
			the usual scroll gestures keep working. The top bar sticks to the top; the footer comes after
			the content and is reached by scrolling, or sits at the bottom edge when the content is short.
		-->
		<div class="sticky top-0 z-sticky">
			<TopBar />
		</div>
		<Box
			as="main"
			direction="col"
			class="flex-1 w-full max-w-screen-desktop mx-auto bg-surface">
			<slot></slot>
		</Box>
		<Footer />
	</Box>
</template>
