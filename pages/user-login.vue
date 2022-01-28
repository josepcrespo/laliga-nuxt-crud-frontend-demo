<template>
  <v-row>
    <v-col cols="12">
      <div class="text-h2 d-flex align-start mt-4">
        <v-icon
          size="60"
          left
        >
          mdi-login-variant
        </v-icon>
        Login Form
      </div>
    </v-col>
    <v-col cols="12">
      <v-alert
        v-if="error"
        text
        outlined
        color="deep-orange"
        type="error"
        class="mb-0"
      >
        <strong>Error:</strong> {{ error }}
      </v-alert>
    </v-col>
    <v-col cols="12">
      <!-- https://auth.nuxtjs.org/schemes/local#usage -->
      <!-- eslint-disable-next-line vue/valid-v-model -->
      <v-form
        ref="loginForm"
        v-model="valid"
        method="post"
        lazy-validation
        @submit.prevent="userLogin()"
      >
        <v-text-field
          v-model="email"
          type="email"
          :rules="emailRules"
          label="E-mail"
          required
        />
        <v-text-field
          v-model="password"
          type="password"
          :rules="passwordRules"
          label="Password"
          required
        />
        <div>
          <v-btn
            :disabled="!valid"
            :loading="checkingCredentials"
            color="primary"
            class="mr-4"
            type="submit"
          >
            Submit
          </v-btn>
          <v-btn @click="$refs.loginForm.reset()">
            Clear
          </v-btn>
        </div>
      </v-form>
      <snack-bar
        ref="snackBar"
        :color="snackBar.color"
        :text="snackBar.text"
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  // https://auth.nuxtjs.org/guide/middleware
  auth: ['guest'],

  data () {
    return {
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      checkingCredentials: false,
      password: '',
      passwordRules: [
        v => !!v || 'Password is required'
      ],
      error: null,
      snackBar: {
        color: undefined,
        text: ''
      },
      valid: true
    }
  },

  methods: {
    async userLogin () {
      this.checkingCredentials = true
      await this.$auth.loginWith('local', {
        data: {
          email: this.email,
          password: this.password
        }
      }).then((response) => {
        /**
         * Useful for APIs with Bearer token authentication.
         * https://auth.nuxtjs.org/api/auth/#setusertokentoken-refreshtoken
         * It saves the token into the web browser Local Storage, using the
         * `auth._token.local` key. And, it automatically sends the appropriate
         * HTTP headers on every Axios request (if is configured that way in
         * nuxt.config.js in the `auth.strategies.local.token.global` property).
         */
        this.$auth.setUserToken(response.data.api_token)
        // console.log('Axios Headers after login: %o', this.$axios.defaults.headers)
        this.$auth.setUser(response.data)
        this.checkingCredentials = false
        this.$router.push('/user-profile')
      }).catch((e) => {
        this.checkingCredentials = false
        let userFriendlyMessage
        switch (e.message) {
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
        console.error(`${userFriendlyMessage} %o`, e.message)
        this.snackBar.color = 'red'
        this.snackBar.text = userFriendlyMessage
        this.$refs.snackBar.show()
      })
    }
  }
}
</script>
