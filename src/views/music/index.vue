<template>
	<main-layout page-title="音乐疗愈">
		<div class="space-y-8">
			<MoodRecommendation :emotion="emotion" :songs="songs" :currentlyPlaying="currentlyPlaying"
				@play-song="playSong" @toggle-favorite="toggleFavorite" @add-to-playlist="addToPlaylist"
				@likeSong="likeSong" />
			<MusicPlayer :currentTrack="currentTrack" :isPlaying="isPlaying" :currentTime="currentTime"
				:progress="progress" @toggle-play="togglePlay" @prev-song="prevSong" @next-song="nextSong" />
			<LikedSongsSection :likedSongs="likedSongs" />
		</div>
	</main-layout>
</template>

<script>
import MainLayout from '/@/layouts/MainLayout.vue';
import MoodRecommendation from '/@/views/music/components/MoodRecommendation.vue';
import MusicPlayer from '/@/views/music/components/MusicPlayer.vue';
import LikedSongsSection from '/@/views/music/components/PlaylistSection.vue';
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useMusicStore } from '/@/store/modules/music';
import { musicApi } from '/@/api/music-api';

export default {
	name: 'MusicTherapyPage',
	components: {
		MainLayout,
		MoodRecommendation,
		MusicPlayer,
		LikedSongsSection
	},
	setup() {
		const emotion = ref('');

		const songs = ref(
		);

		const likedSongs = ref(
		);

		const currentlyPlaying = ref(null);
		const isPlaying = ref(false);
		const currentTime = ref(0);
		const progress = ref(0);
		let timer = null;

		const currentTrack = computed(() => {
			if (!currentlyPlaying.value) return null;
			return songs.value.find((song) => song.song_id === currentlyPlaying.value);
		});

		const playSong = (song) => {
			if (currentlyPlaying.value === song.song_id) {
				isPlaying.value = !isPlaying.value;
			} else {
				currentlyPlaying.value = song.song_id;
				currentTime.value = 0;
				progress.value = 0;
				isPlaying.value = true;
			}
		};

		const toggleFavorite = (songId) => {
			const song = songs.value.find((s) => s.song_id === songId);
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
				currentlyPlaying.value = songs.value[0].song_id;
				isPlaying.value = true;
			}
		};

		const prevSong = () => {
			if (!currentlyPlaying.value || songs.value.length <= 1) return;

			const currentIndex = songs.value.findIndex(
				(s) => s.song_id === currentlyPlaying.value
			);
			const prevIndex =
				(currentIndex - 1 + songs.value.length) % songs.value.length;
			currentlyPlaying.value = songs.value[prevIndex].song_id;
			currentTime.value = 0;
			progress.value = 0;
		};

		const nextSong = () => {
			if (!currentlyPlaying.value && songs.value.length > 0) {
				currentlyPlaying.value = songs.value[0].song_id;
				isPlaying.value = true;
				return;
			}

			if (songs.value.length <= 1) return;

			const currentIndex = songs.value.findIndex(
				(s) => s.song_id === currentlyPlaying.value
			);
			const nextIndex = (currentIndex + 1) % songs.value.length;
			currentlyPlaying.value = songs.value[nextIndex].song_id;
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



		onUnmounted(() => {
			clearInterval(timer);
		});

		watch(emotion, (newEmotion) => {
			console.log(`情绪改变为: ${newEmotion}，更新音乐推荐`);
		});




		const getTextMusic = (val) => {
			musicApi.recommend({
				text: val
			}).then((result) => {
				songs.value = result.recommended_songs;
				emotion.value = result.emotion ? result.emotion[0] : ''
			});
		}

		const getImageMusic = (val) => {
			musicApi.recommendByImage(val).then((result) => {
				songs.value = result.recommended_songs;
				emotion.value = result.emotion ? result.emotion[0] : '';
			});
		};

		const getEmotionMusic = (val) => {
			musicApi.recommendByEmotion({
				emotion: val
			}).then((result) => {
				songs.value = result.recommended_songs;
				emotion.value = result.emotion ? result.emotion[0] : ''
			});
		}

		watch(() => useMusicStore().musicValue, (newVal, oldVal) => {
			if (useMusicStore().type === 'text') {
				getTextMusic(newVal);
			} else if (useMusicStore().type === 'image') {
				getImageMusic(newVal);
			} else if (useMusicStore().type === 'emotion') {
				getEmotionMusic(newVal);
			}
		}, { immediate: true });

		const getLikeList = () => {
			musicApi.userLike().then((result) => {
				likedSongs.value = result.music;
			});
		}

		const likeSong = (val) => {
			musicApi.addLike({
				songId: val.song_id,
				songName: val.song_name,
				singer: val.singer,
				emotion: val.emotion,
			}).then((result) => {
				getLikeList();
			});
		}

		onMounted(() => { getLikeList() });


		return {
			emotion,
			songs,
			likedSongs,
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
			formatTime,
			getTextMusic,
			getEmotionMusic,
			likeSong
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
