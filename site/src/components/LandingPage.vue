<template>
    <v-app style="background-color: white">

        <div id="pixis" class="landing-bg" style="position:absolute;background-position: top 0 right 0;background-repeat:no-repeat;
        background-size: 100vh auto; background-color: white; z-index:1; height:100vh; width:100vw">
        </div>


        <section style=" width:100%;height:100vh" :style="{'height':$vuetify.breakpoint.xs?'':'100vh'}"
                 :class="{'mt-5':$vuetify.breakpoint.xs}">
            <v-layout class="pa-4" row wrap align-center :fill-height="$vuetify.breakpoint.mdAndUp"
                      :class="{'pl-5': $vuetify.breakpoint.mdAndUp,'ml-5': $vuetify.breakpoint.mdAndUp,'text-xs-center':$vuetify.breakpoint.xs}">
                <v-flex style="z-index:2 ">
                    <div>
                        <h1 class="display-4 deep-purple--text font-weight-bold"
                            :class="{'display-2': $vuetify.breakpoint.xs}">
                            SoStatic</h1>


                        <h1 class="display-3 deep-purple--text font-weight-regular"
                            :class="{'headline': $vuetify.breakpoint.xs}">
                            Form backend for static websites</h1>
                        <h1 class="headline font-weight-regular deep-purple--text "
                            :class="{'subheading': $vuetify.breakpoint.xs}"> with email forwarding</h1>


                    </div>
                    <div class=" my-4">


                        <template  v-if="isLoggedIn">
                            <v-btn large outline color="primary" @click="goToDashboard">
                                Go to dashboard
                            </v-btn>
                            <v-btn large outline color="primary" @click="logout">Logout</v-btn>
                        </template>

                        <template v-else>


                            <v-btn large color="primary" :to="{name:'Register'}">Register</v-btn>
                            <v-btn large color="primary" :to="{name:'Login'}">Login</v-btn>
                        </template>



                        <v-card color="blue-grey darken-4" class="white--text mt-3 hidden-sm-and-down"
                                style="max-width: 500px">


                            <v-card-title primary-title class="pa-0">

                                <pre v-highlightjs="code" style="margin-left:auto;margin-right:auto">
                                    <code class="html text-xs-left subheading font-weight-regular pa-0 mt-3"
                                          :class="{'caption': $vuetify.breakpoint.xs}"
                                          style="background-color: transparent;box-shadow:none"></code>
                                </pre>

                            </v-card-title>

                        </v-card>
                    </div>
                </v-flex>
            </v-layout>

        </section>

        <!--
        <section style="width:100%;height:30vh;margin-top:-1px;
          background: linear-gradient(to right bottom,#5f62b8 49.9%,transparent 50.1%);">
        </section>
        -->


        <v-container :class="{'mt-5':$vuetify.breakpoint.mdAndUp}" style="z-index:10;">


            <v-layout row wrap>


                <v-flex xs12 text-xs-center class="mb-5">
                    <h2 class=" display-3  font-weight-bold"> Features</h2>
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
                            <h6 class="subheading">Adding SoStatic to your website is as easy as replacing the
                                <b>Action</b> parameter on your form</h6>
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
                            <h6 class="subheading">You can change the behaviour of your form processing without needing
                                to redeploy your website</h6>
                        </v-flex>
                    </v-layout>


                </v-flex>
                <v-flex md6 class=" px-2 py-4">
                    <v-layout row wrap align-center>

                        <v-flex md3>
                            <v-img
                                    src="images/landing/european-union.png"
                                    height="70px"
                                    contain
                            ></v-img>
                        </v-flex>
                        <v-flex md9>

                            <h5 class="headline font-weight-bold">GDPR compliant</h5>
                            <h6 class="subheading">We implement all the required mechanism to be compliant with GDPR and
                                will guide you through adding them to your website as well</h6>
                        </v-flex>
                    </v-layout>


                </v-flex>
                <v-flex md6 class=" px-2 py-4">
                    <v-layout row wrap align-center>

                        <v-flex md3>
                            <v-img
                                    src="images/landing/ssl.png"
                                    height="70px"
                                    contain
                            ></v-img>
                        </v-flex>
                        <v-flex md9>

                            <h5 class="headline font-weight-bold">Secure</h5>
                            <h6 class="subheading">All communication can be done through SSL just by adding an 's' to
                                the link we provide ;)</h6>
                        </v-flex>
                    </v-layout>


                </v-flex>


            </v-layout>


            <v-layout row wrap>

                <v-layout row wrap class="text-xs-center">
                    <v-flex xs12 text-xs-center class="mb-2 mt-5">
                        <h2 class="display-3  font-weight-bold"> Pricing</h2>
                    </v-flex>

                    <v-flex md12 class=" px-2 py-2" align-center>


                        <h5 class="headline font-weight-bold py-2">Free for up to 100 valid messages / month</h5>
                        <h6 class="subheading">
                            We understand that most small websites wont get more than a few contact messages per month.
                            <br>
                            We offer our service for free for websites that receive less than 100 valid messages per
                            month.
                            <br>
                            A message is considered valid if the recaptcha was succesfully filled. Spam messages will
                            not count towards your quota.
                        </h6>

                        <h5 class="headline font-weight-bold pt-5">What if you get over 100 valid messages per
                            month?</h5>
                        <h6 class="subheading py-2">
                            The messages will not be lost, but they will no longer be forwarded to your email, they will
                            only be accessible via our platform.
                            <br>
                            If you find value in having all messages forwarded, we can setup a recuring payment method
                            for 5$ / month for unlimited messages per month.
                        </h6>


                    </v-flex>


                    <!--
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
                                <p class="subheading mb-2"><b>100</b> Valid messages per Month</p>
                                <p class="subheading mb-2"><b>1</b> Contact</p>

                                <v-btn large outline color="primary" :to="{name:'Register'}">Sign up for free</v-btn>
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
                                <v-btn large outline color="primary" :to="{name:'Register'}">Sign up</v-btn>

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
                                <v-btn large outline color="primary" :to="{name:'Register'}">Sign up</v-btn>

                            </v-flex>

                        </v-card>
                    </v-flex>


                    <v-flex md12 class="pa-2">
                        <h5 class="text--secondary">* If these plans are not appropriate for your needs, it means
                            that this is not the recommended solution for you.
                            If you still want to outsource this task, please consider contacting us at
                            inquiry@sostatic.xyz to discuss a custom solution for your needs</h5>
                    </v-flex>
  -->

                </v-layout>
            </v-layout>
        </v-container>


        <v-layout>
            <v-flex xs12>

                <v-container>
                    <v-layout row wrap>
                        <v-flex md6 sm6 xs12 class="text-xs-center text-sm-left">
                            <h1>So Static</h1>
                            <h4>

                                <router-link :to="{name:'Register'}">
                                    <a class="pr-2">Sign Up </a>
                                </router-link>
                                <router-link :to="{name:'Login'}">
                                    <a class="px-2">Login </a>
                                </router-link>
                                <a class="px-2">Contact</a>
                            </h4>

                        </v-flex>
                        <v-flex md6 sm6 xs12 class="text-xs-center text-sm-right  text-lg-right">
                            <h4 class="deep-purple--text">© 2019 So Static </h4>
                            <h4><a>Terms of Service</a> | <a> Privacy Policy</a></h4>
                            <h4>Get in touch at<a> contact@sostatic.xyz</a></h4>

                        </v-flex>
                    </v-layout>


                </v-container>


            </v-flex>
        </v-layout>
        <!--
        <v-footer color="primary" app absolute>
            <span class="white--text">&copy; 2017</span>
        </v-footer>
        -->
    </v-app>
