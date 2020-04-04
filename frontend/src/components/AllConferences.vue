<template>
  <div class="base_conference">
    <div class="conference_container">
      <div class="title_section">
      <h3 class="title">所有会议</h3>
      <p class="description">在如下列表中，你可以查询到当前所有审核通过会议</p>
      </div>
      <el-table :data="allConferences.filter(data => !search || data.fullname.toLowerCase().includes(search.toLowerCase()))">
        <el-table-column prop="shortname" label="会议简称" width="150px"></el-table-column>
        <el-table-column prop="fullname" label="会议全称">
        <template slot="header" slot-scope="scope">
          <label class="label">会议全称</label>
          <el-input class="search_input"
             v-model="search"
             size="mini"
             placeholder="输入关键字搜索">
          </el-input>
        </template>
        </el-table-column>
        <el-table-column prop="place" label="举办地点"></el-table-column>
        <el-table-column prop="start_date" label="开始时间" width="180px"></el-table-column>
        <el-table-column prop="deadline_date" label="截止时间" width="180px"></el-table-column>
        <el-table-column prop="release_date" label="发布时间" width="180px"></el-table-column>
        <el-table-column prop="state" label="会议状态" width="100px"></el-table-column>
        <el-table-column prop="action" label="操作" width="250px">
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="primary"
                v-on:click="handleAction(scope.$index, scope.row, 'chair')">管理</el-button>
            <el-button
                size="mini"
                type="success"
                v-on:click="handleAction(scope.$index, scope.row, 'PC member')">审稿</el-button>
            <el-button
                size="mini"
                type="danger"
                v-on:click="handleAction(scope.$index, scope.row, 'author')">投稿</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
    export default {
      name: "AllConferences",
      data(){
        return{
          allConferences:[{
            shortname: '简称1',
            fullname: '会议全称1',
            place: '家',
            start_date: '2020/4/4 9:32',
            deadline_date: '2020/4/4 10:10',
            release_date: '2020/4/4 10:30',
            state: '已截止',
          },
          {
            shortname: '简称1',
            fullname: '会议全称1',
            place: '家',
            start_date: '2020/4/4 9:32',
            deadline_date: '2020/4/4 10:10',
            release_date: '2020/4/4 10:30',
            state: '已截止',
          },
          {
            shortname: '简称1',
            fullname: '会议全称1',
            place: '家',
            start_date: '2020/4/4 9:32',
            deadline_date: '2020/4/4 10:10',
            release_date: '2020/4/4 10:30',
            state: '已截止',
          },
          {
            shortname: '简称1',
            fullname: '会议全称1',
            place: '家',
            start_date: '2020/4/4 9:32',
            deadline_date: '2020/4/4 10:10',
            release_date: '2020/4/4 10:30',
            state: '已截止',
          },
          {
            shortname: '简称1',
            fullname: '会议全称1',
            place: '家',
            start_date: '2020/4/4 9:32',
            deadline_date: '2020/4/4 10:10',
            release_date: '2020/4/4 10:30',
            state: '已截止',
          },],
         search:'',
        }
      },
      methods:{
         handleAction(index,row,type){
           console.log(type);
           console.log(index,row);
           this.$axios.post('AllConferences',{
             fullName: row.fullname,
             id: $store.state.id,
             type: type,
           })
           .then(resp => {
             if (resp.status === 200 && resp.data.hasOwnProperty("token")){
               //不同的权限转到不同的页面，后面加会议id作为queryString
                if(type=="chair") this.$router.push('/InvitePCmember?meetingid='+resp.data.meetingid).catch(err=>err);
                if(type=="PC member") this.$router.push('/CheckPapers?meetingid='+resp.data.meetingid).catch(err=>err);
                if(type=="author") this.$router.push('/SubmitPapers?meetingid='+resp.data.meetingid).catch(err=>err)
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
      created(){
        //一开始就向后端请求所有会议
        /*this.$axios.post('/AllConferences')
        .then(resp => {
          if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
              data.allConferences=resp.data;
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
        })*/
      }
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
