import { RouteRecordRaw } from 'vue-router';

const question: RouteRecordRaw = {
  path: '/question',
  name: 'Question',
  meta: {
    title: '问卷',
    icon: 'ant-design:login-outlined',
    sort: 1
  },
  component: () => import('/@/views/question/index.vue')
};

export default question;