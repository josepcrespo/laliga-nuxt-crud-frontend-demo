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
          v-for="(item, i) in items"
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
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            class="mx-2"
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
      <v-btn
        v-if="!isAuthenticated"
        to="/user-login"
        class="ml-2"
      >
        <v-icon left>
          mdi-login-variant
        </v-icon>
        Login
      </v-btn>
      <v-btn
        v-if="isAuthenticated"
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
      items: [
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
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Profile',
          to: '/user-profile'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'LaLiga'
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser'])
  },
  beforeMount () {
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
