<template>
  <div class="base_conference">
    <div class="conference_container">
      <div class="title_section">
        <h3 class="title">我审稿的会议</h3>
        <p class="description">在此查看作为审稿人参与的会议</p>
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
              <div v-show="scope.row.status==1">
                <el-form-item>
                  <label class="label">会议状态</label>
                  <span>审核未通过</span>
                </el-form-item>
              </div>
              <div v-show="scope.row.status==3">
                <el-form-item>
                  <label class="label">会议状态</label>
                  <span>审核中</span>
                </el-form-item>
              </div>
              <div v-show="scope.row.status==2&&getStatus(scope.row.start_date,scope.isOpenSubmission,scope.row.deadline_date,scope.row.release_date)==1">
                <el-form-item>
                  <label class="label">会议状态</label>
                  <span>会议尚未开始</span>
                </el-form-item>
              </div>
              <div v-show="scope.row.status==2&&getStatus(scope.row.start_date,scope.row.isOpenSubmission,scope.row.deadline_date,scope.row.release_date)==2">
                <el-form-item>
                  <label class="label">会议状态</label>
                  <span>会议进行中,投稿尚未开始</span>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary">进入会议</el-button>
                </el-form-item>
              </div>
              <div v-show="scope.row.status==2&&getStatus(scope.row.start_date,scope.row.isOpenSubmission,scope.row.deadline_date,scope.row.release_date)==3">
                <el-form-item>
                  <label class="label">会议状态</label>
                  <span>投稿开始</span>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="enterMeeting(scope.row)">进入会议</el-button>
                </el-form-item>
              </div>
              <div v-show="scope.row.status==2&&getStatus(scope.row.start_date,scope.row.isOpenSubmission,scope.row.deadline_date,scope.row.release_date)==4">
                <el-form-item>
                  <label class="label">会议状态</label>
                  <span>投稿已经结束，等待评审结果</span>
                </el-form-item>
              </div>
              <div v-show="scope.row.status==2&&getStatus(scope.row.start_date,scope.row.isOpenSubmission,scope.row.deadline_date,scope.row.release_date)==5">
                <el-form-item>
                  <label class="label">会议状态</label>
                  <span>评审结束，结果已发布</span>
                </el-form-item>
              </div>
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
            <el-tag type="danger" v-show="scope.row.status===1">未通过</el-tag>
            <el-tag type="success" v-show="scope.row.status===2">已通过</el-tag>
            <el-tag type="warning" v-show="scope.row.status===3">审核中</el-tag>
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
          shortname:'1',
          fullname:'全称',
          place:"我家",
          start_date:'2020-4-10 0:0:0',
          deadline_date:'2020-4-10 0:0:1',
          release_date:'2020-4-10 0:0:2',
          status:1,//1未通过，2已通过，3审核中
          isOpenSubmission:1, //1未开放，2已开放投稿
        },
          {
            shortname:'2',
            fullname:'全称',
            place:"我家",
            start_date:'2020-4-10 0:0:0',
            deadline_date:'2020-4-10 0:0:1',
            release_date:'2020-5-10 0:0:2',
            status:2,
            isOpenSubmission:1,
          },
          {
            shortname:'3',
            fullname:'全称',
            place:"我家",
            start_date:'2020-4-10 0:0:0',
            deadline_date:'2020-5-10 0:0:1',
            release_date:'2020-5-10 0:0:2',
            status:2,
            isOpenSubmission:1,
          }
        ],
        search: '',
      }
    },
    methods:{
      getTime(time) {
        //2015-05-06 00:00:00
        let year = parseInt(time.slice(0, 4));
        let month = parseInt(time.slice(5, 7));
        let day = parseInt(time.slice(8, 10));
        let hour = parseInt(time.slice(11, 13));
        let minute = parseInt(time.slice(14, 16));
        let second = parseInt(time.slice(17, 19));
        return {
          year: year,
          month: month,
          day: day,
          hour: hour,
          minute: minute,
          second: second
        }
      },
      //如果当前时间在参数时间之后返回true
      compareDate(date) {
        let now = new Date();
        let now_year = now.getFullYear();
        let now_month = now.getMonth() + 1;
        let now_day = now.getDate();
        let now_hour = now.getHours();
        let now_minute = now.getMinutes();
        let now_second = now.getSeconds();
        if (now_year < date.year)
          return false;
        else if (now_year > date.year)
          return true;
        else {
          if (now_month < date.month)
            return false;
          else if (now_month > date.month)
            return true;
          else {
            if (now_day < date.day)
              return false;
            else if (now_day > date.day)
              return true;
            else {
              if (now_hour < date.hour)
                return false;
              else if (now_hour > date.hour)
                return true;
              else {
                if (now_minute < date.minute)
                  return false;
                else if (now_minute > date.minute)
                  return true;
                else {
                  if (now_second < date.second)
                    return false;
                  else
                    return true;
                }
              }
            }
          }

        }

      },
      //"会议尚未开始" 1
      //"会议进行中，尚未开始投稿"  2
      //"开始投稿" 3
      //"投稿截止" 4
      //"评审结束" 5
      getStatus(startDate, isOpenSubmission,deadlineDate, releaseDate) {
        let start = this.getTime(startDate);
        let deadline = this.getTime(deadlineDate);
        let release = this.getTime(releaseDate);
        if (!this.compareDate(start)) {
          return 1
        } else if (this.compareDate(start) && isOpenSubmission==1 && !this.compareDate(deadline)) {
          return 2
        } else if(this.compareDate(start) && isOpenSubmission!=1 && !this.compareDate(deadline)){
          return 3
        }else if (this.compareDate(deadline) && !this.compareDate(release)) {
          return 4
        } else
          return 5
      },
    },
    // created() {
    //   //一开始就向后端请求已申请的会议
    //   const _this = this;
    //   this.$axios.post('/ConferenceForPCMember')
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
