<template>

    <v-flex xs12>
        <v-card >
            <v-layout align-content-center>

                <v-flex md3 d-flex class="pl-5 pt-3 pb-0">
                    <v-select
                            :items="items"
                            label="Standard"
                            outline
                    ></v-select>
                </v-flex>


                <v-flex md3 d-flex class="pl-5 pt-3 pb-0">
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
                                label="Picker in menu"
                                prepend-icon="event"
                                readonly
                        ></v-text-field>
                        <v-date-picker v-model="startDatePicker.date" no-title scrollable>
                            <v-spacer></v-spacer>
                            <v-btn flat color="primary" @click="startDatePicker.menu = false">Cancel</v-btn>
                            <v-btn flat color="primary" @click="$refs.startDatePicker.save(startDatePicker.date)">OK</v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-flex>


                <v-flex md3 d-flex class="pl-5 pt-3 pb-0">
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
                                label="Picker in menu"
                                prepend-icon="event"
                                readonly
                        ></v-text-field>
                        <v-date-picker v-model="endDatePicker.date" no-title scrollable>
                            <v-spacer></v-spacer>
                            <v-btn flat color="primary" @click="endDatePicker.menu = false">Cancel</v-btn>
                            <v-btn flat color="primary" @click="$refs.endDatePicker.save(endDatePicker.date)">OK</v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-flex>



                <v-flex md3 d-flex class="pl-5 pr-5 pt-3 pb-0" >
                    <v-btn depressed large color="primary lighten-1" class="pr-3">
                        <v-icon dark class="pr-3">filter_list</v-icon>
                        Filter
                        </v-btn>

                </v-flex>

            </v-layout>

        </v-card>
    </v-flex>
</template>

<script>
    /* eslint-disable */

    export default {
        name: "Messages",
        data: function () {
            return {
                items: ['1', '2', '3'],
                startDatePicker:{
                    date: null,
                    menu: false,
                    modal: false
                },
                endDatePicker:{
                    date: null,
                    menu: false,
                    modal: false
                }


            }
        }
    }
</script>

<style scoped>

</style>