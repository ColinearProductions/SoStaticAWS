<template>
    <v-app>

        <v-toolbar color="primary" dark fixed app>
            <v-toolbar-title>SoStatic</v-toolbar-title>
            <v-spacer></v-spacer>



            <v-btn flat>
                Pricing
            </v-btn>

            <v-btn flat>
                Documentation
            </v-btn>



            <div v-if="isLoggedIn">
                <v-btn  class="primary lighten-1" @click="logout">
                    Logout
                </v-btn>
                <v-btn  class="primary lighten-1"  :to="{name:'Home'}">
                    Go to dashboard
                </v-btn>
            </div>

            <div v-else>
                <v-btn flat :to="{name:'Login'}">
                    Login
                </v-btn>
                <v-btn flat  :to="{name:'Register'}">
                    Sign Up
                </v-btn>
            </div>


        </v-toolbar>
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
            return {}
        },
        mounted: function () {
            this.$store.commit('setLoaderVisibility', false)
        },
        computed: {
            isLoggedIn: function () {
                return this.$store.getters.getIsLoggedIn;
            }
        },
        methods:{
            logout:function(){
                this.$store.commit('setLoaderVisibility', false);
                api.logout();

            }
        }
    }
</script>

<style scoped>
    a{
        text-decoration: none;
    }
</style>