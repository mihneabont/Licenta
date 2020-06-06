import 'font-awesome/css/font-awesome.min.css'
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
 import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'fa4'
  },
  theme: {
    themes: {
      light: {
        primary: '#3B4B8D',
        success: colors["green"].darken3,
        info: '#ffaa2c',
        error: '#c62828'
      }
    }
  }
});
