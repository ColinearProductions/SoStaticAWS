<template>
  <v-container
    class="text-center"
    grid-list-md
  >
    <v-row

      justify="center"
    >
      <v-col
        xl="8"
        md="10"
        cols="12"
        class="pa-2"
      >
        <v-card>
          <v-progress-linear
            :active="loading"
            :indeterminate="true"
          />

          <v-row
            v-if="!loading"

            justify="center"
          >
            <v-col
              xl="10"
              md="10"
              cols="12"
              class="pa-2"
            >
              <v-card-text class="pa-6 text-sm-left">
                <div class="text-sm-left">
                  <span class="display-1 deep-purple--text bold">{{ name }}</span><br>
                </div>

                <v-divider class=" mb-2" />
                <div class="text-sm-left mb-6">
                  <span class="subheading grey--text ">   {{ email }}</span>
                </div>

                <div class="text-sm-center">
                  <span
                    v-if="timerValue"
                    class="title"
                  >Your account will be removed {{ humanizedTimerValue }} </span>
                  <br>
                  <span
                    v-if="timerValue"
                    class="body-2 grey--text "
                  >{{ formattedTimerValue }} </span>

                  <v-progress-linear
                    v-if="timerValue"
                    :active="true"
                    :value="progressValue"
                  />

                  <v-btn
                    v-if="timerValue"
                    text
                    color="red"
                    @click="onCancelDelete"
                  >
                    Cancel Deletion
                  </v-btn>
                  <v-btn
                    v-else
                    text
                    color="red"
                    @click="onDeleteAccount"
                  >
                    Delete account
                  </v-btn>
                </div>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
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