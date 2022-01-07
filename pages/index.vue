<template>
  <v-row
    align="center"
    justify="center"
  >
    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :search="search"
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
            <v-toolbar-title>
              <v-icon
                large
                left
              >
                mdi-account-group
              </v-icon>
              Teams
            </v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            />
            <v-btn
              class="mb-2 datatable-refresh-btn"
              @click="$fetch"
            >
              <v-icon left>
                mdi-sync
              </v-icon>
              Refresh Data
            </v-btn>
            <v-btn
              class="mb-2 datatable-new-btn"
              @click="$fetch"
            >
              <v-icon left>
                mdi-plus
              </v-icon>
              New Team
            </v-btn>
            <v-spacer />
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            />
          </v-toolbar>
        </template>
        <template #item="{ item }">
          <tr>
            <td>
              {{ item.id }}
            </td>
            <td>
              {{ item.name }}
            </td>
            <td>
              {{ item.emblem }}
            </td>
            <td>
              {{ item.salary_limit }}
            </td>
            <td
              v-if="isAuthenticated"
              style="text-align: right;"
            >
              <v-btn
                small
                class="datatable-edit-btn"
                @click="editItem(item)"
              >
                <v-icon left>
                  mdi-pencil
                </v-icon>
                Edit
              </v-btn>
              <v-btn
                small
                class="datatable-delete-btn"
                @click="deleteItem(item)"
              >
                <v-icon left>
                  mdi-delete
                </v-icon>
                Delete
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
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
      search: '',
      teams: []
    }
  },
  async fetch () {
    this.teams = await this.$axios.get('api/team')
      .then(response => response.data)
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
    headers () {
      const headers = [
        { text: 'Id', value: 'id' },
        { text: 'Name', value: 'name' },
        { text: 'Emblem', value: 'emblem' },
        { text: 'Salary Limit', value: 'salary_limit' }
      ]
      if (this.$auth.$state.loggedIn) {
        headers.push({
          align: 'center',
          text: 'Actions',
          value: 'actions',
          sortable: false
        })
      }
      return headers
    }
  },
  methods: {
    editItem (item) {
      console.log(item)
      // this.editedIndex = this.desserts.indexOf(item)
      // this.editedItem = Object.assign({}, item)
      // this.dialog = true
    },
    deleteItem (item) {
      console.log(item)
      // this.editedIndex = this.desserts.indexOf(item)
      // this.editedItem = Object.assign({}, item)
      // this.dialogDelete = true
    }
  }
}
</script>
