<template>
  <div id="base_register">
    <div class="register_container">
      <h3 class="register_title">注册</h3>

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left"
               label-width="0px" v-loading="loading">

        <el-form-item prop="username" class="item">
          <el-input ref="username" v-model="ruleForm.username" placeholder="用户名" type="text" auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item prop="password" class="item">
          <el-input v-model="ruleForm.password" placeholder="密码" type="password" auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item prop="ensure_password" class="item">
          <el-input v-model="ruleForm.ensure_password" placeholder="确认密码" type="password"
                    auot-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item prop="email" class="item">
          <el-input v-model="ruleForm.email" placeholder="邮箱" type="text" auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item prop="country" class="item">
          <el-select v-model="ruleForm.country" placeholder="区域地区">
            <el-option label="Asia" value="Asia"></el-option>
            <el-option label="Europe" value="Europe"></el-option>
            <el-option label="North American" value="North American"></el-option>
            <el-option label="South American" value="South American"></el-option>
            <el-option label="Africa" value="Africa"></el-option>
            <el-option label="Oceania" value="Oceania"></el-option>
            <el-option label="Antarctica" value="Antarctica"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="company" class="item">
          <el-input v-model="ruleForm.company" placeholder="所属单位" type="text" auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item prop="user_type" class="item">
          <el-radio-group v-model="ruleForm.user_type">
            <el-radio label="Admin" border>Admin</el-radio>
            <el-radio label="Contributor" border>Contributor</el-radio>
            <el-radio label="Reviewer" border>Reviewer</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="item">
          <el-button type="success" round @click="submitForm('ruleForm')" class="middle_button">注册</el-button>
          <el-button type='danger' round @click="resetForm('ruleForm')" class="middle_button">重置</el-button>
        </el-form-item>
        <p class="tip">已有账号!
          <router-link to="/login" class="router_link_active">
            登录
          </router-link>
        </p>
      </el-form>
    </div>
  </div>
</template>

<script>

  export default {
    name: "Register1",
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
        if (value !== this.ruleForm.password) {
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
        ruleForm: {
          username: '',
          password: '',
          ensure_password: '',
          email: '',
          country: '',
          company: '',
          user_type: '',
        },
        rules: {
          username: [
            {required: true, message: '用户名不能为空', trigger: 'blur'},
            {min: 5, max: 32, message: '用户名长度在5-32之间', trigger: 'blur'},
            {validator: checkUserName, trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'},
            {min: 6, max: 32, message: "密码长度在6-32之间", trigger: 'blur'},
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
          user_type: [
            {required: true, message: "注册身份不能为空", trigger: 'change'}
          ]
        },
        loading: false
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //this.$axios.post用来向后台请求数据
            this.$axios.post('/register', {
                username: this.ruleForm.username,
                password: this.ruleForm.password,
                email: this.ruleForm.email,
                institution: this.ruleForm.company,
                country: this.ruleForm.country,
                authorities:this.ruleForm.user_type
              }
            )
              .then(resp => {
                // 根据后端的返回数据修改
                alert(resp.data);
                  if (resp.status === 200 && resp.data.hasOwnProperty("id")) {
                  // 跳转到login
                  alert('register successfully！');
                  this.$router.replace('/login')
                } else {
                  alert('register error！1')
                }
              })
              .catch(error => {
                console.log(error+"1234");
                alert('register error！2')
              })
          } else {
            alert('wrong submit！');
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
  #base_register {
    background: url("../assets/background/checkerboard-cross.png") repeat;
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }

  .register_container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 40px auto;
    width: 500px;
    height: 580px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .register_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #494e8f;
  }

  .register_container .item {
    margin-bottom: 20px;
  }

  .register_container .item .middle_button {
    width: 30%;
    border: none
  }

  .router_link_active {
    text-decoration: none;
    color: #ff5a60;

  }

  .router_link_active:hover {
    color: #55b6ff;
  }

  .tip {
    margin-top: 40px;
    font-size: 15px;
    margin-left: 300px;

  }
</style>
