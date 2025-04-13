<template>
	<!-- 使用 MainLayout 作为页面的布局 -->
	<main-layout page-title="心理健康测评">
		<div class="assessment-container">
			<div class="text-center mb-10">
				<h3 class="text-2xl font-bold mb-3 text-primary-700 dark:text-primary-300">
					心理健康测评
				</h3>
				<p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
					通过科学的测评量表，了解您当前的心理健康状况
				</p>
			</div>

			<!-- 问卷列表 -->
			<div
				v-if="!activeQuestionnaire"
				class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
			>
				<div
					v-for="questionnaire in questionnaires"
					:key="questionnaire.id"
					class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl overflow-hidden scale-animation border border-gray-100 dark:border-gray-700"
				>
					<div
						:class="[
							'h-28 flex items-center justify-center',
							questionnaire.bgColor
						]"
					>
						<i :class="['text-white text-4xl', questionnaire.icon]"></i>
					</div>
					<div class="p-6">
						<h4 class="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100">
							{{ questionnaire.title }}
						</h4>
						<p class="text-gray-600 dark:text-gray-400 text-sm mb-3">
							{{ questionnaire.questions.length }}道题目，约需{{
								questionnaire.timeEstimate
							}}分钟
						</p>
						<p class="text-xs text-gray-500 dark:text-gray-400 mb-5">
							{{ questionnaire.description }}
						</p>
						<button
							@click="startQuestionnaire(questionnaire.id)"
							class="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all duration-300 font-medium flex items-center justify-center shadow-md hover:shadow-lg"
						>
							<i class="fas fa-clipboard-check mr-2"></i> 开始测评
						</button>
					</div>
				</div>
			</div>

			<!-- 进行中的问卷 -->
			<div
				v-if="activeQuestionnaire"
				class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-3xl mx-auto border border-gray-100 dark:border-gray-700"
			>
				<div class="flex items-center justify-between mb-6">
					<h3 class="text-xl font-bold text-primary-700 dark:text-primary-300">
						{{ currentQuestionnaire.title }}
					</h3>
					<button
						@click="exitQuestionnaire"
						class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
					>
						<i class="fas fa-times"></i>
					</button>
				</div>

				<!-- 进度条 -->
				<div class="mb-8">
					<div
						class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2"
					>
						<span>测评进度</span>
						<span
							>{{ currentQuestionIndex + 1 }}/{{
								currentQuestionnaire.questions.length
							}}</span
						>
					</div>
					<div class="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
						<div
							class="h-full bg-primary-600 rounded-full transition-all duration-500 ease-in-out"
							:style="{
								width: `${
									((currentQuestionIndex + 1) /
										currentQuestionnaire.questions.length) *
									100
								}%`
							}"
						></div>
					</div>
				</div>

				<!-- 当前问题 -->
				<div class="mb-10">
					<h4 class="text-lg font-medium mb-6 text-gray-800 dark:text-gray-200">{{ currentQuestion.text }}</h4>

					<div class="space-y-4">
						<div
							v-for="(option, index) in currentQuestion.options"
							:key="index"
							@click="selectAnswer(index)"
							:class="[
								'p-4 rounded-xl cursor-pointer transition-all duration-200',
								answers[currentQuestionIndex] === index
									? 'bg-primary-50 border-2 border-primary-600 dark:bg-primary-900/40 dark:border-primary-400'
									: 'bg-gray-50 border-2 border-gray-200 hover:bg-gray-100 dark:bg-gray-700/50 dark:border-gray-600 dark:hover:bg-gray-600/70'
							]"
						>
							<div class="flex items-center">
								<div
									:class="[
										'w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-all',
										answers[currentQuestionIndex] === index
											? 'border-primary-600 dark:border-primary-400'
											: 'border-gray-400 dark:border-gray-500'
									]"
								>
									<div
										v-if="answers[currentQuestionIndex] === index"
										class="w-3 h-3 rounded-full bg-primary-600 dark:bg-primary-400 animate-scale-in"
									></div>
								</div>
								<span class="text-gray-800 dark:text-gray-200">{{ option.text }}</span>
							</div>
						</div>
					</div>
				</div>

				<!-- 导航按钮 -->
				<div class="flex justify-between">
					<button
						@click="prevQuestion"
						:disabled="currentQuestionIndex === 0"
						:class="[
							'px-6 py-3 rounded-xl transition-all font-medium flex items-center',
							currentQuestionIndex === 0
								? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
								: 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
						]"
					>
						<i class="fas fa-arrow-left mr-2"></i> 上一题
					</button>

					<button
						v-if="
							currentQuestionIndex < currentQuestionnaire.questions.length - 1
						"
						@click="nextQuestion"
						:disabled="answers[currentQuestionIndex] === undefined"
						:class="[
							'px-6 py-3 rounded-xl transition-all font-medium flex items-center',
							answers[currentQuestionIndex] === undefined
								? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
								: 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg'
						]"
					>
						下一题 <i class="fas fa-arrow-right ml-2"></i>
					</button>

					<button
						v-else
						@click="completeQuestionnaire"
						:disabled="answers[currentQuestionIndex] === undefined"
						:class="[
							'px-6 py-3 rounded-xl transition-all font-medium flex items-center',
							answers[currentQuestionIndex] === undefined
								? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
								: 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
						]"
					>
						<i class="fas fa-check-circle mr-2"></i> 完成测评
					</button>
				</div>
			</div>

			<!-- 结果显示模态框 -->
			<div
				v-if="showResults"
				class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 backdrop-blur-sm"
			>
				<div
					class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-0 max-w-2xl w-full mx-4 animate-scale-in"
				>
					<div class="p-6 border-b border-gray-200 dark:border-gray-700">
						<div class="flex justify-between items-center">
							<h3 class="text-xl font-bold text-primary-700 dark:text-primary-300">测评结果</h3>
							<button
								@click="closeResults"
								class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"
							>
								<i class="fas fa-times"></i>
							</button>
						</div>
					</div>

					<div class="p-8">
						<div class="flex items-center justify-center mb-6">
							<div
								:class="[
									'w-28 h-28 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg',
									getScoreColor(testScore.score)
								]"
							>
								{{ testScore.score }}
							</div>
						</div>

						<h4 class="text-center text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">
							{{ testScore.level }}
						</h4>
						<p class="text-gray-600 dark:text-gray-400 text-center mb-6">
							{{ testScore.description }}
						</p>

						<div class="h-3 bg-gray-200 dark:bg-gray-700 rounded-full mb-2 overflow-hidden">
							<div
								:class="['h-full rounded-full', getScoreColor(testScore.score)]"
								:style="{
									width: `${(testScore.score / testScore.maxScore) * 100}%`
								}"
							></div>
						</div>
						<div
							class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-8"
						>
							<span>轻微</span>
							<span>中度</span>
							<span>严重</span>
						</div>

						<div class="space-y-4 mb-8 bg-gray-50 dark:bg-gray-700/30 p-6 rounded-xl">
							<h4 class="font-bold text-gray-800 dark:text-gray-200">建议与应对措施:</h4>
							<ul
								class="list-disc pl-5 space-y-3 text-gray-600 dark:text-gray-400"
							>
								<li
									v-for="(suggestion, index) in testScore.suggestions"
									:key="index"
								>
									{{ suggestion }}
								</li>
							</ul>
						</div>
					</div>

					<div class="bg-gray-50 dark:bg-gray-700/30 px-6 py-4 rounded-b-2xl flex justify-end space-x-4">
						<button
							@click="closeResults"
							class="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-all dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 font-medium"
						>
							关闭
						</button>
						<button
							@click="saveResults"
							class="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg font-medium flex items-center"
						>
							<i class="fas fa-save mr-2"></i> 保存结果
						</button>
					</div>
				</div>
			</div>

			<!-- 历史记录表格 -->
			<div v-if="!activeQuestionnaire" class="mt-16">
				<h3 class="text-xl font-bold mb-6 text-primary-700 dark:text-primary-300 flex items-center">
					<i class="fas fa-history mr-3"></i> 我的测评记录
				</h3>
				<div
					class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
				>
					<div v-if="history.length === 0" class="py-16 text-center">
						<i
							class="fas fa-clipboard-list text-6xl text-gray-300 dark:text-gray-600 mb-6"
						></i>
						<p class="text-gray-500 dark:text-gray-400 text-xl">暂无测评记录</p>
					</div>

					<div v-else class="overflow-x-auto">
						<table class="w-full text-left">
							<thead>
								<tr class="bg-primary-50 dark:bg-primary-900/30">
									<th
										class="px-6 py-5 text-sm font-bold text-primary-700 dark:text-primary-300 border-b-2 border-primary-200 dark:border-primary-800"
									>
										测评名称
									</th>
									<th
										class="px-6 py-5 text-sm font-bold text-primary-700 dark:text-primary-300 border-b-2 border-primary-200 dark:border-primary-800"
									>
										完成时间
									</th>
									<th
										class="px-6 py-5 text-sm font-bold text-primary-700 dark:text-primary-300 border-b-2 border-primary-200 dark:border-primary-800"
									>
										结果
									</th>
									<th
										class="px-6 py-5 text-sm font-bold text-primary-700 dark:text-primary-300 border-b-2 border-primary-200 dark:border-primary-800"
									>
										变化趋势
									</th>
									<th
										class="px-6 py-5 text-sm font-bold text-primary-700 dark:text-primary-300 border-b-2 border-primary-200 dark:border-primary-800"
									>
										操作
									</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="(record, index) in history"
									:key="record.id"
									:class="[
										index % 2 === 0
											? 'bg-white dark:bg-gray-800'
											: 'bg-gray-50 dark:bg-gray-800/50',
										'hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors'
									]"
								>
									<td
										class="px-6 py-5 text-sm border-b border-gray-200 dark:border-gray-700"
									>
										<span class="font-semibold text-gray-800 dark:text-gray-200">{{ record.title }}</span>
									</td>
									<td
										class="px-6 py-5 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700"
									>
										{{ record.dateTime }}
									</td>
									<td
										class="px-6 py-5 border-b border-gray-200 dark:border-gray-700"
									>
										<span
											:class="[
												'px-4 py-2 text-xs font-bold rounded-full shadow-sm',
												record.levelClass
											]"
											>{{ record.level }} ({{ record.score }}分)</span
										>
									</td>
									<td
										class="px-6 py-5 border-b border-gray-200 dark:border-gray-700"
									>
										<span
											:class="[
												'flex items-center font-medium',
												record.trendClass
											]"
										>
											<i :class="record.trendIcon + ' mr-2 text-lg'"></i>
											{{ record.trendText }}
										</span>
									</td>
									<td
										class="px-6 py-5 text-sm border-b border-gray-200 dark:border-gray-700"
									>
										<button
											@click="viewRecord(record.id)"
											class="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors shadow-sm hover:shadow-md flex items-center"
										>
											<i class="fas fa-chart-line mr-2"></i>
											查看详情
										</button>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<!-- 查看详情 -->
			<div
				v-if="showDetails"
				class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 backdrop-blur-sm"
			>
				<div
					class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-0 w-[70%] max-w-4xl mx-4 animate-fadeIn"
				>
					<div
						class="bg-primary-50 dark:bg-primary-900/30 px-6 py-5 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl flex justify-between items-center"
					>
						<h3
							class="text-xl font-bold text-primary-700 dark:text-primary-300"
						>
							测评历史详情
						</h3>
						<button
							@click="showDetails = false"
							class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
						>
							<i class="fas fa-times"></i>
						</button>
					</div>

					<div class="p-6">
						<div class="overflow-x-auto">
							<table class="w-full text-left">
								<thead>
									<tr class="bg-primary-50 dark:bg-primary-900/30">
										<th
											class="px-6 py-4 text-sm font-bold text-primary-700 dark:text-primary-300 border-b-2 border-primary-200 dark:border-primary-800"
										>
											测评名称
										</th>
										<th
											class="px-6 py-4 text-sm font-bold text-primary-700 dark:text-primary-300 border-b-2 border-primary-200 dark:border-primary-800"
										>
											完成时间
										</th>
										<th
											class="px-6 py-4 text-sm font-bold text-primary-700 dark:text-primary-300 border-b-2 border-primary-200 dark:border-primary-800"
										>
											结果
										</th>
										<th
											class="px-6 py-4 text-sm font-bold text-primary-700 dark:text-primary-300 border-b-2 border-primary-200 dark:border-primary-800"
										>
											变化趋势
										</th>
									</tr>
								</thead>
								<tbody>
									<tr
										v-for="(record, index) in detailsList"
										:key="record.id"
										:class="[
											index % 2 === 0
												? 'bg-white dark:bg-gray-800'
												: 'bg-gray-50 dark:bg-gray-800/50',
											'hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors'
										]"
									>
										<td
											class="px-6 py-5 text-sm border-b border-gray-200 dark:border-gray-700"
										>
											<span class="font-semibold text-gray-800 dark:text-gray-200">{{ record.title }}</span>
										</td>
										<td
											class="px-6 py-5 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700"
										>
											{{ record.dateTime }}
										</td>
										<td
											class="px-6 py-5 border-b border-gray-200 dark:border-gray-700"
										>
											<span
												:class="[
													'px-4 py-2 text-xs font-bold rounded-full shadow-sm',
													record.levelClass
												]"
												>{{ record.level }} ({{ record.score }}分)</span
											>
										</td>
										<td
											class="px-6 py-5 border-b border-gray-200 dark:border-gray-700"
										>
											<span
												:class="[
													'flex items-center font-medium',
													record.trendClass
												]"
											>
												<i :class="record.trendIcon + ' mr-2 text-lg'"></i>
												{{ record.trendText }}
											</span>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					<div
						class="bg-gray-50 dark:bg-gray-800/50 px-6 py-5 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl flex justify-end"
					>
						<button
							@click="showDetails = false"
							class="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors shadow-md hover:shadow-lg font-medium flex items-center"
						>
							<i class="fas fa-times-circle mr-2"></i> 关闭
						</button>
					</div>
				</div>
			</div>
		</div>
	</main-layout>
</template>

<script>
import MainLayout from '@/layouts/MainLayout.vue';
import { ref, computed, onMounted } from 'vue';
import { questionnaireApi } from '/@/api/questionnaire';

export default {
	name: 'AssessmentPage',
	components: {
		MainLayout
	},
	setup() {
		// 测评问卷数据
		const questionnaires = ref([
			{
				id: 1,
				title: '抑郁症筛查（PHQ-9）',
				description: '测评抑郁症状严重程度的量表，广泛用于临床筛查',
				timeEstimate: '2',
				icon: 'fas fa-brain',
				bgColor: 'bg-gradient-to-r from-blue-400 to-indigo-500',
				questions: [
					{
						text: '在过去的两周内，有多少天您感到做事时提不起劲或没有兴趣？',
						options: [
							{ text: '完全没有', value: 0 },
							{ text: '有几天', value: 1 },
							{ text: '一半以上时间', value: 2 },
							{ text: '几乎每天', value: 3 }
						]
					},
					{
						text: '在过去的两周内，有多少天您感到情绪低落、沮丧或无望？',
						options: [
							{ text: '完全没有', value: 0 },
							{ text: '有几天', value: 1 },
							{ text: '一半以上时间', value: 2 },
							{ text: '几乎每天', value: 3 }
						]
					},
					{
						text: '在过去的两周内，有多少天您入睡困难、易醒或睡眠过多？',
						options: [
							{ text: '完全没有', value: 0 },
							{ text: '有几天', value: 1 },
							{ text: '一半以上时间', value: 2 },
							{ text: '几乎每天', value: 3 }
						]
					},
					{
						text: '在过去的两周内，有多少天您感到疲劳或缺乏精力？',
						options: [
							{ text: '完全没有', value: 0 },
							{ text: '有几天', value: 1 },
							{ text: '一半以上时间', value: 2 },
							{ text: '几乎每天', value: 3 }
						]
					},
					{
						text: '在过去的两周内，有多少天您食欲不振或吃得过多？',
						options: [
							{ text: '完全没有', value: 0 },
							{ text: '有几天', value: 1 },
							{ text: '一半以上时间', value: 2 },
							{ text: '几乎每天', value: 3 }
						]
					},
					{
						text: '在过去的两周内，有多少天您感到自己很糟糕，或者觉得自己是个失败者，或者让自己或家人失望？',
						options: [
							{ text: '完全没有', value: 0 },
							{ text: '有几天', value: 1 },
							{ text: '一半以上时间', value: 2 },
							{ text: '几乎每天', value: 3 }
						]
					},
					{
						text: '在过去的两周内，有多少天您对事物难以集中注意力，例如阅读报纸或看电视？',
						options: [
							{ text: '完全没有', value: 0 },
							{ text: '有几天', value: 1 },
							{ text: '一半以上时间', value: 2 },
							{ text: '几乎每天', value: 3 }
						]
					},
					{
						text: '在过去的两周内，有多少天您行动或说话缓慢到别人已经注意到？或者相反，您比平常更烦躁或坐立不安？',
						options: [
							{ text: '完全没有', value: 0 },
							{ text: '有几天', value: 1 },
							{ text: '一半以上时间', value: 2 },
							{ text: '几乎每天', value: 3 }
						]
					},
					{
						text: '在过去的两周内，有多少天您有过自残或轻生的念头，或者觉得自己活着没有意义？',
						options: [
							{ text: '完全没有', value: 0 },
							{ text: '有几天', value: 1 },
							{ text: '一半以上时间', value: 2 },
							{ text: '几乎每天', value: 3 }
						]
					}
				]
			},
			{
				id: 2,
				title: '睡眠质量指数（PSQI）',
				description: '评估睡眠质量和睡眠障碍的标准化问卷',
				timeEstimate: '2',
				icon: 'fas fa-moon',
				bgColor: 'bg-gradient-to-r from-purple-400 to-pink-500',
				questions: [
					{
						text: '过去一个月，您通常需要多长时间才能入睡？',
						options: [
							{ text: '5分钟以内', value: 0 },
							{ text: '6-15分钟', value: 1 },
							{ text: '16-30分钟', value: 2 },
							{ text: '30分钟以上', value: 3 }
						]
					},
					{
						text: '过去一个月，您每晚平均睡眠时长是多少小时？',
						options: [
							{ text: '少于4小时', value: 3 },
							{ text: '4-5小时', value: 2 },
							{ text: '6-7小时', value: 1 },
							{ text: '8小时及以上', value: 0 }
						]
					},
					{
						text: '过去一个月，您是否因以下情况而夜间醒来或早醒？',
						options: [
							{ text: '从未', value: 0 },
							{ text: '偶尔', value: 1 },
							{ text: '经常', value: 2 },
							{ text: '几乎每晚', value: 3 }
						]
					},
					{
						text: '过去一个月，您感觉睡眠质量如何？',
						options: [
							{ text: '很好', value: 0 },
							{ text: '较好', value: 1 },
							{ text: '较差', value: 2 },
							{ text: '很差', value: 3 }
						]
					},
					{
						text: '过去一个月，您是否有打鼾的情况？',
						options: [
							{ text: '没有', value: 0 },
							{ text: '偶尔', value: 1 },
							{ text: '经常', value: 2 },
							{ text: '几乎每晚', value: 3 }
						]
					},
					{
						text: '过去一个月，您白天是否感到困倦或精力不足？',
						options: [
							{ text: '完全没有', value: 0 },
							{ text: '有几天', value: 1 },
							{ text: '一半以上时间', value: 2 },
							{ text: '几乎每天', value: 3 }
						]
					},
					{
						text: '过去一个月，您是否因睡眠问题影响到日常工作或社交？',
						options: [
							{ text: '完全没有', value: 0 },
							{ text: '有一点影响', value: 1 },
							{ text: '有较大影响', value: 2 },
							{ text: '影响严重', value: 3 }
						]
					}
				]
			},
			{
				id: 3,
				title: '压力感知量表（PSS）',
				description: '测量个体对生活中压力事件的感知程度',
				timeEstimate: '3',
				icon: 'fas fa-heartbeat',
				bgColor: 'bg-gradient-to-r from-red-400 to-orange-500',
				questions: [
					{
						text: '在过去的一个月里，您感觉无法控制生活中的重要事情的频率？',
						options: [
							{ text: '从不', value: 0 },
							{ text: '很少', value: 1 },
							{ text: '有时', value: 2 },
							{ text: '经常', value: 3 },
							{ text: '总是', value: 4 }
						]
					},
					{
						text: '在过去的一个月里，您感到紧张或压力的频率？',
						options: [
							{ text: '从不', value: 0 },
							{ text: '很少', value: 1 },
							{ text: '有时', value: 2 },
							{ text: '经常', value: 3 },
							{ text: '总是', value: 4 }
						]
					},
					{
						text: '在过去的一个月里，您觉得事情正按着您的期望进行的频率？',
						options: [
							{ text: '从不', value: 4 },
							{ text: '很少', value: 3 },
							{ text: '有时', value: 2 },
							{ text: '经常', value: 1 },
							{ text: '总是', value: 0 }
						]
					},
					{
						text: '在过去的一个月里，您感到无法应对所有需要做的事情的频率？',
						options: [
							{ text: '从不', value: 0 },
							{ text: '很少', value: 1 },
							{ text: '有时', value: 2 },
							{ text: '经常', value: 3 },
							{ text: '总是', value: 4 }
						]
					},
					{
						text: '在过去的一个月里，您感到无法控制生活中发生的事情的频率？',
						options: [
							{ text: '从不', value: 0 },
							{ text: '很少', value: 1 },
							{ text: '有时', value: 2 },
							{ text: '经常', value: 3 },
							{ text: '总是', value: 4 }
						]
					},
					{
						text: '在过去的一个月里，您感到愤怒，因为事情超出了您的控制范围的频率？',
						options: [
							{ text: '从不', value: 0 },
							{ text: '很少', value: 1 },
							{ text: '有时', value: 2 },
							{ text: '经常', value: 3 },
							{ text: '总是', value: 4 }
						]
					},
					{
						text: '在过去的一个月里，您觉得困难堆积如山，无法克服的频率？',
						options: [
							{ text: '从不', value: 0 },
							{ text: '很少', value: 1 },
							{ text: '有时', value: 2 },
							{ text: '经常', value: 3 },
							{ text: '总是', value: 4 }
						]
					}
				]
			},
		]);

		// 历史记录数据
		const history = ref([]);

		// 状态变量
		const activeQuestionnaire = ref(null);
		const currentQuestionIndex = ref(0);
		const answers = ref([]);
		const showResults = ref(false);
		const testScore = ref({
			score: 0,
			maxScore: 0,
			level: '',
			description: '',
			suggestions: []
		});

		// 当前问卷和问题
		const currentQuestionnaire = computed(() => {
			if (!activeQuestionnaire.value) return null;
			return questionnaires.value.find(
				(q) => q.id === activeQuestionnaire.value
			);
		});

		const currentQuestion = computed(() => {
			if (!currentQuestionnaire.value) return null;
			return currentQuestionnaire.value.questions[currentQuestionIndex.value];
		});

		// 开始测评
		const startQuestionnaire = (id) => {
			activeQuestionnaire.value = id;
			currentQuestionIndex.value = 0;
			answers.value = new Array(
				questionnaires.value.find((q) => q.id === id).questions.length
			).fill(undefined);
		};

		// 退出测评
		const exitQuestionnaire = () => {
			if (confirm('确定要退出当前测评吗？您的进度将不会被保存。')) {
				activeQuestionnaire.value = null;
			}
		};

		// 选择答案
		const selectAnswer = (optionIndex) => {
			answers.value[currentQuestionIndex.value] = optionIndex;
		};

		// 前一题/后一题
		const prevQuestion = () => {
			if (currentQuestionIndex.value > 0) {
				currentQuestionIndex.value--;
			}
		};

		const nextQuestion = () => {
			if (
				currentQuestionIndex.value <
					currentQuestionnaire.value.questions.length - 1 &&
				answers.value[currentQuestionIndex.value] !== undefined
			) {
				currentQuestionIndex.value++;
			}
		};

		// 完成测评
		const completeQuestionnaire = () => {
			if (answers.value[currentQuestionIndex.value] === undefined) return;

			// 计算得分
			let totalScore = 0;
			let maxScore = 0;

			answers.value.forEach((answer, index) => {
				if (
					answer !== undefined &&
					currentQuestionnaire.value.questions[index]
				) {
					totalScore +=
						currentQuestionnaire.value.questions[index].options[answer].value;
					maxScore += 3; // 假设每个问题最高分为3
				}
			});

			// 设置结果
			testScore.value = {
				score: totalScore,
				maxScore: maxScore,
				level: getLevel(totalScore, currentQuestionnaire.value.id),
				description: getLevelDescription(
					totalScore,
					currentQuestionnaire.value.id
				),
				suggestions: getSuggestions(totalScore, currentQuestionnaire.value.id)
			};

			showResults.value = true;
		};

		// 根据得分获取级别
		const getLevel = (score, questionnaireId) => {
			if (questionnaireId === 1) {
				// PHQ-9
				if (score < 5) return '无或轻微抑郁';
				if (score < 10) return '轻度抑郁';
				if (score < 15) return '中度抑郁';
				if (score < 20) return '中重度抑郁';
				return '重度抑郁';
			}
			return '未知级别';
		};

		// 获取级别描述
		const getLevelDescription = (score, questionnaireId) => {
			if (questionnaireId === 1) {
				// PHQ-9
				if (score < 5) return '您的抑郁症状极轻或没有，心理状态良好。';
				if (score < 10)
					return '您有轻微的抑郁症状，可能需要关注自己的心理健康。';
				if (score < 15) return '您有中度抑郁症状，建议考虑寻求专业帮助。';
				if (score < 20) return '您有中重度抑郁症状，强烈建议咨询专业心理医生。';
				return '您有重度抑郁症状，请尽快寻求专业医疗帮助。';
			}
			return '测评完成，感谢参与。';
		};

		// 获取建议
		const getSuggestions = (score, questionnaireId) => {
			if (questionnaireId === 1) {
				// PHQ-9
				if (score < 5) {
					return [
						'保持健康的生活方式和积极心态',
						'定期锻炼身体，保持社交活动',
						'当遇到压力时，尝试放松技巧如深呼吸或冥想'
					];
				}
				if (score < 10) {
					return [
						'增加日常活动和社交互动',
						'学习压力管理技巧',
						'保持规律的作息时间',
						'可考虑参加一些心理健康相关讲座或课程'
					];
				}
				return [
					'建议咨询专业心理医生或精神科医生',
					'学习认知行为疗法等自助技巧',
					'保持与亲友的沟通，不要独自面对问题',
					'确保充足的睡眠和健康的饮食'
				];
			}
			return ['感谢参与测评，建议定期关注自己的心理健康状况。'];
		};

		// 获取分数对应的颜色类
		const getScoreColor = (score) => {
			if (score < 5) return 'bg-green-500';
			if (score < 10) return 'bg-yellow-500';
			if (score < 15) return 'bg-orange-500';
			return 'bg-red-500';
		};

		// 关闭结果
		const closeResults = () => {
			showResults.value = false;
			activeQuestionnaire.value = null;
		};

		// 保存结果
		const saveResults = async () => {
			const res = await questionnaireApi.submitMentalRecord({
				score: testScore.value.score,
				level: testScore.value.level,
				description: testScore.value.description,
				suggestion: testScore.value.suggestions.join(','),
				questionnaireId: activeQuestionnaire.value
			});
			alert('结果已保存！');
			closeResults();
			getMentalHistoryList();
		};

		// 查看历史记录
		const viewRecord = (id) => {
			// alert(`查看记录 ID: ${id}`);
			questionnaireApi
				.getQuestionnaireHistory({ questionnaireId: id })
				.then((result) => {
					showDetails.value = true;
					detailsList.value = result.content;
				});
		};

		const getMentalHistoryList = () => {
			questionnaireApi.getMentalHistory().then((result) => {
				history.value = result.content;
			});
		};

		onMounted(() => {
			getMentalHistoryList();
		});

		const showDetails = ref(false);
		const detailsList = ref([]);

		return {
			detailsList,
			showDetails,
			questionnaires,
			history,
			activeQuestionnaire,
			currentQuestionIndex,
			answers,
			showResults,
			testScore,
			currentQuestionnaire,
			currentQuestion,
			startQuestionnaire,
			exitQuestionnaire,
			selectAnswer,
			prevQuestion,
			nextQuestion,
			completeQuestionnaire,
			getScoreColor,
			closeResults,
			saveResults,
			viewRecord
		};
	}
};
</script>

