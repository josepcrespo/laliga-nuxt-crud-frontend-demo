<template>
  <v-snackbar
    :app="true"
    :color="color"
    :multi-line="multiLine"
    :timeout="timeout"
    :value="mutableVisible"
  >
    <v-layout align-center>
      <v-icon
        class="pr-3"
        large
      >
        {{ icon }}
      </v-icon>
      <v-layout column>
        <div v-html="text" />
      </v-layout>
    </v-layout>
    <template #action="{ attrs }">
      <v-btn
        text
        v-bind="attrs"
        @click="hide()"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>

export default {
  name: 'SnackBar',
  props: {
    color: {
      default: '#333333',
      required: false,
      type: String
    },
    multiLine: {
      default: false,
      required: false,
      type: Boolean
    },
    visible: {
      default: false,
      required: false,
      type: Boolean
    },
    text: {
      required: true,
      type: String
    },
    timeout: {
      default: (10 * 1000),
      required: false,
      type: Number
    }
  },
  data () {
    return {
      /**
       * Disallow mutation of component props. Good practices:
       * @see https://eslint.vuejs.org/rules/no-mutating-props.html
       */
      mutableVisible: false
    }
  },
  computed: {
    icon () {
      let icon
      switch (this.color) {
        case 'blue':
          icon = 'mdi-information-variant'
          break
        case 'green':
          icon = 'mdi-check-circle'
          break
        case 'orange':
          icon = 'mdi-alert'
          break
        case 'red':
          icon = 'mdi-alert-circle'
          break
      }
      return icon
    },
    title () {
      let title
      switch (this.color) {
        case 'blue':
          title = 'Info'
          break
        case 'green':
          title = 'Success!'
          break
        case 'orange':
          title = 'Warning'
          break
        case 'red':
          title = 'Error'
          break
      }
      return title
    }
  },
  methods: {
    hide () {
      this.mutableVisible = false
    },
    show () {
      this.mutableVisible = true
      window.setTimeout(() => {
        this.mutableVisible = false
      }, this.timeout)
    }
  }
}
</script>
