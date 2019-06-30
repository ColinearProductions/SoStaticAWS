<template>
    <v-dialog v-model="visible" width="800px" persistent>
        <v-card>
            <v-progress-linear v-if="loading" height="3" class="mt-1"></v-progress-linear>

            <v-layout row justify-center>
                <v-flex xl10 md10 xs12 class="pa-2">
                    <v-card-title class="pb-0">
                        <div style="width:100%; text-align:left">
                            <span class="headline deep-purple--text bold">Create Website</span><br>
                        </div>

                        <div style="width:100%; text-align:left">
                            <span class="body-1 grey--text text--lighten-1">   Information about this website</span><br>

                        </div>


                    </v-card-title>

                    <v-card-text class="pa-4">
                        <v-form v-model="formValidModel" ref="form" @submit.prevent="">

                            <v-text-field
                                    prepend-icon="assignment"
                                    label="Website Name"
                                    v-model="website.alias"
                                    :rules="[min3]" required
                            ></v-text-field>
                            <v-text-field
                                    prepend-icon="assignment"
                                    label="Website Domain"
                                    v-model="domain"
                                    :rules="[min3, domainRule]" required=""
                            ></v-text-field>


                            <span class="body-1 grey--text text--lighten-1"> Where should the message be forwarded to? (you can add more later)</span><br>
                            <v-layout row wrap>
                                <v-flex xs5 class="pa-2">
                                    <v-text-field

                                            label="Alias"
                                            v-model="website.contacts.alias"
                                            :rules="[min3]"
                                    ></v-text-field>
                                </v-flex>

                                <v-flex xs7 class="pa-2">
                                    <v-text-field

                                            label="Email"
                                            v-model="website.contacts.email"
                                            :rules="[email, min3]"
                                    ></v-text-field>
                                </v-flex>


                            </v-layout>


                        </v-form>
                    </v-card-text>
                </v-flex>
            </v-layout>

            <v-divider></v-divider>
            <v-card-actions>
                <v-btn flat color="primary" v-on:click="onClose">Cancel</v-btn>
                <v-btn flat color="primary" v-on:click="vld">VLD</v-btn>

                <v-spacer></v-spacer>
                <v-btn flat color="primary" v-on:click="onConfirmClicked">Create</v-btn>

            </v-card-actions>
        </v-card>

    </v-dialog>
</template>

<script>
    import * as validateDomain from 'is-valid-domain'


    /* eslint-disable */
    export default {
        name: "CreateWebsiteDialog",

        data: function () {
            return {
                website: {},
                formValidModel: false,
                visible: true,
                loading:false,
                domain:'',

            }
        },
        watch:{
            visible: function(){
                this.$store.commit("setCreateWebsiteDialogVisibility", this.visible);

            }
        },
        methods: {
            vld: function(){
                this.$refs.form.validate();
            },
            onConfirmClicked: function () {

                this.$refs.form.validate();
                if (this.formValidModel) {

                    this.loading = true;
                    this.website.contacts = [this.website.contacts];
                    this.website.domains = [{name:this.domain}];
                    this.$store.dispatch("createWebsite", this.website);


                }

            },
            onClose: function () {
                this.$store.commit("setCreateWebsiteDialogVisibility", false);
                this.formValidModel = false;

            },
            //RULES
            min3: v => {
                if (v === undefined)
                    return true;
                return v.length >= 3 || 'Field must have more than 3 characters'
            },
            email: v => {
                if (v === undefined || v.length<1)
                    return true;
                let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;



                return re.test(v.toLowerCase()) || 'Email invalid'
            },
            domainRule: function (value) {
                console.log(value);
                let tmp = value;


                tmp = tmp.replace(/(^\w+:|^)\/\//, '');
                tmp = tmp.trim().toLowerCase();

                console.log(tmp);
                let domainValid = validateDomain(tmp);
                console.log(domainValid);
                return (domainValid || tmp === 'localhost' || tmp === '127.0.0.1') || "Domain name invalid";


            },

        },
        beforeMount() {
            this.website = {
                alias: 'A12',
                contacts: {
                    alias: 'aaa',
                    email: 'aaa@aaa.aaa'
                }
            }
        }
    }
</script>

<style scoped>

    .bold {
        font-weight: bold;
    }


</style>