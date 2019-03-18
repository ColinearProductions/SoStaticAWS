<template>

    <v-layout row wrap>


        <v-flex xs8 offset-md2>
            <v-flex xs12 class="pa-0 pb-3">
                <v-card>
                    <v-flex>
                        <v-layout>
                            <v-flex md3 d-flex>
                                <v-select
                                        :items="listOfForms"
                                        item-text="alias"
                                        item-value="id"
                                        v-model="selectedForm"
                                        label="Form"

                                ></v-select>
                            </v-flex>
                            <v-flex md3 d-flex>
                                <v-menu
                                        ref="startDatePicker"
                                        :close-on-content-click="false"
                                        v-model="startDatePicker.menu"
                                        :nudge-right="40"
                                        :return-value.sync="startDatePicker.date"
                                        lazy
                                        transition="scale-transition"
                                        offset-y
                                        full-width
                                        min-width="290px"
                                >
                                    <v-text-field
                                            slot="activator"
                                            v-model="startDatePicker.date"
                                            label="Starting from"
                                            prepend-icon="event"
                                            readonly
                                    ></v-text-field>
                                    <v-date-picker v-model="startDatePicker.date" no-title scrollable>
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="primary" @click="startDatePicker.menu = false">Cancel</v-btn>
                                        <v-btn flat color="primary"
                                               @click="$refs.startDatePicker.save(startDatePicker.date)">OK
                                        </v-btn>
                                    </v-date-picker>
                                </v-menu>
                            </v-flex>
                            <v-flex md3 d-flex>
                                <v-menu
                                        ref="endDatePicker"
                                        :close-on-content-click="false"
                                        v-model="endDatePicker.menu"
                                        :nudge-right="40"
                                        :return-value.sync="endDatePicker.date"
                                        lazy
                                        transition="scale-transition"
                                        offset-y
                                        full-width
                                        min-width="290px"
                                >
                                    <v-text-field
                                            slot="activator"
                                            v-model="endDatePicker.date"
                                            label="Until"
                                            prepend-icon="event"
                                            readonly
                                    ></v-text-field>
                                    <v-date-picker v-model="endDatePicker.date" no-title scrollable>
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="primary" @click="endDatePicker.menu = false">Cancel</v-btn>
                                        <v-btn flat color="primary"
                                               @click="$refs.endDatePicker.save(endDatePicker.date)">OK
                                        </v-btn>
                                    </v-date-picker>
                                </v-menu>
                            </v-flex>
                            <v-flex md2 d-flex>
                                <v-checkbox
                                        label="Only valid"
                                        v-model="onlyValidCheckbox"
                                ></v-checkbox>
                            </v-flex>
                            <v-flex md3 d-flex>
                                <v-btn depressed color="primary lighten-1" @click="onDownloadPressed" class="pr-3">
                                    <v-icon dark class="pr-3">cloud_download</v-icon>
                                    Download
                                </v-btn>

                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-card>

            </v-flex>
            <v-card class="pa-3 fill-height">
                <v-layout row wrap>
                    <v-flex xs12 fill-height>
                        <p class="title pl-3">Messages </p>


                        <v-list>
                            <v-card v-for="(message,index) in messages" :key="index" flat class="my-2"  style="border:1px solid rgb(230, 230, 230)">
                                <v-list-tile @click="highlightMessage(message)"
                                             v-bind:class="{'v-list__tile--highlighted':message.highlight}">


                                    <v-list-tile-content>
                                        <v-list-tile-title v-text="message.card.title"></v-list-tile-title>
                                        <v-list-tile-sub-title>{{message.card.subtitle}}</v-list-tile-sub-title>

                                    </v-list-tile-content>
                                    <v-list-tile-action>
                                        <v-list-tile-action-text>{{message.card.time}}</v-list-tile-action-text>
                                    </v-list-tile-action>
                                    <v-icon class="grey--text">{{message.highlight?'expand_less':'expand_more'}}</v-icon>



                                </v-list-tile>

                                <v-card class="pb-3 pt-3 mb-4" flat v-if="message.highlight" >

                                    <v-flex xs12class="pa-3">
                                        <v-layout row v-for="(property,index) in message.properties" wrap class="py-1">

                                            <v-flex xs2 class="py-0">
                                                <p class="text-capitalize my-0 grey--text ">{{property}}:</p>
                                            </v-flex>
                                            <v-flex xs10 class="py-0 ">
                                                <p class="align-end  my-0  subheading">
                                                    {{message.payload[property]}}</p>
                                            </v-flex>
                                            <v-flex xs112 class="py-0" v-if="index<message.properties.length-1">
                                                <v-divider></v-divider>
                                            </v-flex>

                                        </v-layout>


                                    </v-flex>


                                </v-card>


                            </v-card>
                        </v-list>


                    </v-flex>


                </v-layout>
            </v-card>
        </v-flex>
    </v-layout>


</template>

<script>
    /* eslint-disable */
    import moment from 'moment'
    import zipcelx from 'zipcelx'
    import * as api from '../firebase_api';


    export default {
        name: "Messages",
        data: function () {
            return {
                messages: [],
                currentMessage: null,
                startDatePicker: {
                    date: moment().subtract(1, 'months').format("YYYY-MM-DD"),
                    menu: false,
                    modal: false
                },
                endDatePicker: {
                    date: moment().format("YYYY-MM-DD"),
                    menu: false,
                    modal: false
                },
                selectedForm: -1,
                onlyValidCheckbox: true,
                items: [
                    {title: 'Jason Oner', avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg'},
                    {title: 'Travis Howard', avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg'},
                    {title: 'Ali Connors', avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg'},
                    {title: 'Cindy Baker', avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg'},

                ]


            }
        }
        ,
        computed: {
            listOfForms: function () {
                console.log('*******', this.currentWebsite.forms);
                let res = [];
                res.push({'id': -1, 'alias': 'All'});

                if (this.currentWebsite.forms === undefined)
                    return res;
                let formsList = Object.values(this.currentWebsite.forms);

                for (let i = 0; i < formsList.length; i++) {
                    res.push({'id': formsList[i].key, 'alias': formsList[i].alias})
                }


                return res;

            }
            ,
            currentWebsite: function () {
                return this.$store.getters.currentWebsite;
            }
        }
        ,
        methods: {
            onDownloadPressed: function () {


                api.pullMessages(this.currentWebsite.key, this.selectedForm, this.startDatePicker.date, this.endDatePicker.date, this.onlyValidCheckbox, function (res) {
                    download(JSON.stringify(res, null, "\t"), 'messages.json', 'text/plain');
                });


            },
            highlightMessage: function (message) {

                if(message.highlight){
                    message.highlight=false;
                    return;
                }
                this.messages.forEach((message) => {
                    message.highlight = false;
                });
                message.highlight = !message.highlight;
            }
        },
        watch: {
            'currentWebsite': function () {
                let that = this;
                api.pullMessages(this.currentWebsite.key, this.selectedForm, 0, 99999999999999, this.onlyValidCheckbox, function (res) {
                    console.log(res);


                    that.messages = res.map((message) => {
                        let payload = message.payload;
                        message.highlight = false;
                        message.card = {
                            title: payload[Object.keys(payload)[0]],
                            subtitle: payload[Object.keys(payload)[1]],
                            time: moment.unix(message.timestamp / 1000).format("LL")
                        };
                        message.properties = Object.keys(message.payload);
                        return message;
                    });
                });
            }
        }
    }

    function download(content, fileName, contentType) {
        let a = document.createElement("a");
        let file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

</script>

<style scoped>

</style>