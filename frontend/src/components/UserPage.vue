<template>
  <div>
    <el-menu
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#1EAEFF" router>
      <el-submenu v-for="(item,index) in $router.options.routes" :key="index+''" :index="index+''" v-if="index<3 ">
        <template slot="title">{{item.name}}</template>
        <el-menu-item v-for="(item2,index2) in item.children" :key="index+'-'+index2" :index="item2.path"
                      class="is-active">{{item2.name}}{{item2.path==$route.path}}
        </el-menu-item>
      </el-submenu>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'UserPage',
    data() {
      return {
        activeIndex: '1',
        activeIndex2: '1'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style scoped>
  header {
    postion: relative;
    color: white;
    width: 100%;
    height: 20px;
    padding-right: 5pt;
    background-clip: padding-box;
    margin-top: 10px;
    padding: 15px 15px 15px 15px;
    background: #000088;
    border: 1px solid #eaeaea;
  }

  header div {
    display: inline-flex;
  }

  .userinfo ul {
    padding: 0;
  }

  .userinfo h3 {
    text-align: center;
  }

  .is-active{
    background-color: blue;
    border-bottom: 0 solid transparent;
    color: red;
    color: red;
    color: rgba(255,0,187,0.71);
  }

</style>
