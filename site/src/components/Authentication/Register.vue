<template>

    <v-form class="pa-5"  ref="form" @submit="onSubmit">

        <p class="subheading red--text text--lighten-1" v-if="error" >
            {{error}}
        </p>
        <v-text-field label="Display name" v-model="displayName" :rules="displayNameRules" ></v-text-field>
        <v-text-field label="E-mail" v-model="username" :rules="emailRules" class="mt-3"></v-text-field>
        <v-text-field label="Password" v-model="password" type="password" :rules="passwordRules" class="pb-4 mt-3"></v-text-field>


        <v-btn color="deep-purple lighten-1" class="ma-0" large outline  @click="onSubmit">
            Register
        </v-btn>
        <div class="mt-3">
            <router-link class="mr-3" :to="{name:'Login'}">
                <a class=" text--lighten-4"
                   style="text-decoration: none;">Already got an account?</a>
            </router-link>
            <router-link :to="{name:'Recover'}">
                <a class=" text--lighten-4"
                   style="text-decoration: none;">Forgot your password?</a>
            </router-link>

        </div>


    </v-form>

</template>

<script>

    import * as api from '../../API';
    import firebase from 'firebase'
    import router from '../../router'



    export default {
        name: "Register",
        data: function () {
            return {

                    username: '',
                    password: '',
                    displayName: '',
                displayNameRules:[
                    v => !!v || 'A display name is required'
                ],
                emailRules: [
                    v => !!v || 'E-mail is required',
                    v =>
                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                        "E-mail must be valid"
                ],
                passwordRules: [
                    v => !!v || 'Password is required',
                    v => v.length<8 ||
                        'Password must have at least 8 characters'
                ],
                error:''

            }
        },
        methods: {
            onSubmit: function () {

                if (!this.$refs.form.validate())
                    return;

                this.$emit('changeLoading',true);
                this.error = '';

                api.register( this.username, this.password).then(()=>{
                    let user = firebase.auth().currentUser;
                    user.updateProfile({
                        displayName: '' + displayName
                    }).then(() => {
                        router.push({
                            name: 'Settings',
                            params: {
                                'website_index': 0
                            }
                        });
                    })


                }).catch( (error) => {
                    if(error.code==='auth/email-already-in-use'){
                        this.error='Email is already registered, if you forgot your password press \'Forgot your password\''
                    }else if(error.code==='auth/too-many-requests'){
                        this.error = 'Too many unsuccessful login attempts'
                    }

                    console.log(error);
                }).then(()=>this.$emit('changeLoading',false))
            }
        }
    }
</script>

<style scoped>

</style>