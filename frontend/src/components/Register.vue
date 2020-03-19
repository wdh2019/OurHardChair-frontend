<template>
  <div id="base_register">

    <el-form :model="registerForm" :rules="rules" class="register_container" label-position="left"
             label-width="0px" v-loading="loading" :ref="registerForm">
      <!--标题-->
      <h3 class="register_title">Register</h3>
      <!--用户名-->
      <el-form-item prop="username">
      <el-input type="text" v-model="registerForm.username"
                  auto-complete="off" placeholder="username"></el-input>
      </el-form-item>
      <!--密码-->
      <el-form-item prop="password">
        <el-input type="password" v-model="registerForm.password"
                  auto-complete="off" placeholder="password"></el-input>
      </el-form-item>
      <!--邮箱-->
      <el-form-item prop="email">
        <el-input type="text" v-model="registerForm.email"
                  auto-complete="off" placeholder="email"></el-input>
      </el-form-item>
      <!--所属单位-->
      <el-form-item prop="company">
        <el-input type="text" v-model="registerForm.company"
                  auto-complete="off" placeholder="company"></el-input>
      </el-form-item>
      <!--所在区域-->
      <el-form-item prop="country">
        <el-input type="text" v-model="registerForm.country"
                  auto-complete="off" placeholder="country"></el-input>
      </el-form-item>
      <!--用户类型（admin,contributor或reviewer)-->
      <el-form-item prop="usertype">
        <el-radio-group v-model="registerForm.usertype" @change="userTypeChange">
          <el-radio label="Admin" border>Admin</el-radio>
          <el-radio label="Contributor" border>Contributor</el-radio>
          <el-radio label="Reviewer" border>Reviewer</el-radio>
        </el-radio-group>
      </el-form-item>
      <!--提交按钮-->
      <el-form-item style="width: 100%">
        <el-button type="primary"
                   style="width: 40%;background: #afb4db;border: none"
                   v-on:click="register">register</el-button>
      </el-form-item>
      <!--转到登陆-->
      <p>I have already got an account.
      <router-link to="/">
      login
      </router-link>
      </p>

    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Register',
//data
  data () {
    const dataValid = (rule, value, callback) => {
      //未填写信息的处理
      if(!value || value === '') {
        return callback(new Error('Can\'t be empty'))
      }
      return callback()
    }
    const emailValid=(rule, value, callback) =>{
      //邮箱格式检查
      var regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if(!regEmail.test(value)){
        return callback(new Error('email filled in a wrong form!'))
      }
      return callback()
    }
    return {
      registerForm: {
        username: '',
        password: '',
        email: '',
        company:'',
        country:'',
        usertype: ''
      },
      rules: {
        // blur 失去鼠标焦点时触发验证
        username: [{required: true, message: '', trigger: 'blur'}, {validator: dataValid, trigger: 'blur'}],
        password: [{required: true, message: '', trigger: 'blur'}, {validator: dataValid, trigger: 'blur'}],
        email:    [{required: true, message: '', trigger: 'blur'}, {validator: emailValid, message:'email filled in a wrong form!',trigger: 'blur'}],
        company:  [{required: true, message: '', trigger: 'blur'}, {validator: dataValid, trigger: 'blur'}],
        country: [{required: true, message: '', trigger: 'blur'}, {validator: dataValid, trigger: 'blur'}],
        usertype: [{required: true, message: '', trigger: 'blur'}, {validator: dataValid, trigger: 'blur'}]
      },
      loading: false
    }
  },
  //methods包括了所有的functions
  methods: {
    userTypeChange() {    },
    //表单验证
    register (formName) {
      this.$refs[formName].validate(valid => {
        if(valid){
          //this.$axios.post用来向后台请求数据
          this.$axios.post('/register', {
              username: this.registerForm.username,
              password: this.registerForm.password,
              email: this.registerForm.email,
              company: this.registerForm.company,
              country:this.registerForm.country,
              authorities: [this.registerForm.usertype]
            }
          )
            .then(resp => {
              // 根据后端的返回数据修改
              if(resp.status === 200 && resp.data.hasOwnProperty("id")) {
                // 跳转到login
                alert('register successfully！')
                this.$router.replace('/login')
              } else{
                alert('register error！')
              }
            })
            .catch(error => {
              console.log(error)
              alert('register error！')
            })
        } else {
          alert('wrong submit！')
        }
      })
    }
  }
}
</script>

<style scoped>
  #base_register{
    background: url("../assets/background/checkerboard-cross.png") repeat;
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }
  .register_container{
    border-radius: 15px;
    background-clip: padding-box;
    margin: 90px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .register_title{
    margin: 0px auto 40px auto;
    text-align: center;
    color: #494e8f;
  }
  .el-form-item{
    margin-bottom: 10px;
  }
</style>
