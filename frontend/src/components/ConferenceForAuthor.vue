<!--<template>-->
<!--<div class="base_conference">-->
<!--<div class="conference_container">-->
<!--<div class="title_section">-->
<!--<h3 class="title">我投稿的会议</h3>-->
<!--<p class="description">在此查看已投过稿，作为author参与的会议</p>-->
<!--</div>-->
<!--&lt;!&ndash;会议单元&ndash;&gt;-->
<!--<div class="conference_cell" v-for="conference in conferences" v-bind:key="conference.index">-->
<!--<div class="title_section" v-bind:class="changeColor(conference.status)">-->
<!--<h3>{{conference.shortname}}</h3>-->
<!--</div>-->
<!--<div class="body_section">-->
<!--<p><span>会议简称：</span>{{conference.fullname}}</p>-->
<!--<p><span>举办地点：</span>{{conference.place}}</p>-->
<!--<p><span>举办日期：</span>{{conference.start_date}}</p>-->
<!--<p><span>截止日期：</span>{{conference.deadline_date}}</p>-->
<!--<p><span>发布日期：</span>{{conference.release_date}}</p>-->
<!--<el-tag v-bind:type="changeColor1(conference.status)">{{conference.status}}</el-tag>-->
<!--</div>-->
<!--</div>-->
<!--</div>-->
<!--</div>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--name: "ConferenceForAuthor",-->
<!--data(){-->
<!--return{-->
<!--conferences:[],-->
<!--}-->
<!--},-->
<!--methods:{-->
<!--//为标题背景换色-->
<!--changeColor:function(status){-->
<!--return{-->
<!--success:status=="已通过",-->
<!--primary:status=="审核中",-->
<!--danger:status=="未通过",-->
<!--}-->
<!--},-->
<!--//为状态tag换色-->
<!--changeColor1:function(status){-->
<!--if(status=="已通过") return 'success';-->
<!--if(status=="审核中") return 'primary';-->
<!--if(status=="未通过") return 'danger';-->
<!--}-->
<!--},-->
<!--created(){-->
<!--//一开始就向后端请求已申请的会议-->
<!--const _this = this;-->
<!--this.$axios.post('/ConferenceForAuthor')-->
<!--.then(resp => {-->
<!--if (resp.status === 200 && resp.data.hasOwnProperty("token")) {-->
<!--_this.conferences = resp.data.meetings;-->
<!--}else {-->
<!--this.$message({-->
<!--showClose: true,-->
<!--message: resp.data.message,-->
<!--type:'warning'-->
<!--});-->
<!--}-->
<!--})-->
<!--.catch(error => {-->
<!--console.log(error);-->
<!--this.$message({-->
<!--showClose: true,-->
<!--message: '请求我投稿的会议失败',-->
<!--type:'warning'-->
<!--});-->
<!--})-->
<!--}-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--.conference_container {-->
<!--border-radius: 15px;-->
<!--background-clip: padding-box;-->
<!--margin: 10px auto;-->
<!--width: 1500px;-->
<!--padding: 35px 35px 15px 35px;-->
<!--background: #fff;-->
<!--border: 1px solid #eaeaea;-->
<!--box-shadow: 0 0 25px #cac6c6;-->
<!--clear: left;-->
<!--}-->
<!--.title {-->
<!--margin: 20px auto;-->
<!--padding-left: 20px;-->
<!--text-align: left;-->
<!--color: #494e8f;-->
<!--font-size:24px;-->
<!--font-weight: normal;-->
<!--}-->
<!--p.description{-->
<!--text-align: left;-->
<!--padding-top: 10px;-->
<!--padding-left: 20px;-->
<!--color: #999;-->
<!--line-height: 1.4285;-->
<!--font-size: 14px;-->
<!--}-->
<!--.conference_cell{-->
<!--display:inline-block;-->
<!--margin:30px 20px 30px 20px;-->
<!--width:25%;-->
<!--text-align: left;-->
<!--border: 1px solid #eaeaea;-->
<!--box-shadow: 0 0 25px #cac6c6;-->
<!--}-->
<!--.conference_cell .title_section.success{-->
<!--background-color: #67C23A;-->
<!--}-->
<!--.conference_cell .title_section.primary{-->
<!--background-color: #409EFF;-->
<!--}-->
<!--.conference_cell .title_section.danger{-->
<!--background-color: #F56C6C;-->
<!--color: white;-->
<!--}-->
<!--.conference_cell .title_section h3{-->
<!--margin:0;-->
<!--padding:15px 0 15px 20px;-->
<!--}-->
<!--.conference_cell .body_section{-->
<!--padding:10px 10px 10px 15px-->
<!--}-->
<!--.conference_cell .body_section p span{-->
<!--font-family:Avenir, Helvetica, Arial, sans-serif;-->
<!--font-size:1em;-->
<!--font-weight: bold;-->
<!--}-->
<!--</style>-->
<template>
  <div class="base_conference">
    <div class="conference_container">
      <div class="title_section">
        <h3 class="title">我投稿的会议</h3>
        <p class="description">在此查看已投稿的相关会议</p>
      </div>
      <el-table
        :data="conferences.filter(data => !search || data.fullname.toLowerCase().includes(search.toLowerCase())).slice((curPage-1)*pagesize,curPage*pagesize)">
        <el-table-column prop="action" label="操作" width="50px" type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item class="el-form-item">
                <label class="label">会议简称</label>
                <span>{{ scope.row.shortname }}</span>
              </el-form-item>
              <el-form-item class="el-form-item">
                <label class="label">开始时间</label>
                <span>{{ scope.row.start_date }}</span>
              </el-form-item>
              <el-form-item class="el-form-item">
                <label class="label">会议全称</label>
                <span>{{ scope.row.fullname }}</span>
              </el-form-item>
              <el-form-item class="el-form-item">
                <label class="label">结束时间</label>
                <span>{{scope.row.deadline_date }}</span>
              </el-form-item>
              <el-form-item class="el-form-item">
                <label class="label">举办地点</label>
                <span>{{ scope.row.place }}</span>
              </el-form-item>

              <el-form-item class="el-form-item">
                <label class="label">发布时间</label>
                <span>{{ scope.row.release_date }}</span>
              </el-form-item>
              <el-form-item>
                <label class="label">会议状态</label>
                <span>{{getStatus()}}</span>
              </el-form-item>
            </el-form>
            <div>

            </div>
          </template>
        </el-table-column>
        <el-table-column prop="shortname" label="会议简称" width="150px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="fullname" label="会议全称" width="300px" :show-overflow-tooltip="true">
          <template slot="header" slot-scope="scope">
            <label class="label">会议全称</label>
            <el-input class="search_input"
                      v-model="search"
                      size="mini"
                      placeholder="输入关键字搜索">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="place" label="举办地点" width="200px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="start_date" label="开始时间" width="200px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="deadline_date" label="截止时间" width="200px"
                         :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="release_date" label="发布时间" width="200px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="status" label="会议状态" width="120px">
          <template slot-scope="scope">
            <el-tag type="danger" v-show="scope.row.status==='未通过'">{{scope.row.status}}</el-tag>
            <el-tag type="success" v-show="scope.row.status==='已通过'">{{scope.row.status}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page.sync="curPage"
        :page-size="pagesize"
        :pager-count="7"
        :total="conferences.length"
        background
        layout="total, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ConferenceForChair",
    data() {
      return {
        pagesize: 10,
        curPage: 1,
        conferences: [{
          shortname: "FDSM",
          fullname:"FDSM",
          place:"ShangHai",
          start_date:"2020-04-15 00:00:00",
          deadline_date:"2020-04-23 00:00:16",
          release_date:"2020-04-30 00:00:00",
        }
        ],
        search: '',
      }
    },
    methods: {
      getStatus() {
        return "会议进行中";
      }
    },
    // created() {
    //   //一开始就向后端请求已申请的会议
    //   const _this = this;
    //   this.$axios.post('/ConferenceForAuthor')
    //     .then(resp => {
    //       if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
    //         _this.conferences = resp.data.meetings;
    //       } else {
    //         this.$message({
    //           showClose: true,
    //           message: resp.data.message,
    //           type: 'warning'
    //         });
    //       }
    //     })
    //     .catch(error => {
    //       console.log(error);
    //       this.$message({
    //         showClose: true,
    //         message: '请求相关会议失败',
    //         type: 'warning'
    //       });
    //     })
    // }
  }
</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand .label {
    width: 90px;
    color: #99a9bf;
    font-weight: bold;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .base_conference {
    width: 100%;
  }

  .conference_container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 10px auto;
    width: 100%;
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

  .conference_container .el-table {
    text-align: center;
    margin: 30px auto;
  }

  .label {
    float: left;
  }

  .search_input {
    float: right;
    width: 150px;
    margin-right: 30px;
  }
</style>
