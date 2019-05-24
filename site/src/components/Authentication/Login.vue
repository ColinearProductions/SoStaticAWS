<template>

                    <v-form class="pa-5">
                        <p class="display-2 deep-purple--text text--lighten-1 thin">
                            Login
                        </p>
                        <v-text-field label="E-mail" v-model="form_model.username"></v-text-field>
                        <v-text-field label="Password" v-model="form_model.password" type="password"></v-text-field>
                        <v-btn @click="onSubmit" color="deep-purple lighten-1 ma-0" dark>
                            Login
                        </v-btn>
                        <div class="mt-3">


                            <router-link :to="{name:'Register'}">
                                <a class=" text--lighten-4 pr-3"
                                   style="text-decoration: none;"  >Dont have an account?</a>
                            </router-link>

                            <router-link :to="{name:'Recover'}">
                                <a class=" text--lighten-4"
                                   style="text-decoration: none;"  >Forgot your password?</a>
                            </router-link>

                        </div>


                    </v-form>


</template>

<script>

    import * as api from '../../API';
    import router from '../../router'

    export default {
        name: "Login",
        data: function(){
            return{
                form_model:{
                    username:'',
                    password:''
                }
            }
        },
        methods:{
            onSubmit:function(){
                api.login(this.form_model.username, this.form_model.password,function(){
                    router.push({
                        name:'Settings',
                        params: {
                            'website_index':0
                        }
                    });

                }, function(error){
                    console.log(error);

                })
            }
        }
    }
</script>

<style scoped>

</style>