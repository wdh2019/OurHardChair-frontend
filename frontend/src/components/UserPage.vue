<template>
  <!--用户信息框-->
  <div>
    <header>
        <div class="nav_functions"><router-link to="/ApplyConference" class="router_link_active">
         会议申请
        </router-link>
        </div>
        <div class="nav_user">欢迎！{{info.username}}</div>
        <div class="nav_logout"><router-link to="/" class="router_link_active">登出</router-link></div>
    </header>
    <div class="userinfo">
      <ul>
        <h3>个人信息</h3>
        <dl>用户名: {{info.username}}</dl>
        <dl>密码:{{info.password}}</dl>
        <dl>邮箱:{{info.email}}</dl>
        <dl>单位:{{info.company}}</dl>
        <dl>区域地区:{{info.country}}</dl>
      </ul>
    </div>
    <div class="functions">
      <div class="funtion_header">
        代办会议
      </div>
      <div>

      </div>
    </div>
  </div>
</template>

<script>
  export default{
    name:'UserPage',
    data(){
      return{
        //用户信息
        info:{
          username:"xiaoming",
          password:"xiaoming666",
          email:"1830000000@fudan.edu.cn",
          company:"Fudan University",
          country:"China"
        },
      }
    }
  }
</script>

<style>
  header{
    postion:relative;
    color:white;
    width: 100%;
    height:20px;
    padding-right: 5pt;
    background-clip: padding-box;
    margin-top:10px;
    padding: 15px 15px 15px 15px;
    background: #000088;
    border: 1px solid #eaeaea;
  }
  header div{
    display: inline-flex;
  }
  .nav_functions{
    position:absolute;
    left:100px;
  }
  .nav_user{
    position:absolute;
    right:100px;
  }
  .nav_logout{
    position:absolute;
    right:20px;
  }
  .functions{
    float:left;
    clear:right;
    width:25%;
    height:250px;
    background-clip: padding-box;
    margin:10px 0 0 100px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .functions .funtion_header{
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    font-weight: bold;
    padding:5px 0 5px 0;
    height: 25px;
    color:black;
    background:	#F0F0F0;
    border: 1px solid #eaeaea;
  }
  .userinfo{
    float: left;
    text-align: left;
    border-radius: 15px;
    background-clip: padding-box;
    width: 20%;
    padding: 15px 15px 15px 15px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    word-wrap: break-word;
  }
  .userinfo ul{
    padding:0;
  }

  .userinfo h3{
    text-align: center;
  }
  .router_link_active{
    text-decoration: none;
    color: white;

  }
  .router_link_active:hover{
    color: #ff5a60;
  }
</style>
