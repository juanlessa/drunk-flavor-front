import { colors, fontSizes, fontWeights, fonts, lineHeights, radii, space } from './src/tokens';
import type { Config } from 'tailwindcss';

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'selector',
	content: [
		'./src/components/**/*.{js,vue,ts}',
		'./src/layouts/**/*.vue',
		'./src/pages/**/*.vue',
		'./src/nuxt.config.{js,ts}',
		'./src/app.vue'
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
				tablet: '767px',
				desktop: '1190px'
			},
			backgroundImage: {
				'loading-gradient':
					'linear-gradient(to right, #d1d5db 0%, #e5e7eb 10%, #d1d5db 20%, #d1d5db 100%)',
				'loading-dark-gradient':
					'linear-gradient(to right, #374151 0%, #4b5563 10%, #374151 20%, #374151 100%)'
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
			},
			keyframes: {
				loadingAnimate: {
					'0%': { backgroundPosition: '50% 0' },
					'100%': { backgroundPosition: '-150% 0' }
				}
			},
			animation: {
				loading: 'loadingAnimate 1.2s linear infinite'
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
