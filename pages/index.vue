<template>
  <v-row
    v-resize="onResize"
    align="center"
    justify="center"
  >
    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :search="search"
        :items="teams"
        :items-per-page="5"
        :sort-by.sync="sortBy"
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
              :icon="btnsAsIcns"
              :small="btnsAsIcns"
              class="mr-3 datatable-refresh-btn"
              @click="$fetch"
            >
              <v-icon>
                mdi-sync
              </v-icon>
              <div
                v-show="btnsAsIcns === false"
                class="ml-2"
              >
                Refresh Data
              </div>
            </v-btn>
            <v-dialog
              v-model="dialog"
              max-width="800px"
            >
              <template #activator="{ on, attrs }">
                <v-btn
                  :icon="btnsAsIcns"
                  :small="btnsAsIcns"
                  class="mr-3 datatable-new-btn"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>
                    mdi-plus
                  </v-icon>
                  <div
                    v-show="btnsAsIcns === false"
                    class="ml-2"
                  >
                    New Team
                  </div>
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="editedItem.name"
                          label="Name"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="editedItem.emblem"
                          label="Emblem"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="editedItem.salary_limit"
                          label="Salary Limit (€)"
                        />
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    color="red"
                    text
                    @click="close"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    color="blue"
                    text
                    @click="save"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-spacer />
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            />
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5">
                  Delete team
                </v-card-title>
                <v-card-text>
                  Are you sure you want to delete the "{{ editedItem.name }}" team?
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="red" text @click="closeDelete">
                    Cancel
                  </v-btn>
                  <v-btn color="blue" text @click="deleteItemConfirm">
                    OK
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
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
                :icon="btnsAsIcns"
                :small="!btnsAsIcns"
                class="datatable-edit-btn"
                @click="editItem(item)"
              >
                <v-icon>
                  mdi-pencil
                </v-icon>
                <div
                  v-show="btnsAsIcns === false"
                  class="ml-2"
                >
                  Edit
                </div>
              </v-btn>
              <v-btn
                :icon="btnsAsIcns"
                :small="!btnsAsIcns"
                class="datatable-delete-btn ml-2"
                @click="deleteItem(item)"
              >
                <v-icon>
                  mdi-delete
                </v-icon>
                <div
                  v-show="btnsAsIcns === false"
                  class="ml-2"
                >
                  Delete
                </div>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-snackbar
        v-model="snackbar.model"
        :color="snackbar.color"
        :timeout="snackbar.timeout"
      >
        {{ snackbar.text }}
        <template #action="{ attrs }">
          <v-btn
            text
            v-bind="attrs"
            @click="snackbar.model = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
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
      btnsAsIcns: false,
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {
        name: '',
        emblem: '',
        salary_limit: 0
      },
      defaultItem: {
        name: '',
        emblem: '',
        salary_limit: 0
      },
      search: '',
      snackbar: {
        color: undefined,
        model: false,
        text: '',
        timeout: 10000
      },
      sortBy: 'id',
      teams: [],
      windowSize: {
        x: 0,
        y: 0
      }
    }
  },
  async fetch () {
    this.teams = await this.$axios.get('api/team')
      .then(response => response.data)
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
    formTitle () {
      return this.editedIndex === -1 ? 'New Team' : 'Edit Team'
    },
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
  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    }
  },
  mounted () {
    this.onResize()
  },
  methods: {
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    deleteItem (item) {
      this.editedIndex = this.teams.indexOf(item)
      this.dialogDelete = true
    },
    deleteItemConfirm () {
      this.$axios
        .delete(`api/team/${this.editedItem.id}`)
        .then((response) => {
          this.teams.splice(this.editedIndex, 1)
          this.snackbar.text =
            `The team "${this.editedItem.name}"
             has been successfully removed from the database.`
        })
        .catch((error) => {
          this.snackbar.text = error.response.data.message
          this.snackbar.color = 'red'
        }).finally(() => {
          this.snackbar.model = true
        })
      this.closeDelete()
    },
    editItem (item) {
      this.editedIndex = this.teams.indexOf(item)
      delete item.timestamp
      delete item.players
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    onResize () {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight }
      if (this.windowSize.x <= 750) {
        this.btnsAsIcns = true
      } else {
        this.btnsAsIcns = false
      }
    },
    save () {
      Object.assign(this.teams[this.editedIndex], this.editedItem)
      if (this.editedIndex > -1) {
        this.$axios.put(`api/team/${this.editedItem.id}`, this.editedItem)
          .then((response) => {
            this.snackbar.color = 'green'
            this.snackbar.text =
              `The team "${this.editedItem.name}"
               has been successfully modified and saved to the database.`
          })
          .catch((error) => {
            this.snackbar.text = error.response.data.message
            this.snackbar.color = 'red'
          }).finally(() => {
            this.snackbar.model = true
            this.$fetch()
            this.close()
          })
      } else {
        this.$axios.post('api/team', this.editedItem)
          .then((response) => {
            this.teams.push(this.editedItem)
            this.snackbar.color = 'green'
            this.snackbar.text =
              `The team "${this.editedItem.name}"
               has been successfully added to the database.`
          })
          .catch((error) => {
            this.snackbar.text = error.response.data.message
            this.snackbar.color = 'red'
          }).finally(() => {
            this.snackbar.model = true
            this.$fetch()
            this.close()
          })
      }
    }
  }
}
</script>
