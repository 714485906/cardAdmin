import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '联露后台管理系统', icon: 'dashboard' }
    }]
  },
  {
    path: '/admin',
    component: Layout,
    name: 'Admin',
    meta: {
      title: '系统管理',
      icon: 'el-icon-s-help'
    },

    affix: true,
    children: [
      {
        path: '/roleList',
        name: 'roleList',
        component: () => import('@/views/admin/admin-roleList'),
        meta: {
          title: '角色列表',
          icon: 'table'
        }
      },
      {
        path: '/Group',
        name: 'Group',
        component: () => import('@/views/admin/admin-Group'),
        meta: {
          title: '营销组',
          icon: 'people'
        }
      },
      {
        path: '/userList',
        name: 'userList',
        component: () => import('@/views/admin/admin-userList'),
        meta: { title: '营销员', icon: 'tree' }
      },
      {
        path: '/Grouplist/:groupId(\\d+)',
        name: 'Grouplist',
        component: () => import('@/views/admin/Group-list'),
        meta: { title: '营销组详情', icon: 'people' },
        hidden: true
      }
    ]
  },
  {
    path: '/Channel',
    component: Layout,
    name: 'Channel',
    meta: { title: '渠道管理', icon: 'el-icon-s-unfold' },
    children: [
      {
        path: '/platform',
        name: 'platform',
        component: () => import('@/views/platform/platform-List'),
        meta: { title: '投放平台', icon: 'el-icon-share' }
      },
      {
        path: '/channelList',
        name: 'channelList',
        component: () => import('@/views/channel/channel-List'),
        meta: { title: '渠道列表', icon: 'el-icon-attract' }
      },
      {
        path: '/channelAccount/:channelId(\\d+)',
        name: 'channelAccount',
        component: () => import('@/views/channel/channel-account'),
        meta: { title: '渠道账号列表', icon: 'tree' },
        hidden: true
      },
      {
        path: '/recharge',
        name: 'recharge',
        component: () => import('@/views/recharge/recharge-list'),
        meta: { title: '账号充值', icon: 'tree' },
        hidden: true
      }

    ]
  }, {
    path: '/operator',
    component: Layout,
    name: 'operator',
    meta: { title: '运营商管理', icon: 'el-icon-phone-outline' },
    alwaysShow: true,
    children: [
      {
        path: '/operatorTab',
        name: 'operatorTab',
        component: () => import('@/views/operator/index'),
        meta: { title: '运营商列表', icon: 'el-icon-s-operation' }
      },
      {
        path: '/getTouches/:operatorId(\\d+)',
        name: 'getTouches',
        component: () => import('@/views/operator/getTouches-list'),
        meta: { title: '触点码列表', icon: 'table' },
        hidden: true
      }
    ]
  }, {
    path: '/product',
    component: Layout,
    name: 'product',
    meta: { title: '商品管理', icon: 'el-icon-s-shop' },
    alwaysShow: true,
    children: [
      {
        path: '/productlist',
        name: 'productlist',
        component: () => import('@/views/product/product-list'),
        meta: { title: '商品列表', icon: 'el-icon-attract' },
      },
      {
        path: '/productTemp',
        name: 'productTemp',
        component: () => import('@/views/product/productTemp-list'),
        meta: { title: '商品模板列表', icon: 'el-icon-tickets' }
      },
      {
        path: '/mallsDetail',
        name: 'mallsDetail',
        component: () => import('@/views/product/mallsDetail'),
        meta: { title: '商品模板详情', icon: 'el-icon-tickets' },
        hidden: true
      }

    ]
  },
  {
    path: '/landing',
    component: Layout,
    name: 'landing',
    meta: { title: '落地页', icon: 'el-icon-receiving' },
    alwaysShow: true,
    children: [
      {
        path: '/landinglist',
        name: 'landinglist',
        component: () => import('@/views/landing/landing-list'),
        meta: { title: '落地页列表', icon: 'el-icon-coin' }
      },
      {
        path: '/landingEdit',
        name: 'landingEdit',
        component: () => import('@/views/landing/landing-edit'),
        meta: { title: '编辑落地页信息', icon: 'el-icon-coin' },
        hidden: true
      }
    ]
  },
  {
    path: '/apply',
    component: Layout,
    name: 'apply',
    meta: { title: '表单管理', icon: 'el-icon-receiving' },
    alwaysShow: true,
    children: [
      {
        path: '/applyLiStselection',
        name: 'applyLiStselection',
        component: () => import('@/views/apply/apply-list-selection'),
        meta: { title: '选号列表(自动)', icon: 'el-icon-coin' }
      },
      {
        path: '/applyListNoSelection',
        name: 'applyListNoSelection',
        component: () => import('@/views/apply/apply-list-NoSelection'),
        meta: { title: '非选号列表(手动)', icon: 'el-icon-coin' }
      },
      {
        path: '/packageList',
        name: 'packageList',
        component: () => import('@/views/package/package-list'),
        meta: { title: '打包列表', icon: 'el-icon-coin' }
      },
      {
        path: '/packageSelection/:packageId(\\d+)',
        name: 'packageSelection',
        component: () => import('@/views/package/package-list-Selection'),
        meta: { title: '打包详情', icon: 'el-icon-coin' },
        hidden: true
      },
    ]
  },
  {
    path: '/order',
    component: Layout,
    name: 'order',
    meta: { title: '订单服务', icon: 'el-icon-receiving' },
    alwaysShow: true,
    children: [
      {
        path: '/orderList',
        name: 'orderList',
        component: () => import('@/views/order/index'),
        meta: { title: '订单列表', icon: 'el-icon-coin' }
      },
      {
        path: '/orderListErr',
        name: 'orderListErr',
        component: () => import('@/views/order/index'),
        meta: { title: '异常订单', icon: 'el-icon-coin' }
      }
    ]
  },
  {
    path: '/statistics',
    component: Layout,
    name: 'statistics',
    meta: { title: '统计服务', icon: 'el-icon-receiving' },
    alwaysShow: true,
    children: [
      {
        path: '/costList',
        name: 'costList',
        component: () => import('@/views/statistics/costList-List'),
        meta: { title: '投放成本', icon: 'el-icon-coin' }
      },
      {
        path: '/costCountList',
        name: 'costCountList',
        component: () => import('@/views/statistics/costCount-List'),
        meta: { title: '投放统计', icon: 'el-icon-coin' }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 404 page must be placed at the end !!!
 { path: '*', redirect: '/404', hidden: true }
]


/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

]


const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
