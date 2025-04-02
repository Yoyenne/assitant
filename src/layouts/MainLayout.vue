<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- 左侧导航栏 - 桌面版 -->
    <aside class="w-64 bg-white shadow-md hidden md:block">
      <div class="px-4 py-6">
        <div class="flex items-center mb-6">
          <img class="h-8 w-auto" src="@/assets/logo.svg" alt="心理健康助手" />
          <span class="ml-2 text-lg font-medium text-indigo-600">心理健康助手</span>
        </div>
        
        <nav class="mt-6">
          <div class="mb-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            功能导航
          </div>
          <ul class="space-y-2">
            <li v-for="item in navigationItems" :key="item.name">
              <router-link 
                :to="item.href" 
                class="flex items-center px-4 py-3 text-gray-700 rounded-lg transition duration-150 ease-in-out"
                :class="{ 'bg-indigo-50 text-indigo-700 font-medium': isActiveRoute(item.href), 
                          'hover:bg-gray-100': !isActiveRoute(item.href) }"
              >
                <span>{{ item.name }}</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>

    <div class="flex-1 flex flex-col">
      <!-- 顶部导航栏 -->
      <header class="bg-white shadow-sm sticky top-0 z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <div class="md:hidden flex-shrink-0 flex items-center">
                <img class="h-8 w-auto" src="@/assets/logo.svg" alt="心理健康助手" />
                <span class="ml-2 text-xl font-semibold text-indigo-600">心理健康助手</span>
              </div>
              <div class="ml-4 text-gray-700">
                <div class="text-sm text-gray-500">欢迎回来</div>
                <div class="text-base font-medium">祝您今天心情愉快</div>
              </div>
            </div>
            <div class="flex items-center">
              <button 
                class="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                @click="toggleProfileMenu"
              >
                <span>用户中心</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- 移动端导航菜单按钮 -->
      <button 
        @click="toggleMobileMenu" 
        class="md:hidden fixed bottom-4 right-4 z-20 bg-indigo-600 text-white p-3 rounded-full shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      <!-- 移动端导航抽屉 -->
      <div 
        v-if="isMobileMenuOpen" 
        class="md:hidden fixed inset-0 z-30 flex"
      >
        <div class="fixed inset-0 bg-gray-600 bg-opacity-75" @click="toggleMobileMenu"></div>
        <div class="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div class="absolute top-0 right-0 -mr-12 pt-2">
            <button 
              @click="toggleMobileMenu"
              class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span class="sr-only">关闭侧边栏</span>
              <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div class="flex-shrink-0 flex items-center px-4 mb-5">
              <img class="h-8 w-auto" src="@/assets/logo.svg" alt="心理健康助手" />
              <span class="ml-2 text-xl font-semibold text-indigo-600">心理健康助手</span>
            </div>
            <div class="px-4 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              功能导航
            </div>
            <nav class="px-2 space-y-1">
              <router-link 
                v-for="item in navigationItems" 
                :key="item.name" 
                :to="item.href" 
                class="group flex items-center px-3 py-3 text-base font-medium rounded-lg"
                :class="isActiveRoute(item.href) ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'"
                @click="toggleMobileMenu"
              >
                {{ item.name }}
              </router-link>
            </nav>
          </div>
        </div>
      </div>

      <!-- 主要内容 -->
      <main class="flex-1 overflow-y-auto p-6">
        <div class="max-w-7xl mx-auto">
          <!-- 页面标题 -->
          <div class="mb-6">
            <h1 class="text-2xl font-semibold text-gray-900">{{ pageTitle }}</h1>
          </div>
          
          <!-- 内容区域 -->
          <div class="bg-white shadow rounded-lg p-6">
            <slot></slot>
          </div>
        </div>
      </main>

      <!-- 页脚 -->
      <footer class="bg-white mt-auto border-t border-gray-200">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <div class="text-sm text-gray-500">
              &copy; {{ new Date().getFullYear() }} 心理健康助手. 保留所有权利.
            </div>
            <div class="mt-4 md:mt-0 flex space-x-6">
              <a href="#" class="text-gray-400 hover:text-gray-500">
                <span class="sr-only">隐私政策</span>
                隐私政策
              </a>
              <a href="#" class="text-gray-400 hover:text-gray-500">
                <span class="sr-only">使用条款</span>
                使用条款
              </a>
              <a href="#" class="text-gray-400 hover:text-gray-500">
                <span class="sr-only">联系我们</span>
                联系我们
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainLayout',
  props: {
    pageTitle: {
      type: String,
      default: '心理健康助手'
    }
  },
  data() {
    return {
      isMobileMenuOpen: false,
      isProfileMenuOpen: false,
      navigationItems: [
        { name: '个性推荐', href: '/music' },
        { name: '问卷测评', href: '/question' },
        { name: '心声社区', href: '/community' },
        { name: '心情日记', href: '/diary' },
        { name: '正念辅助', href: '/mindfulness' }
      ]
    }
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
    },
    toggleProfileMenu() {
      this.isProfileMenuOpen = !this.isProfileMenuOpen
    },
    isActiveRoute(route) {
      return this.$route.path === route
    }
  }
}
</script>

<style scoped>
/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
