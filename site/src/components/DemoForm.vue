<template>
    <v-app id="inspire">
        <v-btn flat style="position:absolute;z-index:1" color="primary" @click="$router.go(-1)">
            <v-icon dark left>arrow_back</v-icon>Back

        </v-btn>
        <v-content>
            <v-container fluid fill-height>
                <v-layout align-center justify-center>
                    <v-flex xs8 sm3 md3>

                        <v-form  :action="endpoint" method="post" class="text-xs-center">

                            <h2 class="pb-4 pt-2">
                                This is a demo form for your website, that will behave like a real form
                            </h2>
                            <v-flex >
                                <v-text-field name="name"
                                        label="Name"
                                              value="test"
                                ></v-text-field>
                            </v-flex>

                            <v-flex >
                                <v-text-field name="email"
                                        label="Email"
                                              value="test@test.test"

                                ></v-text-field>
                            </v-flex>

                            <v-textarea name="message"

                                    label="Message"
                                    value="Test"
                                    hint="Hint text"
                            ></v-textarea>


                            <div v-if="usesRecaptcha">
                            <vue-recaptcha v-if="!isDataLoading" class="d-inline-block" :sitekey="currentWebsiteSitekey" :loadRecaptchaScript="true"></vue-recaptcha>


                            </div>
                            <v-btn type="submit">Submit</v-btn>

                        </v-form>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
    import * as api from '../API';
    const SERVER = api.SERVER;
    import VueRecaptcha from 'vue-recaptcha';


    export default {
        components: { VueRecaptcha },
        name: "DemoForm",

        computed:{
            currentWebsiteSitekey: function () {
                return this.$store.getters.currentWebsite.sitekey;
            },
            usesRecaptcha: function () {
                return this.$route.params.recaptcha;
            },
            isDataLoading: function () {
                return this.$store.getters.isDataLoading;
            },
            endpoint:function(){
                return  `${SERVER}/${this.$route.params.endpoint}`
            }
        }
    }
</script>

<style scoped>

</style>