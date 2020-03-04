<template>
    <v-app id="inspire">
        <v-content>
            <v-container class="fill-height" fluid>
                <v-row align="center" justify="center">
                    <v-col cols="12" sm="6" md="6" lg="5">
                        <v-form v-model="formValidModel" @submit.prevent="">
                            <div v-if="current_step===1">
                                <h1> Step 1. </h1>
                                <h4 class="pb-6 pt-2"> Let's
                                    setup your website. What is the name of your website?
                                </h4>

                                <v-text-field
                                        v-model="website.alias"
                                        id="website_alias"
                                        label="Website alias"
                                        hint="My awesome website"
                                        :rules="[rules.min3]"
                                        required
                                        autofocus
                                        @keyup.enter="onNextPressed"/>
                            </div>
                            <div v-else-if="current_step===2">
                                <h1> Step 2. </h1>
                                <h4 class="pb-6 pt-2">
                                    Enter the domain of your website (You will be able to add subdomains later)

                                    <br> <span style="font-weight: normal">(If you plan to use the service while developing on a localhost, add
                                    it as well)</span>
                                </h4>
                                <v-text-field
                                        id="website_domains"
                                        v-model="website.domain"
                                        label="Website domain"
                                        placeholder="Ex: 127.0.0.1, localhost, facebook.com"
                                        :rules="[rules.min3, rules.domain]"
                                        required=""
                                        autofocus
                                        @keyup.enter="onNextPressed"
                                />
                            </div>

                            <div v-else-if="current_step===3">
                                <h1> Step 3. </h1>
                                <h4 class="pb-6 pt-2">
                                    Enter an email address where you want the messages to be redirected to
                                    and an alias for that email
                                </h4>

                                <v-row>
                                    <v-col
                                            cols="12"
                                            sm="6"
                                            md="4"
                                            class="pr-2"
                                    >
                                        <v-text-field
                                                v-model="contact_alias"
                                                id="contact_alias"
                                                label="Alias"
                                                hint="Ex: Joe, Jane, Parzival"
                                                :rules="[rules.min3]"
                                                required
                                                autofocus
                                                @keyup.enter="onNextPressed"
                                        />
                                    </v-col>

                                    <v-col
                                            cols="12"
                                            sm="6"
                                            md="8"
                                    >
                                        <v-text-field
                                                v-model="contact_email"
                                                id="contact_email"

                                                label="Email"
                                                :rules="[rules.email]"
                                                required
                                                hint="Ex: joe@example.com, jane@example.com, parzival@gss.com"
                                                @keyup.enter="onNextPressed"
                                        />
                                    </v-col>
                                </v-row>
                            </div>


                            <v-btn
                                    color="primary"
                                    class="mt-6"
                                    right
                                    id="next_button"
                                    @click="onNextPressed"
                            >
                                {{ nextButtonText }}
                            </v-btn>

                            <v-btn
                                    color="primary"
                                    text
                                    class="mt-6"
                                    right
                                    @click="onResetPressed"
                                    v-text="'Reset'"
                            />

                            <v-btn
                                    color="primary"
                                    text
                                    class="mt-6"
                                    right
                                    :disabled="current_step===1"
                                    @click="onBackPressed"
                                    v-text="'Back'"
                            />

                            <v-btn
                                    color="primary"
                                    outlined
                                    class="mt-6 float-right"
                                    right
                                    @click="logout"
                                    v-text="'Logout'"
                            />
                        </v-form>
                    </v-col>
                </v-row>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>

    import * as api from '../API'
    import * as validateDomain from 'is-valid-domain'

    /* eslint-disable */
    export default {
        name: "Setup",
        data: function () {
            return {
                current_step: 1,
                website: {
                    alias: '',
                    domain: '',
                    contacts: []
                },
                // form_alias:'',
                formValidModel: false,
                rules: {
                    min3: v => v.length >= 3 || 'Field must have more than 3 characters',
                    domain: function (value) {
                        console.log(value);
                        let tmp = value;


                        tmp = tmp.replace(/(^\w+:|^)\/\//, '');
                        tmp = tmp.trim().toLowerCase();

                        console.log(tmp);
                        let domainValid = validateDomain(tmp);
                        console.log(domainValid);
                        return (domainValid || tmp === 'localhost' || tmp === '127.0.0.1') || "Domain name invalid";


                    },
                    email: function (value) {
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
                this.website.domain = '';
                this.website.alias = '';
            },
            onBackPressed: function () {
                this.current_step -= 1;
            },
            submit: function () {


                let tmp = {
                    alias: this.website.alias,
                    domains: [{name: this.website.domain}],
                    contacts: [{alias: this.contact_alias, email: this.contact_email}]

                };

                this.$store.dispatch("createWebsite", tmp);


            },
            logout: function () {
                api.logout();
            }
        },
        computed: {
            nextButtonText: function () {
                return this.current_step === 3 ? 'Finish' : 'Next';
            },
            user: function () {
                return this.$store.getters.getUser;
            }
        },
        watch: {
            'user': function () {
                this.contact_alias = this.user.displayName;
                this.contact_email = this.user.email;
            }
        }
    }
</script>

<style scoped>

</style>