</template>

<script>

    import * as api from '../API';
    import * as PIXI from 'pixi.js'
    import * as Ease from 'pixi-ease'


    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    export default {
        name: "LandingPage",
        data: function () {
            return {

            }
        },
        mounted: function () {
            //called only for the initial page load
            this.$store.commit('setLoaderVisibility', false);

            const app =new PIXI.Application({width:window.innerWidth,height:window.innerHeight*1.5,
                // backgroundColor: 0xcccccc
                transparent: true
            });
            document.getElementById('pixis').appendChild(app.view);

            const animationlist = new Ease.list();


            /*

                       let d1 = PIXI.Texture.from('dot1.png');
                       let d2 = PIXI.Texture.from('dot2.png');


                       for(let i=0;i<4;i++){
                           let db1 = app.stage.addChild(new PIXI.Sprite(d1));
                           let db2 = app.stage.addChild(new PIXI.Sprite(d2));



                           let x1=getRandomInt(900,window.innerWidth);
                           let x2 =getRandomInt(900,window.innerWidth);
                           let y1 =getRandomInt(0,window.innerHeight);
                           let y2 = getRandomInt(0,window.innerHeight);

                           db1.position.set(x1,y1);
                           db2.position.set(x2,y2);



                       }


                       let t1 = PIXI.Texture.from('Layer 10.png');
                       let t2 = PIXI.Texture.from('Layer 11.png');

                       let b1 = app.stage.addChild(new PIXI.Sprite(t1));
                       let b2 = app.stage.addChild(new PIXI.Sprite(t2));
                       b1.position.set(700,-100);
                       b2.position.set(1200,200); */

            for(let i=6;i>=0;i--){

                let texture = PIXI.Texture.from(`${i+1}.png`);
                let blob = app.stage.addChild(new PIXI.Sprite(texture));
                blob.position.set(1000,-100);

                animationlist.add(new Ease.to(blob,{x:930+i*10,y:-100},10000,{reverse:true,repeat:true,ease:'easeInOutSine'}))
            }

            window.addEventListener('resize', resize);

            // Resize function window
            function resize() {
                // Resize the renderer
                app.renderer.resize(window.innerWidth, window.innerHeight);

                // You can use the 'screen' property as the renderer visible
                // area, this is more useful than view.width/height because
                // it handles resolution
            }



        },
        computed: {
            isLoggedIn: function () {
                return this.$store.getters.isLoggedIn;
            },
            code: function () {
                return `<form action="https://ssttc.xyz/{YOUR_KEY}">
            <input name="name">
            <input name="email">
            <textarea name="message"></textarea>
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
                if (this.$store.getters.currentWebsite._id === "") {
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

    * {
        font-family: 'Rubik' !important;
    }
    h1,h2,h3,h4,h5,h6,div,a {
        font-family: 'Rubik' !important;
    }

</style>