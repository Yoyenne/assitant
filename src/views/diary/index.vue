<template>
    <main-layout page-title="心情日记">
      <div class="diary-app-container">
        <!-- 模式切换按钮 -->
        <div class="mode-switch">
          <button 
            :class="{ 'active': mode === 'write' }"
            @click="switchToWriteMode"
          >
            写日记
          </button>
          <button 
            :class="{ 'active': mode === 'history' }"
            @click="switchToHistoryMode"
          >
            看日记
          </button>
        </div>
  
        <!-- 写日记模式 -->
        <div v-if="mode === 'write'" class="write-mode">
          <!-- 心情选择区域 -->
          <div class="mood-selection">
            <h3>今天的心情是...</h3>
            <div class="mood-options">
              <button 
                v-for="mood in moods" 
                :key="mood.id"
                :class="{ 'selected': selectedMood === mood.id }"
                @click="selectMood(mood.id)"
                :style="{ backgroundColor: mood.color }"
                class="mood-option"
              >
                <span class="emoji">{{ mood.emoji }}</span>
                <span class="label">{{ mood.label }}</span>
              </button>
            </div>
          </div>
          
          <!-- 日记编辑区域 -->
          <div class="diary-editor">
            <div class="date-picker">
              <label for="diary-date">日期：</label>
              <input 
                type="date" 
                id="diary-date" 
                v-model="diaryDate"
              >
            </div>
            
            <input 
              type="text" 
              class="title-input" 
              placeholder="日记标题..."
              v-model="diaryTitle"
            >
            
            <textarea 
              class="content-input" 
              placeholder="写下今天的心情和故事..."
              v-model="diaryContent"
            ></textarea>
            
            <div class="action-buttons">
              <button class="save-btn" @click="saveDiary">保存日记</button>
              <button class="clear-btn" @click="clearDiary">清空</button>
            </div>
          </div>
        </div>
  
        <!-- 看日记模式 -->
        <div v-else class="history-mode">
          <div class="view-toggle">
            <button 
              :class="{ 'active': view === 'list' }"
              @click="view = 'list'"
            >
              列表视图
            </button>
            <button 
              :class="{ 'active': view === 'calendar' }"
              @click="view = 'calendar'"
            >
              日历视图
            </button>
          </div>
  
          <!-- 列表视图（原有代码） -->
          <div v-if="view === 'list'" class="list-view">
            <div class="filter-controls">
              <div class="filter-group">
                <label>按心情筛选：</label>
                <select v-model="filterMood">
                  <option value="">全部</option>
                  <option v-for="mood in moods" :key="mood.id" :value="mood.id">
                    {{ mood.emoji }} {{ mood.label }}
                  </option>
                </select>
              </div>
              
              <div class="filter-group">
                <label>按日期筛选：</label>
                <input type="date" v-model="filterDate">
              </div>
              
              <button class="clear-filter" @click="clearFilters">清除筛选</button>
            </div>
            
            <div class="diary-list-container" ref="diaryListContainer">
              <div class="diary-list">
                <div 
                  v-for="diary in filteredDiaries" 
                  :key="diary.id"
                  class="diary-item"
                  :style="{ borderLeft: `5px solid ${getMoodColor(diary.mood)}` }"
                >
                  <div class="diary-header">
                    <span class="diary-date">{{ formatDate(diary.date) }}</span>
                    <span class="diary-mood">
                      {{ getMoodEmoji(diary.mood) }} {{ getMoodLabel(diary.mood) }}
                    </span>
                    <div class="diary-actions">
                      <button 
                        class="edit-btn"
                        @click="editDiary(diary)"
                      >
                        查看
                      </button>
                      <button 
                        class="delete-btn" 
                        @click="deleteDiary(diary.id)"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                  <h3 class="diary-title">{{ diary.title }}</h3>
                  <p class="diary-content">{{ diary.content }}</p>
                </div>
                
                <div v-if="filteredDiaries.length === 0" class="no-diary">
                  <p>没有找到日记记录</p>
                  <button @click="switchToWriteMode">去写一篇日记</button>
                </div>
              </div>
            </div>
          </div>
  
          <!-- 新增的日历视图 -->
          <div v-else class="calendar-view">
            <div class="calendar-header">
              <button @click="prevMonth">&lt;</button>
              <h3>{{ currentMonthYear }}</h3>
              <button @click="nextMonth">&gt;</button>
            </div>
            <div class="calendar-grid">
              <div class="calendar-weekdays">
                <div v-for="day in ['日', '一', '二', '三', '四', '五', '六']" :key="day" class="weekday">
                  {{ day }}
                </div>
              </div>
              <div class="calendar-days">
                <div 
                  v-for="day in calendarDays" 
                  :key="day.date"
                  :class="[
                    'day', 
                    { 
                      'current-month': day.isCurrentMonth,
                      'today': day.isToday,
                      'has-diary': day.hasDiary
                    }
                  ]"
                  @click="selectCalendarDay(day)"
                >
                  <div class="day-number">{{ day.dayNumber }}</div>
                  <div v-if="day.mood" class="day-mood" :style="{ backgroundColor: getMoodColor(day.mood) }">
                    {{ getMoodEmoji(day.mood) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main-layout>
  </template>
  
  <script>
import MainLayout from '@/layouts/MainLayout.vue';
import { ref, computed, onMounted } from 'vue';

export default {
  name: 'DiaryPage',
  components: {
    MainLayout
  },
  setup() {
    // 心情选项
    const moods = ref([
      { id: 'happy', emoji: '😊', label: '开心', color: '#FFD700' },
      { id: 'excited', emoji: '😃', label: '兴奋', color: '#FF6347' },
      { id: 'peaceful', emoji: '😌', label: '平静', color: '#98FB98' },
      { id: 'sad', emoji: '😢', label: '难过', color: '#87CEFA' },
      { id: 'angry', emoji: '😠', label: '生气', color: '#FF4500' },
      { id: 'tired', emoji: '😴', label: '疲惫', color: '#D3D3D3' },
    ]);
    
    // 当前模式：write(写日记) 或 history(看日记)
    const mode = ref('write');
    const diaryListContainer = ref(null);
    
    // 写日记相关数据
    const selectedMood = ref(null);
    const diaryTitle = ref('');
    const diaryContent = ref('');
    const diaryDate = ref(new Date().toISOString().substr(0, 10));
    const editingId = ref(null);
    
    // 看日记相关数据
    const diaries = ref([]);
    const filterMood = ref('');
    const filterDate = ref('');
    
    // 新增日历相关状态
    const view = ref('list'); // 'list' 或 'calendar'
    const currentMonth = ref(new Date().getMonth());
    const currentYear = ref(new Date().getFullYear());
    
    // 从本地存储加载日记
    const loadDiaries = () => {
      const saved = localStorage.getItem('diaries');
      if (saved) {
        diaries.value = JSON.parse(saved);
      }
    };
    
    // 保存日记到本地存储
    const saveToLocalStorage = () => {
      localStorage.setItem('diaries', JSON.stringify(diaries.value));
    };
    
    // 组件挂载时加载日记
    onMounted(() => {
      loadDiaries();
    });
    
    // 切换到写日记模式
    const switchToWriteMode = () => {
      mode.value = 'write';
      window.scrollTo(0, 0);
    };
    
    // 切换到看日记模式
    const switchToHistoryMode = () => {
      mode.value = 'history';
      // 滚动到顶部确保用户看到筛选条件
      window.scrollTo(0, 0);
    };
    
    // 选择心情
    const selectMood = (moodId) => {
      selectedMood.value = moodId;
    };
    
    // 保存日记
    const saveDiary = () => {
      if (!diaryTitle.value || !diaryContent.value) {
        alert('请填写标题和内容');
        return;
      }
      
      if (!selectedMood.value) {
        alert('请选择心情');
        return;
      }
      
      const diary = {
        id: editingId.value || Date.now(),
        date: diaryDate.value,
        title: diaryTitle.value,
        content: diaryContent.value,
        mood: selectedMood.value,
        createdAt: new Date().toISOString()
      };
      
      if (editingId.value) {
        // 更新现有日记
        const index = diaries.value.findIndex(d => d.id === editingId.value);
        if (index !== -1) {
          diaries.value.splice(index, 1, diary);
        }
      } else {
        // 添加新日记
        diaries.value.unshift(diary);
      }
      
      saveToLocalStorage();
      alert('日记保存成功！');
      clearDiary();
      switchToHistoryMode();
    };
    
    // 清空日记表单
    const clearDiary = () => {
      diaryTitle.value = '';
      diaryContent.value = '';
      selectedMood.value = null;
      diaryDate.value = new Date().toISOString().substr(0, 10);
      editingId.value = null;
    };
    
    // 删除日记
    const deleteDiary = (id) => {
      if (confirm('确定要删除这篇日记吗？')) {
        diaries.value = diaries.value.filter(diary => diary.id !== id);
        saveToLocalStorage();
      }
    };
    
    // 编辑日记
    const editDiary = (diary) => {
      editingId.value = diary.id;
      diaryTitle.value = diary.title;
      diaryContent.value = diary.content;
      selectedMood.value = diary.mood;
      diaryDate.value = diary.date;
      switchToWriteMode();
    };
    
    // 根据心情ID获取表情
    const getMoodEmoji = (moodId) => {
      const mood = moods.value.find(m => m.id === moodId);
      return mood ? mood.emoji : '';
    };
    
    // 根据心情ID获取标签
    const getMoodLabel = (moodId) => {
      const mood = moods.value.find(m => m.id === moodId);
      return mood ? mood.label : '';
    };
    
    // 根据心情ID获取颜色
    const getMoodColor = (moodId) => {
      const mood = moods.value.find(m => m.id === moodId);
      return mood ? mood.color : '#ccc';
    };
    
    // 格式化日期显示
    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    };
    
    // 清除筛选条件
    const clearFilters = () => {
      filterMood.value = '';
      filterDate.value = '';
    };
    
    // 计算当前月份和年份的显示文本
    const currentMonthYear = computed(() => {
      return `${currentYear.value}年${currentMonth.value + 1}月`;
    });
    
    // 计算日历天数
    const calendarDays = computed(() => {
      const days = [];
      const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1);
      const lastDayOfMonth = new Date(currentYear.value, currentMonth.value + 1, 0);
      
      // 上个月的最后几天
      const prevMonthDays = firstDayOfMonth.getDay();
      for (let i = prevMonthDays - 1; i >= 0; i--) {
        const date = new Date(currentYear.value, currentMonth.value, -i);
        days.push(createCalendarDay(date, false));
      }
      
      // 当前月的天数
      for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        const date = new Date(currentYear.value, currentMonth.value, i);
        days.push(createCalendarDay(date, true));
      }
      
      // 下个月的前几天
      const nextMonthDays = 6 - lastDayOfMonth.getDay();
      for (let i = 1; i <= nextMonthDays; i++) {
        const date = new Date(currentYear.value, currentMonth.value + 1, i);
        days.push(createCalendarDay(date, false));
      }
      
      return days;
    });
    
    // 创建日历天对象
    const createCalendarDay = (date, isCurrentMonth) => {
      const dateStr = date.toISOString().split('T')[0];
      const today = new Date();
      const isToday = date.getDate() === today.getDate() && 
                     date.getMonth() === today.getMonth() && 
                     date.getFullYear() === today.getFullYear();
      
      // 查找当天的日记
      const diary = diaries.value.find(d => d.date === dateStr);
      
      return {
        date: dateStr,
        dayNumber: date.getDate(),
        isCurrentMonth,
        isToday,
        hasDiary: !!diary,
        mood: diary?.mood || null
      };
    };
    
    // 切换到上个月
    const prevMonth = () => {
      if (currentMonth.value === 0) {
        currentMonth.value = 11;
        currentYear.value--;
      } else {
        currentMonth.value--;
      }
    };
    
    // 切换到下个月
    const nextMonth = () => {
      if (currentMonth.value === 11) {
        currentMonth.value = 0;
        currentYear.value++;
      } else {
        currentMonth.value++;
      }
    };
    
    // 选择日历中的某一天
    const selectCalendarDay = (day) => {
      if (!day.isCurrentMonth) return;
      
      // 如果有日记，筛选该日期的日记
      if (day.hasDiary) {
        filterDate.value = day.date;
        view.value = 'list';
      } else {
        // 如果没有日记，切换到写日记模式并设置日期
        diaryDate.value = day.date;
        switchToWriteMode();
      }
    };
    
    // 筛选后的日记列表
    const filteredDiaries = computed(() => {
      let result = [...diaries.value];
      
      // 按心情筛选
      if (filterMood.value) {
        result = result.filter(diary => diary.mood === filterMood.value);
      }
      
      // 按日期筛选
      if (filterDate.value) {
        result = result.filter(diary => diary.date === filterDate.value);
      }
      
      // 按日期倒序排列
      return result.sort((a, b) => new Date(b.date) - new Date(a.date));
    });
    
    return {
      moods,
      mode,
      selectedMood,
      selectMood,
      diaryTitle,
      diaryContent,
      diaryDate,
      saveDiary,
      clearDiary,
      diaries,
      filterMood,
      filterDate,
      filteredDiaries,
      deleteDiary,
      editDiary,
      getMoodEmoji,
      getMoodLabel,
      getMoodColor,
      formatDate,
      clearFilters,
      switchToWriteMode,
      switchToHistoryMode,
      diaryListContainer,
      view,
      currentMonthYear,
      calendarDays,
      prevMonth,
      nextMonth,
      selectCalendarDay
    };
  }
};
</script>
  
  <style scoped>
  .diary-app-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    height: calc(100vh - 120px); /* 减去页眉和其他元素的高度 */
    display: flex;
    flex-direction: column;
  }
  
  /* 模式切换按钮 */
  .mode-switch {
    display: flex;
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
    flex-shrink: 0;
  }
  
  .mode-switch button {
    flex: 1;
    padding: 10px;
    background: none;
    border: none;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s;
  }
  
  .mode-switch button.active {
    border-bottom-color: #4CAF50;
    font-weight: bold;
    color: #4CAF50;
  }
  
  /* 写日记模式样式 */
  .write-mode {
    animation: fadeIn 0.5s;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  
  .mood-selection {
    margin-bottom: 30px;
    text-align: center;
    flex-shrink: 0;
  }
  
  .mood-selection h3 {
    margin-bottom: 15px;
    color: #333;
  }
  
  .mood-options {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }
  
  .mood-option {
    border: 2px solid transparent;
    border-radius: 20px;
    padding: 10px 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: all 0.3s;
  }
  
  .mood-option:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .mood-option.selected {
    border-color: #333;
    font-weight: bold;
  }
  
  .emoji {
    font-size: 20px;
    margin-right: 8px;
  }
  
  .diary-editor {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .date-picker {
    margin-bottom: 15px;
    flex-shrink: 0;
  }
  
  .date-picker input {
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .title-input {
    width: 100%;
    padding: 12px;
    font-size: 18px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 15px;
    flex-shrink: 0;
  }
  
  .content-input {
    width: 100%;
    flex: 1;
    min-height: 200px;
    padding: 15px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 5px;
    resize: vertical;
    margin-bottom: 20px;
    line-height: 1.6;
  }
  
  .action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    flex-shrink: 0;
  }
  
  .save-btn, .clear-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s;
  }
  
  .save-btn {
    background-color: #4CAF50;
    color: white;
  }
  
  .save-btn:hover {
    background-color: #45a049;
  }
  
  .clear-btn {
    background-color: #f44336;
    color: white;
  }
  
  .clear-btn:hover {
    background-color: #d32f2f;
  }
  
  /* 看日记模式样式 */
  .history-mode {
    animation: fadeIn 0.5s;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .filter-controls {
    background-color: #f5f5f5;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    flex-shrink: 0;
  }
  
  .filter-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .filter-group label {
    font-weight: bold;
  }
  
  .filter-group select, .filter-group input {
    padding: 5px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .clear-filter {
    padding: 5px 10px;
    background-color: #e0e0e0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .clear-filter:hover {
    background-color: #d0d0d0;
  }
  
  .diary-list-container {
    flex: 1;
    overflow-y: auto;
    padding-right: 5px; /* 为滚动条留出空间 */
  }
  
  .diary-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-bottom: 20px; /* 底部留白 */
  }
  
  .diary-item {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    position: relative;
  }
  
  .diary-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    font-size: 14px;
    color: #666;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .diary-mood {
    font-weight: bold;
    margin-right: auto;
  }
  
  .diary-actions {
    display: flex;
    gap: 10px;
  }
  
  .diary-title {
    margin: 0 0 15px 0;
    color: #333;
  }
  
  .diary-content {
    margin: 0 0 15px 0;
    color: #555;
    white-space: pre-line;
    line-height: 1.6;
    max-height: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
  }
  
  .delete-btn, .edit-btn {
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
  }
  
  .delete-btn {
    background-color: #ffebee;
    color: #f44336;
  }
  
  .delete-btn:hover {
    background-color: #ffcdd2;
  }
  
  .edit-btn {
    background-color: #e8f5e9;
    color: #4CAF50;
  }
  
  .edit-btn:hover {
    background-color: #c8e6c9;
  }
  
  .no-diary {
    text-align: center;
    padding: 40px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .no-diary button {
    margin-top: 15px;
    padding: 8px 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .no-diary button:hover {
    background-color: #45a049;
  }
  
  /* 滚动条样式 */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }


  .view-toggle {
  display: flex;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.view-toggle button {
  flex: 1;
  padding: 8px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.view-toggle button.active {
  border-bottom-color: #4CAF50;
  font-weight: bold;
  color: #4CAF50;
}

.calendar-view {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.calendar-header h3 {
  margin: 0;
  font-size: 18px;
}

.calendar-header button {
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.calendar-header button:hover {
  background-color: #f5f5f5;
}

.calendar-grid {
  display: flex;
  flex-direction: column;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
}

.weekday {
  padding: 5px;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.day {
  aspect-ratio: 1;
  padding: 5px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s;
}

.day.current-month {
  background-color: #f9f9f9;
}

.day.current-month:hover {
  background-color: #f0f0f0;
}

.day.today {
  border: 1px solid #4CAF50;
}

.day.has-diary {
  background-color: #e8f5e9;
}

.day-number {
  font-size: 14px;
  align-self: flex-start;
}

.day-mood {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
  </style>