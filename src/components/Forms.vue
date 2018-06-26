<template>


    <v-layout row wrap>

        <FormCard v-for="form in currentWebsite.forms" :key="form.key" v-bind:form="form"
                  v-on:onEditFormClicked="onEditFormClicked"></FormCard>

        <v-btn fab bottom right color="primary" dark fixed @click="onCreateFormClicked">
            <v-icon>add</v-icon>
        </v-btn>

        <v-dialog v-model="dialogModel.visible" width="800px">
            <v-card>
                <v-card-title class="grey lighten-4 py-4 title deep-purple--text">
                    {{dialogModel.title}}
                </v-card-title>
                <v-container grid-list-sm class="pa-5">
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-text-field
                                    prepend-icon="assignment"
                                    label="Form alias" v-model="dialogModel.aliasField"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-switch label="Use ReCAPTCHA" :disabled="!currentWebsite.recaptcha"
                                      v-model="dialogModel.useRecaptcha"
                            ></v-switch>
                        </v-flex>


                    </v-layout>
                </v-container>
                <v-card-actions>

                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="dialogModel.visible = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="onAddFormConfirm()" v-text="dialogModel.confirmButton">Create
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-layout>

</template>

<script>

    import FormCard from "./FormCard";


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
                    formToBeUpdatedId: ''
                }
            }
        },
        methods: {
            onAddFormConfirm: function () {
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

                this.dialogModel = {
                    visible: true,
                    useRecaptcha: false,
                    title: "Add form to " + this.currentWebsite.alias,
                    confirmButton: "Create",
                    aliasField: "",
                    update: false,
                    formToBeUpdatedIdId: ''
                }
            },
            onEditFormClicked: function (form) {
                console.log(",,,,,,,,,", form);
                this.dialogModel = {
                    visible: true,
                    useRecaptcha: form.recaptcha,
                    title: "Update form " + form.alias,
                    confirmButton: "Confirm",
                    aliasField: form.alias,
                    update: true,
                    formToBeUpdatedId: form.key
                }
            }
        },
        computed: {
            currentWebsite: function () {
                return this.$store.getters.currentWebsite;
            }
        }


    }
</script>

<style scoped>
    @import "https://cdn.jsdelivr.net/npm/animate.css@3.5.1";

    .bold {
        font-weight: bold !important;
    }


</style>