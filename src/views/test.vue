<template>
	<!-- 使用 MainLayout 作为页面的布局 -->
	<main-layout page-title="心理健康自测">
		<!-- 页面顶部的欢迎信息 -->
		<div class="bg-white shadow sm:rounded-lg">
			<div class="px-4 py-5 sm:p-6">
				<!-- 标题 -->
				<h2 class="text-lg leading-6 font-medium text-gray-900">
					欢迎使用心理健康助手
				</h2>
				<!-- 描述信息 -->
				<div class="mt-2 max-w-xl text-sm text-gray-500">
					<p>
						我们提供专业的心理健康评估、在线咨询和学习资源，帮助您维护心理健康。
					</p>
				</div>
				<!-- 开始心理测评按钮 -->
				<div class="mt-5">
					<button
						type="button"
						class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						开始心理测评
					</button>
				</div>
			</div>
		</div>

		<!-- 心理健康卡片区域 -->
		<div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			<!-- 卡片 1：焦虑自测 -->
			<div class="bg-white overflow-hidden shadow rounded-lg">
				<div class="px-4 py-5 sm:p-6">
					<!-- 卡片标题 -->
					<h3 class="text-lg leading-6 font-medium text-gray-900">焦虑自测</h3>
					<!-- 卡片描述 -->
					<div class="mt-2 max-w-xl text-sm text-gray-500">
						<p>快速评估您当前的焦虑水平，并获取专业建议。</p>
					</div>
					<!-- 开始测试按钮 -->
					<div class="mt-3">
						<button
							type="button"
							class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							开始测试
						</button>
					</div>
				</div>
			</div>

			<!-- 卡片 2：抑郁筛查 -->
			<div class="bg-white overflow-hidden shadow rounded-lg">
				<div class="px-4 py-5 sm:p-6">
					<!-- 卡片标题 -->
					<h3 class="text-lg leading-6 font-medium text-gray-900">抑郁筛查</h3>
					<!-- 卡片描述 -->
					<div class="mt-2 max-w-xl text-sm text-gray-500">
						<p>专业的抑郁症筛查工具，帮助您了解自己的情绪状态。</p>
					</div>
					<!-- 开始测试按钮 -->
					<div class="mt-3">
						<button
							type="button"
							class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							开始测试
						</button>
					</div>
				</div>
			</div>

			<!-- 卡片 3：压力评估 -->
			<div class="bg-white overflow-hidden shadow rounded-lg">
				<div class="px-4 py-5 sm:p-6">
					<!-- 卡片标题 -->
					<h3 class="text-lg leading-6 font-medium text-gray-900">压力评估</h3>
					<!-- 卡片描述 -->
					<div class="mt-2 max-w-xl text-sm text-gray-500">
						<p>评估您的压力水平，了解如何有效管理日常压力。</p>
					</div>
					<!-- 开始测试按钮 -->
					<div class="mt-3">
						<button
							type="button"
							class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							开始测试
						</button>
					</div>
				</div>
			</div>
		</div>
	</main-layout>
</template>

<script>
/* 引入 MainLayout 布局组件 */
import MainLayout from '/@/layouts/MainLayout.vue';

export default {
	name: 'Home', // 当前页面的名称
	components: {
		MainLayout // 注册 MainLayout 组件
	}
};
</script>
