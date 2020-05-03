<template>
  <div>
    <el-menu
      :unique-opened="true"
      :default-active="$route.path"
      mode="horizontal"
      class="el-menu-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#1EAEFF" router>
      <el-submenu index="0">
        <template slot="title">操作中心</template>
        <el-menu-item v-for="(child) in $router.options.routes[0].children" :index="child.path" :key="child.path"
                      v-show="$store.state.username!=='admin'" class="nav_item">{{child.name}}
        </el-menu-item>
        <el-menu-item index="/ApproveConference" v-show="$store.state.username==='admin'" class="nav_item">会议审批</el-menu-item>
      </el-submenu>

      <el-submenu v-for="(item,index) in $router.options.routes" :key="index+''" :index="index+''"
                  v-if="index<3&&index>0" v-show="$store.state.username!=='admin'">
        <template slot="title">{{item.name}}</template>
        <el-menu-item v-for="(item2) in item.children" :index="item2.path" :key="item2.path" class="nav_item">{{item2.name}}
        </el-menu-item>
      </el-submenu>

      <el-submenu index="news" style="float:right" v-show="$store.state.username!=='admin'">
          <template slot="title"><el-badge :value="newsCount" class="item" :hidden="newsCount===0">最新消息</el-badge></template>
            <div v-show="newsCount!==0">
              <p v-show="applyNewsCount!==0" class="news_type" >会议申请结果<el-badge :value="applyNewsCount" /></p>
              <p v-show="inviteNewsCount!==0" class="news_type" >PCMember邀请相关<el-badge :value="inviteNewsCount" /></p>
              <p v-show="submitNewsCount!==0" class="news_type" >投稿相关<el-badge :value="submitNewsCount" /></p>
            </div>
            <p class="news_type" v-show="newsCount===0">
              暂无新消息
            </p>
            <el-menu-item index="/NewsCenter" class="more_news nav_item">详情</el-menu-item>
      </el-submenu>

      <el-submenu index="user" style="float:right">
        <template slot="title"><i class="el-icon-user" style="color: white"></i>{{$store.state.username}}</template>
        <el-menu-item class="nav_item" index="/UserInfo">用户信息</el-menu-item>
        <el-menu-item class="nav_item" index="/" @click="quit" >注销</el-menu-item>
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
    data(){
      return{
        notReadInfo: [],
        newsCount:0,
        applyNewsCount:0,
        inviteNewsCount:0,
        submitNewsCount:0,
      }
    },
    methods: {
      quit: function (path) {
        this.$confirm('真的要注销账户吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.$message({
            showClose: true,
            type: 'success',
            message: '注销成功'
          });
          this.$store.commit('logout');
          this.$router.push("/").catch(err => err);
        }).catch(() => {
          this.$message({
            showClose: true,
            type: 'info',
            message: '已取消注销'
          });
        });
      }

    },
    created: function () {
      //一开始就向后端请求所有消息
      const _this = this;
      this.$axios.post('/mailCenter')
        .then(resp => {
          if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
            for (let i = 0; i < resp.data.messages.length; i++) {
              if (resp.data.messages[i].isRead === 1) {
                if(resp.data.messages[i].messageCategory==='ApplyConferenceResponse'){
                  this.applyNewsCount++;
                }
                if(resp.data.messages[i].messageCategory==='PCMemberInvitationRequest'||resp.data.messages[i].messageCategory==='PCMemberInvitationResponse'){
                  this.inviteNewsCount++;
                }
                if(resp.data.messages[i].messageCategory==='ManuscriptSubmissionRequest'||resp.data.messages[i].messageCategory==='ManuscriptSubmissionResponse'){
                  this.submitNewsCount++;
                }
                this.notReadInfo.push(resp.data.messages[i]);
                this.newsCount++;
              }
            }
          } else {}
        })
        .catch(error => {
          console.log(error);
          this.$message({
            showClose: true,
            message: '获取信息失败',
            type: 'error'
          });
        })
    }
  }
</script>

<style>
  .news_type{
    font-size: 14px;
    color:white;
    padding:0 10px 0 20px;
    cursor:default;
  }
  .el-menu.el-menu--popup{
    min-width:115px;
  }
  .el-menu-item.nav_item{
    margin-left:10px;
    margin-right:10px;
  }
  .el-badge__content--undefined{
    margin-left:5px;
    margin-bottom:5px;
  }
  .el-badge__content.is-fixed{
    top: 12px !important;
  }
</style>
<style scoped>
  .router {
    color: white;
    text-decoration: none;
  }
  .more_news{
    text-align: center;
  }
</style>
