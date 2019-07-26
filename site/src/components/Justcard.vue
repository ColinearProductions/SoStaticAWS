<template>
  <v-row>
    <v-col
      cols="12"
      sm="6"
      offset-sm="3"
    >
      <v-card>
        <v-card-media
          src="/static/doc-images/cards/desert.jpg"
          height="200px"
        />
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">
              Kangaroo Valley Safari
            </h3>
            <div>Located two hours south of Sydney in the <br>Southern Highlands of New South Wales, ...</div>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn
            text
            color="orange"
          >
            Share
          </v-btn>
          <v-btn
            text
            color="orange"
          >
            Explore
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    name: 'Justcard'
  }
</script>

<style scoped>

</style>
