import { screens } from '~/tokens';
import { ref, onMounted, onUnmounted } from 'vue';

type ScreenType = 'mobile' | keyof typeof screens;

export const useScreenType = () => {
	const defaultScreen = 'mobile';
	const screenType = ref<ScreenType>(defaultScreen);

	const updateScreenType = () => {
		const width = window.innerWidth;
		let currentType = defaultScreen;

		Object.entries(screens).forEach(([screen, minWidth]) => {
			const parsedMinWidth = parseInt(minWidth.replace(/\D/g, ''));
			if (width >= parsedMinWidth) {
				currentType = screen;
			}
		});

		screenType.value = currentType as ScreenType;
	};

	onMounted(() => {
		updateScreenType();
		window.addEventListener('resize', updateScreenType);
	});

	onUnmounted(() => {
		window.removeEventListener('resize', updateScreenType);
	});

	return {
		screenType
	};
};
