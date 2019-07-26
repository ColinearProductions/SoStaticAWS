<template>
  <v-form
    ref="form"
    class="pa-12"
    @submit="onSubmit"
    @keyup.native.enter="onSubmit"
  >
    <p
      v-if="error"
      class="subheading red--text text--lighten-1"
    >
      {{ error }}
    </p>

    <v-text-field
      v-model="email"
      label="E-mail"
      :rules="emailRules"
    />
    <v-text-field
      v-model="password"
      label="Password"
      type="password"
      :rules="passwordRules"
      class="pb-0 mt-4"
    />

    <div class="mt-4 text-center">
      <v-btn
        color="deep-purple lighten-1"
        large
        outlined
        class="ma-0"
        @click="onSubmit"
      >
        Login
      </v-btn>
    </div>
    <div class="mt-4">
      <router-link :to="{name:'Register'}">
        <a
          class=" text--lighten-4 pr-4"
          style="text-decoration: none;"
        >Dont have an account?</a>
      </router-link>
      <router-link :to="{name:'Recover'}">
        <a
          class=" text--lighten-4 float-right"
          style="text-decoration: none;"
        >Forgot your password?</a>
      </router-link>
    </div>
  </v-form>
</template>

<script>

  import * as api from '../../API'
  import router from '../../router'

  // todo log errors
  export default {
    name: 'Login',
    data: function () {
      return {
        show: true,
        email: '',
        password: '',
        emailRules: [
          v => !!v || 'E-mail is required',
          v =>
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
            'E-mail must be valid'
        ],
        passwordRules: [
          v => !!v || 'Password is required'
        ],
        error: ''

      }
    },
    methods: {
      onSubmit: function () {
        if (!this.$refs.form.validate()) { return }

        this.$emit('changeLoading', true)

        this.error = ''

        api.login(this.email, this.password).then(() => {
          router.push({
            name: 'Settings',
            params: {
              'website_index': 0
            }
          })
        }).catch(error => {
          if (error.code === 'auth/wrong-password') {
            this.error = 'Wrong password, please try again or press \'Forgot your password\''
          } else if (error.code === 'auth/user-not-found') {
            this.error = 'Email not found, make sure you entered the correct email address.'
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
