// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint'
    },
    env: {
        browser: true
    },
    extends: [
        // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
        // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
        'plugin:vue/essential',
        // https://github.com/standard/standard/blob/master/docs/RULES-en.md
        'standard'
    ],
    // required to lint *.vue files
    plugins: ['js', 'html'],
    // add your custom rules here
    rules: {
        // don't require .vue extension when importing
        'import/extensions': ['error', 'never'],
        indent: [
            'error',
            2,
            {
                SwitchCase: 1
            }
        ],
        eqeqeq: 'off', // 由于接口返回的某些字段类型（String和Number）不规范,所以暂时允许使用==
        // 在函数括号之前不允许使用空格
        'space-before-function-paren': ['error', 'never'],
        // 通过 UglifyJS 过滤 console & debugger
        'no-debugger': 0,
        'no-console': 0,
        // allow async-await
        'generator-star-spacing': 'off',
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    }
}