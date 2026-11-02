<template>
	<!-- A switch named "Dark theme": checked while the dark theme is on; the icon shows the active theme. -->
	<ClientOnly>
		<button
			type="button"
			role="switch"
			:aria-checked="isDark"
			:aria-label="props.labelled ? undefined : label"
			:title="props.labelled ? undefined : label"
			:class="buttonStyles({ labelled: props.labelled })"
			@click="handleToggleTheme">
			<component
				:is="isDark ? MoonIcon : SunIcon"
				:class="[
					{ 'animate-theme-icon': isAnimated },
					'size-4 shrink-0 text-accent-content'
				]"
				aria-hidden="true"
				@animationend="handleThemeIconAnimation"
				@animationcancel="handleThemeIconAnimation" />
			<span v-if="props.labelled" class="flex-1 text-left">{{ label }}</span>
			<span
				v-if="props.labelled"
				class="text-caption font-bold uppercase tracking-wide"
				:class="isDark ? 'text-accent-content' : 'text-content-muted'"
				aria-hidden="true">
				{{ isDark ? $t('organisms.themeSwitcher.on') : $t('organisms.themeSwitcher.off') }}
			</span>
		</button>
		<template #fallback>
			<span :class="buttonStyles({ labelled: props.labelled })" aria-hidden="true"></span>
		</template>
	</ClientOnly>
</template>
<script setup lang="ts">
import SunIcon from '~/components/icons/SunIcon.vue';
import MoonIcon from '~/components/icons/MoonIcon.vue';
import { tv } from '~/utils/tv';

const props = defineProps({
	/** Full-width variant with a visible label, used inside the mobile menu. */
	labelled: { type: Boolean, default: false }
});

const { $theme } = useNuxtApp();
const { t } = useI18n();
const isAnimated = ref(false);
const isDark = computed(() => $theme.isDark.value);
const label = computed(() => t('organisms.themeSwitcher.label'));

const handleToggleTheme = () => {
	isAnimated.value = true;
	$theme.isDark.value = !$theme.isDark.value;
};

const handleThemeIconAnimation = (event: AnimationEvent) => {
	if (event.animationName === 'theme-icon-spin') {
		isAnimated.value = false;
	}
};

const buttonStyles = tv({
	base: 'inline-flex items-center gap-3 rounded-full text-body-sm font-medium text-content-secondary cursor-pointer hover:bg-surface-hover focus-visible:outline-hidden focus-visible:shadow-focus-ring',
	variants: {
		labelled: {
			true: 'w-full h-11 px-4 border border-stroke',
			false: 'size-10 justify-center'
		}
	}
});
</script>
