<template>
  <div>
    <el-menu
      :default-active="$route.path"
      mode="horizontal"
      class="el-menu-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#1EAEFF" router>
      <el-submenu v-for="(item,index) in $router.options.routes" :key="index+''" :index="index+''" v-if="index<3 ">
        <template slot="title">{{item.name}}</template>
        <el-menu-item v-for="(item2) in item.children" :index="item2.path" :key="item2.path"
        >{{item2.name}}
        </el-menu-item>
      </el-submenu>

      <el-submenu index="news" style="position: relative; left: 67%;">
        <template slot="title">最新通知</template>
        <el-menu-item index="NewsCenter">
          更多
        </el-menu-item>
      </el-submenu>

      <el-submenu index="user" style="position: relative; left: 70%;">
        <template slot="title"><i class="el-icon-user" style="color: white" ></i>{{$store.state.fullName}}</template>
        <el-menu-item :index="$router.options.routes[3].children[0].path"><!-- 请注意这里的路由数组-->
          用户信息
        </el-menu-item>
        <el-menu-item @click="quit" index="3-1">
          注销
        </el-menu-item>
      </el-submenu>
    </el-menu>
    <el-main>
      <router-view></router-view>
    </el-main>
  </div>
</template>

<script>
  export default {
    name: 'UserPage',
    methods:{
      quit:function () {
        this.$store.commit('logout');
        this.$router.push("/").catch(err=>err);
      }

    }
  }
</script>
