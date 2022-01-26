<template>
    <MglMap :accessToken="accessToken" :mapStyle="mapStyle">
    </MglMap>
</template>

<script>
import Mapbox from "mapbox-gl";
import { MglMap } from "vue-mapbox";

export default {
  components: {
    MglMap
  },
  data() {
    return {
      accessToken:
        'pk.eyJ1IjoidHlsZXJsb25nNTgiLCJhIjoiY2t5dXFtZjFvMW1wZDJuc2poYTh0cW9qdyJ9.r1o13-7Z4FapaSQ0tjFzYg',
      mapStyle: 'mapbox://styles/mapbox/dark-v10'
      
    };
  },
  created() {
    // We need to set mapbox-gl library here in order to use it in template
    this.mapbox = Mapbox;
  }
};
</script>
