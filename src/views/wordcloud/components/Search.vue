<template>
	<div class="search-container">
		<!-- 轮播图区域 -->
		<div class="carousel-wrapper">
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

			<!-- 轮播指示器 -->
			<div class="carousel-indicators">
				<span
					v-for="(_, index) in carouselImages"
					:key="index"
					:class="{ active: index === currentIndex }"
					@click="setActiveSlide(index)"
				></span>
			</div>
		</div>

		<!-- 上传图片提示 -->
		<div class="upload-section" id="image-upload-section">
			<p class="upload-hint">上传一张图片，让我们帮你解读其中的情绪密码</p>
			<label for="image-upload" class="custom-file-upload">
				<span>选择图片</span>
			</label>
			<input
				id="image-upload"
				type="file"
				accept="image/*"
				class="upload-input"
				@change="onImageUpload"
			/>

			<!-- 图片预览 -->
			<div v-if="imagePreview" class="image-preview">
				<img :src="imagePreview" alt="预览图" />
				<span class="remove-preview" @click="removeImage">×</span>
			</div>

			<!-- 提交按钮（图片上传框） -->
			<button class="submit-button" @click="onSubmitImage">
				<span>提交图片分析</span>
			</button>
		</div>

		<!-- 上传文字提示 -->
		<div class="upload-section" id="text-upload-section">
			<p class="upload-hint">
				无论是零散的词句还是心底的长诗，写下它们，我们会为你匹配最懂此刻心事的旋律，
			</p>
			<textarea
				id="text-upload"
				class="text-input"
				placeholder="请输入文字内容，描述您当前的心情..."
				v-model="textContent"
			></textarea>

			<!-- 提交按钮（文字上传框） -->
			<button class="submit-button" @click="onSubmitText">
				<span>提交文字分析</span>
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';

export default defineComponent({
	name: 'Search',
	emits: ['submit-image', 'submit-text'],
	setup(_, { emit }) {
		const imageFile = ref<File | null>(null); // 存储上传的图片文件
		const imagePreview = ref<string | null>(null); // 存储图片预览URL
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
			}, 4000); // 每 4 秒切换一张图片
		};

		const stopCarousel = () => {
			if (intervalId) {
				clearInterval(intervalId);
				intervalId = null;
			}
		};

		// 设置当前轮播图片
		const setActiveSlide = (index: number) => {
			currentIndex.value = index;
			// 重置自动轮播定时器
			stopCarousel();
			startCarousel();
		};

		// 处理图片上传
		const onImageUpload = (event: Event) => {
			const target = event.target as HTMLInputElement;
			if (target.files && target.files[0]) {
				imageFile.value = target.files[0];

				// 创建图片预览
				const reader = new FileReader();
				reader.onload = (e) => {
					imagePreview.value = e.target?.result as string;
				};
				reader.readAsDataURL(target.files[0]);

				console.log('上传的图片文件:', imageFile.value);
			}
		};

		// 移除已上传的图片
		const removeImage = () => {
			imageFile.value = null;
			imagePreview.value = null;
			(document.getElementById('image-upload') as HTMLInputElement).value = '';
		};

		// 提交图片分析
		const onSubmitImage = () => {
			if (!imageFile.value) {
				alert('请上传图片！');
				return;
			}

			// 触发提交事件，将图片传递给父组件
			emit('submit-image', {
				image: imageFile.value
			});

			// 清空图片内容
			imageFile.value = null;
			imagePreview.value = null;
			(document.getElementById('image-upload') as HTMLInputElement).value = '';
		};

		// 提交文字分析
		const onSubmitText = () => {
			if (!textContent.value) {
				alert('请输入文字内容！');
				return;
			}

			// 触发提交事件，将文字内容传递给父组件
			emit('submit-text', {
				text: textContent.value
			});

			// 清空文字内容
			textContent.value = '';
		};

		onMounted(() => {
			startCarousel(); // 开始轮播
		});

		onBeforeUnmount(() => {
			stopCarousel(); // 清除定时器
		});

		return {
			imageFile,
			imagePreview,
			textContent,
			carouselImages,
			currentIndex,
			setActiveSlide,
			onImageUpload,
			removeImage,
			onSubmitImage,
			onSubmitText
		};
	}
});
</script>

<style lang="scss" scoped>
@import '/src/styles/search.scss';
</style>
