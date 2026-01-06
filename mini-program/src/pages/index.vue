<template>
  <div class="index-container">
    <!-- 顶部区域 -->
    <div class="flex-shrink-0 bg-white">
      <!-- 顶部栏：门店图标 + 门店名称 + 小程序图标 + 胶囊栏 -->
      <div class="flex items-center justify-between px-6 pt-2 pb-3 relative">
        <div @click="handleStoreSelect" class="flex items-center gap-2 cursor-pointer active:opacity-80 transition-opacity">
          <!-- 门店图标 -->
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1AD299] to-[#17C088] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <!-- 门店名称（可选） -->
          <span class="text-sm text-gray-800 font-medium">{{ currentStore.name }}</span>
          <!-- 下拉箭头 -->
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-gray-400 ml-1">
            <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        
        <!-- 右侧：小程序图标 + 胶囊按钮 -->
        <div class="flex items-center gap-2">
          <!-- 胶囊按钮（关闭 + 更多） -->
          <div class="capsule-container">
            <!-- 关闭按钮 -->
            <button class="capsule-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="6" cy="12" r="1.5" fill="currentColor"/>
                <circle cx="12" cy="12" r="3" fill="currentColor"/>
                <circle cx="18" cy="12" r="1.5" fill="currentColor"/>
              </svg>
            </button>
            <!-- 分隔线 -->
            <div class="capsule-divider"></div>
            <!-- 更多按钮 -->
            <button class="capsule-btn">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- 外圆环：直径10px，半径5px -->
            <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="2" fill="none"/>
            <!-- 内圆：直径3px，半径1.5px -->
            <circle cx="9" cy="9" r="2" fill="currentColor"/>
          </svg>
            </button>
          </div>
        </div>
      </div>
      
      
    </div>
    
    

    <!-- 主体内容区域 -->
    <div class="flex-1 overflow-y-auto">
      <!-- 搜索框 -->
    <div class="px-6 pb-4 mt-4">
        <div class="flex items-center gap-3 bg-white rounded-full px-4 py-2.5 border border-white-100">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-gray-400">
            <path d="M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z" fill="currentColor"/>
          </svg>
          <span class="text-sm text-gray-400 flex-1">搜索服务或商品</span>
        </div>
      </div>
      <!-- Banner 轮播区 -->
      <div class="px-6 pt-4 pb-6">
        <div class="relative w-full h-32 rounded-2xl overflow-hidden">
          <div class="absolute inset-0 flex transition-transform duration-300" :style="{ transform: `translateX(-${currentBanner * 100}%)` }">
            <div 
              v-for="(banner, index) in banners" 
              :key="index"
              class="min-w-full h-full relative"
            >
              <img 
                :src="banner.image" 
                :alt="banner.title"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-black bg-opacity-20"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <h3 class="text-base font-semibold mb-1">{{ banner.title }}</h3>
                <p class="text-xs opacity-90">{{ banner.subtitle }}</p>
              </div>
            </div>
          </div>
          <!-- 指示器 -->
          <div class="absolute bottom-3 right-4 flex gap-1.5">
            <div 
              v-for="(banner, index) in banners" 
              :key="index"
              class="w-1.5 h-1.5 rounded-full transition-all"
              :class="currentBanner === index ? 'bg-white w-4' : 'bg-white bg-opacity-50'"
            ></div>
          </div>
        </div>
      </div>

      <!-- 功能入口卡片 - 两行布局 -->
      <div class="px-6 pb-6">
        <div class="grid grid-cols-2 gap-4">
          <!-- AI测肤 - 主入口（高亮） -->
          <div 
            @click="handleNavigate('ai-skin')"
            class="bg-[#1AD299] rounded-2xl p-5 shadow-lg active:scale-95 transition-transform"
          >
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mb-3">
              <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="12" fill="white" fill-opacity="0.3"/>
                <path d="M24 12C17.3726 12 12 17.3726 12 24C12 30.6274 17.3726 36 24 36C30.6274 36 36 30.6274 36 24C36 17.3726 30.6274 12 24 12ZM24 32C19.5817 32 16 28.4183 16 24C16 19.5817 19.5817 16 24 16C28.4183 16 32 19.5817 32 24C32 28.4183 28.4183 32 24 32Z" fill="white"/>
                <path d="M20 24C20 21.7909 21.7909 20 24 20C26.2091 20 28 21.7909 28 24C28 26.2091 26.2091 28 24 28C21.7909 28 20 26.2091 20 24Z" fill="white"/>
              </svg>
            </div>
            <h3 class="text-white text-base font-semibold mb-1">AI测肤</h3>
            <p class="text-white text-xs opacity-90">智能分析肌肤状态</p>
          </div>

          <!-- 皮肤问诊 / 在线咨询 -->
          <div 
            @click="handleNavigate('consultation')"
            class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 active:scale-95 transition-transform"
          >
            <div class="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-3">
              <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="12" fill="#FFB84D" fill-opacity="0.1"/>
                <path d="M24 16C20.6863 16 18 18.6863 18 22V26C18 29.3137 20.6863 32 24 32C27.3137 32 30 29.3137 30 26V22C30 18.6863 27.3137 16 24 16ZM26 26C26 26.5523 25.5523 27 25 27H23C22.4477 27 22 26.5523 22 26V22C22 21.4477 22.4477 21 23 21H25C25.5523 21 26 21.4477 26 22V26Z" fill="#FFB84D"/>
                <path d="M20 32H28V34H20V32Z" fill="#FFB84D"/>
              </svg>
            </div>
            <h3 class="text-gray-800 text-base font-semibold mb-1">皮肤问诊</h3>
            <p class="text-gray-500 text-xs">在线咨询</p>
          </div>

          <!-- 我的报告 -->
          <div 
            @click="handleNavigate('reports')"
            class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 active:scale-95 transition-transform"
          >
            <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
              <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="12" fill="#6C9EFF" fill-opacity="0.1"/>
                <path d="M16 14H32V16H16V14Z" fill="#6C9EFF"/>
                <path d="M16 20H32V22H16V20Z" fill="#6C9EFF"/>
                <path d="M16 26H28V28H16V26Z" fill="#6C9EFF"/>
                <path d="M16 32H24V34H16V32Z" fill="#6C9EFF"/>
                <rect x="14" y="12" width="20" height="24" rx="2" stroke="#6C9EFF" stroke-width="2"/>
              </svg>
            </div>
            <h3 class="text-gray-800 text-base font-semibold mb-1">我的报告</h3>
            <p class="text-gray-500 text-xs">查看历史记录</p>
          </div>

          <!-- 护肤方案 / 推荐商品 -->
          <div 
            @click="handleNavigate('products')"
            class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 active:scale-95 transition-transform"
          >
            <div class="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center mb-3">
              <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="12" fill="#FF6B9D" fill-opacity="0.1"/>
                <path d="M24 16L18 20V30C18 31.1046 18.8954 32 20 32H28C29.1046 32 30 31.1046 30 30V20L24 16Z" fill="#FF6B9D"/>
                <path d="M20 20L24 17L28 20V28H20V20Z" stroke="#FF6B9D" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h3 class="text-gray-800 text-base font-semibold mb-1">护肤方案</h3>
            <p class="text-gray-500 text-xs">推荐商品</p>
          </div>

          <!-- 护肤资讯 -->
          <div 
            @click="handleNavigate('beauty-news')"
            class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 active:scale-95 transition-transform"
          >
            <div class="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-3">
              <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="12" fill="#A855F7" fill-opacity="0.1"/>
                <path d="M4 16L8.586 11.414C9.367 10.633 10.633 10.633 11.414 11.414L16 16M14 14L15.586 12.414C16.367 11.633 17.633 11.633 18.414 12.414L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="#A855F7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="text-gray-800 text-base font-semibold mb-1">护肤资讯</h3>
            <p class="text-gray-500 text-xs">专业内容</p>
          </div>

          <!-- 我的预约 -->
          <div
            @click="handleNavigate('appointments')"
            class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 active:scale-95 transition-transform"
          >
            <div class="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-3">
              <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="12" fill="#22C55E" fill-opacity="0.08"/>
                <rect x="14" y="16" width="20" height="16" rx="3" stroke="#22C55E" stroke-width="2"/>
                <path d="M14 20H34" stroke="#22C55E" stroke-width="2" stroke-linecap="round"/>
                <circle cx="20" cy="24" r="1.5" fill="#22C55E"/>
                <circle cx="26" cy="28" r="1.5" fill="#22C55E"/>
                <circle cx="32" cy="24" r="1.5" fill="#22C55E"/>
              </svg>
            </div>
            <h3 class="text-gray-800 text-base font-semibold mb-1">我的预约</h3>
            <p class="text-gray-500 text-xs">查看行程与进度</p>
          </div>
        </div>
      </div>

      <!-- 护肤产品模块 -->
      <div class="px-6 pb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-800">护肤产品</h2>
          <span class="text-sm text-gray-400">更多 ></span>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div 
            v-for="(product, index) in products" 
            :key="index"
            @click="handleNavigate('product-detail', product.id)"
            class="bg-white rounded-xl overflow-hidden active:scale-95 transition-transform"
          >
            <div class="aspect-square w-full overflow-hidden bg-gray-100">
              <img 
                :src="product.image" 
                :alt="product.name"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="p-2">
              <h3 class="text-xs font-medium text-gray-800 mb-1 line-clamp-2">{{ product.name }}</h3>
              <p class="text-xs text-gray-500 line-clamp-1">{{ product.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 护肤资讯模块 -->
      <div class="px-6 pb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-800">护肤资讯</h2>
          <span @click="handleNavigate('beauty-news')" class="text-sm text-gray-400 cursor-pointer">更多 ></span>
        </div>
        <div class="space-y-4">
          <div 
            v-for="(article, index) in articles" 
            :key="index"
            @click="handleNavigate('article-detail', article.id)"
            class="bg-white rounded-xl p-3 flex gap-3 active:scale-[0.98] transition-transform"
          >
            <div class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
              <img 
                :src="article.image" 
                :alt="article.title"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="flex-1 flex flex-col justify-between">
              <h3 class="text-sm font-medium text-gray-800 line-clamp-2 mb-1">{{ article.title }}</h3>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400">{{ article.date }}</span>
                <span class="text-xs text-gray-400">{{ article.views }}阅读</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部导航栏 -->
    <TabBar />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import TabBar from '../components/TabBar.vue'
const router = useRouter()
// 当前选中门店
const currentStore = ref({
  id: 1,
  name: '滨江路美肤管理中心',
  address: '杭州市滨江区滨江路888号',
  distance: '1.2km'
})

const currentBanner = ref(0)

// Banner 数据 - 医美相关图片
const banners = ref([
  {
    title: '促销活动',
    subtitle: '限时优惠，不容错过',
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=375&h=128&fit=crop&q=80' // 美容spa场景
  },
  {
    title: '到店福利',
    subtitle: '新客专享，惊喜不断',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=375&h=128&fit=crop&q=80' // 护肤产品展示
  },
  {
    title: '首诊优惠',
    subtitle: '首次体验，超值价格',
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=375&h=128&fit=crop&q=80' // 美容护理
  }
])

// 护肤产品数据 - 6条产品，图片不一致
const products = ref([
  {
    id: 1,
    name: '深层清洁洗面奶',
    desc: '温和清洁，不紧绷',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=200&fit=crop&q=80' // 洗面奶产品
  },
  {
    id: 2,
    name: '补水保湿精华',
    desc: '24小时长效保湿',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop&q=80' // 精华液产品
  },
  {
    id: 3,
    name: '抗皱紧致面霜',
    desc: '淡化细纹，提拉紧致',
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=200&h=200&fit=crop&q=80' // 面霜产品
  },
  {
    id: 4,
    name: '美白淡斑精华',
    desc: '均匀肤色，提亮肌肤',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=200&h=200&fit=crop&q=80' // 美白产品
  },
  {
    id: 5,
    name: '舒缓修护面膜',
    desc: '敏感肌专用，温和修护',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&h=200&fit=crop&q=80' // 面膜产品
  },
  {
    id: 6,
    name: '眼部护理精华',
    desc: '淡化黑眼圈，消除眼袋',
    image: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.alicdn.com%2Fimgextra%2Fi4%2F2215493996071%2FO1CN01qbUcaG1uiZRKJRSqb_%21%212215493996071-0-gg_content.jpg&refer=http%3A%2F%2Fimg.alicdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1767952360&t=c904726366bd6c19e6415db51bbd70f0?w=200&h=200&fit=crop&q=80' // 眼部护理产品
  }
])

// 护肤资讯数据 - 5条资讯，图文混排，图片不一致
const articles = ref([
  {
    id: 1,
    title: '春季护肤攻略：如何应对换季敏感问题',
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=200&h=200&fit=crop&q=80', // 春季护肤场景
    date: '2025-01-15',
    views: '1.2k'
  },
  {
    id: 2,
    title: '医美级护肤：从基础到进阶的完整指南',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200&h=200&fit=crop&q=80', // 医美护肤产品
    date: '2025-01-14',
    views: '2.5k'
  },
  {
    id: 3,
    title: '熬夜族必看：夜间护肤的正确打开方式',
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=200&h=200&fit=crop&q=80', // 夜间护肤
    date: '2025-01-13',
    views: '3.1k'
  },
  {
    id: 4,
    title: '敏感肌如何选择适合自己的护肤品',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=200&fit=crop&q=80', // 敏感肌护理
    date: '2025-01-12',
    views: '1.8k'
  },
  {
    id: 5,
    title: '抗衰老新趋势：早C晚A护肤法详解',
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=200&h=200&fit=crop&q=80', // 抗衰老产品
    date: '2025-01-11',
    views: '4.2k'
  }
])

const bannerTimer = ref(null)

// 门店选择
const handleStoreSelect = () => {
  router.push('/store-selection')
  console.log('门店选择')
}

// Banner 自动轮播
const startBannerCarousel = () => {
  bannerTimer.value = setInterval(() => {
    currentBanner.value = (currentBanner.value + 1) % banners.value.length
  }, 3000)
}

const stopBannerCarousel = () => {
  if (bannerTimer.value) {
    clearInterval(bannerTimer.value)
    bannerTimer.value = null
  }
}

// 功能入口导航
const handleNavigate = (type, id) => {
  if (type === 'beauty-news') {
    router.push('/beauty-news')
    console.log('跳转到美容资讯')
  } else if (type === 'article-detail') {
    console.log('跳转到文章详情:', id)
    router.push({
      path: '/article-detail',
      query: { id }
    })
  } else if (type === 'reports') {
    router.push('/skin-reports')
    console.log('跳转到肤质报告')
  } else if (type === 'appointments') {
    router.push('/my-appointments')
    console.log('跳转到我的预约')
  } else {
    console.log('导航到:', type, id)
  }
}

onMounted(() => {
  startBannerCarousel()

  // 检查是否有保存的门店信息
  if (typeof wx !== 'undefined' && wx.getStorageSync) {
    const savedStore = wx.getStorageSync('selectedStore')
    if (savedStore && savedStore.id) {
      currentStore.value = savedStore
    }
  } else {
    // 浏览器环境下的处理
    const savedStore = localStorage.getItem('selectedStore')
    if (savedStore) {
      try {
        const store = JSON.parse(savedStore)
        if (store && store.id) {
          currentStore.value = store
        }
      } catch (e) {
        console.log('解析门店数据失败:', e)
      }
    }
  }
})

onBeforeUnmount(() => {
  stopBannerCarousel()
})
</script>

<style scoped>
/* 微信小程序375px适配基础样式 */
.index-container {
  height:100vh;
  width: 100%;
  max-width: 375px;
  margin: 0 auto;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}

/* 确保所有子元素适配容器宽度 */
.index-container > * {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* 主体内容区域样式 */
.content-area {
  height: calc(100vh - 140px);
  overflow-y: auto;
  overflow-x: hidden;
}

/* 微信小程序胶囊按钮 */
.capsule-container {
  display: flex;
  align-items: center;
  height: 32px;
  min-width: 87px;
  width: 87px;
  border-radius: 16px;
  padding: 0 6px;
  box-sizing: border-box;
  flex-shrink: 0;
  transition: background 0.2s;
  justify-content: space-between;
  background: #fff;
  border-radius: 16px;
  padding: 0 6px;
  box-sizing: border-box;
  flex-shrink: 0;
  border: 1px solid #e8e8e8;
}

.capsule-container:active {
  background: rgba(0, 0, 0, 0.85);
}

.capsule-btn {
  flex: 1;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: rgba(0,0,0,.6);
  padding: 0;
  min-width: 0;
  transition: none;
}

.capsule-btn:hover {
  opacity: 1;
}

.capsule-btn:active {
  opacity: 1;
}

.capsule-divider {
  width: 2px;
  height: 16px;
  background: rgba(0,0,0, 0.3);
  margin: 0 2px;
  flex-shrink: 0;
}

/* 小屏幕适配 */
@media screen and (max-width: 375px) {
  .index-container {
    width: 100vw;
    max-width: 100vw;
  }
}
</style>

