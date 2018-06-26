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
                    <small  v-bind:class="{ 'red--text': !form.recaptcha, 'green--text':form.recaptcha}" >
                        {{form.recaptcha?'Enabled':'Disabled'}}
                    </small>

                <p class="deep-purple--text bold mb-1">
                   <v-icon class="deep-purple--text">http</v-icon> Endpoint:
                </p>

                <p class="deep-purple--text text-lighten-2 deep-purple lighten-5 pa-2 " style="width:100%" >
                    <span class="caption">https://sostatic.xyz/</span> -L9edJSb7hRIAXHyL8T3
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
    export default {
        name: "FormCard",
        props:['form'],
        computed:{
            messagesProgress: function(){
                return (this.form.message_count / 300)*100;
            },
            formAddedOn:function(){
                return moment(this.form.added_on).format("YYYY-MM-DD HH:mm") ;
            }
        },
        methods:{
           editForm: function (){

               this.$emit('onEditFormClicked', this.form);
           }
        }
    }
</script>

<style scoped>
    .bold{
        font-weight:bold;
    }


</style>