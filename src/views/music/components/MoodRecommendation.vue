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
			<div v-for="song in songs" :key="song.song_id"
				class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden scale-animation">
				<div :class="['h-40 flex items-center justify-center', song.bgColor]">
					<i class="fas fa-music text-white text-5xl"></i>
				</div>
				<div class="p-5">
					<h4 class="font-semibold text-lg mb-1">{{ song.song_name }}</h4>
					<p class="text-gray-600 dark:text-gray-400 text-sm mb-3">
						{{ song.singer }}
					</p>
					<div class="flex items-center justify-between">
						<div class="flex items-center">
							<button @click="$emit('play-song', song)"
								class="text-primary-600 hover:text-primary-700 text-2xl mr-2">
								<i :class="currentlyPlaying === song.song_id
										? 'fas fa-pause-circle'
										: 'fas fa-play-circle'
									"></i>
							</button>
							<span class="text-gray-500 dark:text-gray-400 text-sm">{{
								song.duration
							}}</span>
						</div>
						<div class="flex items-center space-x-2">
							<button @click="$emit('toggle-favorite', song.song_id)"
								class="text-gray-500 dark:text-gray-400 hover:text-primary-600">
								<i :class="song.isFavorite
										? 'fas fa-heart text-red-500'
										: 'far fa-heart'
									"></i>
							</button>
							<button @click="$emit('add-to-playlist', song.song_id)"
								class="text-gray-500 dark:text-gray-400 hover:text-primary-600">
								<i class="fas fa-plus-circle"></i>
							</button>
						</div>
					</div>
					<!-- 修改后的“我喜欢”按钮 -->
					<div class="flex justify-end mt-4">
						<button @click="getLikeSong(song)"
							class="bg-primary-600 hover:bg-primary-700 text-black font-semibold py-1 px-3 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
							我喜欢
						</button>
					</div>
				</div>
			</div>
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
// export default {
// 	name: 'MoodRecommendation',
// 	props: {
// 		emotion: {
// 			type: String,
// 			required: true
// 		},
// 		songs: {
// 			type: Array,
// 			required: true
// 		},
// 		currentlyPlaying: {
// 			type: Number,
// 			default: null
// 		}
// 	}
// };
</script>

<style scoped>
.scale-animation {
	transition: transform 0.3s ease-in-out;
}

.scale-animation:hover {
	transform: scale(1.03);
}
</style>
