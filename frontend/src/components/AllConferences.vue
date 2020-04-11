<template>
  <div class="base_conference">
    <div class="conference_container">
      <div class="title_section">
        <h3 class="title">所有会议</h3>
        <p class="description">在如下列表中，你可以查询到当前所有审核通过会议</p>
      </div>
      <el-table
        :data="allConferences.filter(data => !search || data.fullName.toLowerCase().includes(search.toLowerCase())).slice((curPage-1)*pagesize,curPage*pagesize)">
        <el-table-column prop="action" label="操作" width="50px" type="expand">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              v-on:click="enterSubmitPapers(scope.row)">投稿
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="short_name" label="会议简称" width="150px" :show-overflow-tooltip="true"></el-table-column>
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
        <el-table-column prop="place" label="举办地点" width="200px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="start_date" label="开始时间" width="200px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="deadline_date" label="截止时间" width="200px"
                         :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="release_date" label="发布时间" width="200px"
                         :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="is_open_submission" label="会议状态" width="120px">
          <template slot-scope="scope" width="50px">
            <el-tag type="danger" v-show="scope.row.is_open_submission===1">未开放投稿</el-tag>
            <el-tag type="success" v-show="scope.row.is_open_submission===2">已开放投稿</el-tag>
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
      enterSubmitPapers(row) {
        console.log(row);
        if (row.is_open_submission === 1) {
          this.$message({
            showClose: true,
            message: "会议主席暂未开放投稿",
            type: 'warning'
          });
        } else {
          this.$router.push({
            name: '/SubmitPapers',
            query: {
              conference_id:row.conference_id,
              chair_name: row.chair_name,
              short_name: row.short_name,
              full_name: row.full_name,
              place: row.place,
              start_date: row.start_date,
              deadline_date: row.deadline_date,
              release_date: row.release_date,
              is_open_submission: row.is_open_submission,
            }
          }).catch(err => err);
        }
      },
      handleActionTest(row) {
        console.log(row);
        this.$router.push({
          name: '/SubmitPapers',
          query: {
            chair_name: row.chair_name,
            short_name: row.short_name,
            full_name: row.full_name,
            place: row.place,
            start_date: row.start_date,
            deadline_date: row.deadline_date,
            release_date: row.release_date,
            is_open_submission: row.is_open_submission,
          }
        }).catch(err => err);
      },
    },

    created() {
      //一开始就向后端请求所有会议
      const _this = this;
      this.$axios.post('/AllConferences')
        .then(resp => {
          console.log(resp.data.meetings);
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
          console.log(error);
          this.$message({
            showClose: true,
            message: '请求所有会议失败',
            type: 'warning'
          });
        })
    }
  }
</script>

<style scoped>
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
