<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted(){
      if(this.$store.state.token!==null) this.$router.push('/UserPage');
      window.addEventListener('beforeunload',e => this.beforeunloadHandler(e));
      window.addEventListener('unload',e => this.unloadHandler(e));
  },
  destroyed() {
      window.removeEventListener('beforeunload');
      window.removeEventListener('unload');
  },
  methods:{
    beforeunloadHandler(){
      this.beforeUnload_time=new Date().getTime();
    },
    unloadHandler(e){
      this.gap_time=new Date().getTime()-this.beforeUnload_time;
      if(this.gap_time>500){
        this.$store.commit('logout');
      }
    }
  }
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /*margin-top: 60px;*/
  }
  body{
    margin: 0px;
    padding: 0px;
  }
</style>
