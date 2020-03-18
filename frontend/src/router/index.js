import Vue from 'vue'
import Router from 'vue-router'
import MeetingApply from '@/components/MeetingApply'
import Login from '@/components/Login'
import Register from '@/components/Register'
import store from '../store'

Vue.use(Router)

export const router = new Router({
  //通过路由转到的页面
  routes: [
    {
      path: '/',
      name: 'MeetingApply',
      component: MeetingApply,
      /*meta: {
        requireAuth: true // 需要登录权限
      }*/
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    }
  ]
})

// 前端登录拦截
router.beforeEach(function (to, from ,next) {
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (store.state.token) {
      next()
    } else {
      next({
        path: '/login',
        query: {redirect: to.fullPath} // 登录成功之后重新跳转到该路由
      })
    }
  } else {
    next()
  }
})
