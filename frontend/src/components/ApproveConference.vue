<template>
  <div class="base_conference">
    <div class="conference_container">
      <div class="title_section">
        <h3 class="title">审批会议</h3>
        <p class="description">作为管理员，在此审批用户提出的会议申请</p>
      </div>
      <el-table :data="conferencesForApproval">
        <el-table-column prop="abbreviation" label="会议简称"></el-table-column>
        <el-table-column prop="fullName" label="会议全称"></el-table-column>
        <el-table-column prop="holdingPlace" label="举办地点"></el-table-column>
        <el-table-column prop="holdingTime" label="开始时间"></el-table-column>
        <el-table-column prop="submissionDeadline" label="截止时间"></el-table-column>
        <el-table-column prop="reviewReleaseDate" label="发布时间"></el-table-column>
        <el-table-column prop="action" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              v-on:click="handleApprove(scope.$index, scope.row)">通过
            </el-button>
            <el-button
              size="mini"
              type="danger"
              v-on:click="handleDisapprove(scope.$index, scope.row)">不通过
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        conferencesForApproval: [],
      }
    },
    methods: {
      //审批通过
      // handleTest(index){
      //   var arr = ['a'];
      //   arr.splice(0,1);
      //   console.log(arr);
      //   console.log(this.conferencesForApproval);
      //   console.log(index);
      //   console.log(this.conferencesForApproval);
      // },

      handleApprove(index, row) {
        const _this = this;
        this.$axios.post('/ApproveConference', {
          fullName: row.fullName,
        })
          .then(resp => {
            console.log(resp);
            if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
              _this.conferencesForApproval.splice(index, 1);
              this.$message({
                showClose: true,
                message: '处理成功',
                type: "success"
              });

            } else {
              this.$message({
                showClose: true,
                message: resp.data.message,
                type: "warning",
              });
            }
          })
          .catch(error => {
            console.log(error);
            this.$message({
              showClose: true,
              message: '处理失败',
              type: 'warning',
            });
          })
      },
      handleDisapprove(index, row) {
        const _this = this;
        this.$axios.post('/DisapproveConference', {
          fullName: row.fullName,
        })
          .then(resp => {
            console.log(resp);
            if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
              _this.conferencesForApproval.splice(index, 1);
              this.$message({
                showClose: true,
                message: '处理成功',
                type: "success"
              });

            } else {
              this.$message({
                showClose: true,
                message: resp.data.message,
                type: "warning",
              });
            }
          })
          .catch(error => {
            console.log(error);
            this.$message({
              showClose: true,
              message: '处理失败',
              type: 'warning',
            });
          })
      },
    },
    created() {
      const _this = this;
      //一开始就向后端请求已申请的会议
      this.$axios.post('/ReviewConference')
        .then(resp => {
          if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
            _this.conferencesForApproval = resp.data.meetings;
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
            message: '请求已申请会议失败',
            type: 'warning'
          });
        })
    }
  }

</script>

<style scoped>
  .conference_container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 10px auto;
    width: 1500px;
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
</style>
