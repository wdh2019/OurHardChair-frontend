<template>
  <div id="login">
    <div>
      <h3 class="login_title">登录</h3>
      <el-form :model="loginForm" :rules="rules" class="login_container" label-position="left"
               label-width="0px" v-loading="loading">
        <!--用户名-->
        <el-tooltip content="tishi">
          <el-form-item prop="username">
            <el-input type="text"
                      v-model="loginForm.username"
                      auto-complete="off"
                      placeholder="username"></el-input>
          </el-form-item>
        </el-tooltip>
        <!--密码-->
        <el-form-item prop="password">
          <el-input type="password"
                    v-model="loginForm.password"
                    auto-complete="off"
                    placeholder="password"></el-input>
        </el-form-item>
        <!--登陆按钮-->
        <el-form-item style="width: 100%">
          <el-button type="primary"
                     style="width: 40%;background: #afb4db;border: none"
                     v-on:click="login">login
          </el-button>
        </el-form-item>
        <!--转到注册-->
        <p>Not register yet?
          <router-link to="register">
            register
          </router-link>
        </p>

      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Login1"
  }
</script>

<style scoped>

</style>
