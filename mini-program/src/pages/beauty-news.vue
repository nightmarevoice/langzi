<template>
  <div class="beauty-news-container">
    <!-- 顶部栏 -->
    <div class="header">
      <button class="back-btn" @click="handleBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="header-title">护肤资讯</h1>
      <div class="capsule-container">
        <button class="capsule-btn" @click="handleMore">
          <!-- 三点菜单图标（横向） -->
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="6" cy="12" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="12" r="3" fill="currentColor"/>
            <circle cx="18" cy="12" r="1.5" fill="currentColor"/>
          </svg>
        </button>
        <div class="capsule-divider"></div>
        <button class="capsule-btn">
          <!-- 圆环套圆图标 -->
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- 外圆环：直径10px，半径5px -->
            <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="2" fill="none"/>
            <!-- 内圆：直径3px，半径1.5px -->
            <circle cx="9" cy="9" r="2" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 分类 Tab -->
    <div class="category-tabs">
      <div class="tabs-wrapper">
        <div 
          v-for="category in categories" 
          :key="category.id"
          @click="handleCategoryChange(category.id)"
          class="tab-item"
          :class="{ active: activeCategory === category.id }"
        >
          {{ category.name }}
        </div>
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="content">
      <div class="articles-list">
        <div 
          v-for="article in filteredArticles" 
          :key="article.id"
          @click="handleArticleClick(article.id)"
          class="article-card"
        >
          <!-- 文章图片 -->
          <div class="article-image-wrapper">
            <img 
              :src="article.image" 
              :alt="article.title"
              class="article-image"
            />
          </div>
          
          <!-- 文章信息 -->
          <div class="article-info">
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-desc">{{ article.desc }}</p>
            
            <!-- 标签 -->
            <div class="article-tags">
              <span 
                v-for="tag in article.tags" 
                :key="tag"
                class="tag"
              >
                {{ tag }}
              </span>
            </div>
            
            <!-- 底部信息 -->
            <div class="article-meta">
              <span class="article-date">{{ article.date }}</span>
              <span class="article-views">{{ article.views }}阅读</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredArticles.length === 0" class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 16L8.586 11.414C9.367 10.633 10.633 10.633 11.414 11.414L16 16M14 14L15.586 12.414C16.367 11.633 17.633 11.633 18.414 12.414L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="#ccc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p class="empty-text">暂无内容</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 当前选中的分类
const activeCategory = ref('all')

// 分类列表
const categories = ref([
  { id: 'all', name: '全部' },
  { id: 'acne', name: '痘痘' },
  { id: 'whitening', name: '美白' },
  { id: 'anti-aging', name: '抗衰' },
  { id: 'sensitive', name: '敏感肌' },
  { id: 'moisturizing', name: '补水' },
  { id: 'sun-protection', name: '防晒' }
])

// 文章列表数据
const articles = ref([
  {
    id: 1,
    category: 'acne',
    title: '痘痘肌护理全攻略：从清洁到修复的完整方案',
    desc: '了解痘痘形成的原因，掌握正确的清洁方法，选择适合的护肤品，让肌肤重获健康光泽。',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=300&fit=crop&q=80',
    tags: ['痘痘', '护理', '清洁'],
    date: '2024-01-15',
    views: 1234
  },
  {
    id: 2,
    category: 'whitening',
    title: '美白精华的正确使用方法，让你快速提亮肤色',
    desc: '揭秘美白精华的核心成分，教你如何正确使用才能达到最佳美白效果，避免常见误区。',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=300&fit=crop&q=80',
    tags: ['美白', '精华', '提亮'],
    date: '2024-01-14',
    views: 2156
  },
  {
    id: 3,
    category: 'anti-aging',
    title: '抗衰老从25岁开始：早预防比晚修复更重要',
    desc: '25岁是肌肤开始老化的关键节点，了解抗衰老的正确时机和方法，让青春停留更久。',
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=300&fit=crop&q=80',
    tags: ['抗衰', '预防', '年轻'],
    date: '2024-01-13',
    views: 3456
  },
  {
    id: 4,
    category: 'sensitive',
    title: '敏感肌护理指南：温和护肤，远离刺激',
    desc: '敏感肌人群必看的护理指南，教你如何选择温和的护肤品，建立健康的肌肤屏障。',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=300&fit=crop&q=80',
    tags: ['敏感肌', '温和', '修护'],
    date: '2024-01-12',
    views: 1890
  },
  {
    id: 5,
    category: 'moisturizing',
    title: '冬季补水大作战：告别干燥，拥有水润肌',
    desc: '冬季肌肤容易干燥，掌握正确的补水方法，让肌肤在寒冷季节也能保持水润状态。',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=300&fit=crop&q=80',
    tags: ['补水', '冬季', '保湿'],
    date: '2024-01-11',
    views: 2789
  },
  {
    id: 6,
    category: 'sun-protection',
    title: '防晒的重要性：一年四季都不能忽视的护肤步骤',
    desc: '紫外线是肌肤老化的主要原因之一，了解防晒的正确方法，保护肌肤免受伤害。',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop&q=80',
    tags: ['防晒', '紫外线', '防护'],
    date: '2024-01-10',
    views: 3124
  },
  {
    id: 7,
    category: 'acne',
    title: '闭口粉刺怎么办？这些方法帮你轻松解决',
    desc: '闭口粉刺困扰很多人，了解形成原因和正确的处理方法，让肌肤恢复光滑。',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=300&fit=crop&q=80',
    tags: ['闭口', '粉刺', '清洁'],
    date: '2024-01-09',
    views: 1567
  },
  {
    id: 8,
    category: 'whitening',
    title: '如何选择适合自己的美白产品？',
    desc: '市面上的美白产品琳琅满目，教你如何根据肤质和需求选择最适合的美白产品。',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=300&fit=crop&q=80',
    tags: ['美白', '产品', '选择'],
    date: '2024-01-08',
    views: 2234
  }
])

