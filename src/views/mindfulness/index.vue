<template>
    <!-- 使用 MainLayout 作为页面的布局 -->
    <main-layout page-title="正念辅助">
      <div class="mindfulness-container">
        <div class="mood-selection">
          <h2>请选择你当前的心情</h2>
          <div class="mood-options">
            <div 
              v-for="mood in moods" 
              :key="mood.id"
              class="mood-option"
              :class="{ 'selected': selectedMood === mood.id }"
              @click="selectMood(mood.id)"
            >
              <div class="emoji">{{ mood.emoji }}</div>
              <div class="label">{{ mood.label }}</div>
            </div>
          </div>
        </div>
  
        <div v-if="selectedMood" class="meditation-section">
          <div class="recommendation">
            <h3>为你推荐</h3>
            <p>{{ currentMood.recommendation }}</p>
          </div>
  
          <div class="meditation-options">
            <div 
              v-for="(option, index) in meditationOptions" 
              :key="index"
              class="meditation-option"
              @click="playMeditation(option)"
            >
              <div class="icon">
                <span v-if="!option.playing">▶️</span>
                <span v-else>⏸️</span>
              </div>
              <div class="info">
                <h4>{{ option.title }}</h4>
                <p>{{ option.description }}</p>
                <div class="duration">{{ option.duration }}</div>
              </div>
            </div>
          </div>
        </div>
  
        <div v-if="currentlyPlaying" class="player-overlay" @click.self="stopPlaying">
          <div class="player-container">
            <div class="player-header">
              <h3>{{ currentlyPlaying.title }}</h3>
              <button @click="stopPlaying">✕</button>
            </div>
            <div class="player-content">
              <div class="play-button" @click="togglePlay">
                {{ isPlaying ? '⏸️' : '▶️' }}
              </div>
              <div class="progress-bar">
                <div 
                  class="progress" 
                  :style="{ width: progress + '%' }"
                ></div>
              </div>
              <div class="time-display">
                {{ formatTime(currentTime) }} / {{ formatTime(currentlyPlaying.durationInSeconds) }}
              </div>
            </div>
            <div class="player-description">
              <p>{{ currentlyPlaying.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </main-layout>
  </template>
  
  <script>
  import MainLayout from '@/layouts/MainLayout.vue';
  import { ref, computed } from 'vue';
  
  export default {
    name: 'MindfulnessPage',
    components: {
      MainLayout
    },
    setup() {
      // 心情选项
      const moods = ref([
        { 
          id: 'stressed', 
          emoji: '😫', 
          label: '压力大', 
          recommendation: '深呼吸练习可以帮助你缓解压力，平静心情。' 
        },
        { 
          id: 'anxious', 
          emoji: '😰', 
          label: '焦虑', 
          recommendation: '身体扫描冥想可以帮助你放松身心，减轻焦虑感。' 
        },
        { 
          id: 'sad', 
          emoji: '😔', 
          label: '悲伤', 
          recommendation: '慈心冥想可以培养自我同情和积极情绪。' 
        },
        { 
          id: 'angry', 
          emoji: '😠', 
          label: '愤怒', 
          recommendation: '观察呼吸可以帮助你冷静下来，不被情绪左右。' 
        },
        { 
          id: 'tired', 
          emoji: '😴', 
          label: '疲惫', 
          recommendation: '短时间的小憩冥想可以帮助你恢复精力。' 
        },
        { 
          id: 'neutral', 
          emoji: '😐', 
          label: '平静', 
          recommendation: '正念冥想可以帮助你保持当下的觉知。' 
        }
      ]);
  
      // 冥想选项数据
      const meditationData = {
        stressed: [
          { 
            title: '深呼吸练习', 
            description: '通过有意识的深呼吸来放松身心', 
            duration: '5分钟',
            durationInSeconds: 300
          },
          { 
            title: '渐进式肌肉放松', 
            description: '逐步放松身体各个部位的肌肉', 
            duration: '10分钟',
            durationInSeconds: 600
          },
          { 
            title: '自然声音冥想', 
            description: '聆听大自然的声音平静心灵', 
            duration: '15分钟',
            durationInSeconds: 900
          }
        ],
        anxious: [
          { 
            title: '身体扫描冥想', 
            description: '从头到脚扫描并放松身体', 
            duration: '8分钟',
            durationInSeconds: 480
          },
          { 
            title: '观息冥想', 
            description: '专注于呼吸的进出', 
            duration: '5分钟',
            durationInSeconds: 300
          },
          { 
            title: '安全空间冥想', 
            description: '在内心创造一个安全舒适的空间', 
            duration: '12分钟',
            durationInSeconds: 720
          }
        ],
        sad: [
          { 
            title: '慈心冥想', 
            description: '培养对自己和他人的善意', 
            duration: '10分钟',
            durationInSeconds: 600
          },
          { 
            title: '感恩冥想', 
            description: '专注于生活中的美好事物', 
            duration: '7分钟',
            durationInSeconds: 420
          },
          { 
            title: '情绪释放冥想', 
            description: '允许情绪自然流动和释放', 
            duration: '15分钟',
            durationInSeconds: 900
          }
        ],
        angry: [
          { 
            title: '冷静呼吸', 
            description: '通过延长呼气来平静情绪', 
            duration: '5分钟',
            durationInSeconds: 300
          },
          { 
            title: '观察情绪冥想', 
            description: '以旁观者角度观察自己的情绪', 
            duration: '8分钟',
            durationInSeconds: 480
          },
          { 
            title: '慈悲冥想', 
            description: '用慈悲心化解愤怒', 
            duration: '10分钟',
            durationInSeconds: 600
          }
        ],
        tired: [
          { 
            title: '能量恢复冥想', 
            description: '通过呼吸恢复身体能量', 
            duration: '5分钟',
            durationInSeconds: 300
          },
          { 
            title: '微休息冥想', 
            description: '短时间的深度休息', 
            duration: '3分钟',
            durationInSeconds: 180
          },
          { 
            title: '身体充电冥想', 
            description: '想象能量充满全身', 
            duration: '7分钟',
            durationInSeconds: 420
          }
        ],
        neutral: [
          { 
            title: '正念呼吸', 
            description: '专注于当下的呼吸', 
            duration: '10分钟',
            durationInSeconds: 600
          },
          { 
            title: '身体觉知冥想', 
            description: '感受身体的每一个部分', 
            duration: '8分钟',
            durationInSeconds: 480
          },
          { 
            title: '行走冥想', 
            description: '在行走中保持正念', 
            duration: '15分钟',
            durationInSeconds: 900
          }
        ]
      };
  
      const selectedMood = ref(null);
      const meditationOptions = ref([]);
      const currentlyPlaying = ref(null);
      const isPlaying = ref(false);
      const progress = ref(0);
      const currentTime = ref(0);
      let progressInterval = null;
  
      // 当前选择的心情对象
      const currentMood = computed(() => {
        return moods.value.find(mood => mood.id === selectedMood.value);
      });
  
      // 选择心情
      const selectMood = (moodId) => {
        selectedMood.value = moodId;
        // 重置播放状态
        meditationOptions.value = meditationData[moodId].map(option => ({
          ...option,
          playing: false
        }));
        stopPlaying();
      };
  
      // 播放冥想
      const playMeditation = (option) => {
        // 如果点击的是当前正在播放的选项，则暂停/继续
        if (currentlyPlaying.value && currentlyPlaying.value.title === option.title) {
          togglePlay();
          return;
        }
  
        // 否则开始播放新的冥想
        stopPlaying();
        currentlyPlaying.value = option;
        isPlaying.value = true;
        currentTime.value = 0;
        progress.value = 0;
        
        // 更新选项的播放状态
        meditationOptions.value.forEach(item => {
          item.playing = item.title === option.title;
        });
  
        // 模拟进度条前进
        progressInterval = setInterval(() => {
          if (isPlaying.value) {
            currentTime.value += 1;
            progress.value = (currentTime.value / option.durationInSeconds) * 100;
            
            // 播放结束
            if (currentTime.value >= option.durationInSeconds) {
              stopPlaying();
            }
          }
        }, 1000);
      };
  
      // 暂停/继续播放
      const togglePlay = () => {
        isPlaying.value = !isPlaying.value;
      };
  
      // 停止播放
      const stopPlaying = () => {
        if (progressInterval) {
          clearInterval(progressInterval);
          progressInterval = null;
        }
        isPlaying.value = false;
        currentlyPlaying.value = null;
        
        // 重置所有选项的播放状态
        meditationOptions.value.forEach(item => {
          item.playing = false;
        });
      };
  
      // 格式化时间显示
      const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      };
  
      return {
        moods,
        selectedMood,
        currentMood,
        meditationOptions,
        currentlyPlaying,
        isPlaying,
        progress,
        currentTime,
        selectMood,
        playMeditation,
        togglePlay,
        stopPlaying,
        formatTime
      };
    }
  };
  </script>
  
  <style scoped>
  .mindfulness-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .mood-selection {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .mood-selection h2 {
    color: #333;
    margin-bottom: 20px;
  }
  
  .mood-options {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
  }
  
  .mood-option {
    width: 100px;
    padding: 15px 10px;
    border-radius: 10px;
    background-color: #f5f5f5;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .mood-option.selected {
    background-color: #e3f2fd;
    box-shadow: 0 0 0 2px #2196f3;
  }
  
  .mood-option:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .emoji {
    font-size: 30px;
    margin-bottom: 5px;
  }
  
  .label {
    font-size: 14px;
    color: #333;
  }
  
  .meditation-section {
    background-color: white;
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .recommendation {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
  }
  
  .recommendation h3 {
    color: #2196f3;
    margin-bottom: 10px;
  }
  
  .recommendation p {
    color: #555;
    line-height: 1.5;
  }
  
  .meditation-options {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .meditation-option {
    display: flex;
    align-items: center;
    padding: 15px;
    border-radius: 10px;
    background-color: #f9f9f9;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .meditation-option:hover {
    background-color: #f0f0f0;
  }
  
  .icon {
    font-size: 24px;
    margin-right: 15px;
    min-width: 30px;
    text-align: center;
  }
  
  .info {
    flex: 1;
  }
  
  .info h4 {
    margin: 0 0 5px 0;
    color: #333;
  }
  
  .info p {
    margin: 0 0 5px 0;
    color: #666;
    font-size: 14px;
  }
  
  .duration {
    font-size: 12px;
    color: #888;
  }
  
  .player-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .player-container {
    background-color: white;
    border-radius: 15px;
    width: 90%;
    max-width: 500px;
    padding: 20px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  .player-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .player-header h3 {
    margin: 0;
    color: #333;
  }
  
  .player-header button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #666;
  }
  
  .player-content {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .play-button {
    font-size: 50px;
    margin: 20px 0;
    cursor: pointer;
  }
  
  .progress-bar {
    height: 6px;
    background-color: #eee;
    border-radius: 3px;
    margin: 20px 0;
    overflow: hidden;
  }
  
  .progress {
    height: 100%;
    background-color: #2196f3;
    border-radius: 3px;
    transition: width 0.3s;
  }
  
  .time-display {
    font-size: 14px;
    color: #666;
  }
  
  .player-description p {
    color: #555;
    line-height: 1.5;
    font-size: 14px;
  }
  </style>