<template>
  <!-- 使用 ant design 的行列布局 -->
  <a-row class="min-h-screen">
    <!-- 左侧区域：词云区域，占 50% -->
    <a-col :span="12" class=" p-0 flex">
      <div class="word-cloud-container">
        <WordCloud :keywords="keywords" />
      </div>
    </a-col>

    <!-- 右侧区域：其他内容，占 50% -->
    <a-col :span="12" class="p-4">
      <Search />
    </a-col>
  </a-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import WordCloud from '/@/views/wordcloud/components/WordCloud.vue';
import Search from './components/Search.vue';
import { keywords } from '/@/data/index';

export default defineComponent({
  name: 'WordCloudPage',
  components: {
    WordCloud,
    Search,
  },
  setup() {
    return {
      keywords
    };
  }
});
</script>

<style scoped>
:deep(.ant-row) {
  background: linear-gradient(to top, #dfe9f3 0%, rgb(42, 3, 3) 100%) !important;
  min-height: 100vh;
}

.word-cloud-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center; 
}

/* 移除左侧内边距和滚动 */
.bg-gray-200 {
  display: flex;
  align-items: center; 
  justify-content: center; 
  overflow: hidden; /* 避免出现滚动条 */
}
</style>
