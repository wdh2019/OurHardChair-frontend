import Vue from 'vue'
import Router from 'vue-router'
import UserPage from '@/components/UserPage'
import ApplyConference from '@/components/ApplyConference'
import Login from '@/components/Login'
import Register from '@/components/Register'
import store from '../store'
import PageOne from "../components/PageOne"
import PageTwo from "../components/PageTwo"
import PageThree from "../components/PageThree"
import InfoPage from "../components/InfoPage"

Vue.use(Router)

export const router = new Router({
  //通过路由转到的页面
  routes: [
	  {
	    path: '/UserPage',
	    name: '操作中心',
	    component: UserPage,
      redirect:'/ApplyConference',
      meta:{
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      children:[{
        path: '/ApplyConference',
        name: '会议申请',
        component: ApplyConference,
      }]
	  },
    {
      path: '/UserPage1',
      name: '我的工作台',
      component: UserPage,
      children:[{
        path: '/PageOne',
        name: '选项一',
        component: PageOne,
      },{
        path: '/PageTwo',
        name: '选项二',
        component: PageTwo,
      },{
        path: '/PageThree',
        name: '选项三',
        component: PageThree,
      }]
    },
    {
      path: '/UserPage2',
      name: '消息中心',
      component: UserPage,
      children:[{
        path: '/InfoPage',
        name: '待处理会议',
        component: InfoPage,
      }]
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
  if(to.fullPath == "/"){
    if(localStorage.getItem('token')){
      next({
        path:from.fullPath
      });
    }else {
      next();
    }
  }
})
