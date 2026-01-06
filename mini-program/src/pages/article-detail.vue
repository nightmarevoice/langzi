<template>
  <div class="article-detail-container">
    <!-- 顶部栏 -->
    <div class="header">
      <button class="back-btn" @click="handleBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="header-title">文章详情</h1>
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

    <!-- 文章内容 -->
    <div class="content" v-if="article">
      <!-- 文章头部 -->
      <div class="article-header">
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-meta">
          <span class="article-date">{{ article.date }}</span>
          <span class="article-views">{{ article.views }}阅读</span>
        </div>
        <div class="article-tags">
          <span 
            v-for="tag in article.tags" 
            :key="tag"
            class="tag"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- 文章封面图 -->
      <div class="article-cover">
        <img 
          :src="article.image" 
          :alt="article.title"
          class="cover-image"
        />
      </div>

      <!-- 文章正文 -->
      <div class="article-body">
        <div class="article-content" v-html="article.content"></div>
      </div>

      <!-- 相关推荐 -->
      <div class="related-section" v-if="relatedArticles.length > 0">
        <h3 class="related-title">相关推荐</h3>
        <div class="related-list">
          <div 
            v-for="item in relatedArticles" 
            :key="item.id"
            @click="handleRelatedClick(item.id)"
            class="related-card"
          >
            <div class="related-image-wrapper">
              <img 
                :src="item.image" 
                :alt="item.title"
                class="related-image"
              />
            </div>
            <div class="related-info">
              <h4 class="related-card-title">{{ item.title }}</h4>
              <div class="related-meta">
                <span class="related-date">{{ item.date }}</span>
                <span class="related-views">{{ item.views }}阅读</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-else class="loading-state">
      <div class="loading-spinner"></div>
      <p class="loading-text">加载中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 文章数据
const article = ref(null)

// 相关文章
const relatedArticles = ref([])