<style scoped>
.assessment-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.scale-animation {
  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}

.scale-animation:hover {
  transform: translateY(-5px);
}

@keyframes scale-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out forwards;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.4s ease-out forwards;
}

.primary-100 {
  background-color: rgba(93, 92, 222, 0.1);
}

.primary-200 {
  background-color: rgba(93, 92, 222, 0.2);
}

.primary-300 {
  color: #9796f0;
}

.primary-400 {
  color: #7e7de6;
}

.primary-50 {
  background-color: rgba(93, 92, 222, 0.05);
}

.primary-600 {
  color: #5d5cde;
}

.primary-700 {
  color: #4847b8;
}

.bg-primary-50 {
  background-color: rgba(93, 92, 222, 0.05);
}

.bg-primary-100 {
  background-color: rgba(93, 92, 222, 0.1);
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

.border-primary-200 {
  border-color: rgba(93, 92, 222, 0.2);
}

.border-primary-400 {
  border-color: #7e7de6;
}

.border-primary-600 {
  border-color: #5d5cde;
}

.border-primary-800 {
  border-color: #3c3b9b;
}

/* 确保暗模式下的配色和谐 */
.dark .text-primary-300 {
  color: #9796f0;
}

.dark .text-primary-700 {
  color: #6e6dff;
}
</style>
