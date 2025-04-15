/*
 *  社区相关接口
 */
import { getRequest, postRequest, smartAxios } from '../lib/axios';

export const communityApi = {
    /**
     * 举报帖子
     */
    reportPost: async (param: { postId: number, reason: string }) => {
        try {
            const response = await postRequest(`/posts/report`, param);
            console.log('举报帖子接口已连接:', response);
            return { success: true, data: response };
        } catch (error) {
            console.error('举报帖子接口未连接:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * 创建帖子
     */
    createPost: async (param: any) => {
        try {
            const response = await postRequest('/posts/create', param);
            console.log('创建帖子接口已连接:', response);
            return { success: true, data: response };
        } catch (error) {
            console.error('创建帖子接口未连接:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * 获取所有帖子（分页）
     */
    getPosts: async (param: any) => {
        try {
            const response = await getRequest('/posts', param);
            console.log('获取帖子接口已连接:', response);
            return { success: true, data: response };
        } catch (error) {
            console.error('获取帖子接口未连接:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * 获取单个帖子详情
     */
    getPostById: (postId: number, param: any) => {
        return getRequest(`/posts/${postId}`, param);
    },

    /**
     * 获取帖子下的评论（分页）
     */
    getPostComments: (postId: number, param: any) => {
        return getRequest(`/posts/${postId}/comments`, param);
    },
};
这是我的接口文档，<template>
  <main-layout page-title="心声社区">
    <div class="community-container">
      <!-- 发布新帖子区域 -->
      <div class="post-creator">
        <div class="user-avatar">
          <img :src="currentUser.avatar" alt="用户头像">
        </div>
        <div class="post-input">
          <textarea 
            v-model="newPostContent" 
            placeholder="分享你的想法..."
            rows="3"
            @keydown.enter.exact.prevent="createPost"
          ></textarea>
          <div class="post-actions">
            <button 
              class="emoji-btn" 
              @click="toggleEmojiPicker"
              aria-label="选择表情"
            >
              😊
            </button>
            <div 
              class="emoji-picker" 
              v-if="showEmojiPicker"
              v-click-outside="closeEmojiPicker"
            >
              <span 
                v-for="emoji in emojis" 
                :key="emoji"
                @click="addEmoji(emoji)"
                :title="emoji"
              >
                {{ emoji }}
              </span>
            </div>
            <button 
              class="post-btn" 
              @click="createPost"
              :disabled="!newPostContent.trim()"
              aria-label="发布帖子"
            >
              发布
            </button>
          </div>
        </div>
      </div>

      <!-- 帖子列表 -->
      <div class="posts-list">
        <div 
          v-for="post in sortedPosts" 
          :key="post.id" 
          class="post-item"
        >
          <div class="post-header">
            <div class="post-user">
              <img 
                :src="post.user.avatar" 
                alt="用户头像" 
                class="avatar"
                loading="lazy"
              >
              <div class="user-info">
                <span class="username">{{ post.user.name }}</span>
                <span class="post-time">{{ formatTime(post.createdAt) }}</span>
              </div>
            </div>
            <div class="post-actions">
              <button 
                v-if="post.user.id === currentUser.id"
                class="delete-btn"
                @click="confirmDeletePost(post.id)"
                aria-label="删除帖子"
              >
                删除
              </button>
              <button 
                class="report-btn"
                @click="reportPost(post.id)"
                aria-label="举报帖子"
              >
                举报
              </button>
            </div>
          </div>

          <div class="post-content">
            {{ post.content }}
          </div>

          <div class="post-stats">
            <button 
              class="like-btn"
              :class="{ 'liked': post.likes.includes(currentUser.id) }"
              @click="toggleLike(post)"
              aria-label="点赞"
            >
              <span>👍</span>
              <span v-if="post.likes.length > 0">{{ post.likes.length }}</span>
            </button>
            <button 
              class="comment-btn"
              @click="toggleComments(post.id)"
              aria-label="评论"
            >
              <span>💬</span>
              <span v-if="post.comments.length > 0">{{ post.comments.length }}</span>
            </button>
          </div>

          <!-- 评论区域 -->
          <div 
            class="comments-section"
            v-if="expandedPosts.includes(post.id)"
          >
            <div class="comments-list">
              <div 
                v-for="comment in post.comments" 
                :key="comment.id"
                class="comment-item"
              >
                <img 
                  :src="comment.user.avatar" 
                  alt="用户头像" 
                  class="avatar"
                  loading="lazy"
                >
                <div class="comment-content">
                  <div class="comment-header">
                    <span class="username">{{ comment.user.name }}</span>
                    <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
                  </div>
                  <div class="comment-text">{{ comment.content }}</div>
                </div>
              </div>
            </div>

            <div class="add-comment">
              <input 
                v-model="newComments[post.id]"
                @keyup.enter="addComment(post.id)"
                placeholder="写下你的评论..."
                aria-label="评论输入框"
              >
              <button 
                @click="addComment(post.id)"
                :disabled="!newComments[post.id]?.trim()"
              >
                发送
              </button>
            </div>
          </div>
        </div>

        <div v-if="posts.length === 0" class="no-posts">
          <p>还没有帖子，快来发表第一个吧！</p>
        </div>
      </div>
    </div>

    <!-- 举报弹窗 -->
    <div v-if="showReportDialog" class="modal-overlay">
      <div class="modal-content">
        <h3>举报帖子</h3>
        <textarea 
          v-model="reportReason" 
          placeholder="请输入举报原因..."
          rows="3"
        ></textarea>
        <div class="modal-actions">
          <button @click="submitReport">提交</button>
          <button @click="cancelReport">取消</button>
        </div>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <div v-if="showDeleteConfirm" class="modal-overlay">
      <div class="modal-content">
        <h3>确认删除</h3>
        <p>确定要删除这条帖子吗？此操作不可撤销。</p>
        <div class="modal-actions">
          <button @click="confirmDelete">确定</button>
          <button @click="cancelDelete">取消</button>
        </div>
      </div>
    </div>
  </main-layout>
</template>

<script>
import MainLayout from '@/layouts/MainLayout.vue';
import { ref, computed, onMounted } from 'vue';

// 点击外部指令
const vClickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value();
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  }
};

export default {
  name: 'CommunityPage',
  components: {
    MainLayout
  },
  directives: {
    'click-outside': vClickOutside
  },
  setup() {
    // 当前用户信息
    const currentUser = ref({
      id: 'user1',
      name: '我',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    });

    // 新帖子内容
    const newPostContent = ref('');
    
    // 新评论内容（按帖子ID存储）
    const newComments = ref({});
    
    // 显示表情选择器
    const showEmojiPicker = ref(false);
    
    // 已展开评论的帖子ID列表
    const expandedPosts = ref([]);
    
    // 表情列表
    const emojis = ref(['😀', '😂', '😍', '😎', '👍', '❤️', '🙏', '🔥', '🎉', '🤔']);
    
    // 帖子列表
    const posts = ref([
      {
        id: 'post1',
        user: {
          id: 'user2',
          name: '张三',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        content: '今天天气真好，大家有什么推荐的活动吗？',
        likes: ['user1', 'user3'],
        comments: [
          {
            id: 'comment1',
            user: {
              id: 'user3',
              name: '李四',
              avatar: 'https://randomuser.me/api/portraits/women/33.jpg'
            },
            content: '可以去公园野餐！',
            createdAt: '2023-05-15T10:30:00'
          },
          {
            id: 'comment2',
            user: {
              id: 'user1',
              name: '我',
              avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
            },
            content: '好主意！',
            createdAt: '2023-05-15T11:15:00'
          }
        ],
        createdAt: '2023-05-15T09:45:00'
      },
      {
        id: 'post2',
        user: {
          id: 'user3',
          name: '李四',
          avatar: 'https://randomuser.me/api/portraits/women/33.jpg'
        },
        content: '分享一个好消息，我升职啦！🎉',
        likes: ['user1', 'user2', 'user4'],
        comments: [
          {
            id: 'comment3',
            user: {
              id: 'user2',
              name: '张三',
              avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
            },
            content: '恭喜恭喜！',
            createdAt: '2023-05-14T16:20:00'
          }
        ],
        createdAt: '2023-05-14T15:30:00'
      }
    ]);

    // 举报相关状态
    const showReportDialog = ref(false);
    const reportReason = ref('');
    const postToReport = ref(null);

    // 删除相关状态
    const showDeleteConfirm = ref(false);
    const postToDelete = ref(null);

    // 从本地存储加载数据
    const loadData = () => {
      const savedPosts = localStorage.getItem('communityPosts');
      if (savedPosts) {
        posts.value = JSON.parse(savedPosts);
      }
    };

    // 保存数据到本地存储
    const saveData = () => {
      localStorage.setItem('communityPosts', JSON.stringify(posts.value));
    };

    // 组件挂载时加载数据
    onMounted(() => {
      loadData();
    });

    // 按时间排序的帖子
    const sortedPosts = computed(() => {
      return [...posts.value].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
    });

    // 创建新帖子
    const createPost = () => {
      if (!newPostContent.value.trim()) return;

      const newPost = {
        id: 'post' + Date.now(),
        user: { ...currentUser.value },
        content: newPostContent.value,
        likes: [],
        comments: [],
        createdAt: new Date().toISOString()
      };

      posts.value.unshift(newPost);
      newPostContent.value = '';
      showEmojiPicker.value = false;
      saveData();
    };

    // 确认删除帖子
    const confirmDeletePost = (postId) => {
      postToDelete.value = postId;
      showDeleteConfirm.value = true;
    };

    // 执行删除帖子
    const confirmDelete = () => {
      posts.value = posts.value.filter(post => post.id !== postToDelete.value);
      saveData();
      showDeleteConfirm.value = false;
      postToDelete.value = null;
    };

    // 取消删除
    const cancelDelete = () => {
      showDeleteConfirm.value = false;
      postToDelete.value = null;
    };

    // 举报帖子
    const reportPost = (postId) => {
      postToReport.value = postId;
      showReportDialog.value = true;
    };

    // 提交举报
    const submitReport = () => {
      if (reportReason.value.trim()) {
        alert(`已举报帖子，原因: ${reportReason.value}`);
        reportReason.value = '';
        showReportDialog.value = false;
        postToReport.value = null;
      }
    };

    // 取消举报
    const cancelReport = () => {
      reportReason.value = '';
      showReportDialog.value = false;
      postToReport.value = null;
    };

    // 点赞/取消点赞
    const toggleLike = (post) => {
      const index = post.likes.indexOf(currentUser.value.id);
      if (index === -1) {
        post.likes.push(currentUser.value.id);
      } else {
        post.likes.splice(index, 1);
      }
      saveData();
    };

    // 展开/收起评论
    const toggleComments = (postId) => {
      const index = expandedPosts.value.indexOf(postId);
      if (index === -1) {
        expandedPosts.value.push(postId);
      } else {
        expandedPosts.value.splice(index, 1);
      }
    };

    // 添加评论
    const addComment = (postId) => {
      const commentContent = newComments.value[postId]?.trim();
      if (!commentContent) return;

      const post = posts.value.find(p => p.id === postId);
      if (post) {
        const newComment = {
          id: 'comment' + Date.now(),
          user: { ...currentUser.value },
          content: commentContent,
          createdAt: new Date().toISOString()
        };

        post.comments.unshift(newComment);
        newComments.value[postId] = '';
        saveData();
      }
    };

    // 关闭表情选择器
    const closeEmojiPicker = () => {
      showEmojiPicker.value = false;
    };

    // 切换表情选择器
    const toggleEmojiPicker = () => {
      showEmojiPicker.value = !showEmojiPicker.value;
    };

    // 添加表情到帖子内容
    const addEmoji = (emoji) => {
      newPostContent.value += emoji;
      showEmojiPicker.value = false;
    };

    // 格式化时间显示
    const formatTime = (timeStr) => {
      const now = new Date();
      const time = new Date(timeStr);
      const diff = now - time;
      
      const seconds = Math.floor(diff / 1000);
      if (seconds < 60) return `${seconds}秒前`;
      
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}分钟前`;
      
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}小时前`;
      
      const days = Math.floor(hours / 24);
      if (days < 7) return `${days}天前`;
      
      return time.toLocaleDateString();
    };

    return {
      currentUser,
      newPostContent,
      newComments,
      showEmojiPicker,
      expandedPosts,
      emojis,
      posts,
      sortedPosts,
      showReportDialog,
      reportReason,
      showDeleteConfirm,
      createPost,
      confirmDeletePost,
      confirmDelete,
      cancelDelete,
      reportPost,
      submitReport,
      cancelReport,
      toggleLike,
      toggleComments,
      addComment,
      toggleEmojiPicker,
      closeEmojiPicker,
      addEmoji,
      formatTime
    };
  }
};
</script>

<style scoped>
.community-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  height: calc(100vh - 120px); /* 减去页眉高度等 */
  display: flex;
  flex-direction: column;
}

/* 发布新帖子区域 */
.post-creator {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  background-color: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0; /* 防止压缩 */
}

.user-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.post-input {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.post-input textarea {
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px;
  font-size: 16px;
  resize: none;
  margin-bottom: 10px;
  transition: border-color 0.3s;
}

.post-input textarea:focus {
  outline: none;
  border-color: #4CAF50;
}

.post-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.emoji-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  transition: transform 0.2s;
}

.emoji-btn:hover {
  transform: scale(1.1);
}

.emoji-picker {
  position: absolute;
  bottom: 40px;
  left: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  width: 200px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.emoji-picker span {
  cursor: pointer;
  font-size: 20px;
  padding: 3px;
  transition: transform 0.2s;
}

.emoji-picker span:hover {
  transform: scale(1.2);
}

.post-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 20px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.post-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.post-btn:not(:disabled):hover {
  background-color: #45a049;
}

/* 帖子列表 */
.posts-list {
  flex: 1; /* 占据剩余空间 */
  overflow-y: auto; /* 允许内部滚动 */
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 20px; /* 底部留白 */
}

.post-item {
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.post-item:hover {
  transform: translateY(-2px);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.post-user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.post-user .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: bold;
}

.post-time {
  font-size: 12px;
  color: #888;
}

.post-actions {
  display: flex;
  gap: 10px;
}

.delete-btn, .report-btn {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 5px;
}

.delete-btn {
  color: #ff4444;
}

.report-btn {
  color: #ff6b6b;
}

.delete-btn:hover, .report-btn:hover {
  text-decoration: underline;
}

.post-content {
  margin-bottom: 15px;
  line-height: 1.5;
  white-space: pre-line;
}

.post-stats {
  display: flex;
  gap: 20px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.like-btn, .comment-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #555;
  transition: color 0.2s;
}

.like-btn.liked {
  color: #4CAF50;
}

.like-btn:hover, .comment-btn:hover {
  color: #333;
}

/* 评论区域 */
.comments-section {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.comments-list {
  margin-bottom: 15px;
  max-height: 300px;
  overflow-y: auto;
}

.comment-item {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.comment-item .avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.comment-header .username {
  font-weight: bold;
  font-size: 14px;
}

.comment-header .comment-time {
  font-size: 12px;
  color: #888;
}

.comment-text {
  font-size: 14px;
  line-height: 1.4;
  background-color: #f9f9f9;
  padding: 8px 12px;
  border-radius: 12px;
  display: inline-block;
}

.add-comment {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.add-comment input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.add-comment input:focus {
  outline: none;
  border-color: #4CAF50;
}

.add-comment button {
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-comment button:hover {
  background-color: #45a049;
}

.add-comment button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* 没有帖子的提示 */
.no-posts {
  text-align: center;
  padding: 40px;
  color: #888;
}

/* 滚动条样式 */
.comments-list::-webkit-scrollbar {
  width: 6px;
}

.comments-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.comments-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.comments-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-content h3 {
  margin-top: 0;
  color: #333;
}

.modal-content textarea {
  width: 100%;
  margin: 15px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  min-height: 100px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.modal-actions button:first-child {
  background-color: #4CAF50;
  color: white;
}

.modal-actions button:last-child {
  background-color: #f0f0f0;
  color: #333;
}
</style>