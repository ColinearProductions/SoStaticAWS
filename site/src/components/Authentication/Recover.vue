<template>

    <v-form class="pa-5" ref="form">
        <p class="display-2 deep-purple--text text--lighten-1 thin">
            Recover
        </p>
        <v-text-field label="E-mail" v-model="email" :rules="emailRules" class="pb-2"></v-text-field>

        <v-btn color="deep-purple lighten-1 ma-0" dark @click="sendMail">
            Send recovery Email
        </v-btn>
        <div class="mt-3">
            <router-link class="mr-3" :to="{name:'Login'}">
                <a class=" text--lighten-4"
                   style="text-decoration: none;">Remembered your password?</a>
            </router-link>
        </div>
    </v-form>

</template>

<script>

    import * as api from '../../API';


    export default {
        name: "Forgot",
        data: function () {
            return {
                email: '',
                emailRules: [
                    v => !!v || 'E-mail is required',
                    v =>
                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                        "E-mail must be valid"
                ],
            }
        },
        methods: {
            sendMail: function () {
                if (!this.$refs.form.validate())
                    return;
                this.$emit('changeLoading', true);

                //todo auth/too-many-requests

                api.sendRecoveryEmail(this.email).then(() => {
                    console.log('Done')
                }).catch(error => {
                    console.log(error);
                }).then(() => this.$emit('changeLoading', false))
            }
        }
    }
</script>

<style scoped>

</style>