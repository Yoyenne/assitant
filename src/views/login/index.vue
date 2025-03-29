<template>
  <div class="body">
    <div class="main">
      <LoginSigin_in />
      <LoginSign_up />
      <LoginSwitch />
    </div>
    <!-- 气泡元素 -->
    <div
      class="emotion-bubble"
      v-for="(image, index) in bubbleImages"
      :key="index"
      :style="{ backgroundImage: `url(${image})` }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import gsap from 'gsap';
import LoginSigin_in from './components/sign_in.vue';
import LoginSign_up from './components/sign_up.vue';
import LoginSwitch from './components/switch.vue';

// 气泡图片数组
const bubbleImages = [
  new URL('@/assets/images/smile.png', import.meta.url).href,
  new URL('@/assets/images/shock.png', import.meta.url).href,
  new URL('@/assets/images/cry.png', import.meta.url).href,
  new URL('@/assets/images/wink.png', import.meta.url).href,
  new URL('@/assets/images/angry.png', import.meta.url).href,
];

// 气泡动画逻辑
onMounted(() => {
  const bubbles = document.querySelectorAll('.emotion-bubble');

  // 设置气泡的初始位置和动画
  bubbles.forEach(bubble => {
    const scale = gsap.utils.random(0.6, 1.2);
    const startX = gsap.utils.random(0, window.innerWidth); // 限制在页面宽度范围内
    const startY = gsap.utils.random(0, window.innerHeight); // 限制在页面高度范围内

    // 设置初始位置、大小和透明度
    gsap.set(bubble, {
      scale: scale,
      x: startX,
      y: startY,
      opacity: gsap.utils.random(0.7, 1),
    });

    // 浮动动画
    gsap.to(bubble, {
      y: "-=" + gsap.utils.random(50, 120),
      x: "+=" + gsap.utils.random(-100, 100),
      rotation: gsap.utils.random(-10, 10),
      scale: scale * gsap.utils.random(0.95, 1.05),
      duration: gsap.utils.random(15, 25),
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  });
});
</script>

<style scoped>
/* 全局样式重置 */
*,
*::after,
*::before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  user-select: none;
}

/* 页面主体样式 */
.body {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  background-color: #ecf0f3;
  color: #a0a5a8;
  position: relative;
  overflow: hidden; /* 防止气泡溢出 */
}

/* 主内容区域样式 */
.main {
  position: relative;
  width: 1000px;
  min-width: 1000px;
  min-height: 600px;
  height: 600px;
  padding: 25px;
  background-color: #ecf0f3;
  box-shadow:
    10px 10px 10px #d1d9e6,
    -10px -10px 10px #f9f9f9;
  border-radius: 20px;
  overflow: hidden;
}

@media (max-width: 1200px) {
  .main {
    transform: scale(0.7);
  }
}

@media (max-width: 1000px) {
  .main {
    transform: scale(0.6);
  }
}

@media (max-width: 800px) {
  .main {
    transform: scale(0.5);
  }
}

@media (max-width: 600px) {
  .main {
    transform: scale(0.4);
  }
}

/* 气泡样式 */
.emotion-bubble {
  position: absolute;
  width: 50px;
  height: 50px;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  pointer-events: none; /* 防止气泡干扰用户操作 */
}
</style>
