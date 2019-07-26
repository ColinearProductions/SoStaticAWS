<template>
    <v-col cols="12" sm="6" md="6" lg="4">
        <v-dialog v-model="dialog.visible" width="60%" max-width="800px">
            <v-card class=" grey lighten-5 pl-6 pt-6 pr-6">
                <v-card
                        v-if="this.form.recaptcha"
                        color="blue-grey darken-4"
                        class="white--text mt-4 pa-5"
                >
          <pre v-highlightjs="recaptchaBoilerplate"><code
                  style="background-color: transparent;box-shadow:none"
                  class="html subheading font-weight-regular"
          /></pre>
                </v-card>


                <v-card color="blue-grey darken-4" class="white--text mt-4 pa-5">
                    <pre v-highlightjs="formBoilerplate" class=""><code
                            style="background-color: transparent;box-shadow:none;"
                            class="html subheading font-weight-regular"/></pre>
                </v-card>
                <v-card-actions>
                    <v-btn
                            text
                            color="primary"
                            @click="dialog.visible = false"
                    >
                        Close
                    </v-btn>

                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-card>
            <v-card-title class="pb-0">
                <div>
                    <span class="title deep-purple--text">{{ form.alias }}</span><br>
                    <span class="subtitle-1 grey--text text--lighten-1 ">Added on {{ formAddedOn }}</span><br>
                </div>
            </v-card-title>
            <v-card-text class="pa-6">


                <p class="deep-purple--text bold mb-2">
                    ReCAPTCHA
                    <br>
                    <small :class="{ 'red--text': !form.recaptcha, 'green--text':form.recaptcha}">
                        {{ form.recaptcha?'Enabled':'Disabled' }}
                    </small>
                </p>
                <p class="deep-purple--text bold mb-1">
                    <v-icon class="deep-purple--text">
                        http
                    </v-icon>
                    Endpoint:
                </p>

                <p
                        class="deep-purple--text text-lighten-2 deep-purple lighten-5 pa-2 "
                        style="cursor: pointer;width:100%"
                        @click="onEndpointClicked"
                >
                    <span class="caption">{{ shortEndpoint }}</span>
                </p>

                <a
                        class="deep-purple--text bold"
                        @click="onGenerateBoilerplateClicked"
                >
                    Generate form boilerplate
                </a>
            </v-card-text>

            <v-divider/>
            <v-card-actions>
                <v-btn
                        text
                        color="primary"
                        @click="goToDemo"
                >
                    Demo
                </v-btn>
                <v-spacer/>
                <v-btn
                        text
                        color="primary"
                        @click="editForm"
                >
                    Edit
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-col>
</template>

<script>
    import moment from 'moment'
    import * as api from '../API'

    const SERVER = api.SERVER;


    export default {
        name: 'FormCard',
        props: ['form'],
        data: function () {
            return {
                dialog: {
                    visible: false
                },
                formBoilerplate: '',
                recaptchaBoilerplate: `<script src="https://www.google.com/recaptcha/api.js" async defer><script>`

            }
        },
        computed: {
            formAddedOn: function () {
                return moment(this.form.added_on).format('YYYY-MM-DD HH:mm')
            },
            shortEndpoint: function () {
                return `${SERVER}/${this.form._id}`
            },
            recaptchaScriptRefString: function () {
                return `<script src="https://www.google.com/recaptcha/api.js" async defer><script>`
            },
            currentWebsite: function () {
                return this.$store.getters.currentWebsite
            },
        },
        methods: {
            editForm: function () {
                this.$emit('onEditFormClicked', this.form)
            },
            onEndpointClicked: function () {

            },
            onGenerateBoilerplateClicked: function () {
                this.dialog.visible = true
            },
            goToDemo: function () {
                this.$router.push({name: 'DemoForm', params: {endpoint: this.form._id, recaptcha: this.form.recaptcha}})
            }
        },
        beforeMount() {
            let url = `${SERVER}/${this.form._id}`;

            let recaptchaSiteKey = '';
            let recaptchaCode = '';

            if (this.form.recaptcha) {
                recaptchaSiteKey = this.currentWebsite.sitekey;
                recaptchaCode = `\n    <div class="g-recaptcha" data-sitekey="${recaptchaSiteKey}"></div>`
            }

            this.formBoilerplate = `<form action="${url}" method="POST">
        <input type="text" name="name">
        <input type="text" name="email">
        <textarea name="message" placeholder="Your message"></textarea>${recaptchaCode}
        <input type="submit" value="Submit">
    </form>`
        }
    }
</script>

<style scoped>
    .bold {
        font-weight: bold;
    }

</style>
