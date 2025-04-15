import { RouteRecordRaw } from 'vue-router';
import diary from './diary';

const diary: RouteRecordRaw = {
  path: '/diary',
  name: 'Diary',
  meta: {
    title: '日记',
    icon: 'ant-design:login-outlined',
    sort: 1
  },
  component: () => import('/@/views/diary/index.vue')
};

export default diary;