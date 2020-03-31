<template>
  <div id="base_userinfo">
    <div class="userinfo_container">
      <div class="title_section">
      <h3 class="userinfo_title">用户信息</h3>
      <p class="description">管理您的Gysw账号详情，包括您的用户名，邮箱等信息</p>
      </div>
      <div class="userinfo_form">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  label-position="left">
        <h3 class="userinfo_title">账户信息</h3>
        <p class="id"><span class="id_bold">ID:</span>{{$store.state.token}}</p>

        <div class="inline_block display_username_field">
           <el-form-item prop="username" class="item" label="用户名" disabled>
              <el-input v-model="ruleForm.username" :placeholder="$store.state.username" type="text" auto-complete="off" :disabled="username_disabled">
              </el-input>
           </el-form-item>
        </div>
        <el-button class="inline_block" type="primary" icon="el-icon-edit" @click="unlockUsername" title="用户名是重要信息,请勿随意更改"></el-button>

        <div class="inline_block display_email_field">
          <el-form-item prop="email" class="item" label="邮箱">
            <el-input v-model="ruleForm.email" :placeholder="$store.state.email" type="text" auto-complete="off"  :disabled="email_disabled">
            </el-input>
          </el-form-item>
        </div>
        <el-button class="inline_block" type="primary" icon="el-icon-edit" @click="unlockEmail" title="绑定邮箱是重要信息,请勿随意更改"></el-button>

        <h3 class="userinfo_title">密码与安全</h3>
        <div class="display_password_field">
        <el-form-item prop="old_password" class="item">
          <el-input v-model="ruleForm.old_password" placeholder="输入原密码" type="password" auto-complete="off" show-password>
          </el-input>
        </el-form-item>
        </div>
        <div class="display_ensure_password_field">
        <el-form-item prop="ensure_password" class="item">
          <el-input v-model="ruleForm.ensure_password" placeholder="确认密码" type="password" auto-complete="off" show-password>
          </el-input>
        </el-form-item>
        </div>
        <h3 class="userinfo_title title3">个人信息</h3>
        <div class="inline_block display_country_field">
        <el-form-item prop="country" class="item" label="国家/地区">
          <el-select v-model="ruleForm.country" :placeholder="$store.state.country" filterable>
            <el-option v-for="country in countries" :key="country.value" :value="country.value" :label="country.label">
              <span style="float: left">{{ country.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ country.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        </div>
        <div class="inline_block display_company_field">
        <el-form-item prop="company" class="item" label="所属单位">
          <el-input v-model="ruleForm.company" :placeholder="$store.state.company" type="text" auto-complete="off">
          </el-input>
        </el-form-item>
        </div>
        <el-form-item class="item">
          <el-button type="primary"  @click="submitForm('ruleForm')" class="middle_button">保存变更</el-button>
          <el-button type='info'  @click="resetForm('ruleForm')" class="middle_button">放弃变更</el-button>
        </el-form-item>
      </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "UserInfo",
    data() {
      let checkUserName = (rule, value, callback) => {
        var regUserName = /^[a-zA-Z-][a-zA-Z0-9_-]{4,31}$/;
        if (!regUserName.test(value)) {
          return callback(new Error("用户名格式不正确，只包含字母、数字以及特殊符号（-_）且需要以字母或特殊符号（-）开头"))
        }
        return callback();
      };
      let checkPassword = (rule, value, callback) => {
        var regPassword = /(?!^(\d+|[a-zA-Z]+|[-_]+)$)^[\w-_]{6,32}$/;
        var username = this.$refs.username.value;
        if (!regPassword.test(value)) {
          return callback(new Error("密码格式不正确，必须包含字母、数字以及特殊符号（-_）中两种"));
        }
        if (value.includes(username)) {
          return callback(new Error("密码不能包含账号"));
        }
        return callback();
      };
      let checkEnsurePassword = (rule, value, callback) => {
        if (value !== this.ruleForm.old_password) {
          return callback(new Error("确认密码与密码不相符"))
        }
        return callback();
      };
      let checkEmail = (rule, value, callback) => {
        var regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        if (!regEmail.test(value)) {
          return callback(new Error('邮箱格式不正确'))
        }
        return callback()
      };
      return {
        username_disabled:true,
        email_disabled:true,
        form_visible: false,
        countries:[{value: 'China', label:'中国'},
        {value: 'United States', label:'美国'},
        {value: 'United Kingdom', label:'英国'},
        {value: 'Russia', label:'俄罗斯'},
        {value: 'Japan', label: '日本'},
        {value: 'Others', label: '其他区域'}
        /*<el-option label="Asia" value="Asia"></el-option>
        <el-option label="Europe" value="Europe"></el-option>
        <el-option label="North American" value="North American"></el-option>
        <el-option label="South American" value="South American"></el-option>
        <el-option label="Africa" value="Africa"></el-option>
        <el-option label="Oceania" value="Oceania"></el-option>
        <el-option label="Antarctica" value="Antarctica"></el-option>*/
        ],
        userData: [{
          username: this.$store.state.username,
          email: this.$store.state.email,
          country: this.$store.state.country,
          company: this.$store.state.institution,
        }],
        ruleForm: {
          username: '',
          old_password: '',
          password: '',
          ensure_password: '',
          email: '',
          country: '',
          company: '',
        },
        rules: {
          username: [
            {required: true, message: '用户名不能为空', trigger: 'blur'},
            {min: 5, max: 32, message: '用户名长度在5-32之间', trigger: 'blur'},
            {validator: checkUserName, trigger: 'blur'}
          ],
          old_password: [
            {required: true, message: '原密码不能为空', trigger: 'blur'},
            {validator: checkPassword, trigger: 'blur'}
          ],
          ensure_password: [
            {required: true, message: "确认密码不能为空", trigger: 'blur'},
            {validator: checkEnsurePassword, trigger: 'blur'}
          ],
          email: [
            {required: true, message: '邮箱不能为空', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}
          ],
          country: [
            {required: true, message: '地区不能为空', trigger: 'change'}
          ],
          company: [
            {required: true, message: '单位不能为空', trigger: 'blur'}
          ],
        },
        loading: false
      };
    },
    methods: {
      unlockUsername(){
        this.username_disabled=false;
      },
      unlockEmail(){
        this.email_disabled=false;
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //this.$axios.post用来向后台发送数据
            this.$axios.post('/UserInfo', {
                username_changed: this.ruleForm.username,
                old_password: this.ruleForm.old_password,
                password_changed: this.ruleForm.password,
                email_changed: this.ruleForm.email,
                institution_changed: this.ruleForm.company,
                country_changed: this.ruleForm.country,
              }
            )
              .then(resp => {
                //console.log(resp.data);
                if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
                  // 跳转到login
                  this.$message({
                    showClose: true,
                    message: "修改成功",
                    type:'success'
                  });
                  // 修改成功后，修改表单隐藏
                  this.form_visible = false;
                  this.$router.push('/UserPage').catch(err=>err)
                } else {
                  this.$message({
                    showClose: true,
                    message: resp.data.message,
                    type:'warning'
                  });
                }
              })
              .catch(error => {
                console.log(error);
                this.$message({
                  showClose: true,
                  message: "修改失败",
                  type:'warning'
                });
              })
          } else {
            this.$message({
              showClose: true,
              message: "请按要求填写修改信息",
              type:'warning'
            });
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    mounted() {
      this.username_disabled=true;
      this.email_disabled=true;
    }

  }
</script>

<style scoped>
  #base_userinfo {
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }

  .userinfo_container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 10px auto;
    width: 750px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    clear: left;
  }

  .userinfo_title {
    margin: 20px auto;
    text-align: left;
    color: #494e8f;
    font-size:24px;
    font-weight: normal;
  }
  .title3{
    margin-top: 40px;
    margin-bottom: 10px;
  }

  p.description{
    text-align: left;
    color: #999;
    line-height: 1.4285;
    padding-top: 10px;
    font-size: 14px;
  }
  .userinfo_form{
    margin-top: 40px;
    text-align: left;
  }
  .id{
    margin-top: 25px;
    font-size:14px;
    text-align: left;
  }
  .id_bold{
    font-weight: bold;
  }
  .inline_block{
    display: inline-block;
  }
  .display_username_field{
    width: 250px;
  }
  .display_email_field{
    width: 300px;
  }
  .display_password_field{
    width:50%;
  }
  .display_ensure_password_field{
    width:50%;
  }
  .display_country_field{
    width:250px;
  }
  .display_company_field{
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
  .item .el-form-item__label{
    color:red;
  }
  .item .el-form-item__label:before{
  content: '' !important;
  width: 0px;
  margin-right: 0px;
  }

</style>
