<template>
  <div>
    <div id="base_login">
      <el-popover placement="bottom" trigger="click" content="账号:admin 密码:password 版本号:Lab5.1">
        <el-button slot="reference" type="primary">查看管理员账号</el-button>
      </el-popover>
      <div class="login_container">
        <h3 class="login_title">登录</h3>

        <el-form :model="ruleForm" :rules="rules" label-position="left" ref="ruleForm"
                 label-width="0px" v-loading="loading">

          <!--用户名-->
          <el-form-item prop="username">
            <el-input type="text"
                      v-model="ruleForm.username"
                      auto-complete="off"
                      placeholder="用户名">
            </el-input>
          </el-form-item>
          <!--密码-->
          <el-form-item prop="password">
            <el-input type="password"
                      v-model="ruleForm.password"
                      show-password
                      auto-complete="off"
                      placeholder="密码">

            </el-input>
          </el-form-item>
          <!--登陆按钮-->
          <el-form-item style="width: 100%">
            <el-button type="primary" round
                       class="submit"
                       @click="submitForm('ruleForm')">登录
            </el-button>
          </el-form-item>
          <!--转到注册-->
          <p class="tip">尚未注册？
            <router-link to="/register" class="router_link_active">
              注册
            </router-link>
          </p>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data() {

      return {
        ruleForm: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            {required: true, message: "用户名不能为空", trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        },
        loading: false
      }
    },

    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //this.$axios.post用来向后台请求数据
            this.$axios.post('/login', {
              username: this.ruleForm.username,
              password: this.ruleForm.password
            })
              .then(resp => {
                if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
                  this.$message({
                    showClose: true,
                    message: '欢迎回来' + resp.data.username,
                    type: 'success'
                  });
                  this.$store.commit('login', resp.data);
                  this.$router.push("/UserPage").catch(err => err);
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
                  message: "登录失败",
                  type:'error'
                });
              })
          }
        });
      }
    }
  }
</script>

<style scoped>
  #base_login {
    height: 100%;
    width: 100%;
    background-color: blanchedalmond;
    background-size: cover;
    position: fixed;
  }

  .login_container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 125px auto;
    width:400px;
    height: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;

  }

  .login_container .submit {
    width: 35%;
    border: 1px;
    margin-top: 20px;
  }

  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #494e8f;
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
</style>
