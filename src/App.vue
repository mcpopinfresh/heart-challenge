<template>
  <v-app 
    dark
    style="background: teal-lighten-4"
  >
    
    <v-app-bar
      app
      src="./assets/headerImage.jpg"
      dark
      prominent
      color="black"
    >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          contain
        ></v-img>
      </template>

      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

    </v-app-bar>

      <v-navigation-drawer
        app
        v-model="drawer"
        temporary
      >
        <side-nav-list/>
      </v-navigation-drawer>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import SideNavList from "./components/SideNavList.vue"

export default {
  name: 'App',
  
  components:{
    SideNavList,
  },

  data: () => ({
    drawer: false,
  }),
};
</script>
