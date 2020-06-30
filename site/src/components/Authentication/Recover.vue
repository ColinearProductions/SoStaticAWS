<template>
  <v-form
    ref="form"
    class="pa-12"
  >
    <v-text-field
      v-model="email"
      label="E-mail"
      :rules="emailRules"
      class="pb-2"
    />

    <v-btn
      color="deep-purple lighten-1"
      class="ma-0"
      large
      outlined
      @click="sendMail"
    >
      Send recovery Email
    </v-btn>
    <div class="mt-4">
      <router-link
        class="mr-4"
        :to="{name:'Login'}"
      >
        <a
          class=" text--lighten-4"
          style="text-decoration: none;"
        >Remembered your password?</a>
      </router-link>
    </div>
  </v-form>
</template>

<script>

  import * as api from '../../API'
  //todo show feedback
  export default {
    name: 'Forgot',
    data: function () {
      return {
        email: '',
        emailRules: [
          v => !!v || 'E-mail is required',
          v =>
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
            'E-mail must be valid'
        ]
      }
    },
    methods: {
      sendMail: function () {
        if (!this.$refs.form.validate()) { return }
        this.$emit('changeLoading', true)

        // todo auth/too-many-requests

        api.sendRecoveryEmail(this.email).then(() => {
          console.log('Done')
        }).catch(error => {
          console.log(error)
        }).then(() => this.$emit('changeLoading', false))
      }
    }
  }
</script>

<style scoped>

</style>
