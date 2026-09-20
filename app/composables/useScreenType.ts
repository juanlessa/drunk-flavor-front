import { ref, onMounted, onUnmounted } from 'vue';

type ScreenType = 'mobile' | 'tablet' | 'desktop';

let hasLoggedScreenTypeError = false;

const logScreenTypeError = (reason: string) => {
	if (hasLoggedScreenTypeError) return;

	hasLoggedScreenTypeError = true;
	console.error(`[useScreenType] Unable to detect the screen type: ${reason}`);
};

export const useScreenType = () => {
	const screenType = ref<ScreenType>('mobile');
	let tabletMediaQuery: MediaQueryList | undefined;
	let desktopMediaQuery: MediaQueryList | undefined;

	const updateScreenType = () => {
		if (!tabletMediaQuery || !desktopMediaQuery) return;

		screenType.value = desktopMediaQuery.matches
			? 'desktop'
			: tabletMediaQuery.matches
				? 'tablet'
				: 'mobile';
	};

	onMounted(() => {
		if (
			typeof window === 'undefined' ||
			typeof document === 'undefined' ||
			typeof window.getComputedStyle !== 'function' ||
			typeof window.matchMedia !== 'function'
		) {
			logScreenTypeError('required browser APIs are not available.');
			return;
		}

		const styles = window.getComputedStyle(document.documentElement);
		const tabletBreakpoint = styles.getPropertyValue('--breakpoint-tablet').trim();
		const desktopBreakpoint = styles.getPropertyValue('--breakpoint-desktop').trim();

		if (!tabletBreakpoint || !desktopBreakpoint) {
			logScreenTypeError(
				'CSS tokens --breakpoint-tablet and --breakpoint-desktop must be defined.'
			);
			return;
		}

		tabletMediaQuery = window.matchMedia(`(min-width: ${tabletBreakpoint})`);
		desktopMediaQuery = window.matchMedia(`(min-width: ${desktopBreakpoint})`);

		if (
			typeof tabletMediaQuery.addEventListener !== 'function' ||
			typeof tabletMediaQuery.removeEventListener !== 'function' ||
			typeof desktopMediaQuery.addEventListener !== 'function' ||
			typeof desktopMediaQuery.removeEventListener !== 'function'
		) {
			tabletMediaQuery = undefined;
			desktopMediaQuery = undefined;
			logScreenTypeError('MediaQueryList change listeners are not available.');
			return;
		}

		updateScreenType();
		tabletMediaQuery.addEventListener('change', updateScreenType);
		desktopMediaQuery.addEventListener('change', updateScreenType);
	});

	onUnmounted(() => {
		tabletMediaQuery?.removeEventListener('change', updateScreenType);
		desktopMediaQuery?.removeEventListener('change', updateScreenType);
	});

	return {
		screenType
	};
};
