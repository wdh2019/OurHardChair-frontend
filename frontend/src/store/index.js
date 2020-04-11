import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || null,
	  id: localStorage.getItem('id')|| null,
    username: localStorage.getItem('username') || null,
	  fullName: localStorage.getItem('fullName')|| null,
    email: localStorage.getItem('email') || null,
    country: localStorage.getItem('country') || null,
    institution: localStorage.getItem('institution') || null

  },
  mutations: {
      login(state, data) {
      localStorage.setItem('token', data.token);
	  localStorage.setItem('id', data.id);
      localStorage.setItem('username', data.username);
	  localStorage.setItem('fullName',data.fullName);
      localStorage.setItem('email', data.email);
      localStorage.setItem('country', data.country);
      localStorage.setItem('institution', data.institution);
      state.token = data.token
	    state.id = data.id;
      state.username = data.username;
	    state.fullName = data.fullName;
      state.email = data.email;
      state.country = data.country;
      state.institution = data.institution;
    },
    logout(state) {
      // 移除token
      localStorage.removeItem('token');
	    localStorage.removeItem('id');
      localStorage.removeItem('username');
	    localStorage.removeItem('fullName');
      localStorage.removeItem('email');
      localStorage.removeItem('country');
      localStorage.removeItem('institution');
      state.username = null;
	    state.fullName = null;
      state.email = null;
      state.country = null;
      state.institution = null;
      state.token = null;;
	  state.id=null;
    }
  },
  getters: {
    getUserDetails: state => state.userDetails,
    getUser: state => state.user
  },
  actions: {}
})
