module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    // https://vuetifyjs.com/en/components/data-tables/#slots
    'vue/valid-v-slot': [
      'error', { allowModifiers: true }
    ]
  }
}
