<template>
  <div id="base_userinfo">

    <div class="userinfo_container">
      <h3 class="userinfo_title">用户信息</h3>
      <el-table class="userinfo_info" :data="userData" v-show="!form_visible">
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="password" label="密码"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="country" label="地区"></el-table-column>
        <el-table-column prop="company" label="所属单位"></el-table-column>
      </el-table>
      <el-button type="success" round @click="showChangeForm()" v-show="!form_visible">修改</el-button>

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px"
                label-position="left" v-show="form_visible">
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

        <el-form-item class="item">
          <el-button type="success" round @click="submitForm('ruleForm')" class="middle_button">提交修改</el-button>
          <el-button type='danger' round @click="resetForm('ruleForm')" class="middle_button">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default{
    name:"UserInfo",
    data(){
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
      return{
        form_visible:false,
        userData:[{
          username: '111',
          password: '111',
          email: '111',
          country: '111',
          company: '111',
        }],
        ruleForm:{
          username: '',
          password: '',
          ensure_password: '',
          email:'',
          country:'',
          company:'',
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
        },
        loading: false
      };
    },
    methods:{
      //用户信息从后端请求
      getUserInfo(){
        this.$axios.get('/UserInfo')
        .then(resp => {
          if(resp.status === 200){
            this.userData=res.body;
          }
          else{
            alert('请求失败！服务器状态码非200')
          }
        })
        .catch(error => {
          console.log(error);
          alert('请求用户数据时发生错误error')
        });
      },
      //修改信息的表单 显示方法
      showChangeForm(){
        this.form_visible=true;
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //this.$axios.post用来向后台发送数据
            this.$axios.post('/UserInfo', {
                username_changed: this.ruleForm.username,
                password_changed: this.ruleForm.password,
                email_changed: this.ruleForm.email,
                institution_changed: this.ruleForm.company,
                country_changed: this.ruleForm.country,
              }
            )
              .then(resp => {
                // 根据后端的返回数据修改
                alert(resp.data);
                //console.log(resp.data);
                if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
                  // 跳转到login
                  alert('修改成功');
                  // 修改成功后，修改表单隐藏
                  this.form_visible=false;
                  this.$router.replace('/UserPage')
                } else {
                  alert('修改失败,用户名重复')
                }
              })
              .catch(error => {
                console.log(error);
                alert('修改失败')
              })
          } else {
            alert('wrong submit！');
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    mounted:function(){
      this.form_visible=false;
      //this.getUserInfo();
    }

  }
</script>

<style scoped>
  #base_userinfo {
    background: url("../assets/background/checkerboard-cross.png") repeat;
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }

  .userinfo_container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 20px auto;
    width: 600px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    clear: left;
  }

  .userinfo_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #494e8f;
  }

  .userinfo_container .item {
    margin-bottom: 20px;
  }
</style>
