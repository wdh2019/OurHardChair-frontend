<template>
  <div class="base_conference">
    <div class="conference_container">
      <div class="title_section">
      <h3 class="title">所有会议</h3>
      <p class="description">在如下列表中，你可以查询到当前所有审核通过会议</p>
      </div>
      <el-table :data="allConferences.filter(data => !search || data.fullName.toLowerCase().includes(search.toLowerCase())).slice((curPage-1)*pagesize,curPage*pagesize)">
        <el-table-column prop="action" label="操作" width="50px" type="expand">
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="primary"
                v-on:click="handleAction(scope.$index, scope.row, 'chair')">以chair身份进入</el-button>
            <el-button
                size="mini"
                type="success"
                v-on:click="handleAction(scope.$index, scope.row, 'PC member')">以PCmember身份进入</el-button>
            <el-button
                size="mini"
                type="warning"
                v-on:click="handleAction(scope.$index, scope.row, 'author')">以author身份进入</el-button>
            <el-button
                size="mini"
                type="danger"
                v-on:click="handleAction(scope.$index, scope.row, 'none')">投稿</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="abbreviation" label="会议简称" width="150px"></el-table-column>
        <el-table-column prop="fullName" label="会议全称">
        <template slot="header" slot-scope="scope">
          <label class="label">会议全称</label>
          <el-input class="search_input"
             v-model="search"
             size="mini"
             placeholder="输入关键字搜索">
          </el-input>
        </template>
        </el-table-column>
        <el-table-column prop="holdingPlace" label="举办地点"></el-table-column>
        <el-table-column prop="holdingTime" label="开始时间" width="200px"></el-table-column>
        <el-table-column prop="submissionDeadline" label="截止时间" width="200px"></el-table-column>
        <el-table-column prop="reviewReleaseDate" label="发布时间" width="200px"></el-table-column>
        <el-table-column prop="isOpenSubmission" label="会议状态" width="120px">
          <template slot-scope="scope">
            <el-tag type="danger" v-show="scope.row.isOpenSubmission==1">未开放投稿</el-tag>
            <el-tag type="success" v-show="scope.row.isOpenSubmission!=1">已开放投稿</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          :current-page.sync="curPage"
          :page-size="pagesize"
          :pager-count="7"
          :total="allConferences.length"
          background
          layout="total, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>

<script>
    export default {
      name: "AllConferences",
      data(){
        return{
          pagesize: 10,
          curPage: 1,
          allConferences:[
            {
              abbreviation:"简称1",
              fullName:"全称1",
              holdingPlace:"翻斗乐园",
              holdingTime:"2020-4-9 23:59:59",
              submissionDeadline:"2020-4-10 23:58:58",
              reviewReleaseDate:"2020-4-11 23:57:57",
              isOpenSubmission:1,
            }
          ],
          search:'',
        }
      },
      methods:{
         handleAction(index,row,type){
           //console.log(type);
           this.$axios.post('/AllConferences',{
             fullName: row.fullName,
             id: this.$store.state.id,
             type: type,
           })
           .then(resp => {
             if (resp.status === 200 && resp.data.hasOwnProperty("token")){
               //不同的权限转到不同的页面，后面加会议名作为queryString
                if(type=="chair") this.$router.push({
                  name:'/InvitePCMember',
                  query:{
                    conference:row.fullName,
                  }
                }).catch(err=>err);
                if(type=="PC member") this.$router.push({
                  name:'/CheckPapers',
                  query:{
                    conference:row.fullName,
                  }
                }).catch(err=>err);
                if(type=="none") this.$router.push({
                  name:'/ViewSubmission',
                  query:{
                    conference:row.fullName,
                  }
                }).catch(err=>err);
                if(type=="none") this.$router.push({
                  name:'/SubmitPapers',
                  query:{
                    conference:row.fullName,
                  }
                }).catch(err=>err)
             }else {
               this.$message({
                 showClose:true,
                 message: resp.data.message,
                 type:"warning",
               });
             }
           })
           .catch(error => {
             console.log(error);
             this.$message({
               showClose: true,
               message: '审批失败',
               type:'warning',
             });
           })
         }
      },
      /*created(){
        //一开始就向后端请求所有会议
        const _this = this;
        this.$axios.post('/AllConferences')
        .then(resp => {
          if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
              _this.allConferences=resp.data.meetings;
          }else {
            this.$message({
              showClose: true,
              message: resp.data.message,
              type:'warning'
            });
          }
        })
        .catch(error => {
          console.log(error);
          this.$message({
            showClose: true,
            message: '请求所有会议失败',
            type:'warning'
          });
        })
      }*/
    }
</script>

<style scoped>
  .conference_container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 10px auto;
    width: 1600px;
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
    font-size:24px;
    font-weight: normal;
  }
  p.description{
    text-align: left;
    padding-top: 10px;
    padding-left: 20px;
    color: #999;
    line-height: 1.4285;
    font-size: 14px;
  }
  .conference_container .el-table{
    text-align: center;
    margin: 30px auto;
  }
  .label{
    float:left;
  }
  .search_input{
    float:right;
    width:150px;
    margin-right:30px;
  }
</style>
