<template>
  <!-- 使用 MainLayout 作为页面的布局 -->
  <main-layout page-title="心理健康测评">
    <div>
      <div class="text-center mb-8">
        <h3 class="text-xl font-semibold mb-2">心理健康测评</h3>
        <p class="text-gray-600 dark:text-gray-400">通过科学的测评量表，了解您当前的心理健康状况</p>
      </div>
      
      <!-- 问卷列表 -->
      <div v-if="!activeQuestionnaire" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="questionnaire in questionnaires" :key="questionnaire.id" 
             class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden scale-animation">
          <div :class="['h-24 flex items-center justify-center', questionnaire.bgColor]">
            <i :class="['text-white text-3xl', questionnaire.icon]"></i>
          </div>
          <div class="p-5">
            <h4 class="font-semibold text-lg mb-1">{{ questionnaire.title }}</h4>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">{{ questionnaire.questions.length }}道题目，约需{{ questionnaire.timeEstimate }}分钟</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">{{ questionnaire.description }}</p>
            <button @click="startQuestionnaire(questionnaire.id)" 
                    class="w-full py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
              开始测评
            </button>
          </div>
        </div>
      </div>
      
      <!-- 进行中的问卷 -->
      <div v-if="activeQuestionnaire" class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 max-w-3xl mx-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold">{{ currentQuestionnaire.title }}</h3>
          <button @click="exitQuestionnaire" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <!-- 进度条 -->
        <div class="mb-6">
          <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>测评进度</span>
            <span>{{ currentQuestionIndex + 1 }}/{{ currentQuestionnaire.questions.length }}</span>
          </div>
          <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div class="h-2 bg-primary-600 rounded-full" 
                 :style="{ width: `${((currentQuestionIndex + 1) / currentQuestionnaire.questions.length) * 100}%` }"></div>
          </div>
        </div>
        
        <!-- 当前问题 -->
        <div class="mb-8">
          <h4 class="text-lg font-medium mb-4">{{ currentQuestion.text }}</h4>
          
          <div class="space-y-3">
            <div v-for="(option, index) in currentQuestion.options" :key="index" 
                 @click="selectAnswer(index)"
                 :class="[
                   'p-3 rounded-lg cursor-pointer transition-colors',
                   answers[currentQuestionIndex] === index 
                     ? 'bg-primary-100 border border-primary-600 dark:bg-primary-900 dark:border-primary-400' 
                     : 'bg-gray-100 border border-gray-200 hover:bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600'
                 ]">
              <div class="flex items-center">
                <div :class="[
                  'w-5 h-5 rounded-full border flex items-center justify-center mr-3',
                  answers[currentQuestionIndex] === index 
                    ? 'border-primary-600 dark:border-primary-400' 
                    : 'border-gray-400 dark:border-gray-500'
                ]">
                  <div v-if="answers[currentQuestionIndex] === index" 
                       class="w-3 h-3 rounded-full bg-primary-600 dark:bg-primary-400"></div>
                </div>
                <span>{{ option.text }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 导航按钮 -->
        <div class="flex justify-between">
          <button @click="prevQuestion" 
                  :disabled="currentQuestionIndex === 0"
                  :class="[
                    'px-4 py-2 rounded-lg transition-colors',
                    currentQuestionIndex === 0 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                  ]">
            上一题
          </button>
          
          <button v-if="currentQuestionIndex < currentQuestionnaire.questions.length - 1" 
                  @click="nextQuestion"
                  :disabled="answers[currentQuestionIndex] === undefined"
                  :class="[
                    'px-4 py-2 rounded-lg transition-colors',
                    answers[currentQuestionIndex] === undefined 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500' 
                      : 'bg-primary-600 hover:bg-primary-700 text-white'
                  ]">
            下一题
          </button>
          
          <button v-else 
                  @click="completeQuestionnaire"
                  :disabled="answers[currentQuestionIndex] === undefined"
                  :class="[
                    'px-4 py-2 rounded-lg transition-colors',
                    answers[currentQuestionIndex] === undefined 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  ]">
            完成测评
          </button>
        </div>
      </div>
      
      <!-- 结果显示模态框 -->
      <div v-if="showResults" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-2xl w-full mx-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold">测评结果</h3>
            <button @click="closeResults" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="mb-6">
            <div class="flex items-center justify-center mb-4">
              <div :class="[
                'w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold',
                getScoreColor(testScore.score)
              ]">
                {{ testScore.score }}
              </div>
            </div>
            
            <h4 class="text-center text-lg font-medium mb-2">{{ testScore.level }}</h4>
            <p class="text-gray-600 dark:text-gray-400 text-center mb-4">{{ testScore.description }}</p>
            
            <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-2">
              <div :class="['h-2 rounded-full', getScoreColor(testScore.score)]" 
                   :style="{ width: `${(testScore.score / testScore.maxScore) * 100}%` }"></div>
            </div>
            <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>轻微</span>
              <span>中度</span>
              <span>严重</span>
            </div>
          </div>
          
          <div class="space-y-4 mb-6">
            <h4 class="font-medium">建议与应对措施:</h4>
            <ul class="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
              <li v-for="(suggestion, index) in testScore.suggestions" :key="index">
                {{ suggestion }}
              </li>
            </ul>
          </div>
          
          <div class="flex justify-end space-x-3">
            <button @click="closeResults" 
                    class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300">
              关闭
            </button>
            <button @click="saveResults" 
                    class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg">
              保存结果
            </button>
          </div>
        </div>
      </div>
      
      <!-- 历史记录表格 -->
      <div v-if="!activeQuestionnaire" class="mt-12">
        <h3 class="text-lg font-semibold mb-4">我的测评记录</h3>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-gray-100 dark:bg-gray-700">
                  <th class="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">测评名称</th>
                  <th class="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">完成时间</th>
                  <th class="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">结果</th>
                  <th class="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">变化趋势</th>
                  <th class="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">操作</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="record in history" :key="record.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td class="px-6 py-4 text-sm">{{ record.title }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{{ record.date }}</td>
                  <td class="px-6 py-4">
                    <span :class="[
                      'px-2 py-1 text-xs rounded-full', 
                      record.levelClass
                    ]">{{ record.level }} ({{ record.score }}分)</span>
                  </td>
                  <td class="px-6 py-4">
                    <span :class="[
                      'flex items-center',
                      record.trendClass
                    ]">
                      <i :class="record.trendIcon + ' mr-1'"></i> {{ record.trendText }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <button @click="viewRecord(record.id)" class="text-primary-600 hover:text-primary-700 dark:hover:text-primary-400">查看详情</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </main-layout>
</template>

<script>
// 引入 MainLayout 布局组件
import MainLayout from '@/layouts/MainLayout.vue';
import { ref, computed } from 'vue';

export default {
  name: 'AssessmentPage',
  components: {
    MainLayout // 注册 MainLayout 组件
  },
  setup() {
    // 测评问卷数据
    const questionnaires = ref([
      {
        id: 1,
        title: '抑郁症筛查（PHQ-9）',
        description: '测评抑郁症状严重程度的量表，广泛用于临床筛查',
        timeEstimate: '3',
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
            text: '在过去的两周内，有多少天您感到心情低落、沮丧或绝望？',
            options: [
              { text: '完全没有', value: 0 },
              { text: '有几天', value: 1 },
              { text: '一半以上时间', value: 2 },
              { text: '几乎每天', value: 3 }
            ]
          },
          {
            text: '在过去的两周内，有多少天您入睡困难、睡不安稳或睡眠太多？',
            options: [
              { text: '完全没有', value: 0 },
              { text: '有几天', value: 1 },
              { text: '一半以上时间', value: 2 },
              { text: '几乎每天', value: 3 }
            ]
          },
          // 更多问题...
        ]
      },
      {
        id: 2,
        title: '焦虑自评量表（GAD-7）',
        description: '评估广泛性焦虑障碍症状的简短问卷',
        timeEstimate: '2',
        icon: 'fas fa-wind',
        bgColor: 'bg-gradient-to-r from-green-400 to-teal-500',
        questions: [
          {
            text: '在过去的两周内，有多少天您感到紧张、焦虑或烦躁？',
            options: [
              { text: '完全没有', value: 0 },
              { text: '有几天', value: 1 },
              { text: '一半以上时间', value: 2 },
              { text: '几乎每天', value: 3 }
            ]
          },
          // 更多问题...
        ]
      },
      {
        id: 3,
        title: '睡眠质量指数（PSQI）',
        description: '评估睡眠质量和睡眠障碍的标准化问卷',
        timeEstimate: '5',
        icon: 'fas fa-moon',
        bgColor: 'bg-gradient-to-r from-purple-400 to-pink-500',
        questions: [
          // 问题列表...
        ]
      },
      {
        id: 4,
        title: '压力感知量表（PSS）',
        description: '测量个体对生活中压力事件的感知程度',
        timeEstimate: '3',
        icon: 'fas fa-heartbeat',
        bgColor: 'bg-gradient-to-r from-red-400 to-orange-500',
        questions: [
          // 问题列表...
        ]
      },
      {
        id: 5,
        title: '幸福感指数（OHI）',
        description: '衡量个体主观幸福感和生活满意度的量表',
        timeEstimate: '8',
        icon: 'fas fa-smile',
        bgColor: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
        questions: [
          // 问题列表...
        ]
      },
      {
        id: 6,
        title: '社交焦虑量表（SIAS）',
        description: '评估社交互动中的焦虑程度',
        timeEstimate: '6',
        icon: 'fas fa-users',
        bgColor: 'bg-gradient-to-r from-indigo-400 to-purple-500',
        questions: [
          // 问题列表...
        ]
      }
    ]);
    
    // 历史记录数据
    const history = ref([
      {
        id: 1,
        title: '抑郁症筛查（PHQ-9）',
        date: '2023-07-15',
        score: 3,
        level: '轻微',
        levelClass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        trend: -2,
        trendClass: 'text-green-500 dark:text-green-400',
        trendIcon: 'fas fa-arrow-down',
        trendText: '2分'
      },
      {
        id: 2,
        title: '焦虑自评量表（GAD-7）',
        date: '2023-07-10',
        score: 12,
        level: '中度',
        levelClass: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        trend: 3,
        trendClass: 'text-red-500 dark:text-red-400',
        trendIcon: 'fas fa-arrow-up',
        trendText: '3分'
      },
      {
        id: 3,
        title: '睡眠质量指数（PSQI）',
        date: '2023-07-05',
        score: 4,
        level: '良好',
        levelClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        trend: 0,
        trendClass: 'text-gray-500 dark:text-gray-400',
        trendIcon: 'fas fa-minus',
        trendText: '持平'
      }
    ]);
    
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
      return questionnaires.value.find(q => q.id === activeQuestionnaire.value);
    });
    
    const currentQuestion = computed(() => {
      if (!currentQuestionnaire.value) return null;
      return currentQuestionnaire.value.questions[currentQuestionIndex.value];
    });
    
    // 开始测评
    const startQuestionnaire = (id) => {
      activeQuestionnaire.value = id;
      currentQuestionIndex.value = 0;
      answers.value = new Array(questionnaires.value.find(q => q.id === id).questions.length).fill(undefined);
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
      if (currentQuestionIndex.value < currentQuestionnaire.value.questions.length - 1 && 
          answers.value[currentQuestionIndex.value] !== undefined) {
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
        if (answer !== undefined && currentQuestionnaire.value.questions[index]) {
          totalScore += currentQuestionnaire.value.questions[index].options[answer].value;
          maxScore += 3; // 假设每个问题最高分为3
        }
      });
      
      // 设置结果
      testScore.value = {
        score: totalScore,
        maxScore: maxScore,
        level: getLevel(totalScore, currentQuestionnaire.value.id),
        description: getLevelDescription(totalScore, currentQuestionnaire.value.id),
        suggestions: getSuggestions(totalScore, currentQuestionnaire.value.id)
      };
      
      showResults.value = true;
    };
    
    // 根据得分获取级别
    const getLevel = (score, questionnaireId) => {
      if (questionnaireId === 1) { // PHQ-9
        if (score < 5) return '无或轻微抑郁';
        if (score < 10) return '轻度抑郁';
        if (score < 15) return '中度抑郁';
        if (score < 20) return '中重度抑郁';
        return '重度抑郁';
      } else if (questionnaireId === 2) { // GAD-7
        if (score < 5) return '无或轻微焦虑';
        if (score < 10) return '轻度焦虑';
        if (score < 15) return '中度焦虑';
        return '重度焦虑';
      }
      return '未知级别';
    };
    
    // 获取级别描述
    const getLevelDescription = (score, questionnaireId) => {
      if (questionnaireId === 1) { // PHQ-9
        if (score < 5) return '您的抑郁症状极轻或没有，心理状态良好。';
        if (score < 10) return '您有轻微的抑郁症状，可能需要关注自己的心理健康。';
        if (score < 15) return '您有中度抑郁症状，建议考虑寻求专业帮助。';
        if (score < 20) return '您有中重度抑郁症状，强烈建议咨询专业心理医生。';
        return '您有重度抑郁症状，请尽快寻求专业医疗帮助。';
      }
      return '测评完成，感谢参与。';
    };
    
    // 获取建议
    const getSuggestions = (score, questionnaireId) => {
      if (questionnaireId === 1) { // PHQ-9
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
    const saveResults = () => {
      // 实际项目中，这里应该调用API保存结果
      alert('结果已保存！');
      closeResults();
      
      // 模拟添加到历史记录
      const newRecord = {
        id: history.value.length + 1,
        title: currentQuestionnaire.value.title,
        date: new Date().toISOString().split('T')[0],
        score: testScore.value.score,
        level: testScore.value.level,
        levelClass: getScoreLevelClass(testScore.value.score),
        trend: 0,
        trendClass: 'text-gray-500 dark:text-gray-400',
        trendIcon: 'fas fa-minus',
        trendText: '首次'
      };
      
      history.value.unshift(newRecord);
    };
    
    // 获取分数级别样式类
    const getScoreLevelClass = (score) => {
      if (score < 5) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      if (score < 10) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      if (score < 15) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    };
    
    // 查看历史记录
    const viewRecord = (id) => {
      // 实际项目中，这里应该获取详细记录并显示
      alert(`查看记录 ID: ${id}`);
    };

    return {
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
}
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

.primary-400 {
  color: #7E7DE6;
}

.primary-600 {
  color: #5D5CDE;
}

.primary-700 {
  color: #4847B8;
}

.bg-primary-100 {
  background-color: rgba(93, 92, 222, 0.1);
}

.bg-primary-600 {
  background-color: #5D5CDE;
}

.bg-primary-700 {
  background-color: #4847B8;
}

.bg-primary-900 {
  background-color: rgba(93, 92, 222, 0.2);
}

.border-primary-400 {
  border-color: #7E7DE6;
}

.border-primary-600 {
  border-color: #5D5CDE;
}
</style>
