<template>


    <v-layout row wrap>

        <v-container v-if="formsCount<1" bg fill-height grid-list-md text-xs-center>
            <v-layout row wrap align-center>
                <v-flex>
                    <h3 class="display-1 text--secondary text--lighten-3">
                        You have no forms at the moment, click <span class="deep-purple--text text--lighten-3">+</span>
                        to create a form
                    </h3>
                </v-flex>
            </v-layout>
        </v-container>


        <FormCard v-for="form in currentWebsiteClone.forms" :key="form._id" v-bind:form="form"
                  v-on:onEditFormClicked="onEditFormClicked"></FormCard>

        <v-btn fab bottom right color="primary" dark fixed @click="onCreateFormClicked">
            <v-icon>add</v-icon>
        </v-btn>


        <v-dialog v-model="dialogModel.visible" width="800px">


            <v-card>
                <v-form v-model="formValidModel" ref="form" @submit.prevent="">
                    <v-card-title class="grey lighten-4 py-4 title deep-purple--text">
                        {{dialogModel.title}}
                    </v-card-title>
                    <v-container grid-list-sm class="pa-5">
                        <v-layout row wrap>
                            <v-flex xs12>
                                <v-text-field
                                        :rules="[min3, uniqueFormName]" required=""
                                        prepend-icon="assignment"
                                        label="Form alias" v-model="dialogModel.aliasField"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-switch label="Use ReCAPTCHA" :disabled="!currentWebsiteClone.recaptcha"
                                          v-model="dialogModel.useRecaptcha"
                                ></v-switch>
                            </v-flex>


                        </v-layout>
                    </v-container>
                    <v-card-actions>
                        <v-btn flat color="red" @click="deleteForm" v-if="dialogModel.update">Delete form</v-btn>

                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="dialogModel.visible = false">Cancel</v-btn>

                        <v-btn flat color="primary" @click="onAddFormConfirm()" v-text="dialogModel.confirmButton">
                            Create
                        </v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>

        </v-dialog>


    </v-layout>


</template>


<script>
    /* eslint-disable */
    import FormCard from "./FormCard";

    function objToArray(obj) {
        return Object.keys(obj).map(function (key) {
            obj[key]['key'] = key;
            return obj[key];
        });
    }


    export default {
        name: "Forms",
        components: {FormCard},
        data: function () {
            return {
                dialogModel: {
                    visible: false,
                    title: '',
                    useRecaptcha: false,
                    aliasField: "",
                    confirmButton: "Create",
                    update: false,
                    formToBeUpdatedId: '',
                    formToBeUpdated: null
                },
                formValidModel: false

            }
        },
        methods: {
            min3: v => {
                return v.length >= 3 || 'Field must have more than 3 characters'
            },
            uniqueFormName: function (v) {
                let res = true;

                if (this.currentWebsiteClone.forms === undefined)
                    return true;

                Object.values(this.currentWebsiteClone.forms).forEach((form) => {
                    // if the form didnt change name
                    if (this.dialogModel.formToBeUpdated !== null && this.dialogModel.formToBeUpdated.alias === v)
                        return true;
                    if (v === form.alias)
                        res = false;
                });
                return res || 'Form name must be unique to avoid confusion';
            },
            onAddFormConfirm: function () {


                if (!this.formValidModel)
                    return;

                if (this.dialogModel.update) {
                    this.$store.dispatch('updateForm',
                        {
                            alias: this.dialogModel.aliasField,
                            recaptcha: this.dialogModel.useRecaptcha,
                            form_id: this.dialogModel.formToBeUpdatedId
                        }
                    );

                } else {
                    this.$store.dispatch('addFormToWebsite',
                        {
                            alias: this.dialogModel.aliasField,
                            recaptcha: this.dialogModel.useRecaptcha
                        }
                    );

                }
                this.dialogModel.visible = false;
            },
            onCreateFormClicked: function () {
                PUB = this.currentWebsiteClone;
                this.dialogModel = {
                    visible: true,
                    useRecaptcha: false,
                    title: "Add form to " + this.currentWebsiteClone.alias,
                    confirmButton: "Create",
                    aliasField: "",
                    update: false,
                    formToBeUpdatedIdId: '',
                    formToBeUpdated: null
                }
            },
            onEditFormClicked: function (form) {
                this.dialogModel = {
                    visible: true,
                    useRecaptcha: form.recaptcha,
                    title: "Update form " + form.alias,
                    confirmButton: "Confirm",
                    aliasField: form.alias,
                    update: true,
                    formToBeUpdatedId: form._id,
                    formToBeUpdated: form
                }
            },
            deleteForm: function () {
                let formId = this.dialogModel.formToBeUpdatedId;
                this.$store.dispatch('deleteForm', formId);
                this.dialogModel.visible = false;
            }
        },
        computed: {
            currentWebsiteClone: function () {
                return this.$store.getters.currentWebsiteClone;
            },
            formsCount: function () {
                if (this.currentWebsiteClone.forms !== undefined && this.currentWebsiteClone.forms !== null)
                    return objToArray(this.currentWebsiteClone.forms).length;
                else
                    return 0;
            },
            loading(){
                return this.$store.getters.isDataLoading;
            }

        }


    }




</script>

<style scoped>



</style>