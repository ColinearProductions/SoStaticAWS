<template>
    <v-app style="background: white">

        <v-toolbar color="transparent" class="elevation-0 hidden-sm-and-down" dark absolute app>
            <v-toolbar-title>SoStatic</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-btn flat>
                Pricing
            </v-btn>

            <v-btn flat>
                Documentation
            </v-btn>

            <div v-if="isLoggedIn">

                <v-btn outline @click="logout">
                    Logout
                </v-btn>
                <v-btn outline @click="goToDashboard">
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
        <v-toolbar color="transparent" class="elevation-0 hidden-md-and-up" dark absolute app>
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

        <section style="    background: linear-gradient(180deg,#74309d 0,#5f62b8);width:100%;height:50vh;">

            <v-container fill-height class="mt-4">
                <v-layout row wrap align-center>
                    <v-flex class="text-xs-center" style="z-index:2">
                        <h1 class="display-3  font-weight-regular" style="color:white">Form submission for static
                            websites</h1>
                        <h1 class="headline font-weight-regular mb-4" style="color:white"> without any backend</h1>
                        <v-btn large class="text--primary" :to="{name:'Register'}">Get started</v-btn>
                        <v-btn outline dark large>Documentation</v-btn>
                    </v-flex>
                </v-layout>
            </v-container>
        </section>

        <section style="width:100%;height:30vh;margin-top:-1px;
          background: linear-gradient(to right bottom,#5f62b8 49.9%,transparent 50.1%);">
        </section>


        <div style="position:absolute;width:100%;height:100vh;z-index:1" class="hidden-sm-and-down">

            <v-container>
                <v-layout row wrap>
                    <v-flex>

                        <v-card color="grey lighten-5" class="white--text"
                                style="margin-top:40vh;max-width:800px;margin-left:auto;margin-right:auto">


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

        <div class="hidden-sm-and-down" style="margin-top:16vh"></div>


        <v-container text-xs-center>
            <v-layout row wrap>

                <v-layout row wrap>
                    <v-flex xs12 text-xs-center class="mb-5">
                        <h2 class="display-3 fnt"> How it works</h2>
                    </v-flex>
                    <v-flex md4 xs12 class="pa-2">
                        <v-card class="pa-2">

                            <v-img
                                    src="images/Photoshop/form.png"
                                    height="250px"
                                    contain
                            ></v-img>
                            <v-card-title style="min-height:170px;" primary-title>
                                <div>
                                    <h3 class="headline mb-0">Point your form to the generated link</h3>
                                    <div>Use the generated endpoint as the action for your form. No additional
                                        dependencies required
                                    </div>
                                </div>
                            </v-card-title>
                        </v-card>
                    </v-flex>
                    <v-flex md4 xs12 class="pa-2">
                        <v-card class="pa-2">

                            <v-img
                                    src="images/Photoshop/server.png"
                                    height="250px"
                                    contain
                            ></v-img>
                            <v-card-title primary-title style="min-height:170px;">
                                <div>
                                    <h3 class="headline mb-0">Let us provide you the backend</h3>
                                    <div>The form content will be processed by our servers, matched and validated
                                        with the
                                        information you provided
                                    </div>
                                </div>
                            </v-card-title>
                        </v-card>
                    </v-flex>
                    <v-flex md4 xs12 class="pa-2">
                        <v-card class="pa-2">

                            <v-img
                                    src="images/Photoshop/email.png"
                                    height="250px"
                                    contain
                            ></v-img>
                            <v-card-title primary-title class="justify-center" style="min-height:170px;">
                                <div>
                                    <h3 class="headline mb-0 ">Read the emails</h3>
                                    <div>After making sure that the message is not span, we will redirect it to the
                                        email
                                        addresses you provided as soon as possible
                                    </div>
                                </div>
                            </v-card-title>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-layout>

        </v-container>


        <v-container>


            <v-layout row wrap>

                <v-flex xs12 text-xs-center class="mb-5">
                    <h2 class=" display-3 fnt"> Why?</h2>
                    <h3 class="title text--secondary pt-4"> This is the simplest solution for form submission on static
                        websites hosted on github or firebase </h3>
                </v-flex>

                <v-flex md6 class=" pa-3">
                    <h5 class="headline">No need for backend</h5>
                    <h6 class="subheading">Using our service, you dont need to waste time or money
                        implementing and maintaining a backend just for this simple task</h6>

                </v-flex>

                <v-flex md6 class=" pa-3">
                    <h5 class="headline">Zero dependencies</h5>
                    <h6 class="subheading">You dont need to download or know any javascript, our solution
                        will work even if you just downloaded a website template</h6>
                </v-flex>

                <v-flex md6 class=" pa-3">
                    <h5 class="headline">Simple recaptcha validation</h5>
                    <h6 class="subheading">With just a checkbox, you can also integrate spam filtering on the server side using
                        Google's recaptcha for free. </h6>
                </v-flex>

                <v-flex md6 class=" pa-3">
                    <h5 class="headline">Hide your email from the internet</h5>
                    <h6 class="subheading">Using our service, you wont have to make your email public to the visitors,
                        thus avoiding spam</h6>
                </v-flex>


            </v-layout>

        </v-container>


        <v-container text-xs-center style="margin-top:-140px;">
            <v-layout row wrap>

                <v-layout row wrap>
                    <v-flex xs12 text-xs-center class="mb-5">
                        <h2 class="display-3 fnt" > Pricing</h2>
                    </v-flex>

                    <v-flex md4 xs12 class="pa-2">
                        <v-card class="pa-2">


                            <v-flex xs12 class="text-lg-center">
                                <h3 class="display-1 " style="width:100%">Free</h3>
                                <v-img
                                        src="images/Photoshop/server.png"
                                        height="200px"
                                        contain
                                ></v-img>

                                <h3 class="display-1 font-weight-thin " style="width:100%">$0/Mo</h3>
                                <v-divider></v-divider>
                                <p class="subheading ma-2"><b>1</b> Website</p>
                                <v-divider></v-divider>
                                <p class="subheading ma-2"><b>1</b> Form</p>
                                <v-divider></v-divider>
                                <p class="subheading ma-2"><b>100</b> Messages per Month</p>
                                <v-divider></v-divider>
                                <p class="subheading ma-2"><b>1</b> Contact</p>
                            </v-flex>

                        </v-card>
                    </v-flex>
                    <v-flex md4 xs12 class="pa-2">
                        <v-card class="pa-2">


                            <v-flex xs12 class="text-lg-center">
                                <h3 class="display-1 " style="width:100%">Freelancer</h3>
                                <v-img
                                        src="images/Photoshop/server.png"
                                        height="200px"
                                        contain
                                ></v-img>

                                <h3 class="display-1 font-weight-thin " style="width:100%">$5/Mo/Websitte</h3>
                                <v-divider></v-divider>
                                <p class="subheading ma-2"><b>∞</b> Website</p>
                                <v-divider></v-divider>
                                <p class="subheading ma-2"><b>∞</b> Form</p>
                                <v-divider></v-divider>
                                <p class="subheading ma-2"><b>1000</b> Messages / Month / Website</p>
                                <v-divider></v-divider>
                                <p class="subheading ma-2"><b>1</b> Contact / Website</p>
                            </v-flex>

                        </v-card>
                    </v-flex>
                    <v-flex md4 xs12 class="pa-2">
                        <v-card class="pa-2">


                            <v-flex xs12 class="text-lg-center">
                                <h3 class="display-1 " style="width:100%">Small Business</h3>
                                <v-img
                                        src="images/Photoshop/server.png"
                                        height="200px"
                                        contain
                                ></v-img>

                                <h3 class="display-1 font-weight-thin " style="width:100%">$30 / Websitte</h3>
                                <v-divider></v-divider>
                                <p class="subheading ma-2"><b>1</b> Website</p>
                                <v-divider></v-divider>
                                <p class="subheading ma-2"><b>∞</b> Form</p>
                                <v-divider></v-divider>
                                <p class="subheading ma-2"><b>∞</b> Messages / Month / Website</p>
                                <v-divider></v-divider>
                                <p class="subheading ma-2"><b>∞</b> Contact / Website</p>
                            </v-flex>

                        </v-card>
                    </v-flex>

                    <v-flex md12 class="pa-2">
                        <h5 class="text--secondary">* If these plans are not appropriate for your needs, it means
                            that this is not the recommended solution for you.
                            If you still want to outsource this task, please consider contacting us at
                            inquiry@sostatic.xyz to discuss a custom solution for your needs</h5>
                    </v-flex>

                    <v-flex xs12 class="mt-5 mb-5 text--secondary text-lg-center">
                        <v-btn large class="btn btn--large primary " :to="{name:'Register'}">Get started</v-btn>

                    </v-flex>

                </v-layout>
            </v-layout>
        </v-container>


        <!--<section style="width: 100%; height:10vh;box-shadow: rgba(0, 0, 0, 0.3) 0 2px 1px -1px"></section> -->


        <v-footer color="primary" app absolute>
            <span class="white--text">&copy; 2017</span>
        </v-footer>
    </v-app>
</template>

<script>

    import * as api from '../API';

    export default {
        name: "LandingPage",
        data: function () {
            return {
                menuItems: [
                    {
                        title: "Login",
                        to: "/auth/login"
                    },
                    {
                        title: "Register",
                        to: "/auth/register"
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
            //called only for the initial page load
            this.$store.commit('setLoaderVisibility', false)
        },
        computed: {
            isLoggedIn: function () {
                return this.$store.getters.getIsLoggedIn;
            },
            code: function () {
                return `<form action="https://sostatic.xyz/api/{YOUR_KEY}" method="POST">
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
                api.logout();

            },
            goToDashboard: function(){

                console.log(this.$store.getters.currentWebsite);
                if(this.$store.getters.currentWebsite.key===""){
                    this.$router.push('/setup');
                }else{
                    this.$router.push({
                        name:'Settings',
                        params:{
                            website_index:0
                        }
                    })
                }


            }
        }
    }
</script>

<style scoped>
    a {
        text-decoration: none;
    }

    .fnt {
        font-family: 'Staatliches', cursive;
    }

</style>