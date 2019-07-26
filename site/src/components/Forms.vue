<template>
    <v-row>
        <v-container
                v-if="formsCount<1"
                class="bg fill-height text-center"
                grid-list-md
        >
            <v-row

                    align="center"
            >
                <v-col>
                    <h3 class="display-1 text--secondary text--lighten-3">
                        You have no forms at the moment, click <span class="deep-purple--text text--lighten-3">+</span>
                        to create a form
                    </h3>
                </v-col>
            </v-row>
        </v-container>

        <form-card
                v-for="form in currentWebsite.forms"
                :key="form._id"
                :form="form"
                @onEditFormClicked="onEditFormClicked"
        />

        <v-btn
                fab
                bottom
                right
                color="primary"
                fixed
                @click="onCreateFormClicked"
        >
            <v-icon>add</v-icon>
        </v-btn>

        <v-dialog
                v-model="dialogModel.visible"
                width="800px"
        >
            <v-card>
                <v-form
                        ref="form"
                        v-model="formValidModel"
                        @submit.prevent=""
                >
                    <v-card-title class="grey lighten-4 py-6 title deep-purple--text">
                        {{ dialogModel.title }}
                    </v-card-title>
                    <v-container
                            grid-list-sm
                            class="pa-12"
                    >
                        <v-row>
                            <v-col cols="12">
                                <v-text-field
                                        v-model="dialogModel.aliasField"
                                        :rules="[min3, uniqueFormName]"
                                        required=""
                                        prepend-icon="assignment"
                                        label="Form alias"
                                />
                            </v-col>
                            <v-col cols="12">
                                <v-switch
                                        v-model="dialogModel.useRecaptcha"
                                        label="Use ReCAPTCHA"
                                        :disabled="!currentWebsite.recaptcha"
                                />
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-card-actions>
                        <v-btn
                                v-if="dialogModel.update"
                                text
                                color="red"
                                @click="deleteForm"
                        >
                            Delete form
                        </v-btn>

                        <v-spacer/>
                        <v-btn
                                text
                                color="primary"
                                @click="dialogModel.visible = false"
                        >
                            Cancel
                        </v-btn>

                        <v-btn
                                text
                                color="primary"
                                @click="onAddFormConfirm()"
                                v-text="dialogModel.confirmButton"
                        >
                            Create
                        </v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
    /* eslint-disable */
    import FormCard from "./FormCard";
    import rulesMixin from './rulesMixin'
    import {mapGetters, mapActions, mapMutations} from 'vuex'


    function objToArray(obj) {
        return Object.keys(obj).map(function (key) {
            obj[key]['key'] = key;
            return obj[key];
        });
    }


    export default {
        mixins: [
            rulesMixin
        ],
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
            uniqueFormName: function (v) {
                let res = true;

                if (this.currentWebsite.forms === undefined)
                    return true;

                Object.values(this.currentWebsite.forms).forEach((form) => {
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

                    let payload = {
                        alias: this.dialogModel.aliasField,
                        recaptcha: this.dialogModel.useRecaptcha,
                        form_id: this.dialogModel.formToBeUpdatedId
                    };
                    this.updateForm(payload)

                } else {
                    let payload =  {
                        alias: this.dialogModel.aliasField,
                        recaptcha: this.dialogModel.useRecaptcha
                    };
                    this.addFormToWebsite(payload);


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
                this.deleteForm(formId);
                this.dialogModel.visible = false;
            },
            ...mapActions([
                'addFormToWebsite','updateForm','deleteForm'
            ])
        },
        computed: {
            formsCount: function () {
                if (this.currentWebsite.forms !== undefined && this.currentWebsite.forms !== null)
                    return objToArray(this.currentWebsite.forms).length;
                else
                    return 0;
            },
            ...mapGetters([
                'currentWebsite'
            ])
        }


    }


</script>

<style scoped>


</style>