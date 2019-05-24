<template>

    <v-layout row wrap>
        <v-flex xs12>
            <v-card>
                <v-flex>
                    <v-layout>
                        <v-flex md3 d-flex class="pl-5 pt-3 pb-0">
                            <v-select
                                    :items="listOfForms"
                                    item-text="alias"
                                    item-value="id"
                                    v-model="selectedForm"
                                    label="Form"
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
                                        label="Until"
                                        prepend-icon="event"
                                        readonly
                                ></v-text-field>
                                <v-date-picker v-model="endDatePicker.date" no-title scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn flat color="primary" @click="endDatePicker.menu = false">Cancel</v-btn>
                                    <v-btn flat color="primary" @click="$refs.endDatePicker.save(endDatePicker.date)">OK
                                    </v-btn>
                                </v-date-picker>
                            </v-menu>
                        </v-flex>
                        <v-flex md2 d-flex class="pl-5 pr-5 pt-4 pb-0">
                            <v-checkbox
                                    label="Only valid"
                                    v-model="onlyValidCheckbox"
                            ></v-checkbox>
                        </v-flex>
                        <v-flex md3 d-flex class="pl-5 pr-5 pt-3 pb-0">
                            <v-btn depressed large color="primary lighten-1" @click="onDownloadPressed" class="pr-3">
                                <v-icon dark class="pr-3">cloud_download</v-icon>
                                Download
                            </v-btn>

                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-card>

        </v-flex>


    </v-layout>


</template>

<script>
    /* eslint-disable */
    import moment from 'moment'
    import zipcelx from 'zipcelx'
    import * as api from '../API';


    export default {
        name: "Messages",
        data: function () {
            return {

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
                    {icon: true, title: 'Jason Oner', avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg'},
                    {title: 'Travis Howard', avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg'},
                    {title: 'Ali Connors', avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg'},
                    {title: 'Cindy Baker', avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg'}
                ]


            }
        }
        ,
        computed: {
            listOfForms: function () {
                console.log('*******', this.currentWebsiteIndex.forms);
                let res = [];
                res.push({'id': -1, 'alias': 'All'});

                if (this.currentWebsiteIndex.forms === undefined)
                    return res;
                let formsList = Object.values(this.currentWebsiteIndex.forms);

                for (let i = 0; i < formsList.length; i++) {
                    res.push({'id': formsList[i].key, 'alias': formsList[i].alias})
                }


                return res;

            }
            ,
            currentWebsiteIndex: function () {
                return this.$store.getters.currentWebsiteIndex;
            }
        }
        ,
        methods: {
            onDownloadPressed: function () {


                api.pullMessages(this.currentWebsiteIndex.key, this.selectedForm, this.startDatePicker.date, this.endDatePicker.date, this.onlyValidCheckbox).then(response => {
                    download(JSON.stringify(response.data, null, "\t"), 'messages.json', 'text/plain');
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