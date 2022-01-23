<template>
  <v-app 
    dark
  >
    
    <v-app-bar
      app
      color="primary"
      dark
      dense
    >
     <v-icon 
        large
        color="accent"
        @click="drawer = true"
      >
        mdi-heart-settings
      </v-icon>

      <v-spacer></v-spacer>
      <span class="mr-2">Heart Chalange</span>
      <v-spacer></v-spacer>

    </v-app-bar>

      <v-navigation-drawer
        app
        v-model="drawer"
        absolute
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
