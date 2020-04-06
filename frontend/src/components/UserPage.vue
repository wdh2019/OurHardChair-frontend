<template>
  <div>
    <el-menu
      :default-active="$route.path"
      mode="horizontal"
      class="el-menu-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#1EAEFF" router>
      <el-submenu index="0">
        <template slot="title">操作中心</template>
        <el-menu-item v-for="(child) in $router.options.routes[0].children" :index="child.path" :key="child.path" v-show="$store.state.id!=1">{{child.name}}</el-menu-item>
        <el-menu-item index="ApproveConference" v-show="$store.state.id==1">会议审批</el-menu-item>
      </el-submenu>

      <el-submenu v-for="(item,index) in $router.options.routes" :key="index+''" :index="index+''" v-if="index<3&&index>0" v-show="$store.state.id!=1">
        <template slot="title">{{item.name}}</template>
        <el-menu-item v-for="(item2) in item.children" :index="item2.path" :key="item2.path">{{item2.name}}
        </el-menu-item>
      </el-submenu>

      <el-submenu index="news" style="float:right" v-show="$store.state.id!=1">
        <template slot="title">最新消息</template>
        <el-menu-item index="NewsCenter">更多</el-menu-item>
      </el-submenu>

      <el-submenu index="user" style="float:right">
        <template slot="title"><i class="el-icon-user" style="color: white" ></i>{{$store.state.fullName}}</template>
        <el-menu-item index="UserInfo">用户信息</el-menu-item>
        <el-menu-item @click="quit" index="UserPage">注销</el-menu-item>
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
        this.$confirm('真的要注销账户吗？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.$message({
            type: 'success',
            message:'注销成功'
          });
          this.$store.commit('logout');
          this.$router.push("/").catch(err=>err);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消注销'
          });
        });
      }

    }
  }
</script>
