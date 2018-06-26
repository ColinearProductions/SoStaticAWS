<template>
    <div style="width:100%; height:100%;position:absolute;background-color: rgba(243,229,245,0.45); z-index:1000"  v-bind:class="{hidden:!visible}">
        <v-container fill-height>
            <v-layout row wrap align-center>
                <v-flex class="text-xs-center">
                    <v-progress-circular :size="140" :width="15" indeterminate color="purple"></v-progress-circular>

                </v-flex>
            </v-layout>
        </v-container>

    </div>
</template>

<script>
    export default {
        name: "Loader",
        computed:{
            visible:function(){return this.$store.getters.getLoaderVisible}
        }
    }
</script>

<style scoped>
    .hidden {
        display: none
    }

</style>