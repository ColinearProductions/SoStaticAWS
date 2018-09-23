<template>
    <v-flex xs12 sm6 md6 lg4 class="pa-2">



        <v-dialog v-model="dialog.visible" width="60%" max-width="1000px">


            <v-card class=" grey lighten-5 pl-4 pt-4 pr-4">


                <pre v-highlightjs="recaptchaScriptRefString" v-if="this.form.recaptcha"><code class="html subheading font-weight-regular"></code></pre>

                <v-card-actions v-if="this.form.recaptcha">
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="onCopyRecaptchaRefClicked">Copy</v-btn>

                </v-card-actions>

                <pre v-highlightjs="sourceCode"><code class="html subheading font-weight-regular"></code></pre>

                <v-card-actions>
                    <v-btn flat color="primary" @click="dialog.visible = false">Close</v-btn>

                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="onCopyFormCodeClicked">Copy</v-btn>

                </v-card-actions>
            </v-card>
        </v-dialog>


        <v-card>
            <v-card-title class="pb-0">
                <div>
                    <span class="headline deep-purple--text bold">{{form.alias}}</span><br>
                    <span class="body-1 grey--text text--lighten-1 ">Added on {{formAddedOn}}</span><br>
                </div>


            </v-card-title>

            <v-card-text class="pa-4">


                <p class="deep-purple--text bold mb-1">
                    Messages {{form.message_count}}/300
                </p>
                <v-progress-linear v-bind:value="messagesProgress" height="3" class="mt-1"></v-progress-linear>

                <p class="deep-purple--text bold mb-2">
                    ReCAPTCHA
                    <br>
                    <small v-bind:class="{ 'red--text': !form.recaptcha, 'green--text':form.recaptcha}">
                        {{form.recaptcha?'Enabled':'Disabled'}}
                    </small>

                <p class="deep-purple--text bold mb-1">
                    <v-icon class="deep-purple--text">http</v-icon>
                    Endpoint:
                </p>

                <p @click="onEndpointClicked" class="deep-purple--text text-lighten-2 deep-purple lighten-5 pa-2 "
                   style="cursor: pointer;width:100%">
                    <span class="caption">{{shortEndpoint}}</span>
                </p>

                <a class="deep-purple--text bold" v-on:click="onGenerateBoilerplateClicked">
                    Generate form boilerplate
                </a>


            </v-card-text>

            <v-divider></v-divider>
            <v-card-actions>
                <v-btn flat color="primary" @click="editForm">Edit</v-btn>

            </v-card-actions>
        </v-card>

    </v-flex>

</template>

<script>
    import moment from 'moment'

    const pathToFunction = "https://sostatic.xyz/api/";

    export default {
        name: "FormCard",
        props: ['form'],
        data: function () {
            return {
                dialog: {
                    visible: false
                }

            }
        },
        computed: {
            messagesProgress: function () {
                return (this.form.message_count / 300) * 100;
            },
            formAddedOn: function () {
                return moment(this.form.added_on).format("YYYY-MM-DD HH:mm");
            },
            shortEndpoint: function () {
                return pathToFunction + this.form.endpoint
            },
            recaptchaScriptRefString: function () {
                return `<script src="https://www.google.com/recaptcha/api.js" async defer><script>`;

            },
            currentWebsite: function () {
                return this.$store.getters.currentWebsite;
            },
            sourceCode: function () {
                let url =pathToFunction + this.form.endpoint;

                let recaptchaSiteKey='';
                let recaptchaCode='';

                if(this.form.recaptcha) {
                    recaptchaSiteKey = this.currentWebsite.sitekey;
                    recaptchaCode = `<div class="g-recaptcha" data-sitekey="${recaptchaSiteKey}"></div>`;
                }

                return `<form action="${ url } " method="POST">
    <label for="name">Name</label>
    <input type="text" name="name">
    <label for="email">Email  </label>
    <input type="text" name="email">
    <label for="message"> Message </label>
    <textarea name="message" placeholder="Your message"></textarea>
    ${recaptchaCode}
    <input type="submit" value="Submit">
</form>`;
            }
        },
        methods: {
            editForm: function () {
                this.$emit('onEditFormClicked', this.form);
            },
            onEndpointClicked: function () {
                this.$store.commit("showSnackbar", "Endpoint copied to clipboard");
                this.copyToClipboard(pathToFunction + this.form.endpoint);
            },
            onGenerateBoilerplateClicked: function () {
                this.dialog.visible = true;
            },
            onCopyRecaptchaRefClicked: function(){
                this.$store.commit("showSnackbar", "Recaptcha reference copied to clipboard");

                this.copyToClipboard(this.recaptchaScriptRefString);
            },
            onCopyFormCodeClicked: function(){
                this.$store.commit("showSnackbar", "Boilerplate code copied to clipboard");

                this.copyToClipboard(this.sourceCode);
            },
            copyToClipboard(text){
                const el = document.createElement('textarea');
                el.value = text;
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);

            }
        }
    }
</script>

<style scoped>
    .bold {
        font-weight: bold;
    }


</style>