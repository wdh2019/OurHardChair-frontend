<template>
  <div class="base_conference">
    <div class="outside_container">
      <div class="title_section">
      <h3 class="title">贴吧</h3>
      <p class="description">查看所有针对你审核过的文章发起的讨论</p>
      </div>
      <template>
        <div class="content">
        <el-scrollbar style="height: 100%" class="hidden_scrollbar">
            <ul class="infinite-list" v-infinite-scroll="load">
             <!-- <li v-for="(post,index) in postList" class="infinite-list-item" v-bind:key="index" >
               <a>针对文章{{post.articleID}}的讨论</a>
               <p>{{post.words}}</p>
               <span><i class="el-icon-user-solid"></i>{{post.ownerID}}</span><span>回帖数：{{post.replyNumber}}</span>
              </li> -->
              <li v-for="i in totalPage" class="infinite-list-item" v-bind:key="i">
                {{i}}
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
        curPage:0,
        totalPage:10,
        postList:[]
      }
    },
    methods:{
      /* 无限滚动条-滚动行为函数 */
      load () {
        if(this.totalPage<50)
        this.totalPage+=2;
      }
    },
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
  }
  ul.infinite-list{
    padding:20px;
  }
  li.infinite-list-item{
    list-style: none;
    height:fit-content;
    border: 1px solid #E5E5E5;
    padding:20px;
  }

</style>
