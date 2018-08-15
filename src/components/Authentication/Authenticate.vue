<template>

    <v-app id="inspire" class="deep-purple lighten-1">
                        <v-content>
                            <v-container fluid fill-height>
                                <v-layout align-center justify-center>
                                    <v-flex xs12 sm8 md8>
                        <v-card md-12 raised>
                            <v-btn color="primary" dark absolute bottom right fab
                                   :to="{name:'Landing Page'}">
                                <v-icon>home</v-icon>
                            </v-btn>
                            <v-toolbar dark color="primary">

                                <v-toolbar-items >
                                    <v-btn :to="{name:'Login'}" flat class="px-5">Login</v-btn>
                                    <v-btn  :to="{name:'Register'}"  flat  class="px-5">Register</v-btn>
                                    <v-btn  :to="{name:'Recover'}" flat  class="px-5">Recover</v-btn>
                                </v-toolbar-items>
                            </v-toolbar>
                            <div style="height:60vh">
                                <v-card flat color="grey lighten-5" style="height:100%">
                                    <v-layout align-center justify-center>
                                        <v-flex xs12 sm8 md8>
                                            <router-view>

                                            </router-view>
                                        </v-flex>
                                    </v-layout>
                                </v-card>

                            </div>
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
                tab: 1
            }
        },
        mounted: function () {
            this.$store.commit('setLoaderVisibility', false)
        },
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