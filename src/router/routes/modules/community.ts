import { RouteRecordRaw } from 'vue-router';
import community from './community';

const community: RouteRecordRaw = {
  path: '/community',
  name: 'Community',
  meta: {
    title: '社区',
    icon: 'ant-design:login-outlined',
    sort: 1
  },
  component: () => import('/@/views/community/index.vue')
};

export default community;