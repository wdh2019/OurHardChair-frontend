<template>
  <div id="base">
    <div class="container">
      <div>
        <h3 class="title">{{this.$route.params.row.fullName}}欢迎您的投稿</h3>
        <p class="description">请你填写下面信息</p>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item prop="title" class="item" label="文章标题">
          <el-input v-model="ruleForm.title" placeholder="文章标题"></el-input>
        </el-form-item>
        <el-form-item prop="articleAbstract" class="item" label="文章摘要">
          <el-input v-model="ruleForm.articleAbstract" placeholder="文章摘要" type="textarea" :rows="8"></el-input>
        </el-form-item>
        <el-upload
          class="upload-demo"
          action=""
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="3"
          :on-exceed="handleExceed"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
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
          fileList: [{
            name: 'food.jpeg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
          }, {
            name: 'food2.jpeg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
          }]
        },
        rules: {
          title: [
            {required: true, message: '请填写文章标题', trigger: 'blur'},
            {min: 1, max: 50, message: '标题不得超过50个字符', trigger: 'blur'}
          ],
          file: [
            {required: true, message: '请填写文件名', trigger: 'change'}
          ],
          articleAbstract: [
            {required: true, message: '请填写文章摘要', trigger: 'blur'}
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
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style scoped>
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
