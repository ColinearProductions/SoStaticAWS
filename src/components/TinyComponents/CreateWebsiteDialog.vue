<template>
    <v-dialog v-model="display" width="800px">
        <v-card>

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


                        <v-text-field
                                prepend-icon="assignment"
                                label="Website Name"
                                v-model="website.alias"
                        ></v-text-field>
                        <v-text-field
                                prepend-icon="assignment"
                                label="Website Urls (Separated by commas)"
                                v-model="website.url"
                        ></v-text-field>


                        <span class="body-1 grey--text text--lighten-1"> Where should the message be forwarded to? (you can add more later)</span><br>
                        <v-layout row wrap>
                            <v-flex xs5 class="pa-2">
                                <v-text-field

                                        label="Alias"
                                        v-model="website.contacts.alias"
                                ></v-text-field>
                            </v-flex>

                            <v-flex xs7 class="pa-2">
                                <v-text-field

                                        label="Email"
                                        v-model="website.contacts.email"

                                ></v-text-field>
                            </v-flex>


                        </v-layout>

                        <v-checkbox label="HTTPs Only" v-model="website.httpsOnly"></v-checkbox>

                        <v-switch label="Use ReCAPTCHA" v-model="website.recaptcha"></v-switch>

                        <div v-bind:class="{hidden:!website.recaptcha}">

                            <v-text-field
                                    prepend-icon="assignment"
                                    label="Site key"
                                    v-model="website.sitekey"
                            ></v-text-field>
                            <v-text-field
                                    prepend-icon="assignment"
                                    label="Secret"
                                    v-model="website.secret"
                            ></v-text-field>


                        </div>


                    </v-card-text>
                </v-flex>
            </v-layout>

            <v-divider></v-divider>
            <v-card-actions>
                <v-btn flat color="primary" v-on:click="onClose">Cancel</v-btn>

                <v-spacer></v-spacer>
                <v-btn flat color="primary" v-on:click="onConfirmClicked">Create</v-btn>

            </v-card-actions>
        </v-card>

    </v-dialog>
</template>

<script>
    export default {
        name: "CreateWebsiteDialog",

        data: function () {
            return {
                website: {



                    alias: '',
                    url: '',
                    httpsOnly: true,
                    recaptcha: false,
                    sitekey: '',
                    secret: '',
                    contacts: {
                        alias: '',
                        email: ''
                    },
                    forms: [],
                    messages: [],
                },
                display:false
            }
        },
        methods: {
            onConfirmClicked: function () {
                this.website.contacts = [this.website.contacts];
                this.$store.dispatch("createWebsite", this.website);
                this.$emit('close')

            },
            onClose: function () {
                this.$emit('close')

            }

        },
        watch:{
            // Because the dialog will modify the value of it's v-model on close, you need to make a proxy for the state
            // in VUEX store. Otherwise it will try to chanFge the value there and it will fail. This way
            // The display variable is the proxy, when visible (from store) changes, the local display value is updated
            // and applied to the dialog, when display (local) changes, the vuex store is notified and updated accordingly
            'visible': function () {
                this.display = this.visible;

            },
            'display':function(){
                this.$store.commit('setCreateWebsiteDialogVisibility',this.display)

            }
        },
        computed:{
            visible(){
                return this.$store.getters.getIsCreateWebsiteDialogVisible;
            }
        },
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