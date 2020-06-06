<template>
  <div class="base_conference">
    <div class="conference_container">
    <div class="title_section">
    <h3 class="title">Rebuttal</h3>
    <p class="description">对初次没有录用的论文，提交你的rebuttal信息</p>
    </div>
    <el-collapse class="meeting_introduction">
      <el-collapse-item>
        <span slot="title" class="collapse-title">论文信息</span>
        <div>
          <p class="content"><label class="label">论文标题: </label></p>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-collapse class="meeting_introduction">
      <el-collapse-item>
        <span slot="title" class="collapse-title">评审信息</span>
        <div>
          <p class="content"><label class="label">评分一: </label></p>
          <p class="content"><label class="label">评分二: </label></p>
          <p class="content"><label class="label">评分三: </label></p>
          <p class="content"><label class="label">评语一: </label></p>
          <p class="content"><label class="label">评语二: </label></p>
          <p class="content"><label class="label">评语三: </label></p>
          <p class="content"><label class="label">confidence值一: </label></p>
          <p class="content"><label class="label">confidence值二: </label></p>
          <p class="content"><label class="label">confidence值三: </label></p>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-form :model="ruleForm" :rules="rules" label-position="left" ref="ruleForm">
      <el-form-item label="rebuttal" prop="rebuttal">
        <el-input v-model="ruleForm.rebuttal"
        type="textarea"
        :rows="8"
        placeholder="填写你的rebuttal信息"></el-input>
      </el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
    </el-form>
    </div>
  </div>
</template>

<script>
  export default{
    data(){
      return{
        ruleForm:{
          rebuttal:'',
        },
        rules:{
          rebuttal:[{required: true, message: "rebuttal信息不能为空", trigger: 'blur'}],
        }
      }
    },
    methods:{
      submitForm(formName){
        this.$refs[formName].validate((valid)=>{
          if(valid){
            this.$axios.post('/submitRebuttal', {
              authorID: this.$route.params.authorID,
              password: this.$route.params.articleID,
              words: this.ruleForm.rebuttal,
            })
            .then(resp => {
                if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
                  this.$message({
                    showClose: true,
                    message: '欢迎回来' + resp.data.username,
                    type: 'success'
                  });
                }else{
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
                message: "错误发生于提交rebuttal信息",
                type:'error'
              });
            })
          }
        });
      },

    },

  }
</script>

<style scoped>
  .conference_container{
    width:60%;
  }
  .el-form{
    width:80%;
    margin-right: auto;  margin-left: auto;
    margin-top:80px;
    margin-bottom: 80px;
  }
  .el-collapse{
    margin: 0 0 0 35px;
  }
  .el-button{
    float:right
  }
</style>
