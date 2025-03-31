<template>
	<div class="search-container">
		<!-- 轮播图 -->
		<div class="carousel">
			<div
				v-for="(image, index) in carouselImages"
				:key="index"
				class="carousel-item"
				:class="{ active: index === currentIndex }"
			>
				<img :src="image" alt="轮播图" class="carousel-image" />
			</div>
		</div>

		<!-- 上传图片提示 -->
		<div class="upload-section" id="image-upload-section">
			<p class="upload-hint">上传图片识别心情：</p>
			<input
				id="image-upload"
				type="file"
				accept="image/*"
				class="upload-input"
				@change="onImageUpload"
			/>
		</div>

		<!-- 上传文字提示 -->
		<div class="upload-section" id="text-upload-section">
			<p class="upload-hint">上传文字识别心情：</p>
			<textarea
				id="text-upload"
				class="text-input"
				placeholder="请输入文字内容"
				v-model="textContent"
			></textarea>
		</div>

		<!-- 提交按钮 -->
		<button class="submit-button" @click="onSubmit">提交</button>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';

export default defineComponent({
	name: 'Search',
	emits: ['submit'],
	setup(_, { emit }) {
		const imageFile = ref<File | null>(null); // 存储上传的图片文件
		const textContent = ref(''); // 存储上传的文字内容
		const carouselImages = ref([
			'/src/assets/images/angery.png',
			'/src/assets/images/cry1.png',
			'/src/assets/images/happy.png'
		]); // 轮播图图片路径
		const currentIndex = ref(0); // 当前显示的图片索引
		let intervalId: ReturnType<typeof setInterval> | null = null; // 定时器 ID

		// 自动轮播逻辑
		const startCarousel = () => {
			intervalId = setInterval(() => {
				currentIndex.value =
					(currentIndex.value + 1) % carouselImages.value.length;
			}, 3000); // 每 3 秒切换一张图片
		};

		const stopCarousel = () => {
			if (intervalId) {
				clearInterval(intervalId);
				intervalId = null;
			}
		};

		// 处理图片上传
		const onImageUpload = (event: Event) => {
			const target = event.target as HTMLInputElement;
			if (target.files && target.files[0]) {
				imageFile.value = target.files[0];
				console.log('上传的图片文件:', imageFile.value);
			}
		};

		// 提交数据
		const onSubmit = () => {
			if (!imageFile.value && !textContent.value) {
				alert('请上传图片或输入文字内容！');
				return;
			}

			// 触发提交事件，将图片和文字内容传递给父组件
			emit('submit', {
				image: imageFile.value,
				text: textContent.value
			});

			// 清空输入内容
			imageFile.value = null;
			textContent.value = '';
			(document.getElementById('image-upload') as HTMLInputElement).value = '';
		};

		onMounted(() => {
			startCarousel(); // 开始轮播
		});

		onBeforeUnmount(() => {
			stopCarousel(); // 清除定时器
		});

		return {
			imageFile,
			textContent,
			carouselImages,
			currentIndex,
			onImageUpload,
			onSubmit
		};
	}
});
</script>

<style scoped>
@import '/src/styles/search.scss';
</style>
