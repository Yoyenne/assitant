import { RouteRecordRaw } from 'vue-router';

const music: RouteRecordRaw = {
  path: '/music',
  name: 'Music',
  meta: {
    title: '音乐',
    icon: 'ant-design:login-outlined',
    sort: 1
  },
  component: () => import('/@/views/music/index.vue')
};

export default music;