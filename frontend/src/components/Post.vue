<template>
  <div class="base_conference">
    <div class="posts">


    <el-container class="wrap_container">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :current-page.sync="curPage"
        :page-size="10"
        :pager-count="7"
        :total="totalPage">
      </el-pagination>

      <el-header id="post-header">标题</el-header>

      <el-container class="content_container">
      <el-aside>用户信息</el-aside>
      <el-main>帖子内容</el-main>
      </el-container>

      <el-container class="content_container">
      <el-aside>用户信息</el-aside>
      <el-main>帖子内容</el-main>
      </el-container>

      <el-container class="content_container">
      <el-aside>用户信息</el-aside>
      <el-main>帖子内容</el-main>
      </el-container>

      <el-container class="content_container">
      <el-aside>用户信息</el-aside>
      <el-main>帖子内容</el-main>
      </el-container>

      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :current-page.sync="curPage"
        :page-size="10"
        :pager-count="7"
        :total="totalPage">
      </el-pagination>

    </el-container>
    </div>
    <div class="submit">
    <el-container class="wrap_container">
      <el-header>发表回复</el-header>
      <el-container class="content_container">
        <el-main>
          <el-input
          v-model="myComment"
          :rows="8"
          type="textarea"
          placeholder="开通超级会员发帖0倍经验"></el-input>
        </el-main>
      </el-container>
    </el-container>
    </div>
  </div>
</template>

<script>
  export default{
    data(){
      return{
        curPage:1,
        totalPage:2,
        myComment:'',
        headerTop:0,
      }
    },
    methods:{
      /* 滚动时固定标题 */
      fixHeader(){
        var scrollTop = document.querySelector(".base_conference").scrollTop;
        var postHeader = document.querySelector('#post-header');
        /* 如果不合适，请改变 scrollTop-[number] 中number的数值 */
        if(scrollTop-100>=this.headerTop){
          postHeader.classList.add("fixed");
        }
        else{
          postHeader.classList.remove("fixed");
        }
      }
    },
    mounted() {
      this.headerTop = document.querySelector('#post-header').offsetTop;
      window.addEventListener('scroll', this.fixHeader,true);
    },
    destroyed(){
      windwo.removeEventListener('scroll',this.fixHeader,true);
    }
  }
</script>

<style scoped>
    .wrap_container {
      position:relative;
      width:920px;
      margin:100px  auto;
    }
    .wrap_container .el-header{
      width:920px;
      color: #333;
      text-align: center;
      line-height: 60px;
      background-color: white;
      text-align: left;
    }
    .wrap_container .el-header.fixed{
      position: fixed;
      top:60px;
      border-top: 2px solid #E5E5E5;
      border-bottom: 1px solid #E5E5E5;
      border-right: 1px solid #E5E5E5;
    }
    .content_container{
      border-left: 1px solid #E5E5E5;
      border-right: 1px solid #E5E5E5;
      border-top:1px solid #E1E4E6;
      border-bottom:1px solid #E1E4E6;
    }
    .content_container .el-aside {
      width: 130px !important;
      background-color: rgba(250,250,253,0.8);
      color: #333;
      text-align: center;
      line-height: 200px;
    }

    .content_container .el-main {
      color: #333;
      text-align: center;
      line-height: 160px;
      padding:20px;
    }

    .el-pagination{
      width:910px;
      background-color: rgba(240,240,243,1);
      padding: 20px 0 20px 10px;
      text-align: left;
    }
</style>
