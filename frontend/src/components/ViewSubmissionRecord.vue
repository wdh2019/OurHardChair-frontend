<template>
  <div class="base_conference">
    <div class="conference_container">
      <div class="title_section">
        <h3 class="title">查看您在 {{this.$route.params.short_name}} 会议中的投稿记录</h3>
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
          <!--需要接口的重新商榷最后后端返回chair的名字，或者此处编写方法问后端查找chair是谁-->
          <div>
            <p class="content"><label class="label">会议主席: </label>{{this.$route.params.chair_username}}</p>
          </div>
          <div>
            <p class="content"><label class="label">会议地点: </label>{{this.$route.params.place}}</p>
          </div>
          <div>
            <p class="content"><label class="label">会议主题: </label>{{handleTopics(this.$route.params.topics)}}</p>
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
      <el-table
        :data="submissionRecord"
        style="width: 100%">
        <el-table-column
          label="文章标题"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="文件名"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{scope.row.filename}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="文章摘要"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{scope.row.articleAbstract}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="文章主题"
          prop="topics"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-tag v-for="key in scope.row.topics" :key="key"
                    v-show="!($route.params.is_open_submission === 2 || $route.params.is_open_submission === 3)">
              {{key.topic}}
            </el-tag>
            <el-tag v-for="key in scope.row.topics" :key="key"
                    v-show="$route.params.is_open_submission === 2 || $route.params.is_open_submission === 3">{{key}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          prop="status"
          :show-overflow-tooltip="true">
          <template slot-scope="scope" width="50px">
            <el-tag type="danger" v-show="scope.row.status===0">未审稿</el-tag>
            <el-tag type="primary" v-show="scope.row.status===1">审稿中</el-tag>
            <el-tag type="success" v-show="scope.row.status===2">结果已发布</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-show="$route.params.is_open_submission===2"
              size="mini"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)">修改信息
            </el-button>
            <el-button
              v-show="$route.params.is_open_submission===3"
              size="mini"
              type="primary"
              disabled
              @click="handleEdit(scope.$index, scope.row)">修改信息
            </el-button>
            <el-button
              v-show="$route.params.is_open_submission===4||$route.params.is_open_submission===5"
              size="mini"
              type="primary"
              @click="viewDetails(scope.$index,scope.row)">查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>

  </div>
</template>

<script>
  export default {
    name: "ViewSubmissionRecord",
    data() {
      return {
        conference_id: this.$route.params.conference_id,
        submissionRecord: [],
        evaluations: [],
      }
    },
    methods: {
      handleTopics(topics) {
        let tempTopic = "";
        for (let i = 0; i < topics.length; i++) {
          tempTopic += topics[i] + "   "
        }
        return tempTopic;
      },
      handleEdit(index, row) {
        this.$router.push({
          name: '/ResetPapers',
          params: {
            conference_id: this.$route.params.conference_id,
            topics: this.$route.params.topics,
            checkedTopics: row.topics,
            title: row.title,
            articleAbstract: row.articleAbstract,
            writers: row.writers,
            articleID: row.articleID,
          }
        }).catch(err => err);
      },
      viewDetails(index, row) {
        console.log(row);
        this.$router.push({
          name: '/ViewResultDetails',
          params: {
            authorID: row.contributorID,
            articleID: row.articleID,
            evaluations: this.evaluations[index],
          }
        }).catch(err => err)
      }
    },

    //接口需要进一步协商
    created() {
      const _this = this;
      window.addEventListener("beforeunload", () => {
        localStorage.removeItem("messageStore");
        localStorage.setItem("messageStore", JSON.stringify(this.$route.params))
      });
      localStorage.getItem("messageStore") && Object.assign(this.$route.params, JSON.parse(localStorage.getItem("messageStore")));

      if (this.$route.params.is_open_submission === 2 || this.$route.params.is_open_submission === 3) {
        this.$axios.post('/showMySubmission', {
          conference_id: this.$route.params.conference_id,
        })
          .then(resp => {
            if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
              _this.submissionRecord = resp.data.submissions;
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
              message: '请求相关记录失败1',
              type: 'error'
            });
          });
      } else {
        this.$axios.post('/viewReviewResult', {
          conference_id: this.$route.params.conference_id,
          userId: this.$store.state.id,
        })
          .then(resp => {
            if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
              let resultResponses = resp.data.resultResponses;
              for (let i = 0; i < resultResponses.length; i++) {
                _this.submissionRecord.push(resultResponses[i].article);
                _this.evaluations.push(resultResponses[i].result.evaluations);
              }
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
              message: '请求相关记录失败2',
              type: 'error'
            });
          });
      }
    },
  }
</script>

<style scoped>
  .conference_container {
    width: 90%;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .el-tag {
    margin-right: 5px;
  }

</style>
