<template>
	<div>
		<h3 class="text-lg font-semibold mb-4">更多{{ emotion }}歌单</h3>
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			<div
				v-for="playlist in playlists"
				:key="playlist.id"
				class="bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
			>
				<div
					:class="[
						'aspect-square rounded-lg mb-3 flex items-center justify-center',
						playlist.bgColor
					]"
				>
					<i class="fas fa-headphones text-white text-3xl"></i>
				</div>
				<h4 class="font-medium text-sm">{{ playlist.name }}</h4>
				<p class="text-gray-500 dark:text-gray-400 text-xs mt-1">
					{{ playlist.songCount }}首歌曲
				</p>
			</div>
		</div>
	</div>
	<div>
		<h3 class="text-lg font-semibold mb-4">我喜欢的歌曲</h3>
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			<div
				v-for="song in likedSongs"
				:key="song.id"
				class="bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
			>
				<div
					:class="[
						'aspect-square rounded-lg mb-3 flex items-center justify-center',
						song.bgColor
					]"
				>
					<i class="fas fa-music text-white text-3xl"></i>
				</div>
				<h4 class="font-medium text-sm">{{ song.songName }}</h4>
				<p class="text-gray-500 dark:text-gray-400 text-xs mt-1">
					{{ song.singer }}
				</p>
				<p class="text-gray-500 dark:text-gray-400 text-xs mt-1">
					时长：{{ song.duration }}
				</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'PlaylistSection',
	props: {
		emotion: {
			type: String,
			required: true
		},
		playlists: {
			type: Array,
			required: true
		},
		likedSongs: {
			type: Array,
			required: true
		}
	}
};
</script>
