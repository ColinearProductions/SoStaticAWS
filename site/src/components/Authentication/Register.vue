<template>
  <v-form
    ref="form"
    class="pa-12"
    @submit="onSubmit"
  >
    <p
      v-if="error"
      class="subheading red--text text--lighten-1"
    >
      {{ error }}
    </p>
    <v-text-field
      v-model="displayName"
      label="Display name"
      :rules="displayNameRules"
    />
    <v-text-field
      v-model="username"
      label="E-mail"
      :rules="emailRules"
      class="mt-4"
    />
    <v-text-field
      v-model="password"
      label="Password"
      type="password"
      :rules="passwordRules"
      class="pb-6 mt-4"
    />

    <v-btn
      color="deep-purple lighten-1"
      class="ma-0"
      large
      outlined
      @click="onSubmit"
    >
      Register
    </v-btn>
    <div class="mt-4">
      <router-link
        class="mr-4"
        :to="{name:'Login'}"
      >
        <a
          class=" text--lighten-4"
          style="text-decoration: none;"
        >Already got an account?</a>
      </router-link>
      <router-link :to="{name:'Recover'}">
        <a
          class=" text--lighten-4"
          style="text-decoration: none;"
        >Forgot your password?</a>
      </router-link>
    </div>
  </v-form>
</template>

<script>

  import * as api from '../../API'
  import firebase from 'firebase'
  import router from '../../router'

  export default {
    name: 'Register',
    data: function () {
      return {

        username: '',
        password: '',
        displayName: '',
        displayNameRules: [
          v => !!v || 'A display name is required'
        ],
        emailRules: [
          v => !!v || 'E-mail is required',
          v =>
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
            'E-mail must be valid'
        ],
        passwordRules: [
          v => !!v || 'Password is required',
          v => v.length < 8 ||
            'Password must have at least 8 characters'
        ],
        error: ''

      }
    },
    methods: {
      onSubmit: function () {
        if (!this.$refs.form.validate()) { return }

        this.$emit('changeLoading', true)
        this.error = ''

        api.register(this.username, this.password).then(() => {
          let user = firebase.auth().currentUser
          user.updateProfile({
            displayName: '' + displayName
          }).then(() => {
            router.push({
              name: 'Settings',
              params: {
                'website_index': 0
              }
            })
          })
        }).catch((error) => {
          if (error.code === 'auth/email-already-in-use') {
            this.error = 'Email is already registered, if you forgot your password press \'Forgot your password\''
          } else if (error.code === 'auth/too-many-requests') {
            this.error = 'Too many unsuccessful login attempts'
          }

          console.log(error)
        }).then(() => this.$emit('changeLoading', false))
      }
    }
  }
</script>

<style scoped>

</style>
