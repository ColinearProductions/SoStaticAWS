
<template>
    <v-app >
        <v-navigation-drawer fixed app v-model="drawer">
            <v-list dense>
                <WebsitePicker v-on:addWebsitePressed="createWebsiteDialogModel.visible=true"></WebsitePicker>
                <template v-for="item in items">


                    <v-list-tile :key="item.text" :to="item.to" :color="(deletionPending && item.text==='Account')?'red':''">


                            <v-list-tile-action class="px-3">
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title class="bold">
                                    {{ item.text }}
                                </v-list-tile-title>
                            </v-list-tile-content>
                    </v-list-tile>
                </template>
                <v-footer class="justify-center px-5 py-2 white" inset app height="auto">
                    <v-img>
                        <a href="/">
                            <LOGO style="color:#6e77ee;fill:currentColor"></LOGO>
                        </a>
                    </v-img>
                </v-footer>
            </v-list>

        </v-navigation-drawer>
        <v-toolbar color="primary " dark app fixed>
            <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
                <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                <span class="hidden-sm-and-down">{{$route.name}}</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <h5 class="subheading mb-0"> {{welcomeMessage}}</h5>
            <v-btn outline @click="logout">
                Logout
            </v-btn>
        </v-toolbar>
        <v-content>
            <v-container fluid  grid-list-xl >
                <v-btn @click="mockAuth" style="display:none">
                    AUTH
                </v-btn>
                <router-view ></router-view>
            </v-container>
        </v-content>
        <CreateWebsiteDialog v-if="isCreateWebsiteDialogVisible"></CreateWebsiteDialog>
    </v-app>
</template>

<script>
    /* eslint-disable */
    import WebsitePicker from "./TinyComponents/WebsitePicker"
    import Forms from "./Forms"
    import CreateWebsiteDialog from "./TinyComponents/CreateWebsiteDialog";
    import * as api from '../API';
    import Messages from "./Messages";
    import Settings from "./Settings";

    import LOGO from '../../public/SVG/Logo_purple_full.svg'

    const axios = require('axios');

    export default {
        components: {
            CreateWebsiteDialog,
            LOGO,
            'WebsitePicker': WebsitePicker,
            'Forms': Forms,

        },
        data: function () {
            return {
                dialog: false,
                drawer: null,
                items: [

                    {icon: 'assignment', text: 'Forms', to: 'forms'},
                    {icon: 'insert_comment', text: 'Messages', to: 'messages'},
                    {icon: 'settings', text: 'Settings', to:'settings'},
                    {icon: 'person', text: 'Account', to:'account'},

                ]

            }
        },
        computed:{
            welcomeMessage(){
                if(this.$store.getters.getUser === null)
                    return "";
                return "Welcome back, " +  this.$store.getters.getUser.displayName ;
            },
            isCreateWebsiteDialogVisible(){
                return this.$store.getters.getIsCreateWebsiteDialogVisible;
            },
            deletionPending(){
                return this.$store.getters.getDeletionPending;
            }

        },
        methods:{
            logout: function(){
                api.logout();
            },
            mockAuth: function () {
                axios.post('http://localhost/mock/auth',{}).then((response) => {
                    alert(response.data)
                }).catch(function (error) {
                    console.log(error);
                });

            }
        }


    }
</script>

<style scoped>
    .bold {
        font-weight: bold;
    }
</style>