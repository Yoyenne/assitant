<template>
  <!-- 使用 ant design 的行列布局 -->
  <a-row class="min-h-screen gradient-background">
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
.word-cloud-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center; 
}

.gradient-background {
  background-image: linear-gradient(to bottom, #d5e3ff 0%, #e8f2ff 60%, #f5f9ff 100%);
}
</style>
