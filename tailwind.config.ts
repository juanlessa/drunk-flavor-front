import { colors } from './tokens'
import type { Config } from 'tailwindcss'

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
            },
            colors: {
                transparent: 'transparent',
                inherit: 'inherit',
                white: '#FFFFFF',
                black: '#000000',
                txt: {
                    dark: '#14213D',
                    light: '#FFFFFF'
                },
                light: {
                    theme: '#4E86E4',
                    primary: '#FFFFFF',
                    secondary: '#F0F5F5',
                    error: '#E60000',
                    cancel: '#E6E6FA',
                    delete: '#E60000',
                    'select-file': '#81d8d0'
                },
                dark: {
                    theme: '#FFD700',
                    primary: '#262528',
                    secondary: '#3F3F41',
                    error: '#FF3333',
                    cancel: '#525161',
                    delete: '#CC0000',
                    'select-file': '#626A61'
                },
                gray: colors.gray
            }
        }
    },
    plugins: []
} satisfies Config
