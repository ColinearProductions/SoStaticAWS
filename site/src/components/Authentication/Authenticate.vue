<template>
  <v-app
    id="inspire"
    class="deep-purple lighten-1"
  >
    <section
      style="position:absolute;background: linear-gradient(120deg,#f0f1f1 0,#f0f1f1);width:100%;height:100vh"
    />
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
            cols="12"
            sm="8"
            md="6"
          >
            <v-card
              md-12
              raised
            >
              <div style="height:100px; width:100%;background: linear-gradient(170deg,#a386ff 0,#7544a9)">
                <v-container class="fill-height">
                  <v-row

                    align="center"
                  >
                    <v-col class="text-center">
                      <p class="display-2  white--text thin">
                        {{ routeName }}
                      </p>
                    </v-col>
                  </v-row>
                </v-container>
              </div>

              <v-row
                align="center"
                justify="center"
              >
                <v-col
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <router-view @changeLoading="changeLoading" />
                </v-col>
              </v-row>

              <a href="/landing.html">
                <v-btn
                  color="primary"
                  absolute
                  bottom
                  right
                  fab
                >
                  <v-icon>home</v-icon>
                </v-btn>
              </a>

              <v-progress-linear
                :active="loading"
                :indeterminate="true"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    name: 'Authenticate',
    data: function () {
      return {
        tab: 1,
        loading: false,
        menuItems: [
          {
            title: 'Login',
            to: '/login'
          }, {
            title: 'Login',
            to: '/login'
          }, {
            title: 'Login',
            to: '/login'
          }
        ]
      }
    },
    computed: {
      routeName () {
        return this.$route.name
      }
    },
    methods: {
      changeLoading: function (state) {
        this.loading = state
      }
    }
  }

</script>

<style scoped>
    .padded-tab {
        padding-left: 60px;
        padding-right: 60px;
        font-weight: 300;
    }

    .thin {
        font-weight: 300;
    }
</style>
