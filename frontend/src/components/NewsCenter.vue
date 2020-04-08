<template>
  <el-container style="height: 500px; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-active="show+''">
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

    <el-container>
      <el-header style="text-align: right; font-size: 20px">
      </el-header>
      <el-main v-show="(show===1)">
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="具体内容">
                  <span>{{ scope.row.message}}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="发送时间"
            width="180"
            prop="sendTime">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.sendTime}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="发送者"
            width="180"
            prop="senderName">
            <template slot-scope="scope">
              <el-tag size="medium" effect="plain">{{ scope.row.senderName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="消息类型"
            width="180"
            prop="messageCategory">
            <template slot-scope="scope">
              <el-tag size="medium" effect="plain"
                      v-show="scope.row.messageCategory==='ApplyConferenceRequest'"
                      type="success">
                会议申请
              </el-tag>
              <el-tag size="medium" effect="plain"
                      v-show="scope.row.messageCategory==='PCMemeberInvitationRequest'"
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
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div v-show="scope.row.messageCategory!=='PCMemeberInvitationRequest'">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleEdit(scope.$index, scope.row)">标为已读
                </el-button>
              </div>
              <div v-show="scope.row.messageCategory==='PCMemeberInvitationRequest'">
                <el-button
                  size="mini"
                  type="success"
                  @click="handleEdit(scope.$index, scope.row)">同意
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleEdit(scope.$index, scope.row)">拒绝
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-main v-show="(show===2)">
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="具体内容">
                  <span>{{ scope.row.message}}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="发送时间"
            width="180"
            prop="sendTime">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.sendTime}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="发送者"
            width="180"
            prop="senderName">
            <template slot-scope="scope">
              <el-tag size="medium" effect="plain">{{ scope.row.senderName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="消息类型"
            width="180"
            prop="messageCategory">
            <template slot-scope="scope">
              <el-tag size="medium" effect="plain"
                      v-show="scope.row.messageCategory==='ApplyConferenceRequest'"
                      type="success">
                会议申请
              </el-tag>
              <el-tag size="medium" effect="plain"
                      v-show="scope.row.messageCategory==='PCMemeberInvitationRequest'"
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
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div v-show="scope.row.messageCategory!=='PCMemeberInvitationRequest'">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleEdit(scope.$index, scope.row)">标为已读
                </el-button>
              </div>
              <div v-show="scope.row.messageCategory==='PCMemeberInvitationRequest'">
                <el-button
                  size="mini"
                  type="success"
                  @click="handleEdit(scope.$index, scope.row)">同意
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleEdit(scope.$index, scope.row)">拒绝
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-container>
</template>
<style>
  .el-header {
    background-color: #B3C0D1;
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
      //测试的函数
      handleEdit(index, row) {
        console.log(index, row);
      },
      //测试的函数
      handleDelete(index, row) {
        console.log(index, row);
      },
      not_read: function () {
        this.show = 1;
      },
      has_read: function () {
        this.show = 2;
      },
      has_deleted: function () {
        this.show = 3;
      },
      number: function () {
        console.log(this.info.length);
        let notRead = [];
        let hasRead = [];
        for (let i = 0; i < this.info.length; i++) {
          if (this.info[i].isRead === true)
            hasRead.push(this.info[i]);
          else
            notRead.push(this.info[i]);
        }
        console.log("hasRead");
        console.log(hasRead[0]);
        console.log("NotRead");
        console.log(notRead[0]);
      }
    },
    data() {
      return {
        //测试样例
        tableData: [{
          senderName: '王小虎',
          receiverName: '杨雲腾',
          messageCategory: 'ApplyConferenceRequest',
          message: 'xxxx',
          sendTime: '2016-05-02',
          isRead: 0,
        }, {
          senderName: '王小虎',
          receiverName: '杨雲腾',
          messageCategory: 'ApplyConferenceResponse',
          message: 'xxxx',
          sendTime: '2016-05-02',
          isRead: 0,
        }, {
          senderName: '王小虎',
          receiverName: '杨雲腾',
          messageCategory: 'PCMemeberInvitationRequest',
          message: 'xxxx',
          sendTime: '2016-05-02',
          isRead: 0,
        }, {
          senderName: '王小虎',
          receiverName: '杨雲腾',
          messageCategory: 'PCMemberInvitationResponse',
          message: 'xxxxx',
          sendTime: '2016-05-02',
          isRead: 0,
        },{
          senderName: '王小虎',
          receiverName: '杨雲腾',
          messageCategory: 'ManuscriptSubmissionRequest',
          message: 'xxxxx',
          sendTime: '2016-05-02',
          isRead: 0,
        },{
          senderName: '王小虎',
          receiverName: '杨雲腾',
          messageCategory: 'ManuscriptSubmissionResponse',
          message: 'xxxxx',
          sendTime: '2016-05-02',
          isRead: 0,
        }
        ],
        //真实数据
        allInfo: [
          {
            date: 1,
            isRead: true
          },
          {
            date: 2,
            isRead: false
          }
        ],
        notReadInfo: [],
        hasReadInfo: [],
        show: 1,
      }
    },

    created: function () {
      //一开始就向后端请求所有会议
      const _this = this;
      // this.$axios.post('/mailCenter')
      //     .then(resp => {
      //         if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
      //             _this.allInfo = resp.data.mail;
      //         } else {
      //             // this.$message({
      //             //     showClose: true,
      //             //     message: resp.data.message,
      //             //     type: 'success'
      //             // });
      //         }
      //     })
      //     .catch(error => {
      //         console.log(error);
      //         this.$message({
      //             showClose: true,
      //             message: '获取信息失败',
      //             type: 'warning'
      //         });
      //     })

    }
  };
</script>
