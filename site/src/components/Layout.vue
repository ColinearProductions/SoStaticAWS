
<template>
    <v-app >
        <v-navigation-drawer fixed app v-model="drawer">
            <v-list dense>
                <WebsitePicker v-on:addWebsitePressed="createWebsiteDialogModel.visible=true"></WebsitePicker>
                <template v-for="item in items">
                    <v-list-tile :key="item.text" :to="item.to">
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
            <v-container fluid  grid-list-xl fill-height
            >
                <v-btn @click="mockAuth">
                    AUTH
                </v-btn>
                <router-view ></router-view>
            </v-container>
        </v-content>
        <CreateWebsiteDialog></CreateWebsiteDialog>
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

    const axios = require('axios');

    export default {
        components: {
            CreateWebsiteDialog,
            'WebsitePicker': WebsitePicker,
            'Forms': Forms
        },
        data: function () {
            return {
                dialog: false,
                drawer: null,
                items: [

                    {icon: 'assignment', text: 'Forms', to: Forms},
                    {icon: 'insert_comment', text: 'Messages', to: Messages},
                    {icon: 'settings', text: 'Settings', to:Settings},
                    {icon: 'code', text: 'Documentation'},
                    {icon: 'person', text: 'Account'},
                    {icon: 'home', text: 'Home', to:"/"},

                ]

            }
        },
        computed:{
            welcomeMessage(){
                if( this.$store.state.user === null)
                    return "";
                return "Welcome back, " + this.$store.state.user.displayName ;
            }
        },
        props: {
            source: String
        },
        methods:{
            logout: function(){
                api.logout();
            },
            mockAuth: function () {
                let token = this.$store.getters.getIdToken;
                axios.post('http://localhost/mock/auth',{idToken:token}).then((response) => {
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