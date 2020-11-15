<template>
  <v-app id="inspire">
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
            cols="10"
            sm="6"
            md="6"
          >
            <v-card>
              <v-card-title class="pl-12 pt-12 pr-12 pb-0">
                <h2 class=" mb-6 title ">
                  You are about to unsubscribe from

                  <a href="http://google.com">google.com</a>
                </h2>

                <h1 class="subheading  ">
                  At the moment, there are 3 websites that have you as a contact for message
                  forwarding. Please check all websites that you wish to be removed from as a contact
                </h1>

                <v-container fluid>
                  <v-checkbox
                    v-for="site in sites"
                    v-bind:key="site.name"
                    v-model="site.checked"
                    :label="site.name"
                  />
                </v-container>

                <h1 class="subheading  ">
                  If you wish to never receive any messages from any users on SoStatic.xyz, please
                  check the next checkbox
                </h1>
                <v-container fluid>
                  <v-checkbox
                    v-model="global"
                    label="Permanently unsubscribe"
                  />
                </v-container>
              </v-card-title>

              <v-card-actions>
                <v-btn
                  text
                  large
                  color="primary"
                >
                  Cancel
                </v-btn>

                <v-spacer />
                <v-btn
                  text
                  large
                  color="primary"
                >
                  Unsubscribe
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import * as api from '../API'

  const SERVER = api.SERVER

  export default {
    name: 'Unsubsribe',
    data: function () {
      return {
        global: false,
        sites: [
          {
            name: 'google.com',
            checked: true
          },
          {
            name: 'facebook.com',
            checked: false
          },
          {
            name: 'reddit.com',
            checked: false
          }

        ]
      }
    }
  }
</script>

<style scoped>

</style>
