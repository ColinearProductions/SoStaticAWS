<template>
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap justify-center>
            <v-flex xl8 md10 xs12 class="pa-2">
                <v-card>
                    <v-progress-linear

                            :active="loading"
                            :indeterminate="true"
                    ></v-progress-linear>
                    <v-layout row justify-center v-if="!loading">
                        <v-flex xl10 md10 xs12 class="pa-2">
                            <v-card-text class="pa-4">
                                <v-form v-model="formValidModel" ref="form" @submit.prevent="" autocomplete="off">
                                    <div style="width:100%; text-align:left">
                                        <span class="display-1 deep-purple--text bold">Website details</span><br>
                                    </div>
                                    <v-divider class=" mb-2"></v-divider>
                                    <div style="width:100%; text-align:left" class="mb-4">
                                        <span class="body-1 grey--text text--lighten-1">   Information about this website</span><br>

                                    </div>
                                    <v-text-field
                                            label="Website Name"
                                            v-model="websiteDetailsModel.alias"
                                            v-on:keyup="onWebsiteModelChanged"
                                            :rules="[min3]" required
                                    ></v-text-field>

                                    <div class="text-sm-left pb-2">
                                        <p class="subheading bold mb-1">Your domains</p>
                                        <v-chip
                                                v-for="domain in websiteDetailsModel.domains"
                                                v-model="domain.on"
                                                @input="onDomainRemoveClicked"
                                                close
                                        >{{domain.name}}
                                        </v-chip>
                                        <v-chip v-if="!domainInputVisible"
                                                style="cursor: pointer;"
                                                color="primary" dark
                                                @click="domainInputVisible=true"


                                        > <v-icon left> add </v-icon> Add more domains
                                        </v-chip>
                                    </div>
                                    <v-layout row wrap class="px-2 " v-if="domainInputVisible">
                                        <v-text-field class="pl-1"


                                                      label="Add a new domain"
                                                      v-model="currentDomainInput"
                                                      :error="addDomainError.showError"
                                                      :error-messages="addDomainError.message"
                                                      placeholder="example.com"
                                                      @keydown.enter="onAddDomainPressed"




                                        ></v-text-field>
                                        <v-btn color="primary" class="lighten-1 mt-3" outline  @click="onAddDomainPressed">
                                            Add
                                        </v-btn>
                                        <v-btn color="primary" class="lighten-1 mt-3" flat  @click="currentDomainInput=''">
                                            Clear
                                        </v-btn>
                                    </v-layout>
                                    <!--
                                    <v-layout row wrap class=" " v-else>
                                        <v-btn color="primary" class="lighten-1 mt-3" flat @click="domainInputVisible=true" >
                                            Add more domains
                                        </v-btn>
                                    </v-layout> -->

                                    <v-checkbox class="mt-3" label="HTTPs Only" v-model="websiteDetailsModel.httpsOnly"
                                                v-on:change="onWebsiteModelChanged"
                                    ></v-checkbox>
                                    <v-switch :label="recaptchaSwitchLabel" v-model="websiteDetailsModel.recaptcha"
                                              :disabled="recaptchaLocked"
                                              v-on:change="onWebsiteModelChanged"
                                    ></v-switch>
                                    <div v-if="websiteDetailsModel.recaptcha">
                                        <v-text-field
                                                autocomplete="off"
                                                prepend-icon="assignment"
                                                label="Site key"
                                                v-model="websiteDetailsModel.sitekey"
                                                :rules="[requiredIf]"
                                                @click:append-outer="hideRecaptchaSiteKey = !hideRecaptchaSiteKey"
                                                :type="hideRecaptchaSiteKey?'password':'text'"
                                                append-outer-icon="remove_red_eye"

                                                v-on:keyup="onWebsiteModelChanged"
                                        ></v-text-field>
                                        <v-text-field
                                                autocomplete="off"
                                                prepend-icon="assignment"
                                                label="Secret"
                                                :rules="[requiredIf]"
                                                :type="hideRecaptchaSecretKey?'password':'text'"
                                                v-model="websiteDetailsModel.secret"
                                                append-outer-icon="remove_red_eye"
                                                @click:append-outer="hideRecaptchaSecretKey = !hideRecaptchaSecretKey"
                                                v-on:keyup="onWebsiteModelChanged"

                                        ></v-text-field>
                                    </div>
                                    <div style="width:100%; text-align:left" class="mt-4">
                                        <span class="display-1 deep-purple--text bold">Contacts</span><br>
                                    </div>
                                    <v-divider class=" mb-2"></v-divider>
                                    <div style="width:100%; text-align:left" class="pb-3">
                                        <span class="body-1 grey--text text--lighten-1">Enter email addresses where you want the messages to be forwarded to</span><br>
                                    </div>
                                    <v-layout row wrap v-for="(contact,index) in websiteDetailsModel.contacts"
                                              :key="index">
                                        <v-flex xs5 class="pa-2">
                                            <v-text-field

                                                    label="Alias"
                                                    v-model="contact.alias"
                                                    v-on:keyup="onWebsiteModelChanged"
                                                    :rules="[min3]"
                                            ></v-text-field>
                                        </v-flex>

                                        <v-flex xs6 class="pa-2">
                                            <v-text-field

                                                    label="Email"
                                                    v-model="contact.email" :rules="[email, min3]"
                                                    v-on:keyup="onWebsiteModelChanged"
                                            ></v-text-field>
                                        </v-flex>

                                        <v-flex xs1 class="pt-3">
                                            <v-btn color="primary lighten-1" fab small dark
                                                   v-on:click="removeContact(index)" v-if="index!==0">
                                                <v-icon>delete_outline</v-icon>
                                            </v-btn>
                                        </v-flex>


                                    </v-layout>
                                    <v-layout row wrap>
                                        <v-flex xs12>

                                            <v-btn right flat color="primary" v-on:click="addContact"
                                                   v-bind:disabled="websiteDetailsModel.contacts.length>=5">Add more
                                            </v-btn>
                                        </v-flex>
                                    </v-layout>

                                </v-form>
                            </v-card-text>

                        </v-flex>
                    </v-layout>

                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-btn flat color="red" @click="onDeleteWebsiteClicked">
                            Delete Website
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" v-bind:disabled="!isWebsiteChangePending" @click="onSavePressed">
                            Save
                        </v-btn>


                    </v-card-actions>
                </v-card>

            </v-flex>


        </v-layout>


    </v-container>


