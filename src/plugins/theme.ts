import { useDark, useToggle } from '@vueuse/core';

export default defineNuxtPlugin(() => {
	const isDark = useDark();
	const toggle = useToggle(isDark);
	const get = () => (isDark.value ? 'dark' : 'light');

	return {
		provide: {
			theme: {
				toggle,
				get,
				isDark
			}
		}
	};
});
