<template>
    <v-container
            class="text-center"
            grid-list-md
    >
        <v-row

                justify="center"
        >
            <v-col
                    xl="8"
                    md="10"
                    cols="12"
                    class="pa-2"
            >
                <v-card>
                    <v-progress-linear

                            :active="isDataLoading"
                            :indeterminate="true"
                    />
                    <v-row
                            v-if="!isDataLoading"

                            justify="center"
                    >
                        <v-col
                                xl="10"
                                md="10"
                                cols="12"
                                class="pa-2"
                        >
                            <v-card-text class="pa-6">
                                <v-form
                                        ref="form"
                                        v-model="formValidModel"
                                        autocomplete="off"
                                        @submit.prevent=""
                                >
                                    <div style="width:100%; text-align:left">
                                        <span class="display-1 deep-purple--text bold">Website details</span><br>
                                    </div>
                                    <v-divider class=" mb-2"/>
                                    <div
                                            style="width:100%; text-align:left"
                                            class="mb-6"
                                    >
                                        <span class="body-1 grey--text text--lighten-1">   Information about this website</span><br>
                                    </div>
                                    <v-text-field
                                            v-model="websiteDetailsModel.alias"
                                            label="Website Name"
                                            :rules="[min3]"
                                            required
                                            @keyup="onWebsiteModelChanged"
                                    />


                                    <div class="text-sm-left py-2">
                                        <p class="subheading bold mb-0">
                                            Your domains
                                        </p>

                                        <v-chip
                                                v-for="(domain,index) in websiteDetailsModel.domains"
                                                outlined
                                                color="primary"
                                                class="mr-2"
                                                close
                                                @click:close="onDomainRemoveClicked(index)"
                                        >
                                            {{ domain.name }}
                                        </v-chip>
                                        <v-chip
                                                v-if="!domainInputVisible"
                                                style="cursor: pointer;"
                                                color="primary"
                                                class="mr-2"

                                                @click="domainInputVisible=true"
                                        >
                                            <v-icon left>
                                                add
                                            </v-icon>
                                            Add more domains
                                        </v-chip>
                                    </div>


                                    <v-row
                                            v-if="domainInputVisible"
                                            class="px-2 "
                                    >
                                        <v-text-field
                                                v-model="currentDomainInput"

                                                class="pl-1 pr-5"
                                                label="Add a new domain"
                                                :error="addDomainError.showError"
                                                :error-messages="addDomainError.message"
                                                placeholder="example.com"
                                                @keydown.enter="onAddDomainPressed"
                                        />
                                        <v-btn
                                                color="primary"
                                                class="lighten-1 mt-4 "
                                                outlined
                                                @click="onAddDomainPressed"
                                        >
                                            Add
                                        </v-btn>
                                        <v-btn
                                                color="primary"
                                                class="lighten-1 mt-4"
                                                text
                                                @click="currentDomainInput=''"
                                        >
                                            Clear
                                        </v-btn>
                                    </v-row>
                                    <!--
                                                      <v-layout row wrap class=" " v-else>
                                                          <v-btn color="primary" class="lighten-1 mt-4" text @click="domainInputVisible=true" >
                                                              Add more domains
                                                          </v-btn>
                                                      </v-layout> -->

                                    <v-checkbox
                                            v-model="websiteDetailsModel.httpsOnly"
                                            class="mt-4"
                                            label="HTTPs Only"
                                            @change="onWebsiteModelChanged"
                                    />
                                    <v-switch
                                            v-model="websiteDetailsModel.recaptcha"
                                            :label="recaptchaSwitchLabel"
                                            :disabled="recaptchaLocked"
                                            @change="onWebsiteModelChanged"
                                    />
                                    <div v-if="websiteDetailsModel.recaptcha">
                                        <v-text-field
                                                v-model="websiteDetailsModel.sitekey"
                                                autocomplete="off"
                                                prepend-icon="assignment"
                                                label="Site key"
                                                :rules="[requiredIf]"
                                                type="text"
                                                append-outer-icon="remove_red_eye"
                                                @click:append-outer="hideRecaptchaSiteKey = !hideRecaptchaSiteKey"

                                                @keyup="onWebsiteModelChanged"
                                        />
                                        <v-text-field
                                                v-model="websiteDetailsModel.secret"
                                                autocomplete="off"
                                                prepend-icon="assignment"
                                                label="Secret"
                                                :rules="[requiredIf]"
                                                type="text"
                                                append-outer-icon="remove_red_eye"
                                                @click:append-outer="hideRecaptchaSecretKey = !hideRecaptchaSecretKey"
                                                @keyup="onWebsiteModelChanged"
                                        />
                                    </div>
                                    <div
                                            style="width:100%; text-align:left"
                                            class="mt-6"
                                    >
                                        <span class="display-1 deep-purple--text bold">Contacts</span><br>
                                    </div>
                                    <v-divider class=" mb-2"/>
                                    <div
                                            style="width:100%; text-align:left"
                                            class="pb-4"
                                    >
                                        <span class="body-1 grey--text text--lighten-1">Enter email addresses where you want the messages to be forwarded to</span><br>
                                    </div>
                                    <v-row
                                            v-for="(contact,index) in websiteDetailsModel.contacts"
                                            :key="index"
                                    >
                                        <v-col
                                                cols="5"
                                                class="pa-2"
                                        >
                                            <v-text-field

                                                    v-model="contact.alias"
                                                    label="Alias"
                                                    :rules="[min3]"
                                                    @keyup="onWebsiteModelChanged"
                                            />
                                        </v-col>

                                        <v-col
                                                cols="6"
                                                class="pa-2"
                                        >
                                            <v-text-field

                                                    v-model="contact.email"
                                                    label="Email"
                                                    :rules="[email, min3]"
                                                    @keyup="onWebsiteModelChanged"
                                            />
                                        </v-col>

                                        <v-col
                                                cols="1"
                                                class="pt-4"
                                        >
                                            <v-btn
                                                    v-if="index!==0"
                                                    color="primary lighten-1"
                                                    fab
                                                    small
                                                    @click="removeContact(index)"
                                            >
                                                <v-icon>delete_outline</v-icon>
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-btn
                                                    right
                                                    text
                                                    color="primary"
                                                    :disabled="websiteDetailsModel.contacts.length>=5"
                                                    @click="addContact"
                                            >
                                                Add more
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-card-text>
                        </v-col>
                    </v-row>

                    <v-divider/>
                    <v-card-actions>
                        <v-btn
                                text
                                color="red"
                                @click="onDeleteWebsiteClicked"
                        >
                            Delete Website
                        </v-btn>
                        <v-spacer/>
                        <v-btn
                                text
                                color="primary"
                                :disabled="!getPendingModification"
                                @click="onDiscardPressed"
                        >
                            Discard
                        </v-btn>
                        <v-btn
                                text
                                color="primary"
                                :disabled="!getPendingModification"
                                @click="onSavePressed"
                        >
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    /* eslint-disable */

    import * as validateDomain from 'is-valid-domain'
    import cloneDeep from 'lodash.clonedeep'
    import rulesMixin from './rulesMixin'

    import {mapGetters, mapActions, mapMutations} from 'vuex'

    //todo on recaptcha, add a server function to check if the keypair is functional

    export default {
        mixins:[rulesMixin],
        name: "Settings",
        data: function () {
            return {
                domainInputVisible: false,
                websiteDetailsModel: {},
                formValidModel: false,
                addDomainError: {
                    showError: false,
                    message: '',
                    generalError:''
                },
                currentDomainInput: '',
                hideRecaptchaSecretKey: true,
                hideRecaptchaSiteKey: false

            }
        },
        methods: {

            onDomainRemoveClicked: function (domainIndex) {
                this.websiteDetailsModel.domains.splice(domainIndex, 1);
                this.setPendingModification(true);
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
                    this.setPendingModification(true);
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
                let isChanged = !isEquivalent(this.websiteDetailsModel, this.currentWebsite, props, ['alias', 'email']);

                this.setPendingModification(isChanged);

            },
            onDeleteWebsiteClicked: function () {
                this.$confirm(
                    `This action is irreversible and will result in the permanent loss of all the messages archived for this website and all your settings. <br>
                     This action will take effect immediately`, {title: 'Are you sure you want to delete this website?'}).then(res => {
                    if (res) {
                        this.deleteWebsite(this.websiteDetailsModel._id);
                    }

                })
            },
            onSavePressed: function () {
                //todo if no domains, show error message
                this.$refs.form.validate();


                if (this.formValidModel) {

                    let validDomains = this.websiteDetailsModel.domains.filter(d => d.on === undefined || d.on);


                    if (validDomains < 1) {
                        this.domainInputVisible=true;
                        this.addDomainError.showError = true;
                        this.addDomainError.message = 'You must add at least one domain';
                        return;
                    }

                    this.websiteDetailsModel.domains = validDomains;


                    console.log(this.websiteDetailsModel.domains);
                    this.updateWebsite(this.websiteDetailsModel);
                    this.addDomainError.showError = false;


                }


            },
            onDiscardPressed: function () {
                this.websiteDetailsModel = cloneDeep(this.currentWebsite);
                this.domainInputVisible=false;
                this.setPendingModification(false);

            },
            removeContact: function (index) {
                this.websiteDetailsModel.contacts.splice(index, 1);
                this.onWebsiteModelChanged();
            },
            //RULES
            requiredIf: function (value) {
                if (this.websiteDetailsModel.recaptcha)
                    return !(value === undefined || value === null || value === '') || "This field is required";
                else
                    return true;
            },
            ...mapMutations([
                'setPendingModification'
            ]),
            ...mapActions([
                'updateWebsite','deleteWebsite'
            ])


        },
        watch: {
            'currentWebsite': function () {
                this.websiteDetailsModel = cloneDeep(this.currentWebsite);
                this.setPendingModification(false);

            }
        },
        computed: {

            ...mapGetters([
                'currentWebsite',
                'getPendingModification',
                'isDataLoading'

            ]),
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

            this.websiteDetailsModel = cloneDeep(this.currentWebsite);

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



</style>