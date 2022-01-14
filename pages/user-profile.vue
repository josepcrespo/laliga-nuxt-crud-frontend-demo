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
    <v-col cols="12">
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
      <div
        class="text-caption"
        style="color: rgba(255, 255, 255, 0.5);"
      >
        Roles
      </div>
      <v-chip-group
        class="mb-3"
        column
        multiple
      >
        <v-chip
          v-for="(role, index) in loggedInUser.roles"
          :key="index"
          disabled
          outlined
        >
          {{ role }}
        </v-chip>
      </v-chip-group>
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
