<template>
	<p class="word-cloud-title">请选择你现在的心情</p>
	<div ref="refChart" class="word-cloud-box">
	  <!-- 添加云朵动画容器 -->
	  <div class="cloud-animation-container">
		<div class="floating-cloud cloud1"></div>
		<div class="floating-cloud cloud2"></div>
		<div class="floating-cloud cloud3"></div>
		<div class="floating-cloud cloud4"></div>
	  </div>
	</div>
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
									Math.round(Math.random() * 40) + 80,  // 较低的红色值
                    				Math.round(Math.random() * 80) + 140, // 中等的绿色值
                    				Math.round(Math.random() * 40) + 210  // 较高的蓝色值
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
@import '/src/styles/wordcloud.scss';
</style>
