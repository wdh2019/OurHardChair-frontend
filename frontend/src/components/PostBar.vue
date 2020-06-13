<template>
  <div class="base_conference">
    <div class="outside_container">
      <div class="title_section">
      <h3 class="title">讨论区</h3>
      <p class="description">查看所有针对你审核过的文章发起的讨论</p>
      </div>
      <template>
        <div class="content">
        <span v-show="postList.length ===0 ">暂无帖子，请到作为PCMember的会议->查看待审/已审稿件->发起讨论</span>
        <el-scrollbar style="height: 100%" class="hidden_scrollbar">
            <ul class="infinite-list" v-infinite-scroll="load">
              <li v-for="(post,index) in postList" class="infinite-list-item" v-bind:key="index" >
               <el-button type="text" class="post-header" @click="enterPost(post.articleID)">针对文章"{{post.articleTitle}}"的讨论</el-button>
               <p class="words">{{post.words}}</p>
               <br>
               <div class="post-footer"><span><em class="el-icon-user-solid"></em>{{post.ownerFullName}}</span><span>回帖数：{{post.replyNumber}}</span></div>
              </li>
            </ul>
        </el-scrollbar>

        </div>
      </template>
    </div>
  </div>
</template>

<script>
  export default{
    data(){
      return{
        postList:[],
        postListLength:0,
      }
    },
    methods:{
      /* 无限滚动条-滚动行为函数 */
      load () {
        if(this.postListLength<this.postList.length){
          this.postListLength+=2;
        }

      },
      /* 进入单个帖子 */
      enterPost(articleID){
        this.$router.push({
          name:'/Post',
          params:{
            articleID:articleID,
          }
        }).catch(err => err);
      }
    },
    created() {
      /* 展示“我”作为PCMember需要参加讨论的帖子 */
      const _this = this;
      this.$axios.post('/browseAllPosts',{
        userID:this.$store.state.id,
      })
        .then(resp => {
          if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
            _this.postList = resp.data.postList;
          } else {
            this.$message({
              showClose: true,
              message: resp.data.message,
              type: 'warning'
            });
          }
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: '错误发生于请求所有帖子',
            type: 'error'
          });
        })
    }
  }
</script>

<style>
  .el-scrollbar.hidden_scrollbar .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .hidden_scrollbar .el-scrollbar__thumb {
    display: none;
  }
</style>
<style scoped>
  .outside_container{
    width:60%;
    margin:auto;
    margin-top:50px;
  }
  div.title_section{
    width:100%;
    /*background-color: lawngreen;*/
  }
  div.content{
    height:600px;
    width:100%;
    text-align: left;
  }
  ul.infinite-list{
    padding:20px;
  }
  li.infinite-list-item{
    list-style: none;
    height:fit-content;
    border: 1px solid #E5E5E5;
    padding:20px 20px 20px 50px;
  }
  .post-header{
    font-size: 1.2em;
  }
  .post-footer{
    font-size: 0.8em;
  }
  .post-footer span{
    margin-right: 3em;
  }
  p.words{
    word-wrap: normal;
    word-break: break-all;
  }
</style>
