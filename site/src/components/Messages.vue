<template>

    <v-layout row wrap>


        <v-flex xs8 offset-md2>
            <v-flex xs12 class="pa-0 pb-3">
                <v-card>
                    <v-flex class="pl-4 pr-4 pt-4">
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
                                    <v-date-picker v-model="startDatePicker.date" no-title scrollable :min="startDatePicker.minimum" :max="startDatePicker.maximum">
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
                                    <v-date-picker v-model="endDatePicker.date" no-title scrollable  :min="endDatePicker.minimum" :max="endDatePicker.maximum">
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="primary" @click="endDatePicker.menu = false">Cancel</v-btn>
                                        <v-btn flat color="primary"
                                               @click="$refs.endDatePicker.save(endDatePicker.date)">OK
                                        </v-btn>
                                    </v-date-picker>
                                </v-menu>
                            </v-flex>

                            <v-flex md5 d-flex class="mt-2">
                                <v-btn  dark color="primary lighten-1" @click="loadMessages">
                                    <v-icon dark class="pr-2">cloud_download</v-icon>
                                    Filter
                                </v-btn>

                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-card>

            </v-flex>
            <v-card class="pa-3 ">
                <v-layout row wrap>
                    <v-flex xs12 >
                        <v-flex xs12 class="ma-0 pa-0">
                            <div class="text-xs-center grey--text">
                                Total {{items_count}} messages since {{startDatePicker.date}} until {{endDatePicker.date}}
                            </div>
                            <div class="text-xs-center">
                                <v-pagination v-if="page_length>0"
                                        v-model="page"
                                        :length="page_length"
                                        :total-visible="7"
                                ></v-pagination>
                            </div>

                        </v-flex>

                        <v-list>
                            <v-card v-for="(message,index) in messages" :key="index" flat class="my-2"  style="border:1px solid rgb(230, 230, 230)">
                                <v-list-tile @click="highlightMessage(message)"
                                             v-bind:class="{'v-list__tile--highlighted':message.highlight}">


                                    <v-list-tile-content >
                                        <v-list-tile-title v-text="message.card.title"></v-list-tile-title>
                                        <v-list-tile-sub-title>{{message.card.subtitle}}</v-list-tile-sub-title>

                                    </v-list-tile-content>
                                    <v-list-tile-action>
                                        <v-list-tile-action-text>{{message.card.time}}</v-list-tile-action-text>
                                    </v-list-tile-action>
                                    <v-icon class="grey--text">{{message.highlight?'expand_less':'expand_more'}}</v-icon>



                                </v-list-tile>

                                <v-card class=" pt-3 pb-2" flat v-if="message.highlight" >

                                    <v-flex xs12 class="pa-3">
                                        <v-layout row v-for="(property,index) in message.properties" :key="index" wrap class="py-1">

                                            <v-flex xs2 class="py-0">
                                                <p class="text-capitalize  mb-1 grey--text ">{{property}}:</p>
                                            </v-flex>
                                            <v-flex xs10 class="py-0 ">
                                                <v-layout v-if="isEmail(message.payload[property])">
                                                    <v-flex xs-6>
                                                        <p class="align-end  mb-1  subheading">
                                                            {{message.payload[property]}}

                                                        </p>
                                                    </v-flex>
                                                    <v-flex xs-6 class="text-xs-right">
                                                        <a :href="mailto(message.payload[property])" style="text-decoration: none" >
                                                            <v-btn class="ma-0 mb-1 align-end " color="primary" flat small>
                                                                <v-icon dark class="pr-3">reply</v-icon>
                                                                reply
                                                            </v-btn>
                                                        </a>
                                                    </v-flex>



                                                </v-layout>
                                                <template v-else>
                                                    <p class="align-end  mb-1  subheading">
                                                        {{message.payload[property]}}

                                                    </p>
                                                </template>


                                            </v-flex>

                                            <v-flex xs112 class="py-0" >
                                                <v-divider></v-divider>
                                            </v-flex>

                                        </v-layout>

                                        <v-layout class="pl-3 mt-2" wrap>
                                            <v-flex xs12 class="pa-0">

                                                <p class="grey--text  ma-0"> Submitted from <a  :href="message.source_page">{{message.source_page}} </a></p>


                                            </v-flex>
                                            <v-flex xs12 class="pa-0">
                                                <p class="grey--text  ma-0">Sent to: <span v-for="(target,index) in message.sent_to" :key="index" > {{target.alias}} at <a href="#"> {{target.email}}</a></span> </p>

                                            </v-flex>
                                            <v-flex xs12 class="pa-0 text-xs-right">

                                                 <v-btn flat class="my-0">delete</v-btn>
                                                 <v-btn flat class="my-0">resend</v-btn>
                                            </v-flex>

                                        </v-layout>


                                    </v-flex>


                                </v-card>


                            </v-card>
                        </v-list>
                        <v-flex xs12 class="ma-0 pa-0" >
                            <div class="text-xs-center">
                                <v-pagination v-if="page_length>0"
                                        v-model="page"
                                        :length="page_length"
                                        :total-visible="7"
                                ></v-pagination>
                            </div>

                        </v-flex>


                    </v-flex>


                </v-layout>
            </v-card>
        </v-flex>
    </v-layout>


</template>

<script>
    /* eslint-disable */
    import moment from 'moment'
    import * as api from '../API';


    export default {
        name: "Messages",

        data: function () {
            return {
                messages: [],
                currentMessage: null,
                startDatePicker: {
                    date: moment().format("YYYY-MM-DD"),
                    minimum:moment().subtract(31, 'days').format("YYYY-MM-DD"),
                    maximum:moment().format("YYYY-MM-DD"),
                    menu: false,
                    modal: false
                },
                endDatePicker: {
                    date: moment().format("YYYY-MM-DD"),
                    minimum:moment().subtract(31, 'days').format("YYYY-MM-DD"),
                    maximum:moment().format("YYYY-MM-DD"),
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

                ],
                page:1,
                page_length:5,
                items_per_page:10,
                items_count:0,



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
        //todo add hook into firebase messages, and show new messages in real-time
        ,
        methods: {
            mailto:function(email){
                return 'mailto:'+email;
            },
            isEmail: function(payload){
                let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(payload.toLowerCase())
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
            },
            loadMessages:function () {
                let that = this;
                this.$store.commit('setLoaderVisibility', true);

                let startDate = moment(this.startDatePicker.date).valueOf();
                let endDate = moment(this.endDatePicker.date).add(24,'hours').valueOf();



                api.pullMessages(this.currentWebsite.key, this.selectedForm, startDate, endDate, this.onlyValidCheckbox,this.page,this.items_per_page, function (res) {
                    console.log(res);

                    that.items_count = res.count;
                    that.page_length=Math.ceil(res.count/that.items_per_page);

                    that.messages = res.messages.map((message) => {
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
                    that.$store.commit('setLoaderVisibility', false);

                });
            }
        },
        mounted:function(){
            //if website has loaded
            this.loadMessages();
        },
        watch: {
            'currentWebsite': function () {
                this.page =1;
                this.loadMessages();
            },
            'page':function(){
                this.loadMessages();

            }
        }
    }



</script>

<style scoped>

</style>