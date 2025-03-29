import { RouteRecordRaw } from 'vue-router';

const test: RouteRecordRaw = {
  path: '/test',
  name: 'Test',
  component: () => import('/@/views/Test.vue')
};

export default test;