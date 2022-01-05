<template>
  <v-row
    align="center"
    justify="center"
  >
    <v-col cols="12">
      <div class="text-h2 d-flex align-start mt-4">
        <v-icon
          size="60"
          left
        >
          mdi-account-group
        </v-icon>
        Teams
      </div>
    </v-col>
    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="teams"
        :items-per-page="5"
        :loading="$fetchState.pending"
        loading-text="Loading teams data… Please wait"
        class="elevation-1"
      >
        <template #top>
          <v-toolbar
            flat
          >
            <v-spacer />
            <v-btn
              class="mb-2"
              @click="$fetch"
            >
              Refresh data
            </v-btn>
          </v-toolbar>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'IndexPage',
  auth: false,
  data () {
    return {
      headers: [
        { text: 'Id', value: 'id' },
        { text: 'Name', value: 'name' },
        { text: 'Emblem', value: 'emblem' },
        { text: 'Salary Limit', value: 'salary_limit' }
      ],
      teams: []
    }
  },
  async fetch () {
    this.teams = await this.$axios.get('api/team')
      .then(response => response.data)
  }
}
</script>