</template>

<script>
    /* eslint-disable */

    import * as validateDomain from 'is-valid-domain'

    //todo on recaptcha, add a server function to check if the keypair is functional

    export default {
        name: "Settings",
        data: function () {
            return {
                domainInputVisible:false,
                websiteDetailsModel: {},
                formValidModel: false,
                addDomainError: {
                    showError: false,
                    message: ''
                },
                currentDomainInput: '',
                hideRecaptchaSecretKey: true,
                hideRecaptchaSiteKey: false

            }
        },
        methods: {

            onDomainRemoveClicked: function () {
                this.$store.commit("setPendingModification", true);
            },
            onAddDomainPressed: function () {

                this.addDomainError.showError = false;
                this.addDomainError.message = '';


                let domain = this.currentDomainInput;
                domain = domain.replace(/(^\w+:|^)\/\//, '');
                domain = domain.trim().toLowerCase();

                let domainValid = validateDomain(domain);
                domainValid = domainValid || domain === 'localhost' || domain === '127.0.0.1';


                if (this.websiteDetailsModel.domains.filter(d => d.on === undefined || d.on).find(d => d.name === domain) !== undefined) {
                    this.addDomainError.showError = true;
                    this.addDomainError.message = 'Domain already in list';
                    return
                }

                if (domainValid) {
                    this.websiteDetailsModel.domains.push({on: true, name: domain});
                    this.$store.commit("setPendingModification", true);


                    this.currentDomainInput = '';
                    this.addDomainError.showError = false;
                    this.addDomainError.message = '';


                } else {
                    this.addDomainError.showError = true;
                    this.addDomainError.message = 'Not a valid domain name';

                }


            },
            addContact: function () {

                this.websiteDetailsModel.contacts.push({alias: "", email: ""});
                this.onWebsiteModelChanged();
            },
            onWebsiteModelChanged: function () {
                this.$refs.form.validate();
                console.log("ON Detail Model Changed");
                let props = ['alias', 'httpsOnly', 'recaptcha', 'secret', 'sitekey', 'contacts'];
                let isChanged = !isEquivalent(this.websiteDetailsModel, this.$store.getters.currentWebsite, props, ['alias', 'email']);

                this.$store.commit("setPendingModification", isChanged);

            },
            onDeleteWebsiteClicked: function () {
                this.$confirm(
                    `This action is irreversible and will result in the permanent loss of all the messages archived for this website and all your settings. <br>
                     This action will take effect immediately`, {title: 'Are you sure you want to delete this website?'}).then(res => {
                    if (res) {
                        this.$store.dispatch("deleteWebsite", this.websiteDetailsModel._id);

                    }

                })
            },
            onSavePressed: function () {
                this.$refs.form.validate();


                if (this.formValidModel) {

                    let validDomains = this.websiteDetailsModel.domains.filter(d => d.on === undefined || d.on);


                    if (validDomains < 1) {
                        this.addDomainError.showError = true;
                        this.addDomainError.message = 'You must add at least one domain';
                        return;
                    }

                    this.websiteDetailsModel.domains = validDomains;


                    console.log(this.websiteDetailsModel.domains);
                    this.$store.dispatch("updateWebsite", this.websiteDetailsModel);
                    this.addDomainError.showError = false;


                }


            },
            removeContact: function (index) {
                this.websiteDetailsModel.contacts.splice(index, 1);
                this.onWebsiteModelChanged();
            },
            //RULES
            min3: v => {
                if (v === undefined)
                    return true;
                return v.length >= 3 || 'Field must have more than 3 characters'
            },
            email: function (value) {
                let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                if (value === undefined)
                    return true;

                if (value.length < 1)
                    return true;

                return re.test(value.toLowerCase()) || 'Email invalid'
            },
            requiredIf: function (value) {
                if (this.websiteDetailsModel.recaptcha)
                    return !(value === undefined || value === null || value === '') || "This field is required";
                else
                    return true;
            }
            //RULES,


        },
        watch: {
            'currentWebsite': function () {

                this.websiteDetailsModel = this.$store.getters.currentWebsiteClone;


                this.$store.commit("setPendingModification", false);

            }
        },
        computed: {
            isWebsiteChangePending() {
                return this.$store.getters.getPendingModification;
            },
            currentWebsite() {
                return this.$store.getters.currentWebsite;
            },
            currentWebsiteClone() {
                return JSON.parse(JSON.stringify(this.$store.getters.currentWebsiteClone));
            },
            loading() {
                return this.$store.getters.isDataLoading;
            },
            recaptchaLocked() {
                if (!this.websiteDetailsModel.recaptcha) //if recaptcha is not yet enabled there is no reason to lock it.
                    return false;
                else {

                    return this.countFormsUsingRecaptcha > 0;
                }
            },
            countFormsUsingRecaptcha() {
                return this.websiteDetailsModel.forms.filter(form => form.recaptcha).length;
            },
            recaptchaSwitchLabel() {
                if (this.recaptchaLocked) {
                    return `Use ReCAPTCHA - ${this.countFormsUsingRecaptcha} forms are using ReCaptcha`
                } else {
                    return `Use ReCAPTCHA `
                }
            }
        },
        beforeMount: function () {
            this.websiteDetailsModel = this.$store.getters.currentWebsiteClone;

        }

    }

    /* eslint-disable */

    function isEquivalent(a, b, props, subprops) {
        // Create arrays of property names
        let aProps = props;

        for (let i = 0; i < aProps.length; i++) {
            let propName = aProps[i];

            // If values of same property are not equal,
            // objects are not equivalent

            if (Array.isArray(a[propName])) {

                if (a[propName].length !== b[propName].length) {
                    console.log("Not equivalent because", propName, 'has a different length');
                    return false;
                }
                for (let i = 0; i < a[propName].length; i++) {
                    let result = true;
                    subprops.forEach((subprop) => {
                        if (a[propName][i][subprop] !== b[propName][i][subprop]) {
                            console.log("Not equivalent because", propName, '[', i, ']', a[propName][i][subprop], b[propName][i][subprop]);
                            result = result && false;
                        }
                    });

                    if (result === false)
                        return false;

                }

            } else if (a[propName] !== b[propName]) {
                console.log("Not equivalent because", propName, a[propName], b[propName]);
                return false;
            }
        }

        // If we made it this far, objects
        // are considered equivalent
        return true;
    }


</script>

<style scoped>
    .bold {
        font-weight: bold;
    }

    .hidden {
        display: none
    }


</style>