<template>
  <v-row
    align="center"
    justify="center"
  >
    <v-col
      v-for="card in entityCards"
      :key="card.apiResource"
      cols="12"
      sm="6"
    >
      <v-card
        :color="card.color"
        class="pa-3"
      >
        <v-slide-y-transition>
          <v-card-title
            v-if="!$fetchState.pending"
            class="text-h3 mb-3"
          >
            <v-icon class="mr-2 text-h3">
              {{ card.icon }}
            </v-icon>
            {{ card.title }}
          </v-card-title>
        </v-slide-y-transition>
        <v-card-subtitle class="text-h4">
          <v-progress-linear
            v-if="$fetchState.pending"
            color="primary"
            height="10"
            indeterminate
            rounded
          />
          <v-slide-x-transition>
            <div
              v-if="
                !$fetchState.pending &&
                  !$fetchState.error &&
                  items[card.apiResource]
              "
            >
              {{ items[card.apiResource].length }} records
            </div>
            <div v-else-if="!$fetchState.pending">
              Error fetching data…
            </div>
          </v-slide-x-transition>
        </v-card-subtitle>
        <v-card-actions>
          <v-spacer />
          <v-slide-y-reverse-transition>
            <v-btn
              v-if="!$fetchState.pending"
              outlined
              :to="card.to"
            >
              View
            </v-btn>
          </v-slide-y-reverse-transition>
        </v-card-actions>
      </v-card>
      <snack-bar
        ref="snackBar"
        :color="snackBar.color"
        :text="snackBar.text"
      />
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'IndexPage',
  auth: false,
  data () {
    return {
      items: {},
      entityCards: [{
        apiResource: 'team',
        color: 'brown',
        icon: 'mdi-account-group',
        title: 'Teams',
        to: '/teams'
      }, {
        apiResource: 'player',
        color: 'blue-grey',
        icon: 'mdi-account',
        title: 'Players',
        to: '/players'
      }],
      snackBar: {
        color: undefined,
        text: ''
      }
    }
  },
  async fetch () {
    try {
    // https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/for...of#diferencia_entre_for...of_y_for...in
    // https://www.kuworking.com/javascript-loops-con-await-reduce
      for (const resource of this.entityCards) {
        this.items[resource.apiResource] = await this.$axios
          .get(`api/${resource.apiResource}`)
          .then(response => response.data)
      }
    } catch (e) {
      this.checkingCredentials = false
      let userFriendlyMessage
      switch (e.message) {
        case 'Network Error':
          userFriendlyMessage = 'Could not establish connection with "LaLiga API".'
          break
        // e.response.status === 401
        case 'Request failed with status code 401':
          userFriendlyMessage = 'Invalid credentials. Try again!'
          break
        default:
          userFriendlyMessage = 'Oops! An unexpected error occurred.'
      }
      // eslint-disable-next-line no-console
      console.error(`${userFriendlyMessage} %o`, e.message)
      this.snackBar.color = 'red'
      this.snackBar.text = userFriendlyMessage
      this.$refs.snackBar.show()
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated'])
  }
}
</script>

<style lang="scss" scoped>
.v-card {
  &.theme--dark {
    background: linear-gradient(
      356deg,
      rgba(255, 255, 255, 0.33) 20%,
      transparent,
      rgba(0, 0, 0, 0.33) 85%,
    );
  }

  &.theme--light {
    background: linear-gradient(
      356deg,
      rgba(0, 0, 0, 0.33) 20%,
      transparent,
      rgba(255, 255, 255, 0.33) 85%,
    );
  }
}
</style>
