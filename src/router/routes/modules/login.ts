import { RouteRecordRaw } from 'vue-router';

const login: RouteRecordRaw = {
  path: '/login',
  name: 'Login',
  meta: {
    title: '登录',
    icon: 'ant-design:login-outlined',
    sort: 1
  },
  component: () => import('/@/views/login/index.vue')
};

export default login;
