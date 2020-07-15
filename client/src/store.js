import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import {ipServer} from "./views/ipServer";
/* eslint-disable */
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: null
  },
  getters: {
    getUser: state => {
      return state.user;
    }
  },
  mutations: {
    SET_USER_DATA(state, userData) {
      state.user = userData;
      localStorage.setItem("user", JSON.stringify(userData));
      axios.defaults.headers.common["Authorization"] = userData.token;
    },
    LOGOUT(state) {
      state.user=null;
      localStorage.removeItem("user");
      axios.defaults.headers.common["Authorization"] = "";
    }
  },
  actions: {
    register({ commit }, credentials) {
      return axios
        .post(`//${ipServer}:3000/api/user/register`, credentials)
        .then(response => {
          // eslint-disable-next-line no-console
          (response.data);
          commit("SET_USER_DATA", response.data);
        });
    },
    login({ commit }, credentials) {
      return axios
        .post(`//${ipServer}:3000/api/autentificare`, credentials)
        .then(data => {
          commit("SET_USER_DATA", data.data);
        });
    }
  }
});

export default store;
