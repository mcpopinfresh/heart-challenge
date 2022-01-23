import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: colors.teal.darken3, 
                secondary: colors.deepPurple.lighten1, 
                accent: colors.red.lighten2, 
            },
            dark: {
                primary: colors.teal.darken3, 
                secondary: colors.blueGrey.lighten3, 
                accent: colors.red.lighten2, 
            }
        },
    },
})
