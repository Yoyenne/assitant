import { RouteRecordRaw } from 'vue-router';
import mindfulness from './mindfulness';

const mindfulness: RouteRecordRaw = {
  path: '/mindfulness',
  name: 'Mindfulness',
  meta: {
    title: '正念',
    icon: 'ant-design:login-outlined',
    sort: 1
  },
  component: () => import('/@/views/mindfulness/index.vue')
};

export default mindfulness;