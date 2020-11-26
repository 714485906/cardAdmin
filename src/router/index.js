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
    path: '/404',
    component: () => import('@/views/404'),
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
    meta: { title: '系统管理', icon: 'el-icon-s-help' },
    affix: true,
    children: [
      {
        path: '/roleList',
        name: 'roleList',
        component: () => import('@/views/admin/admin-roleList'),
        meta: { title: '角色列表', icon: 'table' }
      },
      {
        path: '/userList',
        name: 'userList',
        component: () => import('@/views/admin/admin-userList'),
        meta: { title: '用户列表', icon: 'tree' }
      },
      {
        path: '/Group',
        name: 'Group',
        component: () => import('@/views/admin/admin-Group'),
        meta: { title: '用户组', icon: 'people' }
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
        path: '/platform',
        name: 'platform',
        component: () => import('@/views/platform/platform-List'),
        meta: { title: '投放平台', icon: 'el-icon-share' }
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
        meta: { title: '商品列表', icon: 'el-icon-attract' }
      },
      {
        path: '/productTemp',
        name: 'productTemp',
        component: () => import('@/views/product/productTemp-list'),
        meta: { title: '商品模板列表', icon: 'el-icon-tickets' }
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
      }
    ]
  },
  {
    path: '/apply',
    component: Layout,
    name: 'apply',
    meta: { title: '表单申请服务', icon: 'el-icon-receiving' },
    alwaysShow: true,
    children: [
      {
        path: '/applyList',
        name: 'applyList',
        component: () => import('@/views/apply/apply-list'),
        meta: { title: '表单列表', icon: 'el-icon-coin' }
      }
    ]
  },
  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       name: 'Menu2',
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
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
