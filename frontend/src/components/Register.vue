<template>
  <div id="base_register">
    <div class="register_container">
      <h3 class="register_title">注册</h3>

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left"
               label-width="0px" v-loading="loading">

        <el-form-item prop="username" class="item">
          <el-input ref="username" v-model="ruleForm.username" placeholder="用户名" type="text" auto-complete="off">
            <i slot="suffix" class="el-icon-warning-outline" title="只能包含字母,数字或两种特殊字符(-_),只能以字母或-开头,长度为5-32个字符"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="fullName" class="item">
          <el-input v-model="ruleForm.fullName" placeholder="真实姓名" type="text" auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item prop="password" class="item">
          <el-input v-model="ruleForm.password" placeholder="密码" type="password" auto-complete="off" show-password>
          <i slot="suffix" class="el-icon-warning-outline" title="至少包含字母,数字或特殊字符(-_)中的两种,长度6-32个字符,不能包含账号"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="ensure_password" class="item">
          <el-input v-model="ruleForm.ensure_password" placeholder="确认密码" type="password" auot-complete="off" show-password>
          </el-input>
        </el-form-item>
        <el-form-item prop="email" class="item">
          <el-input v-model="ruleForm.email" placeholder="邮箱" type="text" auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item prop="country" class="item">
          <el-select v-model="ruleForm.country" placeholder="区域地区" filterable>
            <el-option v-for="country in countries" :key="country.value" :value="country.value" :label="country.label">
              <span style="float: left">{{ country.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ country.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="company" class="item">
          <el-input v-model="ruleForm.company" placeholder="所属单位" type="text" auto-complete="off">
          </el-input>
        </el-form-item>

        <el-form-item class="item">
          <el-button type="primary" round @click="submitForm('ruleForm')" class="middle_button">注册</el-button>
          <el-button type='info' round @click="resetForm('ruleForm')" class="middle_button">重置</el-button>
        </el-form-item>
        <p class="tip">已有账号?
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
        countries: [{value: 'China', label:'中国'},
        {value: 'United States', label:'美国'},
        {value: 'United Kingdom', label:'英国'},
        {value: 'Russia', label:'俄罗斯'},
        {value: 'Japan', label: '日本'},
        {value: 'Others', label: '其他区域'}
        ],
        ruleForm: {
          username: '',
          password: '',
          fullName: '',
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
          fullName: [
            {required: true, message: '真实姓名不能为空', trigger: 'blur'},
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
        },
        loading: false,
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
                fullName: this.ruleForm.fullName,
                email: this.ruleForm.email,
                institution: this.ruleForm.company,
                country: this.ruleForm.country,
              }
            )
              .then(resp => {
                // 根据后端的返回数据修改
                if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
                  // 跳转到login
                  this.$message({
                    showClose: true,
                    message: "恭喜注册成功!"+resp.data.username,
                    type:'success'
                  });
                  this.$store.commit('login', resp.data);
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
                this.$message({
                  showClose: true,
                  message: "注册失败",
                  type:'error'
                });
              })
          } else {
            this.$message({
              showClose: true,
              message: "请按要求填写注册信息",
              type:'warning'
            });
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
    background-color: blanchedalmond;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }

  .register_container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 40px auto;
    width: 480px;
    height: 620px;
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
    margin-top: 20px;
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
    margin-top: 30px;
    font-size: 15px;
  }
  .el-icon-warning-outline{
    font-size: 16px;
  }
  .el-icon-warning-outline:hover{
    font-size: 18px;
    cursor: pointer;
  }
</style>
