import { useDark, useToggle } from '@vueuse/core';

export default defineNuxtPlugin({
	name: 'theme',
	parallel: true,
	setup() {
		const isDark = useDark({ disableTransition: false });
		const toggle = useToggle(isDark);
		const get = () => (isDark.value ? 'dark' : 'light');

		return {
			provide: {
				theme: {
					toggle,
					isDark,
					get
				}
			}
		};
	}
});