// 根据分类筛选文章
const filteredArticles = computed(() => {
  if (activeCategory.value === 'all') {
    return articles.value
  }
  return articles.value.filter(article => article.category === activeCategory.value)
})

// 分类切换
const handleCategoryChange = (categoryId) => {
  activeCategory.value = categoryId
}

// 点击文章
const handleArticleClick = (articleId) => {
  router.push({
    path: '/article-detail',
    query: { id: articleId }
  })
}

// 返回
const handleBack = () => {
  router.back()
}

// 更多操作
const handleMore = () => {
  // 可以添加更多操作菜单
  console.log('更多操作')
}
</script>

<style scoped>
.beauty-news-container {
  width: 100%;
  max-width: 375px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  overflow: hidden;
}

/* 顶部栏 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
  position: relative;
}

.back-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #333;
  padding: 0;
  flex-shrink: 0;
}

.back-btn:active {
  opacity: 0.7;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  text-align: center;
  flex: 1;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
}

.capsule-container {
  display: flex;
  align-items: center;
  height: 32px;
  min-width: 87px;
  width: 87px;
  background: #fff;
  border-radius: 16px;
  padding: 0 6px;
  box-sizing: border-box;
  flex-shrink: 0;
  border: 1px solid #e8e8e8;
}

.capsule-container:active {
  background: #f5f5f5;
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
  color: #333;
  padding: 0;
}

.capsule-btn:active {
  opacity: 0.7;
}

.capsule-divider {
  width: 1px;
  height: 16px;
  background: rgba(0, 0, 0, 0.2);
  margin: 0 2px;
  flex-shrink: 0;
}

/* 分类 Tab */
.category-tabs {
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.tabs-wrapper {
  display: flex;
  align-items: center;
  padding: 0 16px;
  min-width: max-content;
}

.tab-item {
  padding: 12px 16px;
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
  flex-shrink: 0;
}

.tab-item:active {
  opacity: 0.7;
}

.tab-item.active {
  color: #1AD299;
  font-weight: 500;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background-color: #1AD299;
  border-radius: 1px;
}

/* 内容区域 */
.content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  -webkit-overflow-scrolling: touch;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 文章卡片 */
.article-card {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.article-card:active {
  transform: scale(0.98);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.article-image-wrapper {
  width: 100%;
  height: 180px;
  overflow: hidden;
  background-color: #f0f0f0;
}

.article-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-info {
  padding: 16px;
}

.article-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.article-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.tag {
  padding: 4px 10px;
  font-size: 12px;
  color: #1AD299;
  background-color: rgba(26, 210, 153, 0.1);
  border-radius: 12px;
  white-space: nowrap;
}

.article-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
}

.article-date,
.article-views {
  display: flex;
  align-items: center;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #ccc;
}

.empty-text {
  margin-top: 16px;
  font-size: 14px;
  color: #999;
}

/* 微信小程序375px适配 */
@media screen and (max-width: 375px) {
  .beauty-news-container {
    width: 100vw;
    max-width: 100vw;
  }
}
</style>

