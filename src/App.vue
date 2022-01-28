<template>
  <v-app 
    dark
  >
    <v-app-bar
      app
      src="./assets/headerImage-med.jpg"
      dark
      prominent

      color="black"
    >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          class="mx-2"
          contain
        ></v-img>
      </template>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  
};
</script>
