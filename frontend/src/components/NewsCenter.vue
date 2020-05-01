<template>
  <el-container style="height: 500px; border: 1px solid #eee;">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-active="show+''" style="top:60px">
        <el-menu-item index="1" @click="not_read">
          <i class="el-icon-setting"></i>
          <span slot="title">未读消息</span>
        </el-menu-item>
        <el-menu-item index="2" @click="has_read">
          <i class="el-icon-setting"></i>
          <span slot="title">已读消息</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <!--未读页面-->
    <el-container style="height: 480px">
      <el-header style="font-size: 20px;font-weight: bold;">
        消息中心
      </el-header>
      <el-main v-show="(show===1)">
        <el-table
          :data="notReadInfo"
          style="width: 100%">
          <el-table-column
            label="发送者"
            width="180px"
            prop="senderName">
            <template slot-scope="scope">
              <el-tag size="medium" effect="plain">{{ scope.row.senderName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="相关会议"
            width="180"
            prop="relatedConferenceName">
            <template slot-scope="scope">
              <el-tag size="medium" effect="plain" type="info">{{ scope.row.relatedConferenceName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="消息类型"
            width="180"
            prop="messageCategory">
            <template slot-scope="scope">
              <el-tag size="medium" effect="plain"
                      v-show="scope.row.messageCategory==='PCMemberInvitationRequest'"
                      type="success">
                审稿人邀请
              </el-tag>
              <el-tag size="medium" effect="plain"
                      v-show="scope.row.messageCategory==='ManuscriptSubmissionRequest'"
                      type="success">
                投稿邀请
              </el-tag>
              <el-tag size="medium" effect="plain"
                      v-show="scope.row.messageCategory==='ApplyConferenceResponse'"
                      type="success">
                会议申请反馈
              </el-tag>
              <el-tag size="medium" effect="plain"
                      v-show="scope.row.messageCategory==='PCMemberInvitationResponse'"
                      type="success">
                审稿人邀请反馈
              </el-tag>
              <el-tag size="medium" effect="plain"
                      v-show="scope.row.messageCategory==='ManuscriptSubmissionResponse'"
                      type="success">
                投稿反馈
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="具体内容"
            width="400px"
            prop="message">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.message}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="会议主题"
            width="400px"
            prop="topics">
            <template slot-scope="scope">
              <el-checkbox-group v-model="scope.row.selectedTopics"
              v-show="scope.row.messageCategory==='PCMemberInvitationRequest'">
                <el-checkbox v-for="topic in scope.row.topics" v-bind:key="topic" :label="topic"></el-checkbox>
              </el-checkbox-group>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <!--标为已读，对接于/markRead 对应于markRead函数-->
            <template slot-scope="scope">
              <div v-show="scope.row.messageCategory!=='PCMemberInvitationRequest'">
                <el-button
                  size="mini"
                  type="danger"
                  @click="markRead(scope.$index,scope.row)">标为已读
                </el-button>
              </div>
              <div v-show="scope.row.messageCategory==='PCMemberInvitationRequest'">
                <!--接受PCMember邀请，对应于"/approvePCMemberInvitation"，对应于approveInvitation()函数-->
                <el-button
                  size="mini"
                  type="success"
                  @click="approveInvitation(scope.$index,scope.row)">同意
                </el-button>
                <!--拒绝PCMember邀请，对应于"/disapprovePCMemberInvitation"，对应于disapproveInvitation()函数-->
                <el-button
                  size="mini"
                  type="danger"
                  @click="disapproveInvitation(scope.$index,scope.row)">拒绝
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-main>

      <!--已读页面-->
      <el-main v-show="(show===2)">
        <el-table
          :data="hasReadInfo"
          style="width: 100%">
          <el-table-column
            label="发送者"
            width="180"
            prop="senderName">
            <template slot-scope="scope">
              <el-tag size="medium" effect="plain">{{ scope.row.senderName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="相关会议"
            width="180"
            prop="relatedConferenceName">
            <template slot-scope="scope">
              <el-tag size="medium" effect="plain" type="info">{{ scope.row.relatedConferenceName }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column
            label="消息类型"
            width="180"
            prop="messageCategory">
            <template slot-scope="scope">

              <el-tag size="medium" effect="plain"
                      v-show="scope.row.messageCategory==='PCMemberInvitationRequest'"
                      type="success">
                审稿人邀请
              </el-tag>
              <el-tag size="medium" effect="plain"
                      v-show="scope.row.messageCategory==='ManuscriptSubmissionRequest'"
                      type="success">
                投稿邀请
              </el-tag>
              <el-tag size="medium" effect="plain"
                      v-show="scope.row.messageCategory==='ApplyConferenceResponse'"
                      type="success">
                会议申请反馈
              </el-tag>
              <el-tag size="medium" effect="plain"
                      v-show="scope.row.messageCategory==='PCMemberInvitationResponse'"
                      type="success">
                审稿人邀请反馈
              </el-tag>
              <el-tag size="medium" effect="plain"
                      v-show="scope.row.messageCategory==='ManuscriptSubmissionResponse'"
                      type="success">
                投稿反馈
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="具体内容"
            width="400px"
            prop="message">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.message}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-container>
</template>
<style scoped>
  .el-menu-item{
    height:65px;
    border: 1px solid #eee;
    padding-left:0px !important;
  }
  .el-header {
    background-color: rgb(238, 241, 246);
    /*background-color: #B3C0D1;*/
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
</style>

<script>
  export default {
    methods: {
      //将信息标为已读,向/markRead接口发送消息
      markRead(index, row) {
        const _this = this;
        this.$axios.post("/markRead", {
          id: row.id,
        })
          .then(resp => {
            if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
              let Info = _this.notReadInfo.splice(index, 1)[0];
              Info.isRead = 2;
              _this.hasReadInfo.push(Info);
              this.$message({
                showClose: true,
                message: "标为已读",
                type: 'success'
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
            this.$message({
              showClose: true,
              message: "服务器未响应",
              type: "error",
            })
          })
      },
      //接受PCMember邀请,向/approvePCMemberInvitation接口发送消息
      approveInvitation(index, row) {
        const _this = this;
        this.$axios.post("/approvePCMemberInvitation", {
          senderName: row.receiverName,
          receiverName: row.senderName,
          relatedConferenceName: row.relatedConferenceName,
        })
          .then(resp => {
            if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
              _this.notReadInfo.splice(index, 1);
              this.$message({
                showClose: true,
                message: resp.data.message,
                type: 'success'
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
            this.$message({
              showClose: true,
              message: "服务器未响应",
              type: "error",
            })
          });
          this.$axios.post("/setTopicsForPCMember",{
            topics:row.selectedTopics,
            conferenceName:row.relatedConferenceName,
          }).catch(error => {
            this.$message({
              showClose: true,
              message: "上传topics失败",
              type:"error",
            })
          })
      },
      disapproveInvitation(index, row) {
        const _this = this;
        this.$axios.post("/disapprovePCMemberInvitation", {
          senderName: row.receiverName,
          receiverName: row.senderName,
          relatedConferenceName: row.relatedConferenceName,
        }).then(resp => {
          if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
            _this.notReadInfo.splice(index, 1);
            this.$message({
              showClose: true,
              message: resp.data.message,
              type: 'success'
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
            this.$message({
              showClose: true,
              message: "服务器未响应",
              type: "error",
            })
          })

      },
      //选择进入未读界面
      not_read: function () {
        this.show = 1;
      },
      //选择进入已读界面
      has_read: function () {
        this.show = 2;
      },
    },
    data() {
      return {
        //真实数据
        allInfo: [],
        notReadInfo: [],
        hasReadInfo: [],
        show: 1,
      }
    },

    created: function () {
      //一开始就向后端请求所有消息
      const _this = this;
      this.$axios.post('/mailCenter')
        .then(resp => {
          if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
            _this.allInfo = resp.data.messages;
            for (let i = 0; i < _this.allInfo.length; i++) {
              //新增字段selectedTopics,使可选topics和已选topics分开
              _this.$set(_this.allInfo[i],"selectedTopics",[]);
              if (_this.allInfo[i].isRead === 1) {
                this.notReadInfo.push(_this.allInfo[i]);
              } else {
                this.hasReadInfo.push(_this.allInfo[i]);
              }
            }
          } else {
          }
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: '获取信息失败',
            type: 'error'
          });
        })
    }
  };
</script>
