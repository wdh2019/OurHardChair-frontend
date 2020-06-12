<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted(){
      window.addEventListener('beforeunload',e => this.beforeunloadHandler(e));
      window.addEventListener('unload',e => this.unloadHandler(e));
  },
  destroyed() {
      window.removeEventListener('beforeunload',e => this.beforeunloadHandler(e));
      window.removeEventListener('unload',e => this.unloadHandler(e));
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
    },
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

 .base_conference {
    width: 100%;
    height:100%;
    overflow: auto;
    position: fixed;
  }

  .conference_container {
    margin: 10px auto;
    margin-bottom: 50px;
    width: 90%;
    padding: 35px 35px 15px 35px;
    overflow: auto;
    border-radius: 15px;
    background-clip: padding-box;
    background: #fff;
    background-size: cover;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    clear: left;
  }
  .conference_container .el-table {
    text-align: center;
    margin: 30px auto;
  }

  .label {
    float: left;
  }

  .search_input {
    float: right;
    width: 150px !important;
    margin-left: 10px;
    margin-right: 30px;
  }

  .el-pagination {
    width: 100%;
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand .label {
    width: 90px;
    color: #99a9bf;
    font-weight: bold;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .title {
    margin: 20px auto;
    padding-left: 20px;
    text-align: left;
    color: #494e8f;
    font-size: 24px;
    font-weight: normal;
  }

  p.description {
    text-align: left;
    padding-top: 10px;
    padding-left: 20px;
    color: #999;
    line-height: 1.4285;
    font-size: 14px;
  }

  .collapse-title {
    flex: 1 0 90%;
    order: 1;
  }

  .el-collapse-item__header {
    flex: 1 0 auto;
    order: -1;
  }

  .meeting_introduction {
    text-align: left;
    margin-left: 35px;
    margin-top: 30px;
    margin-bottom: 30px;
  }

  .meeting_introduction .content {
    font-size: 15px;
  }

  .meeting_introduction .label {
    color: #99a9bf;
    font-weight: bold;
  }
</style>
