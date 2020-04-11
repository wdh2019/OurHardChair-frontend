<template>
  <div class="base_conference">
    <div class="conference_container">
      <div class="title_section">
        <h3 class="title">邀请PCmembers</h3>
        <p class="description">在如下列表中，你可以查询到所有用户，并邀请用户成为会议的PCmember</p>
        <p class="description">提示：你可以在消息中心查看已发送的邀请状态</p>
      </div>
      <el-collapse class="meeting_introduction">
        <el-collapse-item>
          <span slot="title" class="collapse-title">会议简介</span>
          <div>
            <p class="content"><label class="label">会议简称: </label>{{this.$route.query.short_name}}</p>
          </div>
          <div>
            <p class="content"><label class="label">会议全称: </label>{{this.$route.query.full_name}}</p>
          </div>
          <!--需要接口的重新商榷最后后端返回chair的名字，或者此处编写方法问后端查找chair是谁-->
          <div>
            <p class="content"><label class="label">会议主席: </label>{{this.$route.query.chair_name}}</p>
          </div>
          <div>
            <p class="content"><label class="label">会议地点: </label>{{this.$route.query.place}}</p>
          </div>
          <div>
            <p class="content"><label class="label">会议开始时间: </label>{{this.$route.query.start_date}}</p>
          </div>
          <div>
            <p class="content"><label class="label">会议结束时间: </label>{{this.$route.query.deadline_date}}</p>
          </div>
          <div>
            <p class="content"><label class="label">会议截稿时间: </label>{{this.$route.query.release_date}}</p>
          </div>
        </el-collapse-item>
      </el-collapse>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="搜索相关用户">
          <el-input v-model="formInline.search_key" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table ref="userTable"
                :data="allUsers.filter(data => !search || data.fullName.toLowerCase().includes(search.toLowerCase())).slice((curPage-1)*pagesize,curPage*pagesize)"
                @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          :selectable="checkInvitable"
          width="55">
        </el-table-column>
        <el-table-column prop="fullName" width="300px">
          <template slot="header" slot-scope="scope">
            <label class="label">用户姓名</label>
            <el-input class="search_input"
                      v-model="search"
                      size="mini"
                      placeholder="输入关键字搜索">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="institution" label="所属单位"></el-table-column>
        <el-table-column prop="country" label="所在区域"></el-table-column>
        <el-table-column prop="status" label="邀请状态" width="150px">
          <template slot-scope="scope">
            <el-tag type="success" v-show="scope.row.status===1">可邀请</el-tag>
            <el-tag type="warning" v-show="scope.row.status===2">已邀请未回复</el-tag>
            <el-tag type="danger" v-show="scope.row.status===3">已邀请</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page.sync="curPage"
        :page-size="pagesize"
        :pager-count="7"
        :total="allUsers.length"
        background
        layout="total, prev, pager, next, jumper">
      </el-pagination>
      <div class="selectButton">
        <el-button type="success" @click="submitUsers">确认</el-button>
        <el-button type="info" @click="toggleSelection">取消选择</el-button>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    name: "InvitePCMember",
    data() {
      return {
        pagesize: 10,
        curPage: 1,
        formInline: {
          search_key: '',
        },
        //前端展示所有用户，由三个用户数组合并
        allUsers: [
          {
            fullName: "胡图图",
            username: "htt2020",
            email: "htt2020@jiaotong.edu.cn",
            institution: "脚痛大学",
            country: "China",
            status: 1// 1 可邀请 2 邀请未回复 3 已邀请
          },
          {
            fullName: "胡英俊",
            username: "hyj2020",
            email: "hyj2020@jiaotong.edu.cn",
            institution: "社会大学",
            country: "Others",
            status: 1
          },
          {
            fullName: "胡图图",
            username: "123",
            email: "123@fudan.com",
            institution: "复旦大学",
            country: "China",
            status: 2
          },
          {
            fullName: "胡英俊",
            username: "321",
            email: "321@shehui.edu.cn",
            institution: "社会大学",
            country: "Others",
            status: 2
          },
          {
            fullName: "胡图图",
            username: "12345",
            email: "12345@fudan.edu.cn",
            institution: "复旦大学",
            country: "China",
            status: 3
          },
          {
            fullName: "胡英俊",
            username: "54321",
            email: "54321@jiaotong.edu.cn",
            institution: "脚痛大学",
            country: "US",
            status: 3
          },
        ],
        //allUsers: [],
        search: '',
        //选中的用户，用于返回给后端
        users: [],
        tempUsers: [],
      }
    },
    methods: {
      onSubmit() {
        const _this = this;
        console.log(this.formInline.search_key);
        this.$axios.post('/search', {
          search_key: this.formInline.search_key,
          full_name: this.$route.query.full_name
        }).then(resp => {
          if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
            _this.allUsers = resp.data.users;
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
              message: '查找失败',
              type: 'warning'
            });
          });

      },
      checkInvitable(row, index) {
        // if (row.status === "可邀请")
        //   return true;
        // else
        //   return false;
        return row.status === 1;
      },
      toggleSelection() {
        this.users = [];
        this.$refs.userTable.clearSelection();
      },
      handleSelectionChange(val) {
        this.users = [];
        let count = 0;
        for (let user of val) {
          // console.log(user);
          this.users = this.users.concat(user.username);
        }
        console.log(this.users);
        console.log(this.allUsers);
      },
      submitUsers() {
        this.$axios.post('/invitePCMember', {
          //会议全称
          fullName: this.$route.query.conference,
          //发送者id
          sender: this.$store.state.id,
          //邀请接受者数组
          users: this.users,
        })
          .then(resp => {
            if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
              this.$message({
                showClose: true,
                message: resp.data.message,
                type: "success",
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
              message: resp.data.message,
              type: 'error',
            });
          })
      },
      inviteUsers() {
        const _this = this;
        //请求所有用户
        this.$axios.post('/invitePCMember')
          .then(resp => {
            if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
              this.$message({
                showClose: true,
                message: "邀请已经发送",
                type: 'warning'
              });
              for (let i = 0; i < this.users.length; i++) {
                for (let j = 0; j < this.allUsers.length; j++) {
                  if (this.users[i] === this.allUsers[j].username) {
                    this.allUsers[j].status = 2;
                    break;
                  }
                }
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
              message: resp.data.message,
              type: 'error',
            });
          })
      }
    },
    created() {
      /*const _this=this;
        //请求所有用户
        this.$axios.post('')
        .then(resp => {
          if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
               //添加状态字段，以便前端显示状态
               let list1=resp.data.availableUsers;
               _this.availableUsers=list1.map(i=>{
                    this.$set(i, 'status', '可邀请')
                         return i
               });
               let list2=resp.data.invitingUsers;
               _this.invitingUsers=list2.map(i=>{
                    this.$set(i, 'status', '已邀请未回复')
                         return i
               });
               let list3=resp.data.invitedUsers;
               _this.invitedUsers=list3.map(i=>{
                    this.$set(i, 'status', '已邀请')
                         return i
               });
               _this.allUsers=availableUsers.concat(invitingUsers).concat(invitedUsers);
          }else{
            this.$message({
              showClose: true,
              message: resp.data.message,
              type:'warning'
            });
          }
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: resp.data.message,
            type:'error',
          });
        })*/
    }
  }
</script>

<style>
  .demo-form-inline {
    text-align: left;
    margin-left: 35px;
  }

  .collapse-title {
    flex: 1 0 90%;
    order: 1;
  }

  .el-collapse-item__header {
    flex: 1 0 auto;
    order: -1;
  }

  .meeting_introduction {

    text-align: left;
    margin-left: 35px;
    margin-top: 30px;
    margin-bottom: 30px;
  }

  .meeting_introduction .content {
    font-size: 15px;
  }

  .meeting_introduction .label {
    color: #99a9bf;
    font-weight: bold;
  }

  .conference_container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 10px auto;
    width: 90%;
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

  .label {
    float: left;
  }

  .search_input {
    float: right;
    width: 150px;
    margin-right: 30px;
  }

  .selectButton {
    margin-top: 10px;
  }
</style>
