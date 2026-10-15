<template>
	<Box
		direction="row"
		class="w-screen min-h-screen items-center justify-center bg-surface tablet:bg-surface-sunken">
		<Box
			as="main"
			direction="col"
			class="flex-1 max-w-auth-panel gap-10 p-4 rounded-auth-panel bg-surface tablet:shadow-card">
			<Box direction="row" class="h-auth-logo justify-center">
				<Anchor :to="localePath('/')">
					<Image src="/light-logo.png" alt="Drunk Flavor logo" />
				</Anchor>
			</Box>
			<slot></slot>
		</Box>
	</Box>
</template>
<script setup lang="ts">
const localePath = useLocalePath();
</script>
