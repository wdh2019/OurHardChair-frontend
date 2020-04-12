<template>
  <div class="base_conference">
    <div class="conference_container">
      <div class="title_section">
        <h3 class="title">查看您在  {{this.$route.query.short_name}}  会议中的投稿记录</h3>
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
      <el-table
        :data="submissionRecord"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="提交时间">
                <span>{{ props.row.date }}</span>
              </el-form-item>
              <el-form-item label="文章标题">
                <span>{{ props.row.title }}</span>
              </el-form-item>
              <el-form-item label="文件名">
                <span>{{ props.row.filename }}</span>
              </el-form-item>
              <el-form-item label="文章摘要">
                <span>{{ props.row.articleAbstract }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="提交时间"
          prop="date" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          label="文章标题"
          prop="title" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          label="文件名"
          prop="filename"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          label="文章摘要"
          prop="articleAbstract"
          :show-overflow-tooltip="true">
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
        submissionRecord: []
      }
    },
    created(){
       //接口未定义
       const _this=this;
       this.$axios.post('')
         .then(resp => {
           if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
             _this.submissionRecord = resp.data.submissionRecord;
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
             message: '请求相关记录失败',
             type: 'warning'
           });
         })
     }
  }
</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
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

</style>