// 模拟文章数据
const articlesData = {
  1: {
    id: 1,
    category: 'acne',
    title: '痘痘肌护理全攻略：从清洁到修复的完整方案',
    desc: '了解痘痘形成的原因，掌握正确的清洁方法，选择适合的护肤品，让肌肤重获健康光泽。',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=300&h=200&fit=crop&q=75',
    tags: ['痘痘', '护理', '清洁'],
    date: '2024-01-15',
    views: 1234,
    content: `
      <p>痘痘是困扰很多人的肌肤问题，正确的护理方法可以帮助改善痘痘肌，让肌肤恢复健康状态。</p>
      
      <h2>一、了解痘痘形成的原因</h2>
      <p>痘痘的形成主要与以下几个因素有关：</p>
      <ul>
        <li><strong>皮脂分泌过多：</strong>青春期或内分泌失调会导致皮脂腺分泌旺盛</li>
        <li><strong>毛囊堵塞：</strong>角质层过厚或清洁不当导致毛囊口堵塞</li>
        <li><strong>细菌感染：</strong>痤疮丙酸杆菌等细菌在毛囊内繁殖</li>
        <li><strong>炎症反应：</strong>身体对细菌产生免疫反应，形成红肿</li>
      </ul>

      <h2>二、正确的清洁方法</h2>
      <p>清洁是痘痘肌护理的第一步，也是最重要的一步：</p>
      <ol>
        <li>选择温和的洁面产品，避免过度清洁</li>
        <li>每天早晚各清洁一次，不要频繁洗脸</li>
        <li>使用温水洗脸，避免过热或过冷的水</li>
        <li>轻轻按摩，不要用力搓揉</li>
        <li>彻底冲洗干净，避免残留</li>
      </ol>

      <h2>三、选择合适的护肤品</h2>
      <p>痘痘肌在选择护肤品时需要注意：</p>
      <ul>
        <li>选择无油或低油的配方</li>
        <li>含有水杨酸、果酸等成分的产品有助于去角质</li>
        <li>含有茶树油、金缕梅等成分的产品有抗炎作用</li>
        <li>避免使用过于油腻的面霜</li>
        <li>选择标注"不致痘"的产品</li>
      </ul>

      <h2>四、日常护理建议</h2>
      <p>除了正确的清洁和护肤，日常生活中的一些习惯也很重要：</p>
      <ul>
        <li>保持充足的睡眠，避免熬夜</li>
        <li>饮食清淡，少吃辛辣、油腻食物</li>
        <li>多喝水，促进新陈代谢</li>
        <li>避免用手触摸脸部</li>
        <li>定期更换枕套和毛巾</li>
        <li>保持心情愉快，减少压力</li>
      </ul>

      <p>通过以上方法，坚持护理，痘痘肌会逐渐改善。如果痘痘问题严重，建议咨询专业皮肤科医生。</p>
    `
  },
  2: {
    id: 2,
    category: 'whitening',
    title: '美白精华的正确使用方法，让你快速提亮肤色',
    desc: '揭秘美白精华的核心成分，教你如何正确使用才能达到最佳美白效果，避免常见误区。',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=200&fit=crop&q=75',
    tags: ['美白', '精华', '提亮'],
    date: '2024-01-14',
    views: 2156,
    content: `
      <p>美白精华是很多女性护肤的必备品，但如何正确使用才能达到最佳效果呢？</p>
      
      <h2>一、美白精华的核心成分</h2>
      <p>了解美白精华的成分有助于选择适合自己的产品：</p>
      <ul>
        <li><strong>维生素C：</strong>抗氧化，抑制黑色素生成</li>
        <li><strong>烟酰胺：</strong>阻断黑色素向角质层转移</li>
        <li><strong>熊果苷：</strong>抑制酪氨酸酶活性</li>
        <li><strong>曲酸：</strong>抑制黑色素形成</li>
        <li><strong>传明酸：</strong>抑制黑色素生成和炎症</li>
      </ul>

      <h2>二、正确的使用步骤</h2>
      <ol>
        <li>清洁面部后，使用爽肤水</li>
        <li>取2-3滴精华液于掌心</li>
        <li>用指腹轻轻按摩至吸收</li>
        <li>等待2-3分钟后再使用面霜</li>
        <li>白天使用后务必涂抹防晒霜</li>
      </ol>

      <h2>三、使用注意事项</h2>
      <ul>
        <li>首次使用前先做皮肤测试</li>
        <li>从低浓度开始，逐步增加</li>
        <li>避免与酸性产品同时使用</li>
        <li>白天使用后必须防晒</li>
        <li>坚持使用，效果需要时间</li>
      </ul>
    `
  },
  3: {
    id: 3,
    category: 'anti-aging',
    title: '抗衰老从25岁开始：早预防比晚修复更重要',
    desc: '25岁是肌肤开始老化的关键节点，了解抗衰老的正确时机和方法，让青春停留更久。',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&q=75',
    tags: ['抗衰', '预防', '年轻'],
    date: '2024-01-13',
    views: 3456,
    content: `
      <p>25岁是肌肤老化的分水岭，从这个年龄开始，肌肤的胶原蛋白开始流失，细纹开始出现。</p>
      
      <h2>一、为什么25岁开始抗衰？</h2>
      <p>25岁后，人体各项机能开始下降：</p>
      <ul>
        <li>胶原蛋白合成速度减慢</li>
        <li>弹性纤维开始断裂</li>
        <li>新陈代谢速度下降</li>
        <li>自由基损伤累积</li>
      </ul>

      <h2>二、抗衰老的关键方法</h2>
      <ul>
        <li><strong>防晒：</strong>紫外线是肌肤老化的主要原因</li>
        <li><strong>抗氧化：</strong>使用含有维生素C、E等成分的产品</li>
        <li><strong>保湿：</strong>保持肌肤水润，延缓细纹出现</li>
        <li><strong>抗糖化：</strong>减少糖分摄入，使用抗糖化产品</li>
      </ul>
    `
  },
  4: {
    id: 4,
    category: 'sensitive',
    title: '敏感肌护理指南：温和护肤，远离刺激',
    desc: '敏感肌人群必看的护理指南，教你如何选择温和的护肤品，建立健康的肌肤屏障。',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=200&fit=crop&q=75',
    tags: ['敏感肌', '温和', '修护'],
    date: '2024-01-12',
    views: 1890,
    content: `
      <p>敏感肌需要特别的护理，温和的护肤方式可以帮助建立健康的肌肤屏障。</p>
      
      <h2>一、敏感肌的特征</h2>
      <ul>
        <li>容易泛红、发痒</li>
        <li>对护肤品容易过敏</li>
        <li>肌肤屏障功能较弱</li>
        <li>容易受外界刺激</li>
      </ul>

      <h2>二、护理原则</h2>
      <ul>
        <li>选择温和、无刺激的产品</li>
        <li>简化护肤步骤</li>
        <li>避免频繁更换产品</li>
        <li>做好防晒和保湿</li>
      </ul>
    `
  },
  5: {
    id: 5,
    category: 'moisturizing',
    title: '冬季补水大作战：告别干燥，拥有水润肌',
    desc: '冬季肌肤容易干燥，掌握正确的补水方法，让肌肤在寒冷季节也能保持水润状态。',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=200&fit=crop&q=75',
    tags: ['补水', '冬季', '保湿'],
    date: '2024-01-11',
    views: 2789,
    content: `
      <p>冬季干燥的气候会让肌肤失去水分，正确的补水方法很重要。</p>
      
      <h2>一、冬季肌肤干燥的原因</h2>
      <ul>
        <li>空气湿度低</li>
        <li>室内暖气使空气更干燥</li>
        <li>皮脂分泌减少</li>
        <li>血液循环变慢</li>
      </ul>

      <h2>二、补水方法</h2>
      <ul>
        <li>使用保湿型洁面产品</li>
        <li>使用精华和面霜锁水</li>
        <li>定期敷面膜</li>
        <li>多喝水</li>
      </ul>
    `
  },
  6: {
    id: 6,
    category: 'sun-protection',
    title: '防晒的重要性：一年四季都不能忽视的护肤步骤',
    desc: '紫外线是肌肤老化的主要原因之一，了解防晒的正确方法，保护肌肤免受伤害。',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&q=75',
    tags: ['防晒', '紫外线', '防护'],
    date: '2024-01-10',
    views: 3124,
    content: `
      <p>防晒是护肤的基础，一年四季都不能忽视。</p>
      
      <h2>一、紫外线对肌肤的伤害</h2>
      <ul>
        <li>导致黑色素生成</li>
        <li>破坏胶原蛋白</li>
        <li>加速肌肤老化</li>
        <li>可能引发皮肤癌</li>
      </ul>

      <h2>二、如何选择防晒产品</h2>
      <ul>
        <li>SPF值至少30以上</li>
        <li>选择广谱防晒（UVA+UVB）</li>
        <li>根据肤质选择质地</li>
        <li>每2小时补涂一次</li>
      </ul>
    `
  },
  7: {
    id: 7,
    category: 'acne',
    title: '闭口粉刺怎么办？这些方法帮你轻松解决',
    desc: '闭口粉刺困扰很多人，了解形成原因和正确的处理方法，让肌肤恢复光滑。',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=300&h=200&fit=crop&q=75',
    tags: ['闭口', '粉刺', '清洁'],
    date: '2024-01-09',
    views: 1567,
    content: `
      <p>闭口粉刺是常见的肌肤问题，正确的处理方法很重要。</p>
      
      <h2>一、闭口粉刺的形成原因</h2>
      <ul>
        <li>毛囊口被角质堵塞</li>
        <li>皮脂分泌过多</li>
        <li>清洁不彻底</li>
        <li>使用过于油腻的护肤品</li>
      </ul>

      <h2>二、处理方法</h2>
      <ul>
        <li>定期去角质</li>
        <li>使用含有水杨酸的产品</li>
        <li>保持清洁</li>
        <li>避免用手挤压</li>
      </ul>
    `
  },
  8: {
    id: 8,
    category: 'whitening',
    title: '如何选择适合自己的美白产品？',
    desc: '市面上的美白产品琳琅满目，教你如何根据肤质和需求选择最适合的美白产品。',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=200&fit=crop&q=75',
    tags: ['美白', '产品', '选择'],
    date: '2024-01-08',
    views: 2234,
    content: `
      <p>选择适合自己的美白产品需要考虑多个因素。</p>
      
      <h2>一、了解自己的肤质</h2>
      <ul>
        <li>干性肌肤：选择滋润型美白产品</li>
        <li>油性肌肤：选择清爽型美白产品</li>
        <li>敏感肌：选择温和型美白产品</li>
      </ul>

      <h2>二、查看产品成分</h2>
      <ul>
        <li>选择含有有效美白成分的产品</li>
        <li>避免含有刺激性成分</li>
        <li>注意成分浓度</li>
      </ul>
    `
  }
}

