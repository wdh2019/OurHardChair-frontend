<template>
  <div class="base_conference">
    <div class="conference_container">
      <div class="title_section">
        <h3 class="title">所有会议</h3>
        <p class="description">在如下列表中，你可以查询到当前所有审核通过的会议，并向会议投稿</p>
      </div>
      <el-table
        :data="allConferences.filter(data => !search || data.full_name.toLowerCase().includes(search.toLowerCase())).slice((curPage-1)*pagesize,curPage*pagesize)">
        <el-table-column prop="action" label="操作" width="50px" type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item class="el-form-item">
                <label class="label">会议简称</label>

                <span>{{ scope.row.short_name }}</span>
              </el-form-item>
              <el-form-item class="el-form-item">
                <label class="label">开始时间</label>
                <span>{{ scope.row.start_date }}</span>
              </el-form-item>
              <el-form-item class="el-form-item">
                <label class="label">会议全称</label>
                <span>{{ scope.row.full_name }}</span>
              </el-form-item>
              <el-form-item class="el-form-item">
                <label class="label">截稿时间</label>
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
              <!--显示在此的所有会议都是审核通过的，所以不用判断status-->
              <el-form-item v-show="scope.row.is_open_submission===1" class="el-form-item">
                <label class="label">会议状态</label>
                <span>审核通过，投稿尚未开始</span>
              </el-form-item>
              <el-form-item v-show="scope.row.is_open_submission===2" class="el-form-item">
                <label class="label">会议状态</label>
                <span>开始投稿</span>
              </el-form-item>
              <el-form-item v-show="scope.row.is_open_submission===3" class="el-form-item">
                <label class="label">会议状态</label>
                <span>投稿截止，开始评审</span>
              </el-form-item>
              <el-form-item v-show="scope.row.is_open_submission===4" class="el-form-item">
                <label class="label">会议状态</label>
                <span>评审结果发布</span>
                <el-button type="primary" class="button_view" @click="enterViewAcceptedArticles(scope.row)">
                  查看录用文章
                </el-button>
              </el-form-item>
              <el-form-item v-show="scope.row.is_open_submission===5">
                <label class="label">会议状态</label>
                <span>会议开始</span>
                <el-button type="primary" class="button_view" @click="enterViewAcceptedArticles(scope.row)">查看录用文章
                </el-button>
              </el-form-item>
              <el-form-item class="el-form-item" v-show="scope.row.is_open_submission===2">
                <label class="label">操作</label>
                <el-button
                  size="mini"
                  type="danger"
                  v-if="$store.state.username!==scope.row.chair_username"
                  v-on:click="enterSubmitPapers(scope.row)">投稿
                </el-button>
                <el-tag type="warning" v-else>您是此会议的chair</el-tag>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="short_name" label="会议简称" width="200px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="full_name" label="会议全称" width="300px" :show-overflow-tooltip="true">
          <template slot="header" slot-scope="scope">
            <label class="label">会议全称</label>
            <el-input class="search_input"
                      v-model="search"
                      size="mini"
                      placeholder="输入关键字搜索">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="place" label="举办地点" min-width="300px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="deadline_date" label="截稿时间" width="200px"
                         :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="release_date" label="发布时间" width="200px"
                         :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="start_date" label="举办时间" width="200px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="is_open_submission" label="会议状态" width="200px" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-tag type="warning" v-show="scope.row.is_open_submission===1">未开放投稿</el-tag>
            <el-tag type="success" v-show="scope.row.is_open_submission===2">已开放投稿</el-tag>
            <el-tag type="info" v-show="scope.row.is_open_submission===3">投稿截止，等待评审结果</el-tag>
            <el-tag type="primary" v-show="scope.row.is_open_submission===4">评审结果发布</el-tag>
            <el-tag type="danger" v-show="scope.row.is_open_submission===5">会议开始</el-tag>
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
    data() {


      return {
        pagesize: 10,
        curPage: 1,
        allConferences: [],
        search: '',
      }
    },
    methods: {
      enterViewAcceptedArticles(row) {
        this.$router.push({
          name: "/ViewAcceptedArticles",
          params: {
            conference_id: row.conference_id,
          }
        }).catch(err=>err)
      },
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
                  return (now_second >= date.second);
                }
              }
            }
          }

        }

      },
      //"审核通过，但尚未开启投稿"  1
      //"开始投稿" 2
      //"截稿，开始评审" 3
      //"评审结果发布" 4
      // "会议开始" 5

      enterSubmitPapers(row) {
        if (row.is_open_submission === 1) {
          this.$message({
            showClose: true,
            message: "会议主席暂未开放投稿",
            type: 'warning'
          });
        } else {
          this.$router.push({
            name: '/SubmitPapers',
            params: {
              conference_id: row.conference_id,
              full_name: row.full_name,
              short_name: row.short_name,
              place: row.place,
              start_date: row.start_date,
              deadline_date: row.deadline_date,
              release_date: row.release_date,
              status: row.status,
              chair_username: row.chair_username,
              is_open_submission: row.is_open_submission,
              topics: row.topics,
            },
          }).catch(err => err);
        }
      },
    },


    created() {
      //一开始就向后端请求所有会议
      const _this = this;
      this.$axios.post('/AllConferences')
        .then(resp => {
          if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
            _this.allConferences = resp.data.meetings;
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
            message: '请求所有会议失败',
            type: 'error'
          });
        })
    }
  }
</script>

<style>
  .button_view {
    margin-left: 10%;
  }
</style>
