<template>
    <div>
      <h3 class="text-lg font-semibold mb-4">音乐播放器</h3>
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div class="flex flex-col md:flex-row items-center">
          <div class="w-full md:w-1/3 flex justify-center mb-6 md:mb-0">
            <div
              :class="['w-48 h-48 rounded-full flex items-center justify-center shadow-lg', 
                       currentTrack ? currentTrack.bgColor : 'bg-gradient-to-r from-gray-300 to-gray-400']"
            >
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
              <button @click="$emit('prev-song')" class="text-gray-700 dark:text-gray-300 hover:text-primary-600">
                <i class="fas fa-step-backward text-xl"></i>
              </button>
              <button
                @click="$emit('toggle-play')"
                :class="[
                  'rounded-full w-12 h-12 flex items-center justify-center text-white shadow-md',
                  isPlaying ? 'bg-primary-600 hover:bg-primary-700' : 'bg-green-500 hover:bg-green-600'
                ]"
              >
                <i :class="isPlaying ? 'fas fa-pause text-xl' : 'fas fa-play text-xl'"></i>
              </button>
              <button @click="$emit('next-song')" class="text-gray-700 dark:text-gray-300 hover:text-primary-600">
                <i class="fas fa-step-forward text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MusicPlayer',
    props: {
      currentTrack: {
        type: Object,
        default: null
      },
      isPlaying: {
        type: Boolean,
        default: false
      },
      currentTime: {
        type: Number,
        default: 0
      },
      progress: {
        type: Number,
        default: 0
      }
    },
    methods: {
      formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' + secs : secs}`;
      }
    }
  };
  </script>