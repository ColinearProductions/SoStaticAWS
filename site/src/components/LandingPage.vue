<template>
    <v-app style="background: white">

        <v-toolbar color="transparent" class="elevation-0 hidden-sm-and-down " dark absolute app>
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

        <section style="    background: linear-gradient(180deg,#74309d 0,#5f62b8);width:100%;height:100vh;">

            <v-container fill-height>
                <v-layout row wrap align-center>
                    <v-flex style="z-index:2">
                        <div class="text-xs-center ">
                            <h1 class="display-3  font-weight-regular" style="color:white">
                                Form processing backend for static websites</h1>
                            <h1 class="headline font-weight-regular " style="color:white"> with email forwarding</h1>


                        </div>
                        <div class="text-xs-center my-4">
                            <v-btn large class="text--primary" :to="{name:'Register'}">Get started</v-btn>
                            <v-btn outline dark large>Documentation</v-btn>

                        </div>
                        <v-card color="grey lighten-5" class="white--text"
                                style="max-width:800px;margin-left:auto;margin-right:auto">


                            <v-card-title primary-title class="pa-0">

                                <pre v-highlightjs="code" style="margin-left:auto;margin-right:auto">
                                    <code class="html subheading font-weight-regular pa-0"
                                          style="background-color: transparent;box-shadow:none"></code>
                                </pre>

                            </v-card-title>

                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </section>

        <!--
        <section style="width:100%;height:30vh;margin-top:-1px;
          background: linear-gradient(to right bottom,#5f62b8 49.9%,transparent 50.1%);">
        </section>
        -->

        <div style="position:absolute;width:100%;height:100vh;z-index:1" class="hidden-sm-and-down">

            <v-container>
                <v-layout row wrap>
                    <v-flex>


                    </v-flex>
                </v-layout>
            </v-container>

        </div>


        <v-container class="my-5">


            <v-layout row wrap>


                <v-flex xs12 text-xs-center class="mb-5">
                    <h2 class=" display-3 fnt font-weight-bold"> Features</h2>
                    <!--<h3 class="title text--secondary pt-4"> This is the simplest solution for form submission on static
                  websites hosted on github or firebase </h3>  -->
                </v-flex>


                <v-flex md6 class=" px-2 py-4">
                    <v-layout row wrap align-center>

                        <v-flex md3>
                            <v-img
                                    src="images/landing/server.png"
                                    height="70px"
                                    contain
                            ></v-img>
                        </v-flex>
                        <v-flex md9>

                            <h5 class="headline font-weight-bold">We provide the backend</h5>
                            <h6 class="subheading">Using SoStatic removes the need for developing, hosting and
                                maintaining your
                                own servers just for the simple task of receiving form submissions</h6>
                        </v-flex>
                    </v-layout>

                </v-flex>

                <v-flex md6 class=" px-2 py-4">
                    <v-layout row wrap align-center>

                        <v-flex md3>
                            <v-img
                                    src="images/landing/javascript.png"
                                    height="70px"
                                    contain
                            ></v-img>
                        </v-flex>
                        <v-flex md9>

                            <h5 class="headline font-weight-bold">Zero dependencies</h5>


                            <h6 class="subheading"> Our solution uses the native HTML form submission process. The only
                                library
                                you will need to add is Google's ReCaptcha, if you decide to use it for spam
                                filtering</h6>
                        </v-flex>
                    </v-layout>
                </v-flex>

                <v-flex md6 class=" px-2 py-4">
                    <v-layout row wrap align-center>

                        <v-flex md3>
                            <v-img
                                    src="images/landing/bot.png"
                                    height="70px"
                                    contain
                            ></v-img>
                        </v-flex>
                        <v-flex md9>
                            <h5 class="headline font-weight-bold">Simple ReCaptcha validation</h5>
                            <h6 class="subheading">With just a checkbox, you can integrate spam filtering on the
                                using Google's recaptcha for free.</h6>
                        </v-flex>
                    </v-layout>
                </v-flex>

                <v-flex md6 class=" px-2 py-4">
                    <v-layout row wrap align-center>

                        <v-flex md3>
                            <v-img
                                    src="images/landing/annonymous.png"
                                    height="70px"
                                    contain
                            ></v-img>
                        </v-flex>
                        <v-flex md9>

                            <h5 class="headline font-weight-bold">Hide your email from the internet</h5>
                            <h6 class="subheading">Using our service, you wont have to make your email public to the
                                visitors,
                                thus avoiding spam</h6>
                        </v-flex>
                    </v-layout>


                </v-flex>
                <v-flex md6 class=" px-2 py-4">
                    <v-layout row wrap align-center>

                        <v-flex md3>
                            <v-img
                                    src="images/landing/setup.png"
                                    height="70px"
                                    contain
                            ></v-img>
                        </v-flex>
                        <v-flex md9>

                            <h5 class="headline font-weight-bold">Very quick setup</h5>
                            <h6 class="subheading">Adding SoStatic to your website is as easy as replacing the <b>Action</b> parameter on your form</h6>
                        </v-flex>
                    </v-layout>


                </v-flex>
                <v-flex md6 class=" px-2 py-4">
                    <v-layout row wrap align-center>

                        <v-flex md3>
                            <v-img
                                    src="images/landing/deployment.png"
                                    height="70px"
                                    contain
                            ></v-img>
                        </v-flex>
                        <v-flex md9>

                            <h5 class="headline font-weight-bold">Changes without redeployment</h5>
                            <h6 class="subheading">You can change the behaviour of your form processing without needing to redeploy your website</h6>
                        </v-flex>
                    </v-layout>


                </v-flex>


            </v-layout>

        </v-container>

        <div class="grey lighten-4">
            <v-container text-xs-center>
                <v-layout row wrap>

                    <v-layout row wrap>
                        <v-flex xs12 text-xs-center class="my-5">
                            <h2 class="display-3 fnt font-weight-bold"> Pricing</h2>
                        </v-flex>

                        <v-flex md4 xs12 class="pa-2">
                            <v-card class="pa-2">


                                <v-flex xs12 class="text-lg-center">

                                    <v-img class="my-4"
                                           src="images/landing/price_free.png"
                                           height="100px"
                                           contain
                                    ></v-img>
                                    <h3 class="display-1 mb-4" style="width:100%">Free</h3>
                                    <h3 class="display-1 my-4 font-weight-bold deep-purple--text text--lighten-2"
                                        style="width:100%">0$</h3>
                                    <p class="subheading mb-2"><b>1</b> Website</p>
                                    <p class="subheading mb-2"><b>1</b> Form</p>
                                    <p class="subheading mb-2"><b>100</b> Messages per Month</p>
                                    <p class="subheading mb-2"><b>1</b> Contact</p>
                                </v-flex>

                            </v-card>
                        </v-flex>
                        <v-flex md4 xs12 class="pa-2">
                            <v-card class="pa-2">


                                <v-flex xs12 class="text-lg-center">
                                    <v-img class="my-4"
                                           src="images/landing/price_freelancer.png"
                                           height="100px"
                                           contain
                                    ></v-img>
                                    <h3 class="display-1 mb-4" style="width:100%">Freelancer</h3>

                                    <h3 class="display-1 my-4 font-weight-bold deep-purple--text text--lighten-2"
                                        style="width:100%">$5/month/site</h3>
                                    <p class="subheading mb-2"><b>Unlimited</b> Websites </p>
                                    <p class="subheading mb-2"><b>Unlimited</b> Forms</p>
                                    <p class="subheading mb-2"><b>1000</b> Messages / Month / Website</p>
                                    <p class="subheading mb-2"><b>1</b> Contact / Website</p>
                                </v-flex>

                            </v-card>
                        </v-flex>
                        <v-flex md4 xs12 class="pa-2">
                            <v-card class="pa-2">


                                <v-flex xs12 class="text-lg-center">
                                    <v-img class="my-4"
                                           src="images/landing/price_business.png"
                                           height="100px"
                                           contain
                                    ></v-img>
                                    <h3 class="display-1 " style="width:100%">Small business</h3>

                                    <h3 class="display-1 my-4 font-weight-bold deep-purple--text text--lighten-2"
                                        style="width:100%">$30/month/site</h3>
                                    <p class="subheading mb-2"><b>Unlimited</b> Website</p>
                                    <p class="subheading mb-2"><b>Unlimited</b> Forms</p>
                                    <p class="subheading mb-2"><b>Unlimited</b> Messages</p>
                                    <p class="subheading mb-2"><b>Unlimited</b> Contacts</p>
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
        </div>

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
            goToDashboard: function () {

                console.log(this.$store.getters.currentWebsite);
                if (this.$store.getters.currentWebsite.key === "") {
                    this.$router.push('/setup');
                } else {
                    this.$router.push({
                        name: 'Settings',
                        params: {
                            website_index: 0
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