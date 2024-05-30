import { colors, fontSizes, fontWeights, fonts, lineHeights, radii, space } from './tokens';
import type { Config } from 'tailwindcss';

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: [
		'./components/**/*.{js,vue,ts}',
		'./layouts/**/*.vue',
		'./pages/**/*.vue',
		'./nuxt.config.{js,ts}',
		'./app.vue'
	],
	theme: {
		colors: colors,
		spacing: space,
		fontFamily: fonts,
		fontSize: fontSizes,
		fontWeight: fontWeights,
		lineHeight: lineHeights,
		borderRadius: radii,
		extend: {
			screens: {
				tablet: '768px',
				desktop: '1190px'
			},
			boxShadow: {
				'dark-card': '0 0.25rem 0.25rem rgba(0,0,0,0.85)',
				'light-card': '0 0.25rem 0.25rem rgba(0,0,0,0.25)',
				sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
				DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
				md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
				lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
				xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
				'2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
				inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
				none: 'none'
			}
		}
	},
	variants: {
		extend: {
			backgroundColor: ['disabled'],
			textColor: ['disabled']
		}
	},
	plugins: []
} satisfies Config;
