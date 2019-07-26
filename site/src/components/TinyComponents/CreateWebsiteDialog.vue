<template>
    <v-dialog
            v-model="visible"
            width="600"
            persistent
    >
        <v-card class="px-5 pt-5">
            <v-progress-linear
                    v-if="loading"
                    height="3"
                    class="mt-1"
            />



                    <v-card-title class="pb-0">
                        <div style="width:100%; text-align:left">
                            <span class="headline deep-purple--text bold">Create Website</span><br>
                        </div>

                        <div style="width:100%; text-align:left">
                            <span class="body-1 grey--text text--lighten-1">   Information about this website</span><br>
                        </div>
                    </v-card-title>

                    <v-card-text class="pa-6">
                        <v-form
                                ref="form"
                                v-model="formValidModel"
                                @submit.prevent=""
                        >
                            <v-text-field
                                    v-model="website.alias"
                                    label="Website Name"
                                    :rules="[min3]"
                                    required
                            />
                            <v-text-field
                                    v-model="domain"
                                    label="Website Domain"
                                    :rules="[min3, domainRule]"
                                    required=""
                            />

                            <span class="body-1 grey--text text--lighten-1"> Where should the message be forwarded to? (you can add more later)</span><br>
                            <v-row>
                                <v-col
                                        cols="5"
                                        class="pa-2"
                                >
                                    <v-text-field

                                            v-model="website.contacts.alias"
                                            label="Alias"
                                            :rules="[min3]"
                                    />
                                </v-col>

                                <v-col
                                        cols="7"
                                        class="pa-2"
                                >
                                    <v-text-field

                                            v-model="website.contacts.email"
                                            label="Email"
                                            :rules="[email, min3]"
                                    />
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>



            <v-divider/>
            <v-card-actions>
                <v-btn
                        text
                        color="primary"
                        @click="onClose"
                >
                    Cancel
                </v-btn>


                </v-btn>

                <v-spacer/>
                <v-btn
                        text
                        color="primary"
                        @click="onConfirmClicked"
                >
                    Create
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>


    import ruleMixin from '../rulesMixin'


    export default {
        mixins: [
            ruleMixin
        ],
        name: "CreateWebsiteDialog",
        data: function () {
            return {
                website: {
                    alias: '',
                    contacts: {
                        alias: '',
                        email: ''
                    }
                },
                formValidModel: false,
                visible: true,
                loading: false,
                domain: '',

            }
        },
        watch: {
            visible: function () {
                this.$store.commit("setCreateWebsiteDialogVisibility", this.visible);

            }
        },
        methods: {
            onConfirmClicked: function () {

                this.$refs.form.validate();
                if (this.formValidModel) {

                    this.loading = true;
                    this.website.contacts = [this.website.contacts];
                    this.website.domains = [{name: this.domain}];
                    this.$store.dispatch("createWebsite", this.website);


                }

            },
            onClose: function () {
                this.$store.commit("setCreateWebsiteDialogVisibility", false);
                this.formValidModel = false;

            }

        }
    }
</script>

<style scoped>

    .bold {
        font-weight: bold;
    }


</style>