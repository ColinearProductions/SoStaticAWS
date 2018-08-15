<template>
    <v-app id="inspire">
        <v-content>
            <v-container fluid fill-height>
                <v-layout align-center justify-center>
                    <v-flex xs12 sm6 md6>

                        <v-form v-model="formValidModel" @submit.prevent="">


                            <div v-if="current_step===1">
                                <h1> Step 1. </h1>
                                <h4 class="pb-4 pt-2">
                                    Let's setup your website. What is the name of your website?
                                </h4>
                                <v-text-field @keyup.enter="onNextPressed" label="Website alias"
                                              hint="My awesome website"
                                              v-model="website.alias" :rules="[rules.min3]" required
                                              autofocus></v-text-field>
                            </div>

                            <div v-else-if="current_step===2">
                                <h1> Step 2. </h1>
                                <h4 class="pb-4 pt-2">
                                    Enter the domains of your website separated by comma. Ex:
                                    example.com, www.example.com, example.org, www.example.org
                                    <br>
                                    (If you plan to use the service while locally, add localhost as well)
                                </h4>
                                <v-text-field @keyup.enter="onNextPressed" label="URL"
                                              hint="Ex: example.com, www.example.com, example.org, www.example.org"
                                              v-model="website.url" :rules="[rules.min3, rules.url]" required=""
                                              autofocus></v-text-field>
                            </div>

                            <div v-else-if="current_step===3">
                                <h1> Step 3. </h1>
                                <h4 class="pb-4 pt-2">
                                    Enter an email address where you want the messages to be redirected to
                                    and an alias for that email
                                </h4>

                                <v-layout>
                                    <v-flex xs12 sm6 md4 class="mr-4">
                                        <v-text-field @keyup.enter="onNextPressed" label="Alias"
                                                      hint="Ex: Joe, Jane, Parzival"
                                                      v-model="contact_alias" :rules="[rules.min3]" required
                                                      autofocus></v-text-field>

                                    </v-flex>

                                    <v-flex xs12 sm6 md8>
                                        <v-text-field @keyup.enter="onNextPressed" label="Email"
                                                      v-model="contact_email" :rules="[rules.email]" required
                                                      hint="Ex: joe@example.com, jane@example.com, parzival@gss.com"></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </div>

                            <!--
                            <div v-else-if="current_step===4">
                                <h1> Step 4. </h1>
                                <h4 class="pb-4 pt-2">
                                    Add an alias for a form on your website (you can add more later)
                                </h4>
                                <v-text-field @keyup.enter="onNextPressed" name="input-1" label="Form alias" v-model="form_alias"
                                              hint="Ex: Contact Form"></v-text-field>
                            </div> -->


                            <v-btn color="primary" class="mt-4" dark right @click="onNextPressed">
                                {{nextButtonText}}
                            </v-btn>

                            <v-btn color="primary" flat class="mt-4" dark right @click="onResetPressed"
                                   v-text="'Reset'">
                            </v-btn>


                            <v-btn color="primary" flat class="mt-4" dark right @click="logout"
                                   v-text="'Logout'">
                            </v-btn>

                            <v-btn color="primary" flat class="mt-4" dark right @click="onBackPressed"
                                   v-bind:disabled="current_step===1"
                                   v-text="'Back'">
                            </v-btn>
                        </v-form>
                    </v-flex>

                </v-layout>

            </v-container>
        </v-content>
    </v-app>
</template>

<script>

    import * as api from '../firebase_api';


    /* eslint-disable */
    export default {
        name: "Setup",
        data: function () {
            return {
                current_step: 1,
                website: {
                    alias: '',
                    url: '',
                    contacts: []
                },
                // form_alias:'',
                formValidModel: false,
                rules:{
                    min3: v=> v.length >= 3 || 'Field must have more than 3 characters',
                    url: function(value){ //todo what about websites like .com.ro
                        let re = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
                        return re.test(value.toLowerCase()) || 'URL not valid'
                    },
                    email: function(value) {
                        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        return re.test(value.toLowerCase()) || 'Email invalid'
                    }

                }
            }
        },
        methods: {
            onNextPressed: function () {

                if (!this.formValidModel)
                    return;
                else
                    this.formValidModel = false;

                if (this.current_step === 3)
                    this.submit();
                else
                    this.current_step++;
            },
            onResetPressed: function () {
                this.current_step = 1;
                this.contact_email = '';
                this.contact_alias = '';
                this.website.url = '';
                this.website.alias = '';
            },
            onBackPressed: function () {
                this.current_step -= 1;
            },
            submit: function () {
                this.$store.commit('setLoaderVisibility', true);
                this.website.contacts.push({alias: this.contact_alias, email: this.contact_email});
                this.$store.dispatch("createWebsite", this.website);
            },
            logout: function(){
                api.logout();
            }
        },
        computed: {
            nextButtonText: function () {
                return this.current_step===3?'Finish':'Next';
            },
            user:function(){
                return this.$store.getters.getUser;
            }
        },
        watch:{
            'user': function(){
                this.contact_alias = this.user.displayName;
                this.contact_email = this.user.email;
            }
        }
    }
</script>

<style scoped>

</style>