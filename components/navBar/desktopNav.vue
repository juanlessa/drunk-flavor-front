<template>
	<header ref="menuElement" class="header-container">
		<div class="header-content">
			<NuxtLink to="/" class="logo-container">
				<img
					class="img-logo"
					:src="$getTheme() === 'light' ? '/light-logo.png' : '/dark-logo.png'"
					height="40"
					alt="DrunkFlavor"
				/>
				<span>DrunkFlavor</span>
			</NuxtLink>
			<div class="link-group">
				<NuxtLink v-for="l in props.links" :key="l.name" class="link-item" :to="l.path">
					{{ l.name }}
				</NuxtLink>
				<div v-show="showLogout" @click="handleLogout" class="link-item">logout</div>
				<ThemeSwitch />
			</div>
		</div>
	</header>
</template>
<script setup lang="ts">
const { $signOut } = useNuxtApp();

interface ILink {
	name: string;
	path: string;
}
const props = defineProps({
	links: {
		type: Array<ILink>,
		default: [],
	},
	showLogout: {
		type: Boolean,
		default: false,
	},
});

const handleLogout = () => {
	$signOut(true);
};
</script>
<style scoped>
.header-container {
	height: 5rem;
	width: 100vw;
	background-color: var(--primary-background);
}
.logo-container {
	display: flex;
	align-items: center;
	gap: 0.5rem;

	font-size: 2rem;
	color: var(--primary-color);
}
.header-content {
	width: 1190px;
	margin: auto;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 100%;
}

.img-logo {
	cursor: pointer;
}

.link-group {
	padding-right: 3rem;
	display: flex;
	align-items: center;
	gap: 2rem;
}

.link-item {
	font-size: 1.2rem;
	display: block;
	cursor: pointer;
}
</style>
