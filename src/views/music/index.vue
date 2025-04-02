<template>
	<main-layout page-title="音乐疗愈">
		<div class="space-y-8">
			<MoodRecommendation
				:emotion="emotion"
				:songs="songs"
				:currentlyPlaying="currentlyPlaying"
				@play-song="playSong"
				@toggle-favorite="toggleFavorite"
				@add-to-playlist="addToPlaylist"
			/>
			<MusicPlayer
				:currentTrack="currentTrack"
				:isPlaying="isPlaying"
				:currentTime="currentTime"
				:progress="progress"
				@toggle-play="togglePlay"
				@prev-song="prevSong"
				@next-song="nextSong"
			/>
			<PlaylistSection :emotion="emotion" :playlists="playlists" />
		</div>
	</main-layout>
</template>

<script>
import MainLayout from '/@/layouts/MainLayout.vue';
import MoodRecommendation from '/@/views/music/components/MoodRecommendation.vue';
import MusicPlayer from '/@/views/music/components/MusicPlayer.vue';
import PlaylistSection from '/@/views/music/components/PlaylistSection.vue';
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

export default {
	name: 'MusicTherapyPage',
	components: {
		MainLayout,
		MoodRecommendation,
		MusicPlayer,
		PlaylistSection
	},
	setup() {
		const emotion = ref('快乐');

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
			{
				id: 1,
				name: '活力四射',
				songCount: 15,
				bgColor: 'bg-gradient-to-tr from-yellow-400 to-orange-500'
			},
			{
				id: 2,
				name: '欢乐时光',
				songCount: 18,
				bgColor: 'bg-gradient-to-tr from-pink-400 to-purple-500'
			},
			{
				id: 3,
				name: '轻松一刻',
				songCount: 12,
				bgColor: 'bg-gradient-to-tr from-green-400 to-blue-500'
			},
			{
				id: 4,
				name: '热门流行',
				songCount: 20,
				bgColor: 'bg-gradient-to-tr from-blue-400 to-indigo-500'
			}
		]);

		const currentlyPlaying = ref(null);
		const isPlaying = ref(false);
		const currentTime = ref(0);
		const progress = ref(0);
		let timer = null;

		const currentTrack = computed(() => {
			if (!currentlyPlaying.value) return null;
			return songs.value.find((song) => song.id === currentlyPlaying.value);
		});

		const playSong = (song) => {
			if (currentlyPlaying.value === song.id) {
				isPlaying.value = !isPlaying.value;
			} else {
				currentlyPlaying.value = song.id;
				currentTime.value = 0;
				progress.value = 0;
				isPlaying.value = true;
			}
		};

		const toggleFavorite = (songId) => {
			const song = songs.value.find((s) => s.id === songId);
			if (song) {
				song.isFavorite = !song.isFavorite;
			}
		};

		const addToPlaylist = (songId) => {
			alert(`已添加到播放列表！`);
		};

		const togglePlay = () => {
			if (currentlyPlaying.value) {
				isPlaying.value = !isPlaying.value;
			} else if (songs.value.length > 0) {
				currentlyPlaying.value = songs.value[0].id;
				isPlaying.value = true;
			}
		};

		const prevSong = () => {
			if (!currentlyPlaying.value || songs.value.length <= 1) return;

			const currentIndex = songs.value.findIndex(
				(s) => s.id === currentlyPlaying.value
			);
			const prevIndex =
				(currentIndex - 1 + songs.value.length) % songs.value.length;
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

			const currentIndex = songs.value.findIndex(
				(s) => s.id === currentlyPlaying.value
			);
			const nextIndex = (currentIndex + 1) % songs.value.length;
			currentlyPlaying.value = songs.value[nextIndex].id;
			currentTime.value = 0;
			progress.value = 0;
		};

		const formatTime = (seconds) => {
			const mins = Math.floor(seconds / 60);
			const secs = Math.floor(seconds % 60);
			return `${mins}:${secs < 10 ? '0' + secs : secs}`;
		};

		watch(isPlaying, (newValue) => {
			if (newValue && currentlyPlaying.value) {
				clearInterval(timer);
				timer = setInterval(() => {
					if (currentTrack.value) {
						const totalDuration =
							parseInt(currentTrack.value.duration.split(':')[0]) * 60 +
							parseInt(currentTrack.value.duration.split(':')[1]);

						currentTime.value += 1;
						progress.value = (currentTime.value / totalDuration) * 100;

						if (currentTime.value >= totalDuration) {
							nextSong();
						}
					}
				}, 1000);
			} else {
				clearInterval(timer);
			}
		});

		onMounted(() => {});

		onUnmounted(() => {
			clearInterval(timer);
		});

		watch(emotion, (newEmotion) => {
			console.log(`情绪改变为: ${newEmotion}，更新音乐推荐`);
		});

		return {
			emotion,
			songs,
			playlists,
			currentlyPlaying,
			isPlaying,
			currentTime,
			progress,
			currentTrack,
			playSong,
			toggleFavorite,
			addToPlaylist,
			togglePlay,
			prevSong,
			nextSong,
			formatTime
		};
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

.primary-100 {
	background-color: rgba(93, 92, 222, 0.1);
}

.primary-600 {
	color: #5d5cde;
}

.primary-700 {
	color: #4847b8;
}

.bg-primary-600 {
	background-color: #5d5cde;
}

.bg-primary-700 {
	background-color: #4847b8;
}

.bg-primary-900 {
	background-color: rgba(93, 92, 222, 0.2);
}
</style>
