<template>
    <div style="width:100%; height:100%;position:fixed;background-color: rgba(243,229,245,0.30); z-index:1000"  v-bind:class="{hidden:!visible}">
        <v-container fill-height>
            <v-layout row wrap align-center>
                <v-flex class="text-xs-center justify-center">

                    <v-layout align-center justify-center row fill-height>
                    <ring-loader :loading="true" :color="color" :size="size"></ring-loader>
                    </v-layout>

                </v-flex>
            </v-layout>
        </v-container>

    </div>
</template>

<script>

    import RingLoader from 'vue-spinner/src/BounceLoader.vue'


    export default {
        name: "Loader",
        components:{
            RingLoader
        },
        computed:{
            visible:function(){
                return this.$store.getters.getLoaderVisible
            },
            color:()=>"#673AB7",
            size:()=>"100px"

        }
    }
</script>

<style scoped>
    .hidden {
        display: none
    }

</style>