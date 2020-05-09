<template>
    <transition name="el-zoom-in-center">
      <el-carousel indicator-position="inside" :height="height" :width="width">
        <el-carousel-item v-for="(item,index) in imgUrls" :key="index">
          <div class="demo1">
            <p class="logo">Gysw.co</p>
            <div class="welcome">
              <p class="welcome1">欢迎使用</p>
              <p class="welcome2">Gysw 会议系统</p></div>
            <img class="img" ref='img' :src="item.imageUrl">
            <router-link to="/login" class="button login">
              加入我们
            </router-link>
          </div>
        </el-carousel-item>
      </el-carousel>
    </transition>
</template>

<script>
  export default {
    name: 'HomePage',
    data() {
      return {
        imgUrls: [],
        height:'',
        width:'',
      }

    },
    created() {
      this.height=window.innerHeight+"px";
      this.width=window.innerWidth+"px";
    },
    mounted() {
      this.getImages();
      window.addEventListener("resize",()=>{
        this.setSize();
      });
    },
	destroyed() {
	  window.removeEventListener('resize');
	},
    methods: {
      setSize(){
        this.height=window.innerHeight+"px";
        this.width=window.innerWidth+"px";
      },
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
    },
  }
</script>

<style scoped>
  p {
    cursor: default;
    font-family: Brutal, sans-serif, arial;
  }

  .demo1 {
    position: relative;
  }

  .logo {
    position: absolute;
    z-index: 10;
    color: white;
    top: -2%;
    left: 2%;
    font-size: 32px;
  }

  .welcome {
    position: absolute;
    z-index: 10;
    left: 40.8%;
    top: 12%;
    font-size: 50px;
    color: white;
  }

  .welcome1 {
    margin-bottom: 20px;
  }

  .welcome2 {
    margin-top: 0;
  }

  .button {
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
    left: 45.5%;
    top: 50%;
    font-size: 1.3em;
    font-weight: 600;
    background-color: transparent;
    color: white;
    cursor: pointer;
  }

  .login:hover {
    opacity: 0.6;
  }

  .img{
    width:100%;
    height:100%;
    max-width: 100%;
    max-height: 100%;
  }
  .el-icon-arrow-left,.el-icon-arrow-right{
    width:200px;
    height:200px;
  }
</style>
