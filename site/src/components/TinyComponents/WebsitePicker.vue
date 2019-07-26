<template>
  <div id="wrapper">
    <v-container
      class="fill-height"
      fluid
    >
      <v-row
        align="center"
        justify="center"
      >
        <v-menu

          offset-y
          style="width:100%"
          class="text-center"
        >
          <template v-slot:activator="{ on }" >

            <v-btn
                    dark
                    x-large
                    text
                    block
                    v-on="on"

            >

              <div  v-if="!loading">
                <p class="subheading text-lg-center deep-purple--text ">
                  {{currentWebsite.alias}}</p>
                <v-icon id="arrow_drop_down" color="primary">arrow_drop_down</v-icon>
                <p class="caption text-lg-center  deep-purple--text text--lighten-2">
                  {{websiteDomains}}</p>
              </div>

              <v-progress-linear v-if="loading"
                                 :indeterminate="true"
              ></v-progress-linear>
            </v-btn>


          </template>





          <v-list>
            <v-list-item
              v-for="(website,index) in websites"
              :key="index"
              @click="changeWebsite(index)"
            >
              <v-list-item-title>{{ website.alias }}</v-list-item-title>
            </v-list-item>

            <v-divider />

            <v-list-item @click="addNewWebsitePressed">
              <v-icon>add</v-icon>
              <v-list-item-title>Add new website</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-row>
    </v-container>

    <!--  <v-btn  v-for="website in websites"  :key="website">
                  {{website}}
              </v-btn> -->
  </div>
</template>

<script>
  export default {
    name: 'WebsitePicker',
    computed: {
      websites () {
        return this.$store.getters.websites
      },
      currentWebsite () {
        return this.$store.getters.currentWebsite
      },
      loading () {
        return this.$store.getters.isDataLoading
      },
      websiteDomains: function () {
        return this.currentWebsite.domains[0].name
      }
    },
    methods: {
      changeWebsite: function (websiteIndex) {
        let isChangePending = this.$store.getters.getPendingModification
        if (isChangePending) {
          if (confirm('There is a change pending, are you sure you want to switch the website?')) {
            this.$store.commit('updateCurrentWebsiteIndex', websiteIndex)
          }
        } else {
          this.$store.commit('updateCurrentWebsiteIndex', websiteIndex)
        }

        this.$router.push({
          params: {
            'website_index': websiteIndex
          }
        })
      },

      addNewWebsitePressed: function () {
        this.$store.commit('setCreateWebsiteDialogVisibility', true)
      }
    }
  }
</script>

<style scoped>
    #wrapper {
        height: 56px;
        width: 100%;

    }

    .subheading {
        font-weight: bold;
        margin: 0;

    }

    p {
        margin: 0;
    }

    #arrow_drop_down {
        position: absolute;
        right: 30px;
        top: 8px;
        margin: 0;
    }

    .menu {
        width: 100%;
    }

</style>
