<template>
    <div>
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">根据您的心情推荐</h3>
        <div class="flex items-center space-x-2 bg-primary-100 dark:bg-primary-900 rounded-full px-4 py-1">
          <i class="fas fa-heart text-primary-600"></i>
          <span class="text-primary-600 font-medium">当前心情：{{ emotion }}</span>
        </div>
      </div>
  
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="song in songs"
          :key="song.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden scale-animation"
        >
          <div :class="['h-40 flex items-center justify-center', song.bgColor]">
            <i class="fas fa-music text-white text-5xl"></i>
          </div>
          <div class="p-5">
            <h4 class="font-semibold text-lg mb-1">{{ song.title }}</h4>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">{{ song.artist }}</p>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <button
                  @click="$emit('play-song', song)"
                  class="text-primary-600 hover:text-primary-700 text-2xl mr-2"
                >
                  <i :class="currentlyPlaying === song.id ? 'fas fa-pause-circle' : 'fas fa-play-circle'"></i>
                </button>
                <span class="text-gray-500 dark:text-gray-400 text-sm">{{ song.duration }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="$emit('toggle-favorite', song.id)"
                  class="text-gray-500 dark:text-gray-400 hover:text-primary-600"
                >
                  <i :class="song.isFavorite ? 'fas fa-heart text-red-500' : 'far fa-heart'"></i>
                </button>
                <button
                  @click="$emit('add-to-playlist', song.id)"
                  class="text-gray-500 dark:text-gray-400 hover:text-primary-600"
                >
                  <i class="fas fa-plus-circle"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MoodRecommendation',
    props: {
      emotion: {
        type: String,
        required: true
      },
      songs: {
        type: Array,
        required: true
      },
      currentlyPlaying: {
        type: Number,
        default: null
      }
    }
  };
  </script>
  
  <style scoped>
  .scale-animation {
    transition: transform 0.3s ease-in-out;
  }
  .scale-animation:hover {
    transform: scale(1.03);
  }
  </style>