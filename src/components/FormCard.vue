<template>

    <v-flex xs12 sm6 md6 lg4 class="pa-2">
        <v-card>
            <v-card-title class="pb-0">
                <div>
                    <span class="headline deep-purple--text bold">{{form.alias}}</span><br>
                    <span class="body-1 grey--text text--lighten-1 ">Added on {{formAddedOn}}</span><br>
                </div>


            </v-card-title>

            <v-card-text class="pa-4">


                <p class="deep-purple--text bold mb-1">
                    Messages {{form.message_count}}/300 <a class="deep-purple--text text--lighten-3">(Read)</a>
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

                <a class="deep-purple--text bold">
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
    const pathToFunction ="https://us-central1-sostatic-1d381.cloudfunctions.net/endpoint/";

    export default {
        name: "FormCard",
        props: ['form'],
        computed: {
            messagesProgress: function () {
                return (this.form.message_count / 300) * 100;
            },
            formAddedOn: function () {
                return moment(this.form.added_on).format("YYYY-MM-DD HH:mm");
            },
            shortEndpoint: function () {
                return "https://us-central1-sostatic-1d381   ...   " + this.form.endpoint
            }
        },
        methods: {
            editForm: function () {
                this.$emit('onEditFormClicked', this.form);
            },
            onEndpointClicked: function () {
                const el = document.createElement('textarea');
                el.value = pathToFunction+this.form.endpoint;
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