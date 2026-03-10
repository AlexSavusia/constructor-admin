module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'plugin:react/recommended',
        'plugin:@tanstack/eslint-plugin-query/recommended',
        'plugin:storybook/recommended',
        'airbnb',
        'plugin:prettier/recommended',
    ],
    overrides: [
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'react', '@tanstack/query'],
    ignorePatterns: ['*.svg', '*.json'],
    rules: {
        'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
        'import/no-unresolved': 'off',
        'import/prefer-default-export': 'off',
        'no-unused-vars': 'warn',
        'react/require-default-props': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/jsx-props-no-spreading': 'warn',
        'react/function-component-definition': 'off',
        'no-shadow': 'off',
        'import/extensions': 'off',
        'import/no-extraneous-dependencies': 'off',
        'no-underscore-dangle': 'off',
        'no-unused-expressions': 'off',
        'no-param-reassign': 'off',
        'no-undef': 'off',
        'react/jsx-max-props-per-line': ['error', { maximum: 3 }],
        'prettier/prettier': ['error', { arrowParens: 'always' }],
    },
};
