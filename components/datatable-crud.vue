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
                          ref="itemForm"
                          v-model="itemFormModel"
                          lazy-validation
                        >
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
                                item-value="id"
                                :label="getEditableProp(prop.name).text"
                                :multiple="getEditableProp(prop.name).multiple"
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
                    :disabled="itemFormModel === false"
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
      itemFormModel: true,
      items: [],
      itemsFromRelations: {},
      search: '',
      snackbar: {
        color: undefined,
        model: false,
        text: '',
        timeout: 10000
      },
      windowSize: {
        x: 0,
        y: 0
      }
    }
  },
  async fetch () {
    this.items = await this.getResourceList(this.entity)
    this.editableProps.filter((prop) => {
      return prop.type === 'relation'
    }).forEach(async (relation) => {
      const tempItemsList = await this.getResourceList(relation.value)
      if (relation.required === false) {
        tempItemsList.unshift({ id: null, name: `[Without ${relation.value}]` })
      }
      this.itemsFromRelations[relation.value] = tempItemsList
    })
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
          this.snackbar.text =
            `The ${this.entity} "${this.editedItem.name}"
             has been successfully removed from the database.`
        })
        .catch((error) => {
          this.snackbar.text = this.getApiErrorMessages(error.response.data)
          this.snackbar.color = 'red'
        }).finally(() => {
          this.snackbar.model = true
          this.closeDelete()
        })
    },
    editItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
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
    getApiErrorMessages (responseData) {
      if (responseData.message) {
        return responseData.message
      } else if (Array.isArray(responseData)) {
        return responseData.map(obj => obj.message).toString()
      }
    },
    getDefaultValueByType (type) {
      let defaultValue
      switch (type) {
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
          defaultValue = {}
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
        this.defaultItem[prop.value] = this.getDefaultValueByType(prop.type)
      })
      this.editedItem = Object.assign({}, this.defaultItem)
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
      this.removePropsBeforeSend.forEach((prop) => {
        delete object[prop]
      })
      return object
    },
    save () {
      if (this.editedIndex > -1) {
        this.$axios.put(
          `api/${this.entity}/${this.editedItem.id}`,
          this.removeObjProps(this.editedItem)
        ).then((response) => {
          this.updateItemProps(response.data)
          this.snackbar.color = 'green'
          this.snackbar.text =
            `The ${this.entity} "${response.data.name}"
            has been successfully modified and saved to the database.`
        }).catch((error) => {
          this.snackbar.text = this.getApiErrorMessages(error.response.data)
          this.snackbar.color = 'red'
        }).finally(() => {
          this.snackbar.model = true
          this.close()
        })
      } else {
        this.$axios.post(
          `api/${this.entity}`,
          this.removeObjProps(this.editedItem)
        ).then((response) => {
          this.editedItem.id = response.data.id
          this.items.push(response.data)
          this.snackbar.color = 'green'
          this.snackbar.text =
            `The ${this.entity} "${response.data.name}"
            has been successfully added to the database.`
        }).catch((error) => {
          this.snackbar.text = this.getApiErrorMessages(error.response.data)
          this.snackbar.color = 'red'
        }).finally(() => {
          this.snackbar.model = true
          this.close()
        })
      }
    },
    updateItemProps (item) {
      // https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/for...of#diferencia_entre_for...of_y_for...in
      for (const relation in this.itemsFromRelations) {
        item[relation] = this.itemsFromRelations[relation]
          .find(obj => obj.id === item[`${relation}_id`])
      }
      Object.assign(this.items[this.editedIndex], item)
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
