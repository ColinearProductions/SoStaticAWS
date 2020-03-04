<template>
    <v-row>
        <v-col cols="8" offset-md="2">
            <v-col cols="12" class="pa-0 pb-4">
                <v-card class="px-6">
                    <v-col class="pl-6 pr-6 pt-6">
                        <v-row>
                            <v-col class="d-flex" md="3">
                                <v-select
                                        v-model="selectedForm"
                                        :items="listOfForms"
                                        item-text="alias"
                                        item-value="id"
                                        label="Form"
                                />
                            </v-col>
                            <v-col class="d-flex" md="3">

                                <v-menu
                                        ref="startDatePicker"
                                        v-model="startDatePicker.menu"
                                        :close-on-content-click="false"
                                        :return-value.sync="startDatePicker.date"
                                        transition="scale-transition"
                                        offset-y
                                        full-width
                                        min-width="290px"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                                v-model="startDatePicker.date"
                                                label="Starting from"
                                                prepend-icon="event"
                                                readonly
                                                v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker v-model="startDatePicker.date" no-title scrollable
                                                   :min="startDatePicker.minimum"
                                                   :max="startDatePicker.maximum"
                                    >
                                        <v-spacer></v-spacer>
                                        <v-btn text color="primary" @click="startDatePicker.menu = false">Cancel</v-btn>
                                        <v-btn text color="primary"
                                               @click="$refs.startDatePicker.save(startDatePicker.date)">OK
                                        </v-btn>

                                    </v-date-picker>
                                </v-menu>

                            </v-col>


                            <v-col class="d-flex" md="3">

                                <v-menu
                                        ref="endDatePicker"
                                        v-model="endDatePicker.menu"
                                        :close-on-content-click="false"
                                        :return-value.sync="endDatePicker.date"
                                        transition="scale-transition"
                                        offset-y
                                        full-width
                                        min-width="290px"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                                v-model="endDatePicker.date"
                                                label="Starting from"
                                                prepend-icon="event"
                                                readonly
                                                v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker v-model="endDatePicker.date" no-title scrollable
                                                   :min="endDatePicker.minimum"
                                                   :max="endDatePicker.maximum"
                                    >
                                        <v-spacer></v-spacer>
                                        <v-btn text color="primary" @click="endDatePicker.menu = false">Cancel</v-btn>
                                        <v-btn text color="primary"
                                               @click="$refs.endDatePicker.save(endDatePicker.date)">OK
                                        </v-btn>

                                    </v-date-picker>
                                </v-menu>

                            </v-col>
                            <v-col md="3" class="mt-2 d-flex">


                                <v-btn
                                        color="primary lighten-1"
                                        @click="loadMessages"
                                        block
                                >
                                    <v-icon class="pr-2">
                                        cloud_download
                                    </v-icon>
                                    Filter
                                </v-btn>


                            </v-col>
                        </v-row>
                    </v-col>
                </v-card>
            </v-col>
            <v-card>
                <v-progress-linear v-if="loading || isDataLoading" :indeterminate="true"/>
                <v-row class="pa-4 px-12">
                    <v-col cols="12">
                        <v-col cols="12" class="ma-0 pa-0">
                            <div class="text-center grey--text">
                                Total {{ items_count }} messages since {{ startDatePicker.date }} until
                                {{ endDatePicker.date }}
                            </div>
                            <div class="text-center">
                                <v-pagination
                                        v-if="page_length>0"
                                        v-model="page"
                                        :length="page_length"
                                        :total-visible="7"
                                />
                            </div>
                        </v-col>
                        <v-list>
                            <v-card
                                    v-for="(message,index) in messages"
                                    :key="index"
                                    text
                                    class="my-2 mb-4"
                                    :color="message.highlight?'deep-purple lighten-1':''"
                                    :elevation="message.highlight?4:0"
                                    :class="{'mb-4':message.highlight}"
                                    style="border:1px solid rgb(230, 230, 230)"
                            >
                                <v-list-item
                                        :class="{'v-list__tile--highlighted':message.highlight}"
                                        @click="highlightMessage(message)"
                                >
                                    <v-list-item-content>
                                        <v-list-item-title
                                                :class="{'white--text':message.highlight}"
                                                v-text="message.card.title"
                                        ></v-list-item-title>
                                        <v-list-item-subtitle
                                                :class="{'white--text':message.highlight}"
                                                v-text="message.card.subtitle"
                                        ></v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-list-item-action>
                                        <v-list-item-action-text :class="{'white--text':message.highlight}">
                                            {{ message.card.time }}
                                        </v-list-item-action-text>
                                    </v-list-item-action>
                                    <v-icon :class="{'white--text':message.highlight,'grey--text':!message.highlight}">
                                        {{ message.highlight?'expand_less':'expand_more' }}
                                    </v-icon>
                                </v-list-item>
                                <v-card v-if="message.highlight" class=" pt-4 pb-2" text>
                                    <v-col cols="12" class="pa-4">
                                        <v-row v-for="(property,index) in message.properties" :key="index" class="py-1">
                                            <v-col cols="2" class="py-0">
                                                <p class="text-capitalize  mb-1 grey--text ">
                                                    {{ property }}:
                                                </p>
                                            </v-col>
                                            <v-col cols="10" class="py-0 ">
                                                <v-row v-if="email(message.payload[property],true)">
                                                    <v-col class="xs-6">
                                                        <p class="align-end  mb-1  subheading">
                                                            {{ message.payload[property] }}
                                                        </p>
                                                    </v-col>
                                                    <v-col class="text-xs-right xs-6">
                                                        <a :href="mailto(message.payload[property])"
                                                           style="text-decoration: none">
                                                            <v-btn
                                                                    class="ma-0 mb-1 align-end "
                                                                    color="primary"
                                                                    text
                                                                    small
                                                            >
                                                                <v-icon class="pr-4">reply</v-icon>
                                                                reply
                                                            </v-btn>
                                                        </a>
                                                    </v-col>
                                                </v-row>
                                                <template v-else>
                                                    <p class="align-end  mb-1  subheading">
                                                        {{ message.payload[property] }}
                                                    </p>
                                                </template>
                                            </v-col>
                                            <v-col
                                                    class="py-0 xs112"
                                            >
                                                <v-divider/>
                                            </v-col>
                                        </v-row>
                                        <v-row
                                                class="pl-4 mt-2"
                                        >
                                            <v-col
                                                    cols="12"
                                                    class="pa-0"
                                            >
                                                <p class="grey--text  ma-0">
                                                    Submitted from <a
                                                        :href="message.source_page"
                                                >{{ message.source_page }} </a>
                                                </p>
                                            </v-col>
                                            <v-col cols="12" class="pa-0">
                                                <p class="grey--text  ma-0"> Sent to:
                                                    <span v-for="(target,index) in message.sent_to" :key="index"> {{ target.alias }} at
                                                    <a href="#"> {{ target.email }}</a></span>
                                                </p>
                                            </v-col>
                                            <v-col cols="12" class="pa-0 text-right">
                                                <v-btn text class="my-0">
                                                    delete
                                                </v-btn>
                                                <v-btn text class="my-0">
                                                    resend
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-card>
                            </v-card>
                        </v-list>
                        <v-col
                                cols="12"
                                class="ma-0 pa-0"
                        >
                            <div class="text-center">
                                <v-pagination
                                        v-if="page_length>0"
                                        v-model="page"
                                        :length="page_length"
                                        :total-visible="7"
                                />
                            </div>
                        </v-col>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>

    import moment from 'moment'
    import * as api from '../API'
    import {mapGetters} from 'vuex'
    import rulesMixin from './rulesMixin'


    export default {
        mixins: [
            rulesMixin
        ],
        name: 'Messages',
        data: function () {
            return {
                messages: [],
                currentMessage: null,
                startDatePicker: {
                    date: moment().format('YYYY-MM-DD'),
                    minimum: moment().subtract(31, 'days').format('YYYY-MM-DD'),
                    maximum: moment().format('YYYY-MM-DD'),
                    menu: false,
                    modal: false
                },
                endDatePicker: {
                    date: moment().format('YYYY-MM-DD'),
                    minimum: moment().subtract(31, 'days').format('YYYY-MM-DD'),
                    maximum: moment().format('YYYY-MM-DD'),
                    menu: false,
                    modal: false
                },
                selectedForm: -1,
                onlyValidCheckbox: true,
                page: 1,
                page_length: 5,
                items_per_page: 10,
                items_count: 0,
                loading: true
            }
        },
        computed: {
            listOfForms: function () {
                let res = [];
                res.push({'id': -1, 'alias': 'All'});

                if (this.currentWebsite.forms === undefined) {
                    return res
                }
                let formsList = Object.values(this.currentWebsite.forms);

                for (let i = 0; i < formsList.length; i++) {
                    res.push({'id': formsList[i]._id, 'alias': formsList[i].alias})
                }
                return res
            },
            ...mapGetters([
                'currentWebsite','isDataLoading'
            ])

        },
        watch: {
            'currentWebsite': function () {
                this.page = 1;
                this.loadMessages()
            },
            'page': function () {
                this.loadMessages()
            },
            isDataLoading: function () {
                this.loadMessages()
            }
        },
        mounted: function () {
            if (!this.isDataLoading) {
                this.loadMessages()
            } else {
                this.loading = true
            }
        },
        methods: {
            mailto: function (email) {
                return 'mailto:' + email
            },

            highlightMessage: function (message) {
                if (message.highlight) {
                    message.highlight = false;
                    return
                }
                this.messages.forEach((message) => {
                    message.highlight = false
                });
                message.highlight = !message.highlight
            },
            loadMessages: function () {
                let that = this;
                this.loading = true;
                let startDate = moment(this.startDatePicker.date).valueOf();
                let endDate = moment(this.endDatePicker.date).add(24, 'hours').valueOf();
                api.pullMessages(this.currentWebsite._id, this.selectedForm, startDate, endDate, this.onlyValidCheckbox, this.page, this.items_per_page)
                    .then(function (response) {
                        let res = response.data;
                        that.items_count = res.count;
                        that.page_length = Math.ceil(res.count / that.items_per_page);
                        that.messages = res.messages.map((message) => {
                            let payload = message.payload;
                            message.highlight = false;
                            message.card = {
                                title: payload[Object.keys(payload)[0]],
                                subtitle: payload[Object.keys(payload)[1]],
                                time: moment.unix(message.timestamp / 1000).format('LL')
                            };
                            message.properties = Object.keys(message.payload);
                            return message
                        })
                    }).then(() => this.loading = false)
            }
        }
    }

</script>
<style scoped>
</style>
