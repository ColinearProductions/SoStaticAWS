<template>
    <v-app>

        <v-toolbar color="transparent" class="elevation-0 hidden-sm-and-down" dark fixed app>
            <v-toolbar-title>SoStatic</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-btn flat>
                Pricing
            </v-btn>

            <v-btn flat>
                Documentation
            </v-btn>

            <div v-if="isLoggedIn">

                <v-btn class="primary lighten-1" outline @click="logout">
                    Logout
                </v-btn>
                <v-btn class="primary lighten-1" outline :to="{name:'Home'}">
                    Go to dashboard
                </v-btn>
            </div>

            <div v-else>
                <v-btn outline :to="{name:'Login'}">
                    Login
                </v-btn>
                <v-btn outline :to="{name:'Register'}">
                    Sign Up
                </v-btn>
            </div>


        </v-toolbar>
        <v-toolbar color="transparent" class="elevation-0 hidden-md-and-up" dark fixed app>
            <v-toolbar-title>SoStatic</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-menu bottom left>
                <v-btn slot="activator" dark icon>
                    <v-icon>more_vert</v-icon>
                </v-btn>

                <v-list>
                    <v-list-tile v-for="(item, i) in menuItems" :key="i" :to="item.to">
                        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>


        </v-toolbar>

        <section style="    background: linear-gradient(180deg,#74309d 0,#5f62b8);width:100%;height:50vh">

            <v-container fill-height class="mt-4">
                <v-layout row wrap align-center>
                    <v-flex class="text-xs-center">
                        <h1 class="display-1 font-weight-regular" style="color:white">Form submission for static
                            websites</h1>
                        <h1 class="headline font-weight-regular mb-4" style="color:white"> without any backend</h1>
                        <v-btn large class="text--primary" :to="{name:'Register'}">Get started</v-btn>
                        <v-btn outline dark large>Documentation</v-btn>
                    </v-flex>
                </v-layout>
            </v-container>
        </section>

        <section style="width:100%;height:10vh;
          background: linear-gradient(to right bottom,#5f62b8 49.9%,transparent 50.1%);">
        </section>


        <div style="position:absolute;width:100%;height:100vh" class="hidden-sm-and-down">

            <v-container fill-height>
                <v-layout row wrap>
                    <v-flex >

                        <v-card color="grey lighten-5" class="white--text" style="margin-top:40vh;max-width:700px;margin-left:auto;margin-right:auto">


                            <v-card-title primary-title class="pa-0">

                                <pre v-highlightjs="code" style="margin-left:auto;margin-right:auto" class="pa-0;ma-0">
                                    <code class="html subheading font-weight-regular pa-0" style="background-color: transparent;box-shadow:none"></code>
                                </pre>

                            </v-card-title>

                        </v-card>

                    </v-flex>
                </v-layout>
            </v-container>

        </div>

        <!--<section style="width: 100%; height:10vh;box-shadow: rgba(0, 0, 0, 0.3) 0 2px 1px -1px"></section> -->




        <v-content>
            <v-container fluid fill-height>
                <!--- ------------>
            </v-container>
        </v-content>
        <v-footer color="primary" app>
            <span class="white--text">&copy; 2017</span>
        </v-footer>
    </v-app>
</template>

<script>

    import * as api from '../firebase_api';

    export default {
        name: "LandingPage",
        data: function () {
            return {
                menuItems:[
                    {
                        title:"Login",
                        to:"/Login"
                    },
                    {
                        title:"Register",
                        to:"/Login"
                    },
                    {
                        title:"Documentation",
                        to:"/Login"
                    },
                    {
                        title:"Pricing",
                        to:"/Login"
                    },
                ]
            }
        },
        mounted: function () {
            this.$store.commit('setLoaderVisibility', false)
        },
        computed: {
            isLoggedIn: function () {
                return this.$store.getters.getIsLoggedIn;
            },
            code: function(){
                return `<form action="https://sostatic.xyz/email/{YOUR_KEY}" method="POST">
    <label for="name">Name</label>
    <input type="text" name="name">
    <label for="email">Email </label>
    <input type="text" name="email">
    <label for="message"> Message </label>
    <textarea name="message" placeholder="Your message"></textarea>
    <input type="submit" value="Submit">
</form>`;
            }

        },
        methods: {
            logout: function () {
                this.$store.commit('setLoaderVisibility', false);
                api.logout();

            }
        }
    }
</script>

<style scoped>
    a {
        text-decoration: none;
    }
</style>