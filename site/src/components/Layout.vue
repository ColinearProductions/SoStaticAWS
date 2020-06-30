<template>
    <v-app>
        <v-navigation-drawer
                v-model="drawer"
                fixed
                app
        >
            <v-list dense>
                <website-picker @addWebsitePressed="createWebsiteDialogModel.visible=true"/>

                <v-list-item
                        v-for="item in items"
                        :key="item.text"
                        :to="item.to"
                        :color="(deletionPending && item.text==='Account')?'red':''"
                >
                    <v-list-item-action class="px-4">
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title class="bold">
                            {{ item.text }}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-footer
                        class="justify-center px-12 py-2 white"
                        inset
                        app
                        height="auto"
                >
                    <v-img>
                        <a href="/">
                            <l-o-g-o style="color:#6e77ee;fill:currentColor"/>
                        </a>
                    </v-img>
                </v-footer>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar
                app
                color="primary"
                dark
        >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
            <v-toolbar-title>Application</v-toolbar-title>
            <v-spacer/>
            <h5 class="subtitle-1 mb-0">
                {{ welcomeMessage }} !
            </h5>
            <v-btn outlined @click="logout" class="mx-5">
                Logout
            </v-btn>
        </v-app-bar>

        <v-content class="grey lighten-5" >
            <v-container
                    fluid
                    grid-list-xl
            >
                <v-btn
                        style="display:none"
                        @click="mockAuth"
                >
                    AUTH
                </v-btn>
                <router-view/>
            </v-container>
        </v-content>
        <create-website-dialog v-if="isCreateWebsiteDialogVisible"/>
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
                    {icon: 'settings', text: 'Settings', to: 'settings'},
                    {icon: 'person', text: 'Account', to: 'account'},

                ]

            }
        },
        computed: {
            welcomeMessage() {
                if (this.$store.getters.getUser === null)
                    return "";
                return "Welcome back, " + this.$store.getters.getUser.displayName;
            },
            isCreateWebsiteDialogVisible() {
                return this.$store.getters.getIsCreateWebsiteDialogVisible;
            },
            deletionPending() {
                return this.$store.getters.getDeletionPending;
            }

        },
        methods: {
            logout: function () {
                api.logout();
            },
            mockAuth: function () {
                axios.post('http://localhost/mock/auth', {}).then((response) => {
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