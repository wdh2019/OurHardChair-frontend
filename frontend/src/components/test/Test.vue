<template>
  <el-menu :unique-opened="true"
      :default-active="$route.path"
      mode="horizontal"
      class="el-menu-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#1EAEFF">
   <el-submenu v-for="(item,index) in $router.options.routes" :key="index+''" :index="index+''" route="http://localhost/#/"
               v-if="index<3&&index>0" v-show="$store.state.username!=='admin'">
     <template slot="title">{{item.name}}</template>
     <el-menu-item v-for="(item2) in item.children" :index="item2.path" :key="item2.path" class="nav_item">{{item2.name}}
     </el-menu-item>
   </el-submenu>
  </el-menu>
</template>

<script>
</script>

<style>
</style>
