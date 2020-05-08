<template>
  <div class="base_conference">
    <div class="conference_container">
      <div class="title_section">
        <h3 class="title">查看您在 {{this.$route.params.short_name}}  会议中被分配到的稿件</h3>
      </div>
      <el-collapse class="meeting_introduction">
        <el-collapse-item>
          <span slot="title" class="collapse-title">会议简介</span>
          <div>
            <p class="content"><label class="label">会议简称: </label>{{this.$route.params.short_name}}</p>
          </div>
          <div>
            <p class="content"><label class="label">会议全称: </label>{{this.$route.params.full_name}}</p>
          </div>
          <div>
            <p class="content"><label class="label">会议主席: </label>{{this.$route.params.chair_username}}</p>
          </div>
          <div>
            <p class="content"><label class="label">会议地点: </label>{{this.$route.params.place}}</p>
          </div>
          <div>
            <p class="content"><label class="label">会议开始时间: </label>{{this.$route.params.start_date}}</p>
          </div>
          <div>
            <p class="content"><label class="label">会议结束时间: </label>{{this.$route.params.deadline_date}}</p>
          </div>
          <div>
            <p class="content"><label class="label">会议截稿时间: </label>{{this.$route.params.release_date}}</p>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div  class="topic_section">
      <span>负责的主题：</span><el-tag v-for="item in topics" :key="item.topic" class="topic_tag">{{item.topic}}</el-tag>
      </div>
      <el-table
        :data="articles.filter(data => !search || data.article.title.toLowerCase().includes(search.toLowerCase())).slice((curPage-1)*pagesize,curPage*pagesize)"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="demo-table-expand">
              <el-form-item>
                <label>作者</label>
                <el-tag v-for="author in props.row.authors" :key="author" class="author_tag">{{ author }}</el-tag>
              </el-form-item>
              <el-form-item>
                <label>文章摘要</label><br>
                <p style="margin:0;">&emsp;&emsp;{{ props.row.articleAbstract }}</p>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
          <el-table-column
            label="文章标题"
            prop="title" :show-overflow-tooltip="true" width="400px">
            <template slot="header" slot-scope="scope">
              <div style="display: inline-flex;">
              <label class="label" style="width: 100px">文章标题</label>
              <el-input class="search_input"
                        v-model="search"
                        size="mini"
                        placeholder="输入关键字搜索"
                        style="width: 150px">
              </el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="审稿状态"
            prop="status" :show-overflow-tooltip="true">
            <template slot-scope="slot">
              <el-tag :type="getArticleStatus(slot.row.status).type">{{getArticleStatus(slot.row.status).status}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="预览"
            :show-overflow-tooltip="true">
            <template slot-scope="slot">
              <el-button type="danger" size="small" @click="viewPDF($route.params.conference_id,slot.row.title)">预览</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            :show-overflow-tooltip="true">
            <template slot-scope="slot">
              <el-button type="primary" size="small" @click="enterArticle(slot.row)">审稿</el-button>
            </template>
          </el-table-column>
      </el-table>
      <el-pagination
        :current-page.sync="curPage"
        :page-size="pagesize"
        :pager-count="7"
        :total="articles.length"
        background
        layout="total, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default{
    data(){
      return{
        topics:[],
        articles:[],
        pagesize: 10,
        curPage: 1,
        search: '',
      }
    },
    methods:{
        getArticleStatus(status){
          let _status="";
          let type="";
           switch(status){
             case 0: _status="待审稿";type="warning";break;
             case 1: _status="已审稿";type="success";break;
             default: _status="待审稿";type="warning";break;
           }
           return {status:_status,type:type};
        },
        viewPDF(conference_id,title){
          window.open(
          "http://114.116.112.8:8080/js/pdf/web/viewer.html?file="
           + encodeURIComponent("/preview/"+conference_id+"/"+title+".pdf"));
        },
        enterArticle(row){
          this.$router.push({
            name: '/CheckPapers',
            params: {
                conference_id:this.$route.params.conference_id,
                title:row.title,
                articleAbstract:row.articleAbstract,
                authors:row.authors,
            }
          }).catch(err => err);
        }
    },
    created() {
        const _this=this;
        //在页面加载时读取localStorage里的状态信息
        localStorage.getItem("messageStore") && Object.assign(this.$route.params,JSON.parse(localStorage.getItem("messageStore")));
        //在页面刷新时将vuex里的信息保存到localStorage里
        window.addEventListener("beforeunload",()=>{
          localStorage.removeItem("messageStore");
          localStorage.setItem("messageStore",JSON.stringify(this.$route.params))
        });
        this.$axios.post('/reviewArticle',{
          conference_id:this.$route.params.conference_id,
          userId:this.$store.state.id,
        })
          .then(resp => {
            if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
              console.log(resp.data.articles);
              _this.topics = resp.data.topics;
              _this.articles = resp.data.articles;
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
              message: '请求相关记录失败',
              type: 'error'
            });
          });
      }
  }
</script>

<style scoped>.demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
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
  .conference_container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 10px auto;
    width: 70%;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    clear: left;
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

  .label {
    float: left;
  }

  .topic_section{
    text-align: left;
    font-size:16px;
    padding-left:40px;
    margin-bottom: 20px;
  }

  .topic_tag,.author_tag{
    margin-left:10px;
  }
</style>
