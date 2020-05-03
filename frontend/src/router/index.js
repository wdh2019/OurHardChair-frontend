import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import HomePage from '../components/HomePage'
import Login from '@/components/Login'
import Register from '@/components/Register'
import UserPage from '@/components/UserPage'
import ApplyConference from '@/components/ApplyConference'
import AllConferences from "../components/AllConferences"
import ConferenceForChair from "../components/ConferenceForChair"
import ConferenceForPCmember from "../components/ConferenceForPCmember"
import ConferenceForAuthor from "../components/ConferenceForAuthor"
import NewsCenter from "../components/NewsCenter"
import InvitePCmember from "../components/InvitePCMember"
import CheckPapers from "../components/CheckPapers"
import SubmitPapers from "../components/SubmitPapers"
import ApproveConference from "../components/ApproveConference"
import UserInfo from "../components/UserInfo"
import ViewSubmissionTRecord from "../components/ViewSubmissionRecord"


Vue.use(Router);

//解决路由跳转相同地址时报错
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

export const router = new Router({
  //通过路由转到的页面
  routes: [
    {
      path: '/UserPage',
      name: '操作中心',
      component: UserPage,
      redirect: '/UserInfo',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      children: [
        {
          path: '/ApplyConference',
          name: '会议申请',
          component: ApplyConference,
        },
        // {
        //   path: '/AllConferences',
        //   name: '我要投稿',
        //   component: AllConferences,
        // },
      ]
    },

    {
      path: '/UserPage',
      name: '会议总览',
      component: UserPage,
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      children: [{
        path: "/AllConferences",
        name: '所有会议',
        component: AllConferences,
      }]
    },

    {
      path: '/UserPage',
      name: '我的会议',
      component: UserPage,
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      children: [
        {
          path: '/ConferenceForChair',
          name: '作为Chair的会议',
          component: ConferenceForChair,
        },
        {
          path: '/ConferenceForPCmember',
          name: '作为PCMember的会议',
          component: ConferenceForPCmember,
        },
        {
          path: '/ConferenceForAuthor',
          name: '作为author的会议',
          component: ConferenceForAuthor,
        },
      ]
    },
    {
      path: '/UserPage',
      name: '操作中心之管理员特权',
      component: UserPage,
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      children: [{
        path: '/ApproveConference',
        name: '审批会议',
        component: ApproveConference,
      }],
    },
    {
      path: '/UserPage',
      name: '设置',
      component: UserPage,
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      children: [{
        path: '/UserInfo',
        name: '用户信息',
        component: UserInfo,
      }]
    },
    {
      path: '/UserPage',
      name: '最新消息',
      component: UserPage,
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      children: [{
        path: '/NewsCenter',
        name: '通知中心',
        component: NewsCenter,
      }]
    },
    {
      path: '/UserPage',
      name: '其他功能',
      component: UserPage,
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      children: [
        {
          //邀请PCMember
          path: '/InvitePCMember',
          name: '/InvitePCMember',
          component: InvitePCmember,
        },
        {
          //审稿
          path: '/CheckPapers',
          name: '/CheckPapers',
          component: CheckPapers,
        },
        {
          //投稿
          path: '/SubmitPapers',
          //path: '/SubmitPapers/:row',
          name: '/SubmitPapers',
          component: SubmitPapers,
        },
        {
          path: '/ViewSubmissionRecord',
          //path: '/SubmitPapers/:row',
          name: '/ViewSubmissionRecord',
          component: ViewSubmissionTRecord,
        }
      ]
    },

    {
      path: '/',
      name: 'HomePage',
      component: HomePage
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
    },
    {
      path:"/test",
      name:"test",
      component:Test,
    },
  ]
})

// 前端登录拦截
router.beforeEach(function (to, from, next) {
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (store.state.token) {
      next();
    } else {
      next({
        path: '/login',
        query: {redirect: to.fullPath} // 登录成功之后重新跳转到该路由
      });
    }
  } else {
    next()
  }
  if(from.fullPath === "/"&&to.fullPath === "/login"|| to.fullPath === '/register') {
    if(localStorage.getItem('token')){
      store.commit('logout');
    }
  }
  if (to.fullPath ==="/" ||to.fullPath === "/login" || to.fullPath === '/register') {
    if (localStorage.getItem('token')) {
      next({
        path: from.fullPath
      });
    } else {
      next();
    }
  }
  if (localStorage.username !== 'admin') {
    if (to.fullPath === "/ApproveConference") {
      next({
        path: from.fullPath
      });
    } else {
      next();
    }
  }
  if (localStorage.username === "admin") {
    if (to.fullPath === "/ApproveConference" || to.fullPath === "/UserInfo" || to.fullPath==="/UserPage") {
      next()
    } else {
      next({
        path: from.fullPath
      });
    }
  }
  // if(to.fullPath==="/ApproveConference"){
  //   if(localStorage.username!=='admin'){
  //     next({
  //       path:from.fullPath
  //     })
  //   }else{
  //     next();
  //   }
  // }
});
