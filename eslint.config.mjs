import withNuxt from './.nuxt/eslint.config.mjs';
import eslintConfigPrettier from 'eslint-config-prettier';

export default withNuxt([
	eslintConfigPrettier,
	{
		rules: {
			'vue/multi-word-component-names': 'off',
			'vue/no-v-model-argument': 'off',
			'vue/no-v-for-template-key': 'off',
			'vue/max-len': [
				'error',
				{
					code: 120,
					template: 120,
					comments: 120,
					ignorePattern: '',
					ignoreComments: false,
					ignoreTrailingComments: false,
					ignoreUrls: false,
					ignoreStrings: true,
					ignoreTemplateLiterals: false,
					ignoreRegExpLiterals: false,
					ignoreHTMLAttributeValues: true,
					ignoreHTMLTextContents: false
				}
			],
			'vue/first-attribute-linebreak': [
				'error',
				{
					singleline: 'ignore',
					multiline: 'ignore'
				}
			],
			'vue/no-v-html': 'off',
			'import/named': 'off',
			'comma-dangle': ['error', 'never'],
			quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }]
		}
	},
	{
		// The `tv` exported by tailwind-variants does not know the design-system tokens,
		// so its merge config silently drops custom text colours/sizes.
		// Recipes must use the configured instance instead.
		ignores: ['app/utils/tv.ts'],
		rules: {
			'no-restricted-imports': [
				'error',
				{
					paths: [
						{
							name: 'tailwind-variants',
							message:
								"Import { tv } from '~/utils/tv' so the design-system merge config applies."
						}
					]
				}
			]
		}
	}
]);
