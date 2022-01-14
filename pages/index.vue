<template>
  <v-row
    align="center"
    justify="center"
  >
    <v-col
      v-for="card in resourceCards"
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
          <v-progress-circular
            v-if="$fetchState.pending"
            indeterminate
            color="primary"
          />
          <v-slide-x-transition>
            <div v-if="!$fetchState.pending && !$fetchState.error">
              {{ items[card.apiResource].length }} records
            </div>
            <div v-else-if="!$fetchState.pending && $fetchState.error">
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
      resourceCards: [{
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
      }]
    }
  },
  async fetch () {
    // https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/for...of#diferencia_entre_for...of_y_for...in
    // https://www.kuworking.com/javascript-loops-con-await-reduce
    for (const resource of this.resourceCards) {
      this.items[resource.apiResource] = await this.$axios
        .get(`api/${resource.apiResource}`)
        .then(response => response.data)
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated'])
  },
  methods: {
  }
}
</script>
