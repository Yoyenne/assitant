import { RouteRecordRaw } from 'vue-router';

const wordcloud: RouteRecordRaw = {
  path: '/wordcloud',
  name: 'WordCloud',
  meta: {
    title: '词云',
    icon: 'ant-design:cloud-outlined',
    sort: 2
  },
  component: () => import('/@/views/wordcloud/index.vue')
};

export default wordcloud;