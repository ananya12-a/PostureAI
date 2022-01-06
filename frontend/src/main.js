import Vue from 'vue'
import App from './App.vue'

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

import axios from 'axios';

Vue.use(VueMaterial)

import Vuex from 'vuex'

Vue.use(Vuex);

const account = {
  namespaced: true,
  state: () => ({
    username: "",
    isLoggedIn: false,
    token: "",
    userID:"",
  }),
  mutations: {
    login (state, {username, userID, token}) {
      state.isLoggedIn = true;
      state.username = username;
      state.token = token;
      state.userID = userID;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.username = "";
      state.token = "";
    }
  },

  actions: {
    login (context, {username, password}) {
      
    axios.post("http://localhost:3000/account/login", {
      username,
      password
    })
      .then((res) => {
        if (res.status === 200 && res.data.token && res.data.token != "" && res.data.user_id && res.data.user_id != "") {
          context.commit('login', {username, token: res.data.token, userID: res.data.user_id});
        }
      })
      .catch(() => {
        console.log("unsuccessful login")
      })
    }
  },

  getters: {
    isLoggedIn (state) {
      return state.isLoggedIn;
    },
    username (state) {
      return state.username
    }
  }
}

const store = new Vuex.Store({
  modules: {
    account,
  }
})

Vue.config.productionTip = false


new Vue({
  render: h => h(App),
  store,
}).$mount('#app')
