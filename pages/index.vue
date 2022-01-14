<template>
  <v-row
    align="center"
    justify="center"
  >
    <v-col cols="12">
      <h1>LaLiga</h1>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'IndexPage',
  auth: false,
  data () {
    return {}
  },
  async fetch () {
    this.teams = await this.$axios.get('api/team')
      .then(response => response.data)
  },
  computed: {
    ...mapGetters(['isAuthenticated'])
  },
  methods: {
  }
}
</script>
