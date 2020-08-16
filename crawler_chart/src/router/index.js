import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    // 初始
    path: '/',
    redirect: '/Show',
  },
  {
    // show
    path: '/show',
    name: 'show',
    component: () => import('../views/Show'),
    meta: {
      title: '数据展示',
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

/**
 * 导航守卫
 * 全局前置守卫，判断用户是否为登录状态
 */
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router;
