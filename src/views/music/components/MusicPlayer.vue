<template>
	<div>
		<h3 class="text-lg font-semibold mb-4">音乐播放器</h3>
		<div
			class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 player-container"
		>
			<!-- 右上角图片 -->
			<div class="decoration-image">
				<img src="/src/assets/images/music.svg" alt="音乐装饰" />
			</div>

			<div class="flex flex-col md:flex-row items-center">
				<div class="w-full md:w-1/3 flex justify-center mb-6 md:mb-0">
					<div class="record-player">
						<div class="vinyl-disc">
							<div class="vinyl-center"></div>
						</div>
					</div>
				</div>

				<div class="w-full md:w-2/3 md:pl-8">
					<h4 class="text-xl font-semibold mb-1">
						{{ currentTrack ? currentTrack.title : '播放你的心情歌曲' }}
					</h4>
					<p class="text-gray-600 dark:text-gray-400 mb-4">
						{{
							currentTrack ? currentTrack.artist : '欢迎使用心理健康音乐助手'
						}}
					</p>

					<div class="mb-4">
						<div class="relative">
							<div class="h-1 bg-gray-300 dark:bg-gray-700 rounded-full">
								<div
									class="absolute h-1 bg-primary-600 rounded-full"
									:style="{ width: progress + '%' }"
								></div>
								<div
									class="absolute h-3 w-3 bg-primary-600 rounded-full -mt-1"
									:style="{ left: progress + '%' }"
								></div>
							</div>
							<div
								class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1"
							>
								<span>{{ formatTime(currentTime) }}</span>
								<span>{{ currentTrack ? currentTrack.duration : '3:25' }}</span>
							</div>
						</div>
					</div>

					<div class="flex justify-center space-x-6">
						<button
							class="text-gray-700 dark:text-gray-300 hover:text-primary-600"
						>
							<i class="fas fa-step-backward text-xl"></i>
						</button>
						<button
							:class="[
								'rounded-full w-12 h-12 flex items-center justify-center text-white shadow-md',
								isPlaying
									? 'bg-primary-600 hover:bg-primary-700'
									: 'bg-green-500 hover:bg-green-600'
							]"
						>
							<i
								:class="
									isPlaying ? 'fas fa-pause text-xl' : 'fas fa-play text-xl'
								"
							></i>
						</button>
						<button
							class="text-gray-700 dark:text-gray-300 hover:text-primary-600"
						>
							<i class="fas fa-step-forward text-xl"></i>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div>
		<h3 class="text-lg font-semibold mb-4">重新选择心情</h3>
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
			<div class="flex flex-col items-center">
				<p class="text-gray-600 dark:text-gray-400 mb-4">
					请选择您的当前心情：
				</p>
				<!-- 情绪选项 - 微调布局和样式 -->
				<div class="grid grid-cols-3 sm:grid-cols-4 gap-3 w-full max-w-2xl">
					<div
						v-for="emotion in emotions"
						:key="emotion.emotion"
						class="emotion-option rounded-lg p-2 cursor-pointer"
						:class="
							selectedEmotion === emotion.emotion ? 'selected-emotion' : ''
						"
						@click="selectEmotion(emotion)"
					>
						<input
							type="radio"
							:id="emotion.emotion"
							:value="emotion.emotion"
							v-model="selectedEmotion"
							class="form-radio text-primary-600 focus:ring-primary-500"
						/>
						<label
							:for="emotion.emotion"
							class="ml-2 text-gray-700 dark:text-gray-300 cursor-pointer"
						>
							{{ emotion.name }}
						</label>
					</div>
				</div>

				<!-- 提交按钮 -->
				<button
					class="mt-6 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-md shadow-md"
					@click="submitEmotion"
				>
					确认选择
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import { keywords } from '/@/data/index1.ts';
import { useMusicStore } from '/@/store/modules/music';

export default {
	name: 'MusicPlayer',
	props: {
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
			default: 30 // 默认进度为30%，让它看起来像正在播放
		},
		initialEmotion: {
			type: String,
			default: 'PA' // 默认情绪
		}
	},
	data() {
		return {
			selectedEmotion: this.initialEmotion,
			emotions: keywords,
			// 装饰性播放器不需要真实歌曲数据
			currentTrack: null
		};
	},
	methods: {
		formatTime(seconds) {
			const mins = Math.floor(seconds / 60);
			const secs = Math.floor(seconds % 60);
			return `${mins}:${secs < 10 ? '0' + secs : secs}`;
		},
		selectEmotion(emotion) {
			this.selectedEmotion = emotion.emotion;
		},
		submitEmotion() {
			useMusicStore().setMusicInfo('emotion', this.selectedEmotion);
		}
	}
};
</script>

<style lang="scss" scoped>
@import '/src/styles/player.scss';
</style>
