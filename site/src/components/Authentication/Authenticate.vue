<template>

    <v-app id="inspire" class="deep-purple lighten-1">
        <section
                style="position:absolute;background: linear-gradient(120deg,#f0f1f1 0,#f0f1f1);width:100%;height:100vh">
        </section>
        <v-content>
            <v-container fluid fill-height>
                <v-layout align-center justify-center>
                    <v-flex xs12 sm8 md3>
                        <v-card md-12 raised>

                            <div style="height:100px; width:100%;background: linear-gradient(170deg,#a386ff 0,#7544a9)">
                                <v-container fill-height>
                                    <v-layout row wrap align-center>
                                        <v-flex class="text-xs-center">
                                            <p class="display-2  white--text thin">
                                                {{routeName}}
                                            </p>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </div>

                            <v-layout align-center justify-center>
                                <v-flex xs12 sm12 md12>
                                    <router-view v-on:changeLoading="changeLoading">

                                    </router-view>
                                </v-flex>
                            </v-layout>


                            <a href="/landing.html">
                                <v-btn color="primary" dark absolute bottom right fab>
                                    <v-icon>home</v-icon>
                                </v-btn>
                            </a>

                            <v-progress-linear :active="loading" :indeterminate="true"></v-progress-linear>

                        </v-card>

                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
    export default {
        name: "Authenticate",
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
          routeName(){
              return this.$route.name
          }
        },
        methods: {
            changeLoading: function (state) {
                this.loading = state;
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