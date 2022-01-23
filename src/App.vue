<template>
  <v-app 
    dark
    style="background: teal-lighten-4"
  >
    
    <v-app-bar
      app
      color="primary"
      dark
      dense
    >
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      
      <v-spacer></v-spacer>
      <span><h2>Heart Challange</h2></span>
      <v-spacer></v-spacer>

      <v-icon large color="accent">
        mdi-heart
      </v-icon>

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
    group: null,
  }),
};
</script>