// 加载文章数据
onMounted(() => {
  const articleId = parseInt(route.query.id)
  if (articlesData[articleId]) {
    article.value = articlesData[articleId]
    
    // 加载相关文章（同分类的其他文章）
    const category = article.value.category
    relatedArticles.value = Object.values(articlesData)
      .filter(item => item.category === category && item.id !== articleId)
      .slice(0, 3)
  }
})

// 返回
const handleBack = () => {
  router.back()
}

// 更多操作
const handleMore = () => {
  // 可以添加更多操作菜单
  console.log('更多操作')
}

// 点击相关文章
const handleRelatedClick = (articleId) => {
  router.push({
    path: '/article-detail',
    query: { id: articleId }
  })
  // 滚动到顶部
  window.scrollTo(0, 0)
}
</script>

<style scoped>
.article-detail-container {
  width: 100%;
  max-width: 375px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
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

/* 内容区域 */
.content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 文章头部 */
.article-header {
  padding: 20px 20px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.article-title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  margin: 0 0 12px 0;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: #999;
  margin-bottom: 12px;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 4px 10px;
  font-size: 12px;
  color: #1AD299;
  background-color: rgba(26, 210, 153, 0.1);
  border-radius: 12px;
  white-space: nowrap;
}

/* 文章封面 */
.article-cover {
  width: 100%;
  height: 180px;
  overflow: hidden;
  background-color: #f0f0f0;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 文章正文 */
.article-body {
  padding: 20px;
}

.article-content {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
}

.article-content :deep(p) {
  margin: 0 0 16px 0;
}

.article-content :deep(h2) {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 24px 0 12px 0;
}

.article-content :deep(h3) {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 20px 0 10px 0;
}

.article-content :deep(ul),
.article-content :deep(ol) {
  margin: 0 0 16px 0;
  padding-left: 24px;
}

.article-content :deep(li) {
  margin: 8px 0;
  line-height: 1.6;
}

.article-content :deep(strong) {
  font-weight: 600;
  color: #333;
}

/* 相关推荐 */
.related-section {
  margin-top: 32px;
  padding: 20px;
  background-color: #f5f5f5;
  border-top: 1px solid #e8e8e8;
}

.related-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.related-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.2s;
}

.related-card:active {
  transform: scale(0.98);
}

.related-image-wrapper {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f0f0f0;
}

.related-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.related-card-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

.related-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

/* 加载状态 */
.loading-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f0f0f0;
  border-top-color: #1AD299;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: 12px;
  font-size: 14px;
  color: #999;
}

/* 微信小程序375px适配 */
@media screen and (max-width: 375px) {
  .article-detail-container {
    width: 100vw;
    max-width: 100vw;
  }
}
</style>

