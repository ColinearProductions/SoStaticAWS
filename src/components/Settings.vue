
<template>
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap justify-center>
            <v-flex xl8 md10 xs12 class="pa-2">
                <v-card>

                    <v-layout row justify-center>
                        <v-flex xl10 md10 xs12 class="pa-2">



                            <v-card-text class="pa-4">

                                <v-form v-model="formValidModel" ref="form" @submit.prevent="">

                                    <div style="width:100%; text-align:left">
                                        <span class="display-1 deep-purple--text bold">Website details</span><br>
                                    </div>
                                    <v-divider class=" mb-2"></v-divider >
                                    <div style="width:100%; text-align:left" class="mb-4">
                                        <span class="body-1 grey--text text--lighten-1">   Information about this website</span><br>

                                    </div>


                                    <v-text-field
                                            prepend-icon="assignment"
                                            label="Website Name"
                                            v-model="websiteDetailsModel.alias"
                                            v-on:keyup="onWebsiteModelChanged"
                                            :rules="[min3]" required
                                    ></v-text-field>
                                    <v-text-field
                                            prepend-icon="assignment"
                                            label="Website Urls (Separated by commas)"
                                            v-model="websiteDetailsModel.url"
                                            v-on:keyup="onWebsiteModelChanged"
                                            :rules="[min3, listOfLinks]" required=""

                                    ></v-text-field>


                                    <v-checkbox label="HTTPs Only" v-model="websiteDetailsModel.httpsOnly"
                                                v-on:change="onWebsiteModelChanged"
                                    ></v-checkbox>

                                    <v-switch label="Use ReCAPTCHA" v-model="websiteDetailsModel.recaptcha"
                                              v-on:change="onWebsiteModelChanged"
                                    ></v-switch>

                                    <div v-bind:class="{hidden:!websiteDetailsModel.recaptcha}">

                                        <v-text-field
                                                prepend-icon="assignment"
                                                label="Site key"
                                                v-model="websiteDetailsModel.sitekey"
                                                :rules="[requiredIf]"
                                                v-on:keyup="onWebsiteModelChanged"
                                        ></v-text-field>
                                        <v-text-field
                                                prepend-icon="assignment"
                                                label="Secret"
                                                :rules="[requiredIf]"
                                                v-model="websiteDetailsModel.secret"
                                                v-on:keyup="onWebsiteModelChanged"

                                        ></v-text-field>


                                    </div>


                                    <div style="width:100%; text-align:left" class="mt-4">
                                        <span class="display-1 deep-purple--text bold">Contacts</span><br>
                                    </div>
                                    <v-divider class=" mb-2"></v-divider >

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
                                            <v-btn color="primary lighten-1" fab small  dark v-on:click="removeContact(index)"  v-if="index!==0">
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
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" v-bind:disabled="!websiteModelChangePending" @click="onSavePressed">
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

    export default {
        name: "Settings",
        data: function () {
            return {

                websiteDetailsModel: {},
                websiteModelChangePending: false,
                formValidModel:false,

            }
        },
        methods: {
            addContact: function () {

                this.websiteDetailsModel.contacts.push({alias: "", email: ""});
                this.onWebsiteModelChanged();
            },
            onWebsiteModelChanged: function () {
                this.$refs.form.validate();
                console.log("ON Detail Model Changed");
                let props = ['alias', 'httpsOnly', 'recaptcha', 'secret', 'sitekey', 'url', 'contacts'];
                let isChanged = !isEquivalent(this.websiteDetailsModel, this.$store.getters.currentWebsite, props,['alias','email']);

                this.websiteModelChangePending = isChanged;
                this.$store.commit("setPendingModification", isChanged);

            },
            onSavePressed: function () {
                this.$refs.form.validate();

                if(this.formValidModel)
                    this.$store.dispatch("updateWebsite", this.websiteDetailsModel);


            },
            removeContact: function(index){
              this.websiteDetailsModel.contacts.splice(index,1);
              this.onWebsiteModelChanged();
            },
            //RULES
            min3: v=> {
                if(v===undefined)
                    return true;
                return v.length >= 3 || 'Field must have more than 3 characters'
            },
            listOfLinks: function(value){
                if(value===undefined)
                    return true;
                let urls = value.split(',');
                let valid = true;
                for(let idx in urls){
                    let url = urls[idx].trim();
                    if(url.length<1)
                        continue;
                    if(url==='localhost' || url==='127.0.0.1')
                        valid = valid && true;
                    else{
                        let urlValid = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(url);
                        if(!urlValid)
                            return url+' is not a valid domain name';
                        valid = valid && urlValid;

                    }
                }
                return valid || 'Not all urls are valid'
            },
            email: function(value) {
                let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                if(value===undefined)
                    return true;

                if(value.length<1)
                    return true;

                return re.test(value.toLowerCase()) || 'Email invalid'
            },
            requiredIf: function(value){
                //todo find a way to refer to 'this'


                if(this.websiteDetailsModel.recaptcha)
                    return !(value===undefined || value === null || value==='') || "This field is required";
                else
                    return true;
            }
            //RULES

        },
        watch: {
            'isWebsiteChangePending': function () {
                this.websiteModelChangePending = this.isWebsiteChangePending
            },
            'currentWebsite': function(){
                this.websiteDetailsModel = this.$store.getters.currentWebsiteClone;
                this.$refs.form.validate();
                this.websiteModelChangePending = false;
                this.$store.commit("setPendingModification", false);

            }
        },
        computed: {
            isWebsiteChangePending() {
                return this.$store.getters.getPendingModification;
            },
            currentWebsite(){
                return this.$store.getters.currentWebsite;
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

            if(Array.isArray(a[propName])){

                if(a[propName].length !== b[propName].length){
                    console.log("Not equivalent because", propName, 'has a different length');
                    return false;
                }
                for(let i=0;i<a[propName].length;i++){
                    let result = true;
                    subprops.forEach((subprop)=>{
                        if(a[propName][i][subprop]!==b[propName][i][subprop]){
                            console.log("Not equivalent because", propName,'[',i,']',a[propName][i][subprop],b[propName][i][subprop] );
                            result=result && false;
                        }
                    });

                    if(result===false)
                        return false;

                }

            }else if (a[propName] !== b[propName]) {
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