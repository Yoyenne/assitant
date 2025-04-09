<template>
	<div class="emotion-recommendation">
	  <div class="flex items-center justify-between mb-6">
		<h3 class="text-xl font-semibold text-blue-800">根据您的心情推荐</h3>
		<div class="flex items-center space-x-2 bg-blue-50 rounded-full px-5 py-2 transition-all duration-300 hover:shadow-md">
		  <i class="fas fa-heart text-blue-500 animate-pulse"></i>
		  <span class="text-blue-600 font-medium">当前心情：{{ emotion }}</span>
		</div>
	  </div>
  
	  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
		<div v-for="(song, index) in songs" :key="song.song_id"
		  :class="[
			'song-card-variant-' + ((index % 5) + 1),
			'rounded-2xl shadow-md overflow-hidden scale-animation border border-transparent hover:border-blue-100 transition-all duration-300'
		  ]">
		  <div class="h-48 flex items-center justify-center relative overflow-hidden">
			<div class="absolute inset-0 bg-gradient-to-br from-transparent to-blue-200/50 z-10"></div>
			<i class="fas fa-music text-6xl drop-shadow-lg z-20 transition-transform hover:rotate-12 card-accent"></i>
		  </div>
		  <div class="p-6">
			<h4 class="font-bold text-lg mb-2 card-accent">{{ song.song_name }}</h4>
			<p class="text-blue-600 text-sm mb-4 font-medium">
			  {{ song.singer }}
			</p>
			<div class="flex items-center justify-between mb-4">
			  <div class="flex items-center">
				<button @click="$emit('play-song', song)"
				  class="text-blue-500 hover:text-blue-600 text-2xl mr-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full card-accent">
				  <i :class="[
					currentlyPlaying === song.song_id
					  ? 'fas fa-pause-circle'
					  : 'fas fa-play-circle',
					currentlyPlaying === song.song_id ? 'animate-pulse' : ''
				  ]"></i>
				</button>
				<span class="text-blue-400 text-sm font-medium">{{ song.duration }}</span>
			  </div>
			  <div class="flex items-center space-x-3">
				<button @click="$emit('toggle-favorite', song.song_id)"
				  class="text-blue-400 hover:text-red-400 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full p-1">
				  <i :class="[
					song.isFavorite
					  ? 'fas fa-heart text-red-400'
					  : 'far fa-heart',
					song.isFavorite ? 'animate-pulse' : ''
				  ]"></i>
				</button>
				<button @click="$emit('add-to-playlist', song.song_id)"
				  class="text-blue-400 hover:text-blue-600 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full p-1">
				  <i class="fas fa-plus-circle"></i>
				</button>
			  </div>
			</div>
			<!-- "我喜欢"按钮 - 保持原有功能不变 -->
			<div class="flex justify-end mt-4">
			  <button @click="getLikeSong(song)"
				class="like-button font-semibold py-2 px-4 rounded-lg shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1">
				<i class="fas fa-thumbs-up mr-2"></i>我喜欢
			  </button>
			</div>
		  </div>
		</div>
	  </div>
	  
	  <!-- 无推荐歌曲时显示 -->
	  <div v-if="songs.length === 0" class="flex flex-col items-center justify-center py-20 text-blue-400">
		<i class="fas fa-music text-6xl mb-4 opacity-30"></i>
		<p class="text-lg">暂无符合您心情的推荐歌曲</p>
		<button class="mt-4 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-all duration-300">
		  更换心情试试
		</button>
	  </div>
	</div>
  </template>
  
  <script setup>
  const emit = defineEmits(['likeSong']);
  const props = defineProps({
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
  })
  const getLikeSong = (val) => {
	emit('likeSong', val)
  }
  </script>
  
  <style lang="scss">
  @import '/src/styles/recomendation.scss';
  </style>
  