<template>
	<p class="word-cloud-title">请选择你现在的心情</p>
	<div ref="refChart" class="word-cloud-box"></div>
</template>

<script>
import { defineComponent, nextTick, ref } from 'vue';
import * as Echarts from 'echarts';
import 'echarts-wordcloud';
import maskImagePath from '/@/assets/images/mask-image.png';

export default defineComponent({
	name: 'WordCloud',
	props: {
		keywords: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	setup(props) {
		const refChart = ref(null);
		const chartInstance = ref(null);

		nextTick(() => {
			chartInstance.value = Echarts.init(refChart.value);
			const maskImage = new Image();

			const options = {
				tooltip: {},
				series: [
					{
						type: 'wordCloud',
						rotationRange: [-90, 90],
						gridSize: 10, // 增大文字间距
						maskImage: maskImage,
						drawOutOfBound: false,
						layoutAnimation: true,
						keepAspect: false,
						textStyle: {
							fontWeight: 'bold',
							color: function () {
								return (
									'rgb(' +
									[
										Math.round(Math.random() * 200) + 50,
										Math.round(Math.random() * 50),
										Math.round(Math.random() * 50) + 50
									].join(',') +
									')'
								);
							}
						},
						emphasis: {
							textStyle: {
								color: '#528'
							}
						},
						data: props.keywords
					}
				]
			};

			maskImage.onload = () => {
				chartInstance.value.setOption(options);
			};
			maskImage.src = maskImagePath;
		});
		return {
			maskImagePath,
			refChart
		};
	}
});
</script>

<style lang="scss" scoped>
.word-cloud-title {
	font-size: 2rem; 
	font-weight: bold; 
	color: #333; 
	text-align: center; 
	margin-top: 1rem; 
}

.word-cloud-box {
	width: 100%;
	height: 100%;
	position: relative;
	background-image: url('/src/assets/images/love.svg');
	background-position: left bottom; /* 图片放置在左下角 */
	background-repeat: no-repeat;
	background-size: 25%; 
}

</style>
