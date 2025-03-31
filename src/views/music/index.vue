<template>
    <div>
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">根据您的心情推荐</h3>
          <div class="flex items-center space-x-2 bg-primary-100 dark:bg-primary-900 rounded-full px-4 py-1">
            <i class="fas fa-heart text-primary-600"></i>
            <span class="text-primary-600 font-medium">当前心情：{{ emotion }}</span>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- 歌曲推荐卡片 -->
          <div v-for="song in songs" :key="song.id" 
               class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden scale-animation">
            <div :class="['h-40 flex items-center justify-center', song.bgColor]">
              <i class="fas fa-music text-white text-5xl"></i>
            </div>
            <div class="p-5">
              <h4 class="font-semibold text-lg mb-1">{{ song.title }}</h4>
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">{{ song.artist }}</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <button @click="playSong(song)" class="text-primary-600 hover:text-primary-700 text-2xl mr-2">
                    <i :class="currentlyPlaying === song.id ? 'fas fa-pause-circle' : 'fas fa-play-circle'"></i>
                  </button>
                  <span class="text-gray-500 dark:text-gray-400 text-sm">{{ song.duration }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <button @click="toggleFavorite(song.id)" class="text-gray-500 dark:text-gray-400 hover:text-primary-600">
                    <i :class="song.isFavorite ? 'fas fa-heart text-red-500' : 'far fa-heart'"></i>
                  </button>
                  <button @click="addToPlaylist(song.id)" class="text-gray-500 dark:text-gray-400 hover:text-primary-600">
                    <i class="fas fa-plus-circle"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mb-8">
        <h3 class="text-lg font-semibold mb-4">更多{{ emotion }}歌单</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div v-for="playlist in playlists" :key="playlist.id"
               class="bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div :class="['aspect-square rounded-lg mb-3 flex items-center justify-center', playlist.bgColor]">
              <i class="fas fa-headphones text-white text-3xl"></i>
            </div>
            <h4 class="font-medium text-sm">{{ playlist.name }}</h4>
            <p class="text-gray-500 dark:text-gray-400 text-xs mt-1">{{ playlist.songCount }}首歌曲</p>
          </div>
        </div>
      </div>
      
      <!-- 当前播放器 -->
      <div>
        <h3 class="text-lg font-semibold mb-4">音乐播放器</h3>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div class="flex flex-col md:flex-row items-center">
            <div class="w-full md:w-1/3 flex justify-center mb-6 md:mb-0">
              <div :class="['w-48 h-48 rounded-full flex items-center justify-center shadow-lg', 
                           currentTrack ? currentTrack.bgColor : 'bg-gradient-to-r from-gray-300 to-gray-400']">
                <i class="fas fa-music text-white text-4xl"></i>
              </div>
            </div>
            <div class="w-full md:w-2/3 md:pl-8">
              <h4 class="text-xl font-semibold mb-1">{{ currentTrack ? currentTrack.title : '未选择歌曲' }}</h4>
              <p class="text-gray-600 dark:text-gray-400 mb-4">{{ currentTrack ? currentTrack.artist : '选择一首歌曲开始播放' }}</p>
              
              <div class="mb-4">
                <div class="relative">
                  <div class="h-1 bg-gray-300 dark:bg-gray-700 rounded-full">
                    <div class="absolute h-1 bg-primary-600 rounded-full" :style="{ width: progress + '%' }"></div>
                    <div class="absolute h-3 w-3 bg-primary-600 rounded-full -mt-1" :style="{ left: progress + '%' }"></div>
                  </div>
                  <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>{{ formatTime(currentTime) }}</span>
                    <span>{{ currentTrack ? currentTrack.duration : '0:00' }}</span>
                  </div>
                </div>
              </div>
              
              <div class="flex justify-center space-x-6">
                <button @click="prevSong" class="text-gray-700 dark:text-gray-300 hover:text-primary-600">
                  <i class="fas fa-step-backward text-xl"></i>
                </button>
                <button @click="togglePlay" :class="[
                  'rounded-full w-12 h-12 flex items-center justify-center text-white shadow-md',
                  isPlaying ? 'bg-primary-600 hover:bg-primary-700' : 'bg-green-500 hover:bg-green-600'
                ]">
                  <i :class="isPlaying ? 'fas fa-pause text-xl' : 'fas fa-play text-xl'"></i>
                </button>
                <button @click="nextSong" class="text-gray-700 dark:text-gray-300 hover:text-primary-600">
                  <i class="fas fa-step-forward text-xl"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
  
  const props = defineProps({
    emotion: {
      type: String,
      default: '快乐'
    }
  });
  
  // 音乐数据（实际项目中通常从API获取）
  const songs = ref([
    { 
      id: 1, 
      title: '阳光灿烂的日子', 
      artist: '周杰伦', 
      duration: '3:45',
      bgColor: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
      isFavorite: false
    },
    { 
      id: 2, 
      title: 'Happy', 
      artist: 'Pharrell Williams', 
      duration: '3:53',
      bgColor: 'bg-gradient-to-r from-yellow-300 to-orange-500',
      isFavorite: true
    },
    { 
      id: 3, 
      title: 'Uptown Funk', 
      artist: 'Mark Ronson ft. Bruno Mars', 
      duration: '4:30',
      bgColor: 'bg-gradient-to-r from-orange-400 to-pink-500',
      isFavorite: false
    }
  ]);
  
  const playlists = ref([
    { id: 1, name: '活力四射', songCount: 15, bgColor: 'bg-gradient-to-tr from-yellow-400 to-orange-500' },
    { id: 2, name: '欢乐时光', songCount: 18, bgColor: 'bg-gradient-to-tr from-pink-400 to-purple-500' },
    { id: 3, name: '轻松一刻', songCount: 12, bgColor: 'bg-gradient-to-tr from-green-400 to-blue-500' },
    { id: 4, name: '热门流行', songCount: 20, bgColor: 'bg-gradient-to-tr from-blue-400 to-indigo-500' }
  ]);
  
  // 播放器状态
  const currentlyPlaying = ref(null);
  const isPlaying = ref(false);
  const currentTime = ref(0);
  const progress = ref(0);
  let timer = null;
  
  // 当前播放曲目
  const currentTrack = computed(() => {
    if (!currentlyPlaying.value) return null;
    return songs.value.find(song => song.id === currentlyPlaying.value);
  });
  
  // 播放歌曲
  const playSong = (song) => {
    if (currentlyPlaying.value === song.id) {
      // 切换播放暂停
      isPlaying.value = !isPlaying.value;
    } else {
      // 播放新歌曲
      currentlyPlaying.value = song.id;
      currentTime.value = 0;
      progress.value = 0;
      isPlaying.value = true;
    }
  };
  
  // 切换收藏状态
  const toggleFavorite = (songId) => {
    const song = songs.value.find(s => s.id === songId);
    if (song) {
      song.isFavorite = !song.isFavorite;
    }
  };
  
  // 添加到播放列表
  const addToPlaylist = (songId) => {
    // 实际项目中可以添加一个弹窗让用户选择播放列表
    alert(`已添加到播放列表！`);
  };
  
  // 播放控制功能
  const togglePlay = () => {
    if (currentlyPlaying.value) {
      isPlaying.value = !isPlaying.value;
    } else if (songs.value.length > 0) {
      // 如果没有当前播放的歌曲，选择第一首
      currentlyPlaying.value = songs.value[0].id;
      isPlaying.value = true;
    }
  };
  
  const prevSong = () => {
    if (!currentlyPlaying.value || songs.value.length <= 1) return;
    
    const currentIndex = songs.value.findIndex(s => s.id === currentlyPlaying.value);
    const prevIndex = (currentIndex - 1 + songs.value.length) % songs.value.length;
    currentlyPlaying.value = songs.value[prevIndex].id;
    currentTime.value = 0;
    progress.value = 0;
  };
  
  const nextSong = () => {
    if (!currentlyPlaying.value && songs.value.length > 0) {
      currentlyPlaying.value = songs.value[0].id;
      isPlaying.value = true;
      return;
    }
    
    if (songs.value.length <= 1) return;
    
    const currentIndex = songs.value.findIndex(s => s.id === currentlyPlaying.value);
    const nextIndex = (currentIndex + 1) % songs.value.length;
    currentlyPlaying.value = songs.value[nextIndex].id;
    currentTime.value = 0;
    progress.value = 0;
  };
  
  // 格式化时间
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };
  
  // 模拟播放进度
  watch(isPlaying, (newValue) => {
    if (newValue && currentlyPlaying.value) {
      // 开始计时
      clearInterval(timer);
      timer = setInterval(() => {
        if (currentTrack.value) {
          const totalDuration = parseInt(currentTrack.value.duration.split(':')[0]) * 60 + 
                               parseInt(currentTrack.value.duration.split(':')[1]);
          
          currentTime.value += 1;
          progress.value = (currentTime.value / totalDuration) * 100;
          
          // 当歌曲播放完毕
          if (currentTime.value >= totalDuration) {
            nextSong();
          }
        }
      }, 1000);
    } else {
      // 停止计时
      clearInterval(timer);
    }
  });
  
  onMounted(() => {
    // 可以在这里加载歌曲数据或根据emotion获取推荐
  });
  
  onUnmounted(() => {
    clearInterval(timer);
  });
  
  // 当emotion改变时，可以刷新音乐推荐
  watch(() => props.emotion, (newEmotion) => {
    // 实际项目中，这里可以调用API获取基于情绪的推荐
    console.log(`情绪改变为: ${newEmotion}，更新音乐推荐`);
  });
  </script>
  
  <style scoped>
  .scale-animation {
    transition: transform 0.3s ease-in-out;
  }
  
  .scale-animation:hover {
    transform: scale(1.03);
  }
  
  .primary-100 {
    background-color: rgba(93, 92, 222, 0.1);
  }
  
  .primary-600 {
    color: #5D5CDE;
  }
  
  .primary-700 {
    color: #4847B8;
  }
  
  .bg-primary-600 {
    background-color: #5D5CDE;
  }
  
  .bg-primary-700 {
    background-color: #4847B8;
  }
  
  .bg-primary-900 {
    background-color: rgba(93, 92, 222, 0.2);
  }
  </style>