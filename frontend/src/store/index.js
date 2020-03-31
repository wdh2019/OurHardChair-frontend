import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || null,
    username: localStorage.getItem('username') || null,
	  name: localStorage.getItem('name')|| null,
    email: localStorage.getItem('email') || null,
    country: localStorage.getItem('country') || null,
    institution: localStorage.getItem('institution') || null

  },
  mutations: {
    login(state, data) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
	    localStorage.setItem('name',data.name);
      localStorage.setItem('email', data.email);
      localStorage.setItem('country', data.country);
      localStorage.setItem('institution', data.institution);
      state.username = data.username;
	    state.name = data.name;
      state.email = data.email;
      state.country = data.country;
      state.institution = data.institution;
      state.token = data.token
    },
    logout(state) {
      // 移除token
      localStorage.removeItem('token');
      localStorage.removeItem('username');
	    localStorage.removeItem('name');
      localStorage.removeItem('email');
      localStorage.removeItem('country');
      localStorage.removeItem('institution');
      state.username = null;
	  state.name = null;
      state.email = null;
      state.country = null;
      state.institution = null;
      state.token = null
    }
  },
  getters: {
    getUserDetails: state => state.userDetails,
    getUser: state => state.user
  },
  actions: {}
})
