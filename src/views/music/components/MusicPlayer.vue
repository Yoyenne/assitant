<template>
	<div>
		<h3 class="text-lg font-semibold mb-4">音乐播放器</h3>
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
			<div class="flex flex-col md:flex-row items-center">
				<div class="w-full md:w-1/3 flex justify-center mb-6 md:mb-0">
					<div
						:class="[
							'w-48 h-48 rounded-full flex items-center justify-center shadow-lg',
							currentTrack
								? currentTrack.bgColor
								: 'bg-gradient-to-r from-gray-300 to-gray-400'
						]"
					>
						<i class="fas fa-music text-white text-4xl"></i>
					</div>
				</div>
				<div class="w-full md:w-2/3 md:pl-8">
					<h4 class="text-xl font-semibold mb-1">
						{{ currentTrack ? currentTrack.title : '未选择歌曲' }}
					</h4>
					<p class="text-gray-600 dark:text-gray-400 mb-4">
						{{ currentTrack ? currentTrack.artist : '选择一首歌曲开始播放' }}
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
								<span>{{ currentTrack ? currentTrack.duration : '0:00' }}</span>
							</div>
						</div>
					</div>

					<div class="flex justify-center space-x-6">
						<button
							@click="$emit('prev-song')"
							class="text-gray-700 dark:text-gray-300 hover:text-primary-600"
						>
							<i class="fas fa-step-backward text-xl"></i>
						</button>
						<button
							@click="$emit('toggle-play')"
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
							@click="$emit('next-song')"
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
				<!-- 情绪选项 -->
				<div class="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-lg">
					<div
						v-for="emotion in emotions"
						:key="emotion"
						class="flex items-center space-x-2 cursor-pointer"
						@click="selectEmotion(emotion)"
					>
						<input
							type="radio"
							:id="emotion"
							:value="emotion"
							v-model="selectedEmotion"
							class="form-radio text-primary-600 focus:ring-primary-500"
						/>
						<label
							:for="emotion"
							class="text-gray-700 dark:text-gray-300 cursor-pointer"
						>
							{{ emotion }}
						</label>
					</div>
				</div>

				<!-- 提交按钮 -->
				<button
					class="mt-6 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-md shadow-md"
					@click="submitEmotion"
				>
					确认选择
				</button>
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
		},
		initialEmotion: {
			type: String,
			default: '快乐'
		}
	},
	data() {
		return {
			selectedEmotion: this.initialEmotion, // 当前选择的情绪
			emotions: [
				'快乐',
				'愤怒',
				'羞',
				'安心',
				'悲伤',
				'烦闷',
				'尊敬',
				'失望',
				'憎恶',
				'赞扬',
				'疚',
				'贬责',
				'相信',
				'思',
				'妒忌',
				'喜爱',
				'慌',
				'怀疑',
				'祝愿',
				'恐惧',
				'惊奇'
			] // 情绪列表
		};
	},
	methods: {
		formatTime(seconds) {
			const mins = Math.floor(seconds / 60);
			const secs = Math.floor(seconds % 60);
			return `${mins}:${secs < 10 ? '0' + secs : secs}`;
		},
		selectEmotion(emotion) {
			this.selectedEmotion = emotion; // 更新选中的情绪
		},
		submitEmotion() {
			// 触发事件，将选择的情绪传递给父组件
			this.$emit('emotion-selected', this.selectedEmotion);
			alert(`您选择的心情是：${this.selectedEmotion}`);
		}
	}
};
</script>

<style scoped>
/* 样式保持简洁 */
.form-select {
	border: 1px solid #d1d5db;
	transition: all 0.2s ease-in-out;
}

.form-select:focus {
	outline: none;
	border-color: #6b7280;
	box-shadow: 0 0 0 2px rgba(107, 114, 128, 0.2);
}

.form-radio {
	accent-color: #6b7280; /* 自定义单选按钮颜色 */
	cursor: pointer;
}

.form-radio:focus {
	outline: none;
	box-shadow: 0 0 0 2px rgba(107, 114, 128, 0.2);
}

label {
	cursor: pointer;
}

.grid {
	display: grid;
	gap: 1rem;
}

/* 提交按钮样式 */
button {
	background: linear-gradient(135deg, #6a5acd, #836fff); /* 渐变背景色 */
	color: white; /* 文字颜色为白色 */
	font-weight: bold; /* 加粗文字 */
	border: none; /* 去掉边框 */
	border-radius: 8px; /* 圆角 */
	padding: 0.6rem 1.2rem; /* 内边距 */
	cursor: pointer; /* 鼠标悬停时显示手型 */
	transition: all 0.3s ease; /* 添加过渡效果 */
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 添加阴影 */
}

button:hover {
	background: linear-gradient(135deg, #836fff, #6a5acd); /* 悬停时调整渐变色 */
	transform: translateY(-2px); /* 悬停时向上移动 */
	box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2); /* 悬停时增加阴影 */
}

button:active {
	transform: translateY(0); /* 点击时恢复原位 */
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 点击时恢复阴影 */
}
</style>
