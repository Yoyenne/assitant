<template>
  <!-- 使用 ant design 的行列布局 -->
  <a-row class="min-h-screen">
    <!-- 左侧区域：词云区域，占 50% -->
    <a-col :span="12" class="bg-gray-200 p-0 flex">
      <div class="word-cloud-container">
        <WordCloud :keywords="keywords" />
      </div>
    </a-col>

    <!-- 右侧区域：其他内容，占 50% -->
    <a-col :span="12" class="p-4">
      <h1 class="text-2xl font-bold mb-4">词云页面</h1>
      <p>
        这里是右侧内容区域，可以根据需要添加更多信息。此布局在大屏和小屏下均能自适应。
      </p>
    </a-col>
  </a-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import WordCloud from '/@/views/wordcloud/components/WordCloud.vue';
import { keywords } from '/@/data/index';

export default defineComponent({
  name: 'WordCloudPage',
  components: {
    WordCloud
  },
  setup() {
    return {
      keywords
    };
  }
});
</script>

<style scoped>
/* 左侧容器样式，确保填满父级 */
.word-cloud-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 垂直居中 */
  align-items: center; /* 水平居中 */
}

/* 移除左侧内边距和滚动 */
.bg-gray-200 {
  display: flex;
  align-items: center; 
  justify-content: center; 
  overflow: hidden; /* 避免出现滚动条 */
}
</style>
