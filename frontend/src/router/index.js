import Vue from 'vue'
import Router from 'vue-router'
import UserPage from '@/components/UserPage'
import ApplyConference from '@/components/ApplyConference'
import Login from '@/components/Login'
import Register from '@/components/Register'
import store from '../store'

Vue.use(Router)

export const router = new Router({
  //通过路由转到的页面
  routes: [
	  {
	    path: '/UserPage',
	    name: 'UserPage',
	    component: UserPage,
		/*meta: {
		  requireAuth: true // 需要登录权限
		}*/
	  },
    {
      path: '/ApplyConference',
      name: 'ApplyConference',
      component: ApplyConference,
      /*meta: {
        requireAuth: true // 需要登录权限
      }*/
    },
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register

    },
  ]
})

// 前端登录拦截
router.beforeEach(function (to, from ,next) {
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (store.state.token) {
      next()
    } else {
      next({
        path: '/',
        query: {redirect: to.fullPath} // 登录成功之后重新跳转到该路由
      })
    }
  } else {
    next()
  }
})
