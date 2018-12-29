<template>


    <div id="wrapper">

        <v-container fluid fill-height>


            <v-layout flex align-center justify-center>



                <v-menu offset-y>

                    <div style="width:100%" slot="activator">
                        <p class="subheading text-lg-center deep-purple--text ">{{state.websitesData[state.currentWebsite].alias}}</p>
                        <v-icon id="arrow_drop_down">arrow_drop_down</v-icon>
                        <p class="caption text-lg-center  deep-purple--text text--lighten-2">{{state.websitesData[state.currentWebsite].url}}</p>
                    </div>


                    <v-list>
                        <v-list-tile v-for="(website,index) in state.websitesData" :key="index" @click="changeWebsite(index)">
                            <v-list-tile-title>{{ website.alias }}</v-list-tile-title>
                        </v-list-tile>

                        <v-divider></v-divider>

                        <v-list-tile @click="addNewWebsitePressed">
                            <v-icon>add</v-icon> <v-list-tile-title>Add new website</v-list-tile-title>
                        </v-list-tile>
                    </v-list>

                </v-menu>

            </v-layout>

        </v-container>


        <!--  <v-btn  v-for="website in websites"  :key="website">
              {{website}}
          </v-btn> -->

    </div>
</template>

<script>
    export default {
        name: "WebsitePicker",
        computed:{
            state(){
                return this.$store.state;
            }
        },
        methods: {
            changeWebsite: function(website) {
                let isChangePending = this.$store.getters.getPendingModification;
                if(isChangePending) {
                    if (confirm("There is a change pending, are you sure you want to switch the website?")) {
                        this.$store.commit('updateCurrentWebsite', website);
                    }
                }else{
                    this.$store.commit('updateCurrentWebsite',website)
                }


            },
            addNewWebsitePressed:function(){
                this.$store.commit('setCreateWebsiteDialogVisibility',true)
            }
        }
    }
</script>


<style scoped>
    #wrapper {
        height: 56px;
        width: 100%;


    }

    .subheading {
        font-weight: bold;
        margin: 0;

    }

    p {
        margin: 0;
    }

    #arrow_drop_down {
        position: absolute;
        right: 20px;
        top: 10px;
        margin: 0;
    }

    .menu {
        width: 100%;
    }


</style>