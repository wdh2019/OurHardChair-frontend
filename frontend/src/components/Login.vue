<template>
  <div>
    <transition name="el-zoom-in-center">
      <el-carousel indicator-position="inside" height="740px" v-show="show">
        <el-carousel-item v-for="(item,index) in imgUrls" :key="index">
          <div class="demo1">
            <p class="welcome">欢迎使用全新的会议系统</p>
            <img ref='img' :src="item.imageUrl" height="740px" width="100%"/>
            <p class="login" @click="show=!show" >加入我们</p>
          </div>
        </el-carousel-item>
      </el-carousel>
    </transition>
    <div id="base_login" v-if="!show">
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
                      auto-complete="off"
                      placeholder="密码">

            </el-input>
          </el-form-item>
          <!--登陆按钮-->
          <el-form-item style="width: 100%">
            <el-button type="success" round
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
        imgUrls: [],
        show: true,
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
    mounted() {
      this.getImages();
    },
    methods: {
      getImages() {
        this.getImgUrl().then(res => {
          this.imgUrls = res
        })
      },

      // 数据请求服务，一般是返回的一个promise对象，  是一个异步处理的解决方案，
      getImgUrl() {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const data = [];
            //遍历图片
            for (let index = 1; index < 5; index++) {
              const obj = {};
              //对图片名如果小于十就在前面加一个0
              obj.imageUrl = require(`../assets/background/${index}.jpg`)
              data.push(obj)
            }
            resolve(data);
            reject();
          }, 200);
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //this.$axios.post用来向后台请求数据
            this.$axios.post('/login', {
              username: this.ruleForm.username,
              password: this.ruleForm.password
            })
              .then(resp => {
                console.log(resp.data);
                if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
                  this.$store.commit('login', resp.data);
                  this.$router.replace({path: '/UserPage'});
                  //console.log(this.$store.state.country);
                } else {
                  alert(resp.data.message)
                }
              })
              .catch(error => {
                console.log(error);
                alert('登录失败')
              })
          }
        });
      }
    }
  }
</script>

<style scoped>
  .demo1 {
    position: relative;
  }

  .welcome {
    position: absolute;
    z-index: 10;
    left: 34%;
    top: 22%;
    font-size: 50px;
    color: white;
  }

  .login {
    position: absolute;
    z-index: 10;
    left: 47%;
    top: 45%;
    font-size: 25px;
    color: white;
    text-decoration: underline;
	cursor:pointer;
  }
  .login:hover{
    color: red;

  }
  #base_login {
    background: url("../assets/background/checkerboard-cross.png");
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }

  .login_container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 120px auto;
    width: 450px;
    height: 300px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;

  }

  .login_container .submit {
    width: 40%;
    border: none
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
    margin-top: 60px;
    font-size: 15px;
    margin-left: 300px;

  }
</style>
