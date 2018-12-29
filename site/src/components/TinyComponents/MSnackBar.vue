<template>
    <v-snackbar
            :timeout="timeout"
            :top="y === 'top'"
            :bottom="y === 'bottom'"
            :right="x === 'right'"
            :left="x === 'left'"
            :multi-line="mode === 'multi-line'"
            :vertical="mode === 'vertical'"
            v-model="snackbar"
            class="primary-font"
    >
        {{ text }}
        <v-btn flat color="deep-purple lighten-3" @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
</template>

<script>
    export default {
        name: "MSnackBar",
        data() {
            return {
                snackbar: false,
                y: 'top',
                x: null,
                mode: '',
                timeout: 2000,
                text: 'Hello, I\'m a snackbar'
            }
        },
        watch: {
            'snackbarVisible': function () {
                this.snackbar = this.snackbarVisible;
                this.text = this.snackbarText;
            },
            'snackbar': function () { //snackbar set false by timeout

                if(!this.snackbar)
                    this.$store.commit('hideSnackbar');
            }
        },
        computed: {
            snackbarVisible() {
                return this.$store.getters.getSnackbarVisible;
            },
            snackbarText(){
                return this.$store.getters.getSnackbarText;

            }
        }
    }
</script>

<style scoped>
    .primary-font {
        font-family: Roboto, sans-serif;
    }
</style>