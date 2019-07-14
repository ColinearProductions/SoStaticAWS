<template>

    <v-app id="inspire" class="deep-purple lighten-1">
        <section style="position:absolute;background: linear-gradient(120deg,#74309d 0,#7660b8);width:100%;height:100vh">
        </section>
        <v-content>
            <v-container fluid fill-height>
                <v-layout align-center justify-center>
                    <v-flex xs12 sm8 md4>
                        <v-card md-12 raised>
                            <v-progress-linear :active="loading" :indeterminate="true"></v-progress-linear>

                            <a href="/landing.html">
                            <v-btn color="primary" dark absolute bottom right fab>
                                <v-icon>home</v-icon>
                            </v-btn>
                            </a>

                                <v-card flat color="grey lighten-5" style="height:100%">
                                    <v-layout align-center justify-center>
                                        <v-flex xs12 sm12 md12>
                                            <router-view v-on:changeLoading ="changeLoading">

                                            </router-view>
                                        </v-flex>
                                    </v-layout>
                                </v-card>


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
                loading:false,
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
        methods:{
            changeLoading: function(state){
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