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
        :items="items"
        :items-per-page="8"
        :sort-by="sortBy"
        :loading="$fetchState.pending"
        :loading-text="`Loading ${entityPlural} data… Please wait`"
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
                {{ icon }}
              </v-icon>
              <span class="text-capitalize">
                {{ entityPlural }}
              </span>
            </v-toolbar-title>
            <v-divider
              class="
                mx-4"
              inset
              vertical
            />
            <v-btn
              :icon="btnsAsIcns"
              :small="btnsAsIcns"
              class="mr-3 datatable-refresh-btn"
              @click="$fetch"
            >
              <v-icon v-if="$fetchState.pending">
                mdi-sync mdi-spin
              </v-icon>
              <v-icon v-else>
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
                    class="ml-2 text-capitalize"
                  >
                    New {{ entity }}
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
                      <v-col cols="12">
                        <v-form
                          v-model="itemForm.model"
                          lazy-validation
                        >
                          <v-row>
                            <v-col cols="12">
                              <v-alert
                                v-for="(error, index) in itemForm.errors"
                                :key="index"
                                border="top"
                                colored-border
                                type="error"
                                elevation="2"
                              >
                                {{ error }}
                              </v-alert>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col
                              v-for="prop in filterItemProps('editableProps', editedItem, true)"
                              :key="prop.name"
                              cols="12"
                              sm="6"
                              md="4"
                            >
                              <v-text-field
                                v-if="['text', 'email'].includes(getEditableProp(prop.name).type)"
                                v-model="editedItem[prop.name]"
                                :label="getEditableProp(prop.name).text"
                                :type="getEditableProp(prop.name).type"
                                :required="getEditableProp(prop.name).required"
                                :rules="[
                                  v => (getEditableProp(prop.name).required ? !!v : true) || 'Required',
                                  v => (getEditableProp(prop.name).type === 'email' ? /.+@.+\..+/.test(v) : true) || 'E-mail must be valid',
                                ]"
                              />
                              <v-text-field
                                v-else-if="getEditableProp(prop.name).type === 'number'"
                                v-model.number="editedItem[prop.name]"
                                :label="getEditableProp(prop.name).text"
                                :required="getEditableProp(prop.name).required"
                                :rules="[v => (getEditableProp(prop.name).required ? !!v : true) || 'Required']"
                                type="number"
                              />
                              <v-text-field
                                v-else-if="getEditableProp(prop.name).type === 'date'"
                                v-model="editedItem[prop.name]"
                                :label="getEditableProp(prop.name).text"
                                :required="getEditableProp(prop.name).required"
                                :rules="[v => (getEditableProp(prop.name).required ? !!v : true) || 'Required']"
                                type="date"
                              />
                              <v-select
                                v-else-if="getEditableProp(prop.name).type === 'enum'"
                                v-model="editedItem[prop.name]"
                                :items="getEditableProp(prop.name).enumArray"
                                :label="getEditableProp(prop.name).text"
                                :rules="[v => (getEditableProp(prop.name).required ? !!v : true) || 'Required']"
                              />
                              <v-select
                                v-else-if="getEditableProp(prop.name).type === 'relation'"
                                v-model="editedItem[prop.name][getEditableProp(prop.name).relationId]"
                                :items="itemsFromRelations[prop.name]"
                                :item-text="getEditableProp(prop.name).relationValue"
                                :item-value="getEditableProp(prop.name).relationId"
                                :label="getEditableProp(prop.name).text"
                                :multiple="getEditableProp(prop.name).multiple"
                                :return-object="false"
                                :rules="[v => (getEditableProp(prop.name).required ? !!v : true) || 'Required']"
                              />
                            </v-col>
                          </v-row>
                        </v-form>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    text
                    @click="close"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    color="blue"
                    text
                    :disabled="itemForm.model === false"
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
              <v-card color="red darken-4 delete-item-modal">
                <v-card-title class="text-h5">
                  Delete {{ entity }}
                </v-card-title>
                <v-card-text>
                  <div class="subtitle-1 font-weight-bold">
                    <v-icon
                      class="mr-2"
                      color="yellow"
                    >
                      mdi-alert
                    </v-icon>
                    The "<span class="font-weight-black">{{ editedItem.name }}</span>"
                    {{ entity }} will be eliminated <u>definitively</u>.
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    text
                    color="red"
                    @click="deleteItemConfirm"
                  >
                    Delete
                  </v-btn>
                  <v-btn
                    text
                    @click="closeDelete"
                  >
                    Cancel
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template #item="{ item }">
          <tr>
            <td
              v-for="prop in filterItemProps('datatableHeaders', item)"
              :key="prop.name"
            >
              <template v-if="typeof prop.value !== 'object'">
                {{ prop.value }}
              </template>
              <template v-else-if="typeof prop.value === 'object' && prop.value !== null">
                {{ getRelatedItemName(prop.value, prop.name) }}
              </template>
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
  name: 'DatatableCrud',
  props: {
    datatableHeaders: {
      required: true,
      type: Array
    },
    editableProps: {
      required: true,
      type: Array
    },
    entity: {
      required: true,
      type: String
    },
    entityPlural: {
      required: true,
      type: String
    },
    icon: {
      required: true,
      type: String
    },
    removePropsBeforeSend: {
      default () {
        // It should be an array or strings.
        return []
      },
      required: false,
      type: Array
    },
    sortBy: {
      default: 'id',
      required: false,
      type: String
    }
  },
  auth: false,
  data () {
    return {
      btnsAsIcns: false,
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {},
      defaultItem: {},
      itemForm: {
        errors: [],
        model: true
      },
      items: [],
      itemsFromRelations: {},
      search: '',
      snackBar: {
        color: undefined,
        text: ''
      },
      windowSize: {
        x: 0,
        y: 0
      }
    }
  },
  async fetch () {
    try {
      this.items = await this.getResourceList(this.entity)
      this.editableProps.filter((prop) => {
        return prop.type === 'relation'
      }).forEach(async (relation) => {
        const tempItemsList = await this.getResourceList(relation.value)
        if (relation.required === false) {
          tempItemsList.unshift({ id: 0, name: `[Without ${relation.value}]` })
        }
        this.itemsFromRelations[relation.value] = tempItemsList
      })
    } catch (catchEvent) {
      this.checkingCredentials = false
      let userFriendlyMessage
      switch (catchEvent.message) {
        case 'Network Error':
          userFriendlyMessage = 'Could not establish connection with "LaLiga API".'
          break
        case 'Request failed with status code 401':
          userFriendlyMessage = 'Invalid credentials. Try again!'
          break
        default:
          userFriendlyMessage = 'Oops! An unexpected error occurred.'
      }
      // eslint-disable-next-line no-console
      console.error(`${userFriendlyMessage} %o`, catchEvent.message)
      this.snackBar.color = 'red'
      this.snackBar.text = userFriendlyMessage
      this.$refs.snackBar.show()
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
    formTitle () {
      return this.editedIndex === -1
        ? `New ${this.entity}`
        : `Edit ${this.entity}`
    },
    headers () {
      const tempHeaders = this.datatableHeaders
      if (this.isAuthenticated) {
        tempHeaders.push({
          align: 'center',
          text: 'Actions',
          value: 'actions',
          sortable: false
        })
      }
      return tempHeaders
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
  created () {
    this.initItemTemplates()
  },
  mounted () {
    this.onResize()
  },
  methods: {
    close () {
      this.itemForm.errors = []
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
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    deleteItemConfirm () {
      this.$axios
        .delete(`api/${this.entity}/${this.editedItem.id}`)
        .then((response) => {
          this.items.splice(this.editedIndex, 1)
          this.snackBar.color = 'green'
          this.snackBar.text =
            `The ${this.entity} "${this.editedItem.name}"
             has been successfully removed from the database.`
          this.$refs.snackBar.show()
        })
        .catch((e) => {
          const errorMessage = e.response?.data?.form?.message || e.message
          // eslint-disable-next-line no-console
          console.error(errorMessage)
          this.snackBar.color = 'red'
          this.snackBar.text = errorMessage
          this.$refs.snackBar.show()
        })
    },
    editItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.initNullRelationsForVueModel()
      this.dialog = true
    },
    filterItemProps (propsArrName, item, withoutId) {
      withoutId = withoutId || false
      // itemProp[0] contains an item prop key
      // itemProp[1] contains the item prop value for the key on itemProp[0]
      return Object.entries(item).filter((itemProp) => {
        if (
          this[propsArrName]
            .map(item => item.value)
            .includes(itemProp[0])
        ) {
          if (
            withoutId === false ||
            (withoutId && itemProp[0] !== 'id')
          ) {
            return { [itemProp[0]]: itemProp[1] }
          }
        }
        return false
      }).map((obj) => {
        return {
          name: obj[0],
          value: obj[1]
        }
      })
    },
    getEditableProp (value) {
      return this.editableProps.find(obj => obj.value === value)
    },
    getDefaultValueByType (prop) {
      let defaultValue
      switch (prop.type) {
        case 'text':
        case 'date':
        case 'enum':
        case 'email':
          defaultValue = ''
          break
        case 'number':
          defaultValue = 0
          break
        case 'relation':
          defaultValue = {
            [prop.relationId]: 0
          }
          break
        default:
          defaultValue = null
      }
      return defaultValue
    },
    getRelatedItemName (object, itemPropKey) {
      return object[
        this.datatableHeaders
          .find(obj => obj.value === itemPropKey)
          .relationValue
      ]
    },
    async getResourceList (entity) {
      entity = entity || this.entity
      return await this.$axios
        .get(`api/${entity}`)
        .then(response => response.data)
    },
    /**
     * If `this.editableProps` respects the same order of properties as the API,
     * the elements of the "New" and "Edit" forms will respect the same order.
     */
    initItemTemplates () {
      this.editableProps.forEach((prop) => {
        this.defaultItem[prop.value] = this.getDefaultValueByType(prop)
      })
      this.editedItem = Object.assign({}, this.defaultItem)
    },
    initNullRelationsForVueModel () {
      this.editableProps.filter((prop) => {
        return prop.type === 'relation'
      }).forEach((prop) => {
        if (this.editedItem[prop.value] === null) {
          this.editedItem[prop.value] = this.getDefaultValueByType(prop)
        }
      })
    },
    onResize () {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight }
      if (this.windowSize.x <= 750) {
        this.btnsAsIcns = true
      } else {
        this.btnsAsIcns = false
      }
    },
    removeObjProps (object) {
      /**
       * If the API returns errors, preserving the full content of the original
       * object would allow the user to continue making changes to the form.
       * @see https://gist.github.com/GeorgeGkas/36f7a7f9a9641c2115a11d58233ebed2 */
      const clone = Object.assign(
        Object.create(
          // Set the prototype of the new object to the prototype of the instance.
          // Used to allow new object behave like class instance.
          Object.getPrototypeOf(object)
        ),
        // Prevent shallow copies of nested structures like arrays, etc
        JSON.parse(JSON.stringify(object))
      )
      this.removePropsBeforeSend.forEach((prop) => {
        delete clone[prop]
      })
      return clone
    },
    save () {
      if (this.editedIndex > -1) {
        this.$axios.patch(
          `api/${this.entity}/${this.editedItem.id}`,
          this.updateItemRelations(this.removeObjProps(this.editedItem))
        ).then((response) => {
          Object.assign(this.items[this.editedIndex], response.data)
          this.snackBar.color = 'green'
          this.snackBar.text =
            `The ${this.entity} "${response.data.name}"
            has been successfully modified and saved to the database.`
          this.close()
          this.$refs.snackBar.show()
        }).catch((e) => {
          const errorMessage = e.response?.data?.form?.message || e.message
          // eslint-disable-next-line no-console
          console.error(errorMessage)
          this.itemForm.errors = e.response.data.errors
          this.snackBar.color = 'red'
          this.snackBar.text = errorMessage
          this.$refs.snackBar.show()
        })
      } else {
        this.$axios.post(
          `api/${this.entity}`,
          this.updateItemRelations(this.removeObjProps(this.editedItem))
        ).then((response) => {
          this.editedItem.id = response.data.id
          this.items.push(response.data)
          this.snackBar.color = 'green'
          this.snackBar.text =
            `The ${this.entity} "${response.data.name}"
            has been successfully added to the database.`
          this.close()
          this.$refs.snackBar.show()
        }).catch((e) => {
          const errorMessage = e.response?.data?.form?.message || e.message
          // eslint-disable-next-line no-console
          console.error(errorMessage)
          this.itemForm.errors = e.response.data.errors
          this.snackBar.color = 'red'
          this.snackBar.text = errorMessage
          this.$refs.snackBar.show()
        })
      }
    },
    /**
     * Vuetify `v-select` has a bug, it always returns the whole selected object.
     * Our API requires to receive, only, the ID for each relation in the entity.
     * Example: { team: 1 }
     */
    updateItemRelations (item) {
      // https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/for...of#diferencia_entre_for...of_y_for...in
      for (const relation in this.itemsFromRelations) {
        item[relation] = item[relation].id
      }
      return item
    }
  }
}
</script>

<style lang="scss" scoped>
.delete-item-modal {
  &.theme--dark {
    background: linear-gradient(
      356deg,
      rgba(0, 0, 0, 1) 20%,
      transparent
    );
  }

  &.theme--light {
    background: linear-gradient(
      356deg,
      rgba(255, 255, 255, 0.5) 20%,
      transparent
    );
  }
}
</style>
