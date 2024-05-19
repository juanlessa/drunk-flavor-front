import withNuxt from './.nuxt/eslint.config.mjs'
import eslintConfigPrettier from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'
import vuePlugin from 'eslint-plugin-vue'

export default withNuxt(eslintConfigPrettier, {
    files: ['./**/*.js', './**/*.ts', './**/*.vue'],
    plugins: {
        vue: vuePlugin,
        prettier: prettierPlugin
    },
    languageOptions: {
        parserOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module'
        }
    },
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
        '@typescript-eslint/consistent-type-imports': 'error',
        'prettier/prettier': 'error',
        'comma-dangle': ['error', 'never'],
        quotes: ['error', 'single']
    }
})
