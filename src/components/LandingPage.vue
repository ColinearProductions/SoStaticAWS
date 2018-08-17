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

        <section style="width:100%;height:50vh;
          background: linear-gradient(to right bottom,#5f62b8 49.9%,transparent 50.1%);">
        </section>


        <div style="position:absolute;width:100%;height:100vh" class="hidden-sm-and-down">

            <v-container fill-height>
                <v-layout row wrap>
                    <v-flex>

                        <v-card color="grey lighten-5" class="white--text"
                                style="margin-top:40vh;max-width:700px;margin-left:auto;margin-right:auto">


                            <v-card-title primary-title class="pa-0">

                                <pre v-highlightjs="code" style="margin-left:auto;margin-right:auto" class="pa-0;ma-0">
                                    <code class="html subheading font-weight-regular pa-0"
                                          style="background-color: transparent;box-shadow:none"></code>
                                </pre>

                            </v-card-title>

                        </v-card>

                    </v-flex>
                </v-layout>
            </v-container>

        </div>

        <div class="hidden-sm-and-down" style="margin-top:18vh"></div>
        <v-container fluid class="pa-5">
            <v-layout row wrap>
                <v-flex xs12 text-xs-center class="mb-5">
                    <h2 class="text--secondary display-4"> How it works</h2>
                </v-flex>
                <v-flex md4 xs12 class="pa-2">
                    <v-card class="pa-2">

                        <v-card-media
                                src="images/Photoshop/form.png"
                                height="300px"
                                contain
                        ></v-card-media>
                        <v-card-title primary-title>
                            <div>
                                <h3 class="headline mb-0">Point your form to the generated link</h3>
                                <div>Use the generated endpoint as the action for your form.<br> This is the only change
                                    you have to make to your website
                                </div>
                            </div>
                        </v-card-title>
                    </v-card>
                </v-flex>
                <v-flex md4 xs12 class="pa-2">
                    <v-card class="pa-2">

                        <v-card-media
                                src="images/Photoshop/server.png"
                                height="300px"
                                contain
                        ></v-card-media>
                        <v-card-title primary-title>
                            <div>
                                <h3 class="headline mb-0">Let us provide you the backend</h3>
                                <div>The form content will be processed by our servers and matched with the information
                                    you provided, including checking recaptcha validity
                                </div>
                            </div>
                        </v-card-title>
                    </v-card>
                </v-flex>
                <v-flex md4 xs12 class="pa-2">
                    <v-card class="pa-2">

                        <v-card-media
                                src="images/Photoshop/email.png"
                                height="300px"
                                contain
                        ></v-card-media>
                        <v-card-title primary-title class="justify-center">
                            <div>
                                <h3 class="headline mb-0 ">Read the emails</h3>
                                <div>After making sure that the message is not span, we will redirect it to the email
                                    addresses you provided as soon as possible
                                </div>
                            </div>
                        </v-card-title>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>


        <v-container class="">
            <v-layout row wrap>
                <v-flex xs12 class="mb-5 text--secondary">
                    <h2 class="text--secondary display-4 ma-4"> Why would you do this?</h2>
                    <h3 class="title">
                        There is no easy solution for you if you have a simple static website hosted on Firebase or
                        Github and want to add a contact form.<br>
                        You could build and deploy a very basic web server and deploy it to any host, but then you would
                        have to worry about that.<br>
                        Using So Static you can avoid writing any backend code for such a small problem.
                    </h3>
                </v-flex>
            </v-layout>
        </v-container>


        <v-container class="">
            <v-layout row wrap>
                <v-flex xs12 class="mb-5 text--secondary">
                    <h2 class="text--secondary display-4 ma-4 text-lg-center"> Pricing </h2>
                </v-flex>

                <v-flex md4 xs12 class="pa-2">
                    <v-card class="pa-2">


                        <v-flex xs12 class="text-lg-center">
                            <h3 class="headline " style="width:100%">Free:</h3>
                            <v-card-media
                                    src="images/Photoshop/server.png"
                                    height="300px"
                                    contain
                            ></v-card-media>
                            <h3 class="display-2 " style="width:100%">$0/Mo</h3>
                            <p class="title ma-2"> <b>1</b> Website</p>
                            <p class="title ma-2"> <b>1</b> Form</p>
                            <p class="title ma-2"> <b>100</b> Messages per Month</p>
                            <p class="title ma-2"> <b>1</b> Contact</p>
                        </v-flex>

                    </v-card>
                </v-flex>
                <v-flex md4 xs12 class="pa-2">
                    <v-card class="pa-2">


                        <v-flex xs12 class="text-lg-center">
                            <h3 class="headline " style="width:100%">Freelancer:</h3>
                            <v-card-media
                                    src="images/Photoshop/server.png"
                                    height="300px"
                                    contain
                            ></v-card-media>
                            <h3 class="display-2 " style="width:100%">$5/Mo/Website</h3>
                            <p class="title ma-2"> <b>∞</b> Website</p>
                            <p class="title ma-2"> <b>∞</b> Forms</p>
                            <p class="title ma-2"> <b>1000</b> Messages / Website</p>
                            <p class="title ma-2"> <b>∞</b> Contacts / Website</p>
                        </v-flex>

                    </v-card>
                </v-flex>
                <v-flex md4 xs12 class="pa-2">
                    <v-card class="pa-2">


                        <v-flex xs12 class="text-lg-center">
                            <h3 class="headline " style="width:100%">Small business:</h3>
                            <v-card-media
                                    src="images/Photoshop/server.png"
                                    height="300px"
                                    contain
                            ></v-card-media>
                            <h3 class="display-2 " style="width:100%">$30/Mo</h3>
                            <p class="title ma-2"> <b>1</b> Website</p>
                            <p class="title ma-2"> <b>∞</b> Forms</p>
                            <p class="title ma-2"> <b>∞</b> Messages / Website</p>
                            <p class="title ma-2"> <b>∞</b> Contacts / Website</p>
                        </v-flex>

                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>

        <v-container class="">
            <v-layout row wrap>
                <v-flex xs12 class="mb-5 text--secondary text-lg-center">
                    <v-btn large class="text--primary" :to="{name:'Register'}">Get started</v-btn>

                </v-flex>
            </v-layout>
        </v-container>



        <!--<section style="width: 100%; height:10vh;box-shadow: rgba(0, 0, 0, 0.3) 0 2px 1px -1px"></section> -->


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
                menuItems: [
                    {
                        title: "Login",
                        to: "/Login"
                    },
                    {
                        title: "Register",
                        to: "/Login"
                    },
                    {
                        title: "Documentation",
                        to: "/Login"
                    },
                    {
                        title: "Pricing",
                        to: "/Login"
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
            code: function () {
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