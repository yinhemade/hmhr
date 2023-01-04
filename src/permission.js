import router from '@/router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import store from '@/store'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/404'] // 无需登录就可以跳转的地址---白名单

// 前置路由守卫
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  const token = store.getters.token
  if (token) {
    // 登录了
    if (to.path === '/login') {
      next('/')
      NProgress.done()
    } else {
      next()
      if (!store.getters.name) {
        store.dispatch('user/getUserInfo')
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})
// 后置路由守卫
router.afterEach((to) => {
  document.title = getPageTitle(to.meta.title)
  // finish progress bar
  NProgress.done()
})
