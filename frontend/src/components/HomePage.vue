<template>
  <div>
    <transition name="el-zoom-in-center">
      <el-carousel indicator-position="inside" height="940px">
        <el-carousel-item v-for="(item,index) in imgUrls" :key="index">
          <div class="demo1">
            <p class="welcome logo">Gysw.co</p>
            <div class="welcome">
            <p class="welcome1">欢迎使用</p>
            <p class="welcome2">Gysw 会议系统</p></div>
            <img ref='img' :src="item.imageUrl" height="100%" width="100%">
            <router-link to="/login" class="button login">
              加入我们
            </router-link>
          </div>
        </el-carousel-item>
      </el-carousel>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'HomePage',
    data() {
      return{
        imgUrls: [],
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
    }
  }
</script>

<style scoped>
  p{
    cursor: default;
    font-family:Brutal, sans-serif,arial;
  }
  .demo1 {
    position: relative;
  }
  .welcome{
    position: absolute;
    z-index: 10;
    left: 41.3%;
    top:  18%;
    font-size: 50px;
    color: white;

  }
  .logo{
    top: -2%;
    left: 2%;
    font-size: 32px;
  }
  .welcome1{
    margin-bottom: 20px;
  }
  .welcome2{
    margin-top: 0;
  }
  .button{
    padding: 0.75em 2em;
    border-radius: 2em;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid white;
    text-decoration: none;
  }
  .login {
    position: absolute;
    z-index: 10;
    left: 45.7%;
    top: 55%;
    font-size: 1.3em;
    font-weight: 600;
    background-color: transparent;
    color: white;
    cursor: pointer;
  }

  .login:hover {
    opacity: 0.6;
  }
</style>
