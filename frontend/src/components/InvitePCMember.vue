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
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="搜索相关用户">
          <el-input v-model="formInline.search_key" placeholder="用户姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table ref="allUsers"
                :data="allUsers.filter(data => !search || data.fullName.toLowerCase().includes(search.toLowerCase())).slice((curPage-1)*pagesize,curPage*pagesize)"
                @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          :selectable="checkInvitable"
          width="55">
        </el-table-column>
        <el-table-column prop="fullName" width="400px">
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
            <el-tag type="primary" v-show="scope.row.status===2">已为PCMember</el-tag>
            <el-tag type="warning" v-show="scope.row.status===3">已邀请未回复</el-tag>
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
        <el-button type="success" @click="submitUsers">邀请</el-button>
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
          full_name: this.$route.params.full_name,
        },
        //前端展示所有用户，由三个用户数组合并
        allUsers: [],
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
        this.$axios.post('/search', {
          search_key: this.formInline.search_key,
          full_name: this.$route.params.full_name,
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
            this.$message({
              showClose: true,
              message: '查找失败',
              type: 'error'
            });
          });

      },
      checkInvitable(row, index) {
        return row.status === 1;
      },
      toggleSelection() {
        this.users = [];
        this.$refs.allUsers.clearSelection();
      },
      handleSelectionChange(val) {
        this.users = [];
        for (let user of val) {
          if(user.status===1){
            this.users = this.users.concat(user.username);
          }
        }
      },
      submitUsers() {
        if (this.users.length > 0) {
          this.$axios.post('/invitePCMember', {
            //会议全称
            fullName: this.$route.params.full_name,
            //邀请接受者数组
            users: this.users,
          })
            .then(resp => {
              if (resp.status === 200 && resp.data.message === "success") {
                this.$message({
                  showClose: true,
                  message: "已发送邀请",
                  type: "success",
                });
                for (let i = 0; i < this.users.length; i++) {
                  for (let j = 0; j < this.allUsers.length; j++) {
                    if (this.users[i] === this.allUsers[j].username) {
                      this.allUsers[j].status = 3;
                      break;
                    }
                  }
                }
                this.toggleSelection();
              } else {
                this.$message({
                  showClose: true,
                  message: resp.data.message,//success
                  type: "warning",
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
        }else{
          this.$message({
            showClose: true,
            message: "请选择邀请对象",
            type: "warning",
          });
        }
      },
    },
	  created() {
		  window.addEventListener("beforeunload",() => {
	      localStorage.removeItem("messageStore");
	      localStorage.setItem("messageStore", JSON.stringify(this.$route.params));
	    });
	    localStorage.getItem("messageStore") && Object.assign(this.$route.params, JSON.parse(localStorage.getItem("messageStore")));
	 },
  }
</script>

<style scoped>
  .conference_container {
    width: 90%;
  }

  .demo-form-inline {
    text-align: left;
    margin-left: 35px;
  }


  .selectButton {
    margin-top: 10px;
  }
</style>
