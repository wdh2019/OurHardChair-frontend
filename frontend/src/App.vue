<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
   mounted: function () {
       //此方法刷新页面时也会执行
       window.addEventListener('beforeunload',()=>{
          this.$store.commit('logout');
       });
  },
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
