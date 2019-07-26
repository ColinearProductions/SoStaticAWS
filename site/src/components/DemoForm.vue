<template>
  <v-app id="inspire">
    <v-btn
      text
      style="position:absolute;z-index:1"
      color="primary"
      @click="$router.go(-1)"
    >
      <v-icon left>
        arrow_back
      </v-icon>Back
    </v-btn>
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="8"
            sm="3"
            md="3"
          >
            <v-form
              :action="endpoint"
              method="post"
              class="text-center"
            >
              <h2 class="pb-6 pt-2">
                This is a demo form for your website, that will behave like a real form
              </h2>
              <v-col>
                <v-text-field
                  name="name"
                  label="Name"
                  value="test"
                />
              </v-col>

              <v-col>
                <v-text-field
                  name="email"
                  label="Email"
                  value="test@test.test"
                />
              </v-col>

              <v-textarea
                name="message"

                label="Message"
                value="Test"
                hint="Hint text"
              />

              <div v-if="usesRecaptcha">
                <vue-recaptcha
                  v-if="!isDataLoading"
                  class="d-inline-block"
                  :sitekey="currentWebsiteSitekey"
                  :load-recaptcha-script="true"
                />
              </div>
              <v-btn type="submit">
                Submit
              </v-btn>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import * as api from '../API'
  import VueRecaptcha from 'vue-recaptcha'
  const SERVER = api.SERVER

  export default {
    name: 'DemoForm',
    components: { VueRecaptcha },

    computed: {
      currentWebsiteSitekey: function () {
        return this.$store.getters.currentWebsite.sitekey
      },
      usesRecaptcha: function () {
        return this.$route.params.recaptcha
      },
      isDataLoading: function () {
        return this.$store.getters.isDataLoading
      },
      endpoint: function () {
        return `${SERVER}/${this.$route.params.endpoint}`
      }
    }
  }
</script>

<style scoped>

</style>
