import { useDark, useToggle } from '@vueuse/core';

export default defineNuxtPlugin({
	name: 'theme',
	parallel: true,
	setup() {
		const isDark = useDark({ disableTransition: false });
		const toggle = useToggle(isDark);
		const get = () => (isDark.value ? 'dark' : 'light');

		useHead(() => ({
			meta: [
				{
					key: 'theme-color',
					name: 'theme-color',
					content: isDark.value ? '#0B1220' : '#F1F5F9'
				}
			]
		}));

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
