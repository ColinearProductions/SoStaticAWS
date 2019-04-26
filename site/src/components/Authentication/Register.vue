<template>

    <v-form class="pa-5">
        <p class="display-2 deep-purple--text text--lighten-1 thin">
            Register
        </p>
        <v-text-field label="Display name" v-model="form_model.displayName"></v-text-field>
        <v-text-field label="E-mail" v-model="form_model.username"></v-text-field>
        <v-text-field label="Password" v-model="form_model.password" type="password"></v-text-field>
        <v-checkbox label="Register to our newsletter"></v-checkbox>

        <v-btn color="deep-purple lighten-1 ma-0" dark @click="onSubmit">
            Register
        </v-btn>
        <div class="mt-3">
            <router-link :to="{name:'Login'}">
                <a class=" text--lighten-4"
                   style="text-decoration: none;">Already got an account?</a>
            </router-link>


        </div>


    </v-form>

</template>

<script>

    import * as api from '../../API';


    export default {
        name: "Register",
        data: function () {
            return {
                form_model: {
                    username: '',
                    password: '',
                    displayName: ''
                }
            }
        },
        methods: {
            onSubmit: function () {
                let that = this;
                api.register(this.form_model.displayName, this.form_model.username, this.form_model.password, () => {}, (error_code, error_message) => {
                    console.log(error_code, error_message);
                })
            }
        }
    }
</script>

<style scoped>

</style>