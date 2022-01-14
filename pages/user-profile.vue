<template>
  <v-row>
    <v-col cols="12">
      <div class="text-h2 d-flex align-start mt-4">
        <v-icon
          size="60"
          left
        >
          mdi-account-circle
        </v-icon>
        Profile Data
      </div>
    </v-col>
    <v-col cols="12" class="px-4">
      <v-text-field
        v-model="loggedInUser.email"
        disabled
        label="Email Address"
      />
      <v-text-field
        v-model="loggedInUser.api_token"
        disabled
        label="API Token"
      />
      <v-select
        v-model="loggedInUser.roles"
        :items="loggedInUser.roles"
        small-chips
        label="Roles"
        multiple
        disabled
      />
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'UserProfile',
  computed: {
    ...mapGetters(['loggedInUser'])
  }
}
</script>
