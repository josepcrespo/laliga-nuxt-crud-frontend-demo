<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in navigationDrawerItems"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-menu
        open-on-hover
        offset-y
      >
        <template #activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-translate</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="lang in languages"
            :key="lang.abbr"
            :input-value="$vuetify.lang.current === lang.abbr"
            @click="$vuetify.lang.current = lang.abbr"
          >
            <v-list-item-title>
              {{ lang.name }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            class="mx-1"
            icon
            v-bind="attrs"
            @click="$vuetify.theme.dark = !$vuetify.theme.dark"
            v-on="on"
          >
            <v-icon>
              {{ $vuetify.theme.dark
                ? 'mdi-lightbulb-outline'
                : 'mdi-lightbulb-on' }}
            </v-icon>
          </v-btn>
        </template>
        <span>Switch app theme</span>
      </v-tooltip>
      <v-tooltip
        v-if="isAuthenticated"
        bottom
      >
        <template #activator="{ on, attrs }">
          <v-btn
            class="mx-1"
            icon
            to="/user-profile"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>
              mdi-account-circle
            </v-icon>
          </v-btn>
        </template>
        <span>User profile</span>
      </v-tooltip>
      <v-btn
        v-if="!isAuthenticated"
        to="/user-login"
      >
        <v-icon left>
          mdi-login-variant
        </v-icon>
        Login
      </v-btn>
      <v-btn
        v-if="isAuthenticated"
        class="ml-1"
        @click="userLogout"
      >
        <v-icon left>
          mdi-logout-variant
        </v-icon>
        Logout
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <!-- https://nuxtjs.org/docs/features/data-fetching/#caching -->
        <nuxt keep-alive />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DefaultLayout',
  data () {
    return {
      clipped: true,
      darkTheme: false,
      drawer: true,
      fixed: false,
      languages: [
        { name: 'English', abbr: 'en' },
        { name: 'Castellano', abbr: 'es' },
        { name: 'Català', abbr: 'ca' }
      ],
      navigationDrawerItems: [
        {
          icon: 'mdi-apps',
          title: 'Home',
          to: '/'
        },
        {
          icon: 'mdi-account-group',
          title: 'Teams',
          to: '/teams'
        },
        {
          icon: 'mdi-account',
          title: 'Players',
          to: '/players'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'LaLiga'
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated'])
  },
  beforeMount () {
    const browserLanguage = window.navigator.language.slice(0, 2)
    this.$vuetify.lang.current =
      this.languages.map(obj => obj.abbr)
        .includes(browserLanguage)
        ? browserLanguage
        : 'en'
    this.darkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (this.darkTheme) {
      this.$vuetify.theme.dark = this.darkTheme
    }
    // eslint-disable-next-line no-console
    console.info('Using Vuetify dark theme: %o', this.darkTheme)
  },
  methods: {
    async userLogout () {
      await this.$auth.logout()
      // @nuxtjs/auth automatically removes the
      // Authorization header from Axios headers
      // console.log(
      //   'Axios Headeres after logout: %o',
      //   this.$axios.defaults.headers
      // )
    }
  }
}
</script>
