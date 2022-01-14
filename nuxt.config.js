import colors from 'vuetify/es5/util/colors'
import { en, es, ca } from 'vuetify/lib/locale'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Nuxt frontend demo',
    title: 'LaLiga',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/main.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/vuex-persist', ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],

  router: {
    // This middleware comes from `@nuxtjs/auth` module.
    // https://auth.nuxtjs.org/guide/middleware
    middleware: ['auth']
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: 'https://localhost'
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    lang: {
      locales: { en, es, ca },
      current: 'en'
    },
    theme: {
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // https://auth.nuxtjs.org/
  auth: {
    // https://auth.nuxtjs.org/api/options#redirect
    redirect: {
      login: '/user-login',
      logout: '/',
      callback: '/user-login',
      home: '/'
    },
    strategies: {
      // https://auth.nuxtjs.org/schemes/local
      local: {
        // https://auth.nuxtjs.org/schemes/local#endpoints
        endpoints: {
          login: {
            url: 'login',
            method: 'post',
            propertyName: 'data'
          },
          logout: false,
          user: false
        },
        // https://auth.nuxtjs.org/schemes/local#token
        token: {
          property: 'data.api_token',
          required: true,
          global: true,
          name: 'Authorization',
          type: 'Bearer'
        },
        // https://auth.nuxtjs.org/schemes/local#user
        user: {
          autoFetch: false
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
