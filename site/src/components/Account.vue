<template>
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap justify-center>
            <v-flex xl8 md10 xs12 class="pa-2">
                <v-card>
                    <v-progress-linear :active="loading" :indeterminate="true"></v-progress-linear>

                    <v-layout row justify-center v-if="!loading">
                        <v-flex xl10 md10 xs12 class="pa-2">


                            <v-card-text class="pa-4 text-sm-left">


                                <div class="text-sm-left">
                                    <span class="display-1 deep-purple--text bold">{{name}}</span><br>
                                </div>

                                <v-divider class=" mb-2"></v-divider>
                                <div class="text-sm-left mb-4">
                                    <span class="subheading grey--text ">   {{email}}</span>
                                </div>


                                <div class="text-sm-center">
                                    <span class="title" v-if="timerValue">Your account will be removed {{humanizedTimerValue}} </span>
                                    <br>
                                    <span class="body-2 grey--text " v-if="timerValue">{{formattedTimerValue}} </span>


                                    <v-progress-linear :active="true" :value="progressValue"
                                                       v-if="timerValue"></v-progress-linear>

                                    <v-btn flat color="red" @click="onCancelDelete" v-if="timerValue">
                                        Cancel Deletion
                                    </v-btn>
                                    <v-btn flat color="red" @click="onDeleteAccount" v-else>
                                        Delete account
                                    </v-btn>


                                </div>


                            </v-card-text>

                        </v-flex>
                    </v-layout>

                </v-card>

            </v-flex>


        </v-layout>
    </v-container>


</template>

<script>
    /* eslint-disable */
    import moment from 'moment'
    import momentDurationFormatSetup from 'moment-duration-format';

    momentDurationFormatSetup(moment);

    import * as api from '../API';

    export default {
        name: "Settings",
        data: function () {
            return {

                timerValue: null,
                timer: null
            }
        },
        methods: {
            onDeleteAccount() {
                this.$confirm(
                    `This action is irreversible and will result in the
                     permanent loss of all your data.<br> If you confirm this action, a timer for 48 hours will start until
                     you account will be deleted`, {title: 'Are you sure you want to delete your account? '}).then(res => {
                    if (res) {
                        this.$store.dispatch("beginDeletion");

                    }

                })
            },
            onCancelDelete() {
                this.$store.dispatch("cancelDeletion");

            },
            startTimer(value) {
                this.timerValue = value;
                this.timer = setInterval(() => {
                    this.timerValue -= 1;
                }, 1000);
            },
            stopTimer() {
                this.timerValue = null;
                clearInterval(this.timer);
            },
            refreshCountdown(){
                if (this.deletionPending)
                    this.startTimer(this.deletionTimeout - Math.round(new Date().getTime() / 1000));
                else
                    this.stopTimer();
            }
        },
        computed: {
            name: function () {
                return this.$store.getters.getUser.displayName
            },
            email: function () {
                return this.$store.getters.getUser.email
            },
            websites() {
                return this.$store.getters.websites;
            },
            loading() {
                return this.$store.getters.isDataLoading;
            },
            humanizedTimerValue() {
                return moment.duration(this.timerValue, 'seconds').humanize(true)
            },
            formattedTimerValue() {
                return moment.duration(this.timerValue, 'seconds').format('hh:mm:ss')
            },
            progressValue() {
                return 100 - (this.timerValue / (48 * 3600)) * 100
            },
            deletionPending() {

                return this.$store.getters.getDeletionPending;
            },
            deletionTimeout() {
                return this.$store.getters.getDeletionTimeout;
            }

        },
        watch: {
            deletionPending() {
                this.refreshCountdown();
            },
            loading(){
                this.refreshCountdown();
            }
        },
        mounted() {
            console.log("MOUNTED");
            this.$store.dispatch("updateDeletionPending");
            this.refreshCountdown();
        }


    }


</script>

<style scoped>
    .bold {
        font-weight: bold;
    }

    .hidden {
        display: none
    }


</style>