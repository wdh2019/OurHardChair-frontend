<template>
  <div id="base">
    <div class="container">
      <div>
        <h3 class="title">{{this.$route.query.fullName}}欢迎您的投稿</h3>
        <p class="description">请您填写以下信息</p>
      </div>
      <el-collapse class="meeting_introduction" >
        <el-collapse-item>
          <span slot="title" class="collapse-title">会议简介</span>
          <div>
            <p class="content"><label class="label">会议简称:  </label>{{this.$route.query.short_name}}</p>
          </div>
          <div>
            <p class="content"><label class="label">会议全称:  </label>{{this.$route.query.full_name}}</p>
          </div>
          <!--需要接口的重新商榷最后后端返回chair的名字，或者此处编写方法问后端查找chair是谁-->
          <div>
            <p class="content"><label class="label">会议主席:  </label>{{this.$route.query.chair_name}}</p>
          </div>
          <div>
            <p class="content"><label class="label">会议地点:  </label>{{this.$route.query.place}}</p>
          </div>
          <div>
            <p class="content"><label class="label">会议开始时间:  </label>{{this.$route.query.start_date}}</p>
          </div>
          <div>
            <p class="content"><label class="label">会议结束时间:  </label>{{this.$route.query.deadline_date}}</p>
          </div>
          <div>
            <p class="content"><label class="label">会议截稿时间:  </label>{{this.$route.query.release_date}}</p>
          </div>
        </el-collapse-item>
      </el-collapse>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item prop="title" class="item" label="文章标题">
          <el-input v-model="ruleForm.title" placeholder="文章标题"></el-input>
        </el-form-item>
        <el-form-item prop="articleAbstract" class="item" label="文章摘要">
          <el-input v-model="ruleForm.articleAbstract" placeholder="文章摘要" type="textarea" :rows="8"></el-input>
        </el-form-item>
        <el-form-item label="文件上传" style="text-align: left;">
        <el-upload
          ref="upload"
          style="float:left"
          class="upload-demo"
          action="/upload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-upload="beforeUpload"
          :before-remove="beforeRemove"
          :auto-upload="false"
          accept=".pdf"
          :limit="1"
          :on-exceed="handleExceed"
        >
          <el-button  size="small" type="primary">选择文件</el-button>
          <div slot="tip" class="el-upload__tip">只能上传pdf文件，只能上传一个文件</div>
        </el-upload>
          <el-button size="small" type="info" @click="clearFiles">清空文件列表</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SubmitPapers",
    data() {
      return {
        ruleForm: {
          title: '',
          filename: '',
          articleAbstract: '',
          file: '',
        },
        rules: {
          title: [
            {required: true, message: '请填写文章标题', trigger: 'blur'},
            {min: 1, max: 50, message: '标题不得超过50个字符', trigger: 'blur'}
          ],
          filename: [
            {required: true, message: '请填写文件名', trigger: 'change'},

          ],
          articleAbstract: [
            {required: true, message: '请填写文章摘要', trigger: 'blur'},
            {min: 1, max: 800, message: '文章摘要不得超过800个字符', trigger: 'blur'}
          ],
        }
      };
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file.name);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      //上传前，先把文件COPY一份到ruleForm.file里
      beforeUpload(file){
        this.ruleForm.file=file;
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //虚晃upload一下，submit以后触发beforeUpload
            this.$refs.upload.submit();
            //正常的post
            this.$axios.post('/upload',{
              //会议id需要传进来！！！！！
              conferenceID:this.$route.query.conference_id,
              AuthorID:this.$store.state.id,
              filename:this.ruleForm.file.name,
              title:this.ruleForm.title,
              articleAbstract:this.ruleForm.articleAbstract,
            }).then(resp => {
                if (resp.status === 200 && resp.data.hasOwnProperty("token")){
                  this.$message({
                    showClose:true,
                    message: "投稿成功",
                    type:"success",
                  });
                  this.$router.push('/AllConferences');
                }else {
                  this.$message({
                    showClose: true,
                    message: resp.data.message,
                    type:'warning'
                  });
                }
            }).catch(error => {
                console.log(error);
                this.$message({
                  showClose: true,
                  message: resp.data.message,
                  type:'danger'
                });
              })
          } else {
            this.$message({
              showClose: true,
              message: "请按要求填写投稿信息",
              type:'warning'
            });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.$refs.upload.clearFiles();
      },
      clearFiles(){
        this.$refs.upload.clearFiles();
      }
    }
  }
</script>

<style scoped>

  .collapse-title {
    flex: 1 0 90%;
    order: 1;
  }

  .el-collapse-item__header {
    flex: 1 0 auto;
    order: -1;
  }
  .meeting_introduction{

    text-align: left;
    margin-left:35px;
    margin-top:30px;
    margin-bottom:30px ;
  }

  .meeting_introduction .content{
    font-size:15px;
  }
  .meeting_introduction .label{
    color: #99a9bf;
    font-weight: bold;
  }

  #userinfo {
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }


  .container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 10px auto;
    margin-top: -10px;
    width: 70%;
    height: 800px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    clear: left;
  }

  .title {
    margin: 20px auto;
    text-align: left;
    color: #494e8f;
    font-size: 24px;
    font-weight: normal;
  }

  .title3 {
    margin-top: 40px;
    margin-bottom: 10px;
  }

  p.description {
    text-align: left;
    color: #999;
    line-height: 1.4285;
    padding-top: 10px;
    font-size: 14px;
  }

  .userinfo_form {
    margin-top: 40px;
    text-align: left;
  }

  .id {
    margin-top: 25px;
    font-size: 14px;
    text-align: left;
  }

  .id_bold {
    font-weight: bold;
  }

  .inline_block {
    display: inline-block;
  }

  .display_username_field {
    width: 250px;
  }

  .display_email_field {
    width: 300px;
  }

  .display_password_field {
    width: 50%;
  }

  .display_ensure_password_field {
    width: 50%;
  }

  .display_country_field {
    width: 250px;
  }

  .display_company_field {
    width: 350px;
  }

  .userinfo_container .item {
    margin-top: 0px;
    margin-bottom: 20px;
  }

  .middle_button {
    margin-top: 20px;
    width: 15%;
    height: 50px;
    border: none
  }

  .item .el-form-item__label {
    color: red;
  }

  .item .el-form-item__label:before {
    content: '' !important;
    width: 0px;
    margin-right: 0px;
  }

</style>
