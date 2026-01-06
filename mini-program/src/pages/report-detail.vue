<template>
  <div class="report-detail-container">
    <!-- 顶部栏 -->
    <div class="header">
      <button class="back-btn" @click="handleBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="header-title">报告详情</h1>
      <div class="header-right">
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
            <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="2" fill="none"/>
            <circle cx="9" cy="9" r="2" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 报告内容 -->
    <div class="content" v-if="report">
      <!-- 总览卡片 -->
      <div class="overview-card">
        <div class="score-section">
          <div class="score-circle" :class="getScoreColorClass(report.score)">
            <div class="score-value">{{ report.score }}</div>
            <div class="score-label">综合评分</div>
        </div>
          <div class="skin-type-tags">
            <span
              v-for="tag in report.skinTypes"
              :key="tag"
              class="skin-type-tag"
            >
              {{ tag }}
            </span>
        </div>
      </div>
        <!-- 雷达图区域 -->
        <div class="radar-section">
          <h3 class="radar-title">肌肤维度分析</h3>
          <div class="radar-chart">
            <div ref="radarChart" class="radar-container"></div>
          </div>
        </div>
      </div>

      <!-- 问题详情 -->
      <div class="problems-section">
        <h2 class="section-title">问题详情</h2>

        <!-- 面部热力图 -->
        <div class="face-heatmap-wrapper">
          <div class="face-heatmap-container" :class="{ 'highlighting': highlightedProblem }">
            <img :src="faceBaseImage" alt="面部分析图" class="face-heatmap-image"/>
            <!-- 热力图覆盖层 -->
            <div class="heatmap-overlay">
              <div
                v-for="(region, index) in faceRegions"
                :key="index"
                class="region-highlight"
                :class="{
                  'active': highlightedProblem && highlightedProblem.regions.includes(region.id),
                  'pulse': highlightedProblem && highlightedProblem.regions.includes(region.id)
                }"
                :style="getRegionStyle(region)"
              ></div>
            </div>
        </div>
      </div>

        <!-- 问题列表 -->
        <div class="problems-list">
        <div 
          v-for="(problem, index) in detailedProblems" 
          :key="index"
            class="problem-card"
            :class="{ 'active': selectedProblem?.id === problem.id }"
            @click="selectProblem(problem)"
        >
            <div class="problem-card-header">
            <div class="problem-icon" :style="{ backgroundColor: problem.color }">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2" fill="none"/>
                <path d="M12 8V12M12 16H12.01" stroke="white" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="problem-info">
              <h3 class="problem-name">{{ problem.name }}</h3>
            <div class="problem-severity" :class="problem.severity">
              {{ problem.severityText }}
            </div>
          </div>
              <button class="expand-btn" @click.stop="toggleProblemDetail(problem)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                     :class="{ 'rotated': problem.expanded }">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>

            <!-- 展开的详细分析 -->
            <div v-if="problem.expanded" class="problem-detail-content">
          <div class="problem-description">
                <h4>问题描述</h4>
                <p>{{ problem.description }}</p>
              </div>
              <div class="problem-cause">
                <h4>成因分析</h4>
                <p>{{ problem.causeAnalysis }}</p>
          </div>
          <div class="problem-suggestion">
                <h4>建议</h4>
                <p>{{ problem.suggestion }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 护肤建议 -->
      <div class="care-suggestions-section">
        <h2 class="section-title">护肤建议</h2>

        <!-- 晨间步骤 -->
        <div class="care-routine">
          <h3 class="routine-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            晨间护理
          </h3>
          <div class="routine-steps">
            <div
              v-for="(step, index) in morningRoutine"
            :key="index"
              class="routine-step"
            >
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-content">
                <div class="step-name">{{ step.name }}</div>
                <div class="step-product" v-if="step.product">{{ step.product }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 晚间步骤 -->
        <div class="care-routine">
          <h3 class="routine-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            晚间护理
          </h3>
          <div class="routine-steps">
            <div
              v-for="(step, index) in eveningRoutine"
              :key="index"
              class="routine-step"
            >
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-content">
                <div class="step-name">{{ step.name }}</div>
                <div class="step-product" v-if="step.product">{{ step.product }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Do's & Don'ts -->
        <div class="dos-donts">
          <div class="dos-section">
            <h4 class="dos-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="#1AD299" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              建议做的事
            </h4>
            <ul class="dos-list">
              <li v-for="item in dosList" :key="item" class="dos-item">{{ item }}</li>
            </ul>
          </div>

          <div class="donts-section">
            <h4 class="donts-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#E74C3C" stroke-width="2"/>
                <path d="M15 9L9 15" stroke="#E74C3C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 9L15 15" stroke="#E74C3C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              建议避免的事
            </h4>
            <ul class="donts-list">
              <li v-for="item in dontsList" :key="item" class="donts-item">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 商品/项目推荐 -->
      <div class="recommendations-section">
        <h2 class="section-title">商品/项目推荐</h2>
        <div class="recommendations-grid">
          <div
            v-for="item in recommendations"
            :key="item.id"
            class="recommendation-card"
            @click="handleRecommendationClick(item)"
          >
            <div class="item-image">
              <img :src="item.image" :alt="item.name"/>
              <div v-if="item.type === 'product'" class="item-badge product-badge">商品</div>
              <div v-else class="item-badge service-badge">项目</div>
            </div>
            <div class="item-info">
              <h4 class="item-name">{{ item.name }}</h4>
              <p class="item-desc">{{ item.description }}</p>
              <div class="item-price" v-if="item.price">
                <span class="price-value">¥{{ item.price }}</span>
                <span v-if="item.originalPrice" class="original-price">¥{{ item.originalPrice }}</span>
              </div>
              <button
                class="item-action-btn"
                :class="{ 'cart-btn': item.type === 'product', 'book-btn': item.type === 'service' }"
                @click.stop="handleItemAction(item)"
              >
                {{ item.type === 'product' ? '加购' : '预约' }}
              </button>
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

    <!-- 底部悬浮 -->
    <div class="floating-actions">
      <div class="consult-btn" @click="handleConsultAI">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>咨询AI顾问</span>
      </div>
      <div class="share-btn" @click="handleShare">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="5" r="3" stroke="currentColor" stroke-width="2"/>
          <circle cx="6" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
          <circle cx="18" cy="19" r="3" stroke="currentColor" stroke-width="2"/>
          <path d="M8.59 13.51L15.42 17.49" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M15.41 6.51L8.59 10.49" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>分享</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import * as echarts from 'echarts/core'
import { RadarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// 注册必需的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  RadarChart,
  CanvasRenderer
])

const router = useRouter()
const route = useRoute()

// 报告数据
const report = ref(null)

// 雷达图实例
const radarChart = ref(null)

// 脸部基础图片
const faceBaseImage = ref('/static/微信图片_20251211123514_1179_45.png')

// 选中的问题（用于热力图高亮）
const selectedProblem = ref(null)
const highlightedProblem = ref(null)

// ECharts实例
let chartInstance = null

// 处理标注点点击
const handleMarkerClick = (problem) => {
  console.log('点击问题标注:', problem)
}

// 面部区域定义（用于热力图）
const faceRegions = ref([
  { id: 'forehead', name: '额头', path: 'M50,20 Q70,15 90,20 L90,35 Q70,30 50,35 Z' },
  { id: 'left-cheek', name: '左脸颊', path: 'M20,40 Q15,60 20,80 L40,85 Q45,65 40,45 Z' },
  { id: 'right-cheek', name: '右脸颊', path: 'M80,45 Q85,65 80,85 L100,80 Q105,60 100,40 Z' },
  { id: 'nose', name: '鼻子', path: 'M45,40 Q50,35 55,40 L55,60 Q50,65 45,60 Z' },
  { id: 'chin', name: '下巴', path: 'M40,70 Q50,75 60,70 L60,85 Q50,90 40,85 Z' },
  { id: 'left-eye', name: '左眼', path: 'M35,35 Q40,30 45,35 Q40,40 35,35 Z' },
  { id: 'right-eye', name: '右眼', path: 'M55,35 Q60,30 65,35 Q60,40 55,35 Z' }
])

// 获取分数颜色类名
const getScoreColorClass = (score) => {
  if (score >= 90) return 'score-healthy'
  if (score >= 70) return 'score-warning'
  return 'score-danger'
}


// 获取雷达图数据
const radarData = computed(() => {
  return report.value?.radarData || [0, 0, 0, 0, 0, 0]
})

// 初始化雷达图
const initRadarChart = () => {
  if (!radarChart.value || !report.value) return

  // 销毁之前的实例
  if (chartInstance) {
    chartInstance.dispose()
  }

  // 创建图表实例
  chartInstance = echarts.init(radarChart.value)

  // 配置选项
  const option = {
    backgroundColor: 'transparent',
    radar: {
      indicator: [
        { name: '水润度', max: 100 },
        { name: '光泽度', max: 100 },
        { name: '弹性', max: 100 },
        { name: '紧致度', max: 100 },
        { name: '细腻度', max: 100 },
        { name: '均匀度', max: 100 }
      ],
      center: ['50%', '50%'],
      radius: '75%',
      startAngle: 90,
      splitNumber: 3,
      shape: 'circle',
      axisName: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 12,
        fontWeight: 500
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.15)',
          width: 1,
          type: 'dashed'
        }
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.04)', 'rgba(255, 255, 255, 0.02)']
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.25)',
          width: 1
        }
      }
    },
    series: [{
      type: 'radar',
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 1,
        color: '#1AD299',
        shadowColor: 'rgba(26, 210, 153, 0.5)',
        shadowBlur: 10
      },
      itemStyle: {
        color: '#1AD299',
        borderColor: '#fff',
        borderWidth: 1,
        shadowColor: 'rgba(26, 210, 153, 0.8)',
        shadowBlur: 8
      },
      areaStyle: {
        color: {
          type: 'radial',
          x: 0.5,
          y: 0.5,
          r: 0.6,
          colorStops: [
            { offset: 0, color: 'rgba(255, 255, 255, 0.5)' },
            { offset: 0.5, color: 'rgba(255, 255, 255, 0.5)' },
            { offset: 1, color: 'rgba(255, 255, 255, 0.5)' }
          ]
        },
        shadowColor: 'rgba(26, 210, 153, 0.3)',
        shadowBlur: 15
      },
      emphasis: {
        focus: 'series',
        lineStyle: {
          width: 4,
          color: '#1AD299'
        },
        areaStyle: {
          color: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.6,
            colorStops: [
              { offset: 0, color: 'rgba(26, 210, 153, 0.5)' },
              { offset: 0.5, color: 'rgba(26, 210, 153, 0.3)' },
              { offset: 1, color: 'rgba(26, 210, 153, 0.15)' }
            ]
          }
        }
      },
      data: [{
        value: radarData.value,
        name: '肌肤分析'
      }]
    }],
    tooltip: {
      show: true,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#1AD299',
      textStyle: {
        color: '#fff'
      },
      formatter: (params) => {
        const indicators = ['水润度', '光泽度', '弹性', '紧致度', '细腻度', '均匀度']
        let result = `${params.seriesName}<br/>`
        params.data.value.forEach((value, index) => {
          result += `${indicators[index]}: ${value}%<br/>`
        })
        return result
      }
    }
  }

  // 设置配置项
  chartInstance.setOption(option)

  // 响应式调整
  const resizeObserver = new ResizeObserver(() => {
    if (chartInstance) {
      chartInstance.resize()
    }
  })
  resizeObserver.observe(radarChart.value)
}

// 销毁雷达图
const destroyRadarChart = () => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
}

// 获取区域样式
const getRegionStyle = (region) => {
  return {
    clipPath: `path('${region.path}')`,
    opacity: highlightedProblem.value && highlightedProblem.value.regions.includes(region.id) ? 0.8 : 0
  }
}

// 选择问题（热力图交互）
const selectProblem = (problem) => {
  selectedProblem.value = problem
  highlightedProblem.value = problem
}

// 切换问题详情展开
const toggleProblemDetail = (problem) => {
  problem.expanded = !problem.expanded
}

// 详细问题列表
const detailedProblems = computed(() => {
  if (!report.value) return []
  
  const problemDetails = {
    'pore': {
      id: 'pore',
      name: '毛孔粗大',
      severity: 'medium',
      severityText: '中等',
      description: '检测到T区毛孔明显粗大，鼻翼两侧毛孔直径约0.3mm，超出正常范围（正常范围：0.1-0.2mm）。毛孔周围存在轻微炎症反应。',
      causeAnalysis: '毛孔粗大主要由以下因素造成：1) 皮脂腺分泌旺盛导致毛孔扩张；2) 角质层堆积堵塞毛孔；3) 皮肤老化导致弹性下降；4) 环境污染和紫外线损伤。',
      suggestion: '建议使用含有水杨酸或果酸的洁面产品，定期进行深层清洁，使用收缩毛孔精华，避免使用过于油腻的护肤品。',
      color: '#FF6B6B',
      regions: ['forehead', 'nose'],
      expanded: false
    },
    'acne': {
      id: 'acne',
      name: '痘痘严重',
      severity: 'high',
      severityText: '严重',
      description: '面部存在多处炎性痘痘，主要集中在额头和下巴区域。检测到15处炎性痘痘，其中3处为囊肿型痘痘，炎症反应明显。',
      causeAnalysis: '痘痘形成的主要原因是：1) 皮脂腺过度分泌导致毛孔堵塞；2) 痤疮丙酸杆菌等细菌感染；3) 激素水平波动；4) 生活压力和饮食不规律；5) 护肤品使用不当。',
      suggestion: '建议使用含有水杨酸、茶树精油或过氧化苯甲酰的抗痘产品，避免挤压痘痘，保持面部清洁，必要时咨询皮肤科医生。',
      color: '#FF8E53',
      regions: ['forehead', 'chin', 'left-cheek', 'right-cheek'],
      expanded: false
    },
    'spot': {
      id: 'spot',
      name: '色斑',
      severity: 'medium',
      severityText: '中等',
      description: '面部检测到多处色素沉着，主要集中在颧骨和鼻梁区域，色斑面积约占总面积的8%。色斑颜色较深，边界清晰。',
      causeAnalysis: '色斑产生的原因包括：1) 紫外线照射导致黑色素沉积；2) 激素变化影响黑色素生成；3) 皮肤炎症后色素沉着；4) 遗传因素；5) 某些药物的影响。',
      suggestion: '建议使用含有维生素C、烟酰胺或熊果苷的美白精华，严格做好防晒工作（SPF30+），避免在强光下长时间暴露。',
      color: '#9B59B6',
      regions: ['nose', 'left-cheek', 'right-cheek'],
      expanded: false
    },
    'dry': {
      id: 'dry',
      name: '皮肤干燥',
      severity: 'medium',
      severityText: '中等',
      description: '皮肤水分含量偏低，脸颊区域水分值仅为35%（正常范围：45-55%）。皮肤屏障功能较弱，容易出现脱屑现象。',
      causeAnalysis: '皮肤干燥的成因主要有：1) 皮脂腺分泌不足；2) 环境湿度过低；3) 使用强力洁面产品破坏皮脂膜；4) 年龄增长导致皮肤屏障功能减弱；5) 某些疾病的影响。',
      suggestion: '建议使用含有透明质酸、神经酰胺或角鲨烷的保湿产品，早晚各一次，增加补水面膜使用频率，避免使用过于强力的洁面产品。',
      color: '#3498DB',
      regions: ['left-cheek', 'right-cheek'],
      expanded: false
    },
    'sensitive': {
      id: 'sensitive',
      name: '皮肤敏感',
      severity: 'high',
      severityText: '严重',
      description: '皮肤屏障功能较弱，脸颊区域出现轻微泛红，敏感度评分较高。皮肤对外界刺激反应明显，容易出现过敏症状。',
      causeAnalysis: '皮肤敏感的根本原因是皮肤屏障受损，包括：1) 皮脂膜破坏；2) 角质层变薄；3) 皮肤微生物组失衡；4) 免疫系统过度反应；5) 环境因素刺激。',
      suggestion: '建议使用温和无刺激的护肤品，避免含有酒精、香精、防腐剂的产品，选择含有神经酰胺、积雪草等舒缓成分的产品。',
      color: '#E74C3C',
      regions: ['left-cheek', 'right-cheek', 'left-eye', 'right-eye'],
      expanded: false
    },
    'oil': {
      id: 'oil',
      name: '出油过多',
      severity: 'medium',
      severityText: '中等',
      description: 'T区油脂分泌旺盛，出油量超出正常值30%。毛孔因油脂堵塞而显得粗大，容易引发痘痘问题。',
      causeAnalysis: '出油过多的原因包括：1) 雄激素水平较高刺激皮脂腺；2) 遗传因素；3) 饮食偏油腻；4) 压力过大；5) 环境温度较高；6) 某些护肤品刺激。',
      suggestion: '建议使用温和的控油洁面产品，使用含有水杨酸或烟酰胺的控油精华，避免过度清洁导致皮肤干燥，保持水油平衡。',
      color: '#F39C12',
      regions: ['forehead', 'nose'],
      expanded: false
    },
    'wrinkle': {
      id: 'wrinkle',
      name: '细纹',
      severity: 'low',
      severityText: '轻微',
      description: '眼部周围出现轻微细纹，眼角区域细纹较为明显。细纹主要由于皮肤干燥和胶原蛋白流失导致。',
      causeAnalysis: '细纹形成的主要原因是：1) 胶原蛋白和弹性蛋白流失；2) 皮肤水分不足；3) 面部表情过度使用；4) 紫外线损伤；5) 年龄增长导致皮肤老化。',
      suggestion: '建议使用含有视黄醇、胜肽或维生素C的抗衰老精华，加强眼部护理，使用眼霜，轻柔按摩促进吸收，保持充足睡眠，注意防晒。',
      color: '#95A5A6',
      regions: ['left-eye', 'right-eye'],
      expanded: false
    },
    'dull': {
      id: 'dull',
      name: '肤色暗沉',
      severity: 'medium',
      severityText: '中等',
      description: '整体肤色偏暗沉，亮度值偏低。皮肤缺乏光泽，可能是由于角质层过厚、血液循环不畅或色素沉着导致。',
      causeAnalysis: '肤色暗沉的成因包括：1) 角质层堆积；2) 血液循环不畅；3) 色素沉积过多；4) 睡眠不足；5) 压力过大；6) 营养不良；7) 环境污染。',
      suggestion: '建议定期去角质，促进皮肤新陈代谢，改善肤色暗沉，使用含有维生素C、烟酰胺的提亮精华，保持充足睡眠，多喝水，适当运动促进血液循环。',
      color: '#7F8C8D',
      regions: ['forehead', 'left-cheek', 'right-cheek', 'chin'],
      expanded: false
    }
  }

  return report.value.problems.map(problem => {
    return problemDetails[problem] || {
      id: problem,
      name: '未知问题',
      severity: 'low',
      severityText: '轻微',
      description: '暂无详细描述',
      causeAnalysis: '暂无成因分析',
      suggestion: '建议咨询专业皮肤科医生',
      color: '#95A5A6',
      regions: [],
      expanded: false
    }
  })
})

// 晨间护理步骤
const morningRoutine = computed(() => {
  if (!report.value) return []
  
  const routines = []

  // 基础清洁
  routines.push({
    name: '温和洁面',
    product: report.value.problems.includes('sensitive') ? '氨基酸洁面乳' : '泡沫洁面乳'
  })

  // 根据问题添加步骤
  if (report.value.problems.includes('acne')) {
    routines.push({
      name: '抗痘护理',
      product: '水杨酸抗痘精华'
    })
  }

  if (report.value.problems.includes('dry') || report.value.problems.includes('sensitive')) {
    routines.push({
      name: '补水保湿',
      product: '透明质酸保湿精华'
    })
  }

  if (report.value.problems.includes('oil') || report.value.problems.includes('pore')) {
    routines.push({
      name: '控油护理',
      product: '烟酰胺控油精华'
    })
  }

  if (report.value.problems.includes('spot') || report.value.problems.includes('dull')) {
    routines.push({
      name: '美白提亮',
      product: '维生素C美白精华'
    })
  }

  if (report.value.problems.includes('wrinkle')) {
    routines.push({
      name: '抗衰护理',
      product: '视黄醇抗衰精华'
    })
  }

  // 防晒（必备）
  routines.push({
    name: '防晒保护',
    product: 'SPF50+防晒霜'
  })

  return routines
})

// 晚间护理步骤
const eveningRoutine = computed(() => {
  if (!report.value) return []

  const routines = []

  // 卸妆清洁（如果需要）
  routines.push({
    name: '卸妆清洁',
    product: '温和卸妆油'
  })

  // 基础清洁
  routines.push({
    name: '深度洁面',
    product: report.value.problems.includes('sensitive') ? '氨基酸洁面乳' : '洁面霜'
  })

  // 根据问题添加步骤
  if (report.value.problems.includes('acne')) {
    routines.push({
      name: '抗炎修复',
      product: '茶树精油修复霜'
    })
  }

  if (report.value.problems.includes('dry') || report.value.problems.includes('sensitive')) {
    routines.push({
      name: '深度补水',
      product: '神经酰胺面霜'
    })
  }

  if (report.value.problems.includes('oil') || report.value.problems.includes('pore')) {
    routines.push({
      name: '收缩毛孔',
      product: '果酸收缩水'
    })
  }
  
  if (report.value.problems.includes('spot') || report.value.problems.includes('dull')) {
    routines.push({
      name: '夜间美白',
      product: '烟酰胺美白霜'
    })
  }
  
  if (report.value.problems.includes('wrinkle')) {
    routines.push({
      name: '夜间修复',
      product: '胜肽眼霜'
    })
  }

  return routines
})

// Do's 建议列表
const dosList = computed(() => {
  if (!report.value) return []

  const dos = [
    '保持规律的作息时间，保证充足睡眠',
    '多喝水，保持身体水分充足',
    '注意饮食均衡，避免过度油腻食物',
    '定期进行温和的去角质护理'
  ]

  // 根据具体问题添加针对性建议
  if (report.value.problems.includes('acne')) {
    dos.push('定期更换床品和毛巾，保持清洁')
    dos.push('避免用手触摸面部，减少细菌传播')
  }

  if (report.value.problems.includes('dry')) {
    dos.push('使用加湿器保持室内湿度')
    dos.push('选择温和的护肤品，避免刺激性成分')
  }

  if (report.value.problems.includes('sensitive')) {
    dos.push('避免频繁更换护肤品，建立稳定护理体系')
    dos.push('定期进行皮肤屏障修复护理')
  }

  return dos.slice(0, 6) // 限制数量
})

// Don'ts 建议列表
const dontsList = computed(() => {
  if (!report.value) return []

  const donts = [
    '避免熬夜，保证充足睡眠',
    '少吃辛辣油腻食物',
    '避免过度清洁破坏皮肤屏障',
    '减少化妆品使用频率'
  ]

  // 根据具体问题添加针对性建议
  if (report.value.problems.includes('acne')) {
    donts.push('不要用手挤压痘痘')
    donts.push('避免使用油性较大的护肤品')
  }

  if (report.value.problems.includes('dry')) {
    donts.push('不要使用含酒精的产品')
    donts.push('避免过度去角质')
  }

  if (report.value.problems.includes('sensitive')) {
    donts.push('不要使用含有香精的产品')
    donts.push('避免频繁更换护肤品牌')
  }

  return donts.slice(0, 6) // 限制数量
})

// 商品推荐
const recommendations = computed(() => {
  if (!report.value) return []

  const topProblems = report.value.problems.slice(0, 3) // 取前3个主要问题
  const recommendations = []

    // 根据主要问题推荐商品和服务
  if (topProblems.includes('acne')) {
    recommendations.push({
      id: 'acne-serum',
      type: 'product',
      name: '水杨酸抗痘精华',
      description: '专业抗痘配方，有效控制痘痘生成',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop',
      price: 299,
      originalPrice: 399
    })
    recommendations.push({
      id: 'acne-treatment',
      type: 'service',
      name: '痤疮治疗项目',
      description: '专业祛痘治疗，针对性解决痘痘问题',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
      price: 1280
    })
  }

  if (topProblems.includes('dry')) {
    recommendations.push({
      id: 'hydrating-cream',
      type: 'product',
      name: '神经酰胺保湿霜',
      description: '深度补水，修复皮肤屏障',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop',
      price: 259,
      originalPrice: 329
    })
  }

  if (topProblems.includes('sensitive')) {
    recommendations.push({
      id: 'soothing-serum',
      type: 'product',
      name: '积雪草舒缓精华',
      description: '温和舒缓，缓解皮肤敏感',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop',
      price: 189,
      originalPrice: 249
    })
  }

  if (topProblems.includes('pore')) {
    recommendations.push({
      id: 'pore-minimizer',
      type: 'product',
      name: '收缩毛孔精华',
      description: '紧致毛孔，改善毛孔粗大',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop',
      price: 199,
      originalPrice: 259
    })
  }

  if (topProblems.includes('spot')) {
    recommendations.push({
      id: 'brightening-serum',
      type: 'product',
      name: '维生素C美白精华',
      description: '淡化色斑，提升肤色均匀度',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop',
      price: 329,
      originalPrice: 429
    })
  }

  // 通用推荐
  if (recommendations.length < 3) {
    recommendations.push({
      id: 'sunscreen',
      type: 'product',
      name: '全能防晒霜 SPF50+',
      description: '全方位防晒保护，防水耐汗',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop',
      price: 159,
      originalPrice: 199
    })
  }

  return recommendations.slice(0, 6) // 最多显示6个推荐
})

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}年${month}月${day}日`
}

// 获取门店名称
const getStoreName = (storeCode) => {
  const storeMap = {
    'binjiang': '滨江路美肤管理中心',
    'downtown': '市中心旗舰店',
    'wanda': '万达广场店'
  }
  return storeMap[storeCode] || storeCode
}

// 返回
const handleBack = () => {
  router.push({ name: 'SkinReports' })
}

// 分享报告
const handleShare = () => {
  // 模拟分享功能
  console.log('分享报告:', report.value)
  // 这里可以调用微信分享API或其他分享功能
  alert('分享功能开发中...')
}

// 咨询AI顾问
const handleConsultAI = () => {
  // 跳转到AI咨询页面，携带皮肤报告数据
  console.log('咨询AI顾问:', report.value)

  // 构造要传递的皮肤报告数据
  const skinReportData = {
    skinType: report.value.skinTypes.join('、'),
    mainProblems: detailedProblems.value.map(p => p.problem),
    score: report.value.score,
    radarData: report.value.radarData,
    recommendations: morningRoutine.value.concat(eveningRoutine.value).map(r => r.description),
    lastTestTime: new Date()
  }

  // 跳转到客服咨询页面，传递数据
  router.push({
    name: 'CustomerService',
    query: {
      skinReport: JSON.stringify(skinReportData)
    }
  })
}

// 处理商品推荐点击
const handleRecommendationClick = (item) => {
  if (item.type === 'product') {
    // 跳转到商品详情页
    console.log('查看商品详情:', item)
    router.push({ name: 'ProductDetail', params: { id: item.id } })
  } else {
    // 跳转到项目详情页
    console.log('查看项目详情:', item)
    router.push({ name: 'ServiceDetail', params: { id: item.id } })
  }
}

// 处理商品/项目操作（加购/预约）
const handleItemAction = (item) => {
  if (item.type === 'product') {
    // 添加到购物车
    console.log('添加到购物车:', item)
    alert(`已添加 ${item.name} 到购物车`)
  } else {
    // 预约项目
    console.log('预约项目:', item)
    router.push({ name: 'Booking', params: { serviceId: item.id } })
  }
}

// 加载报告数据
onMounted(() => {
  const reportId = route.params.id || route.query.id
  
  // 模拟数据 - 实际应该从API获取
  const mockReports = [
    {
      id: 1,
      date: '2024-01-15',
      score: 72, // 综合评分
      skinTypes: ['油性皮肤', '混合性'], // 肤质标签
      radarData: [75, 65, 50, 70, 60, 78], // 雷达图数据：水润度、光泽度、紧致度、均匀度、弹性、细腻度
      tags: ['毛孔粗大', '痘痘严重'],
      store: 'binjiang',
      problems: ['pore', 'acne'],
      problemsDescription: '检测到T区毛孔明显粗大，鼻翼两侧毛孔直径约0.3mm，超出正常范围。面部存在多处炎性痘痘，主要集中在额头和下巴区域，建议使用控油和抗炎产品。',
      isBaseline: true
    },
    {
      id: 2,
      date: '2024-01-10',
      score: 85,
      skinTypes: ['中性皮肤', '暗沉'],
      radarData: [90, 75, 85, 70, 80, 82],
      tags: ['色斑', '干燥'],
      store: 'downtown',
      problems: ['spot', 'dry'],
      problemsDescription: '面部检测到多处色素沉着，主要集中在颧骨和鼻梁区域，色斑面积约占总面积的8%。皮肤干燥，水分含量不足，建议加强保湿和防晒。',
      isBaseline: false
    },
    {
      id: 3,
      date: '2024-01-05',
      score: 65,
      skinTypes: ['敏感性皮肤', '出油'],
      radarData: [60, 55, 70, 65, 75, 68],
      tags: ['敏感', '出油'],
      store: 'wanda',
      problems: ['sensitive', 'oil'],
      problemsDescription: '皮肤屏障功能较弱，脸颊区域出现轻微泛红，敏感度评分较高。T区油脂分泌旺盛，出油量超出正常值30%，建议使用温和的控油产品，避免过度清洁。',
      isBaseline: false
    },
    {
      id: 4,
      date: '2023-12-28',
      score: 78,
      skinTypes: ['混合性皮肤'],
      radarData: [80, 70, 75, 72, 78, 76],
      tags: ['毛孔粗大', '色斑'],
      store: 'binjiang',
      problems: ['pore', 'spot'],
      problemsDescription: '鼻翼和脸颊区域毛孔较为明显，毛孔粗大程度中等。检测到少量色斑，主要分布在颧骨上方，建议定期使用美白精华和做好防晒工作。',
      isBaseline: false
    },
    {
      id: 5,
      date: '2023-12-20',
      score: 68,
      skinTypes: ['油性皮肤', '痘痘肌'],
      radarData: [65, 60, 70, 68, 72, 70],
      tags: ['痘痘严重', '干燥'],
      store: 'downtown',
      problems: ['acne', 'dry'],
      problemsDescription: '面部痘痘问题较为严重，检测到15处炎性痘痘，主要集中在额头、下巴和脸颊区域。同时皮肤干燥，水分含量不足，建议先处理炎症，再加强保湿护理。',
      isBaseline: false
    },
    {
      id: 6,
      date: '2023-12-15',
      score: 82,
      skinTypes: ['干性皮肤', '成熟肌'],
      radarData: [85, 78, 75, 80, 70, 82],
      tags: ['细纹', '暗沉'],
      store: 'wanda',
      problems: ['wrinkle', 'dull'],
      problemsDescription: '眼部周围出现轻微细纹，眼角区域细纹较为明显。整体肤色偏暗沉，亮度值偏低，建议使用抗衰老精华和提亮产品，注意眼部护理。',
      isBaseline: false
    },
    {
      id: 7,
      date: '2024-01-20',
      score: 95,
      skinTypes: ['健康皮肤'],
      radarData: [95, 92, 90, 88, 93, 91],
      tags: ['健康'],
      store: 'binjiang',
      problems: [],
      problemsDescription: '您的皮肤状态非常健康，各方面指标都处于良好水平。继续保持现有的护理习惯，定期进行皮肤检查。',
      isBaseline: false
    }
  ]
  
  const foundReport = mockReports.find(r => r.id === Number(reportId))
  if (foundReport) {
    report.value = foundReport
    // 为没有问题的报告设置默认值
    if (!foundReport.problems || foundReport.problems.length === 0) {
      report.value.problems = []
    }
    // 初始化雷达图
    nextTick(() => {
      initRadarChart()
    })
  }
})

// 组件卸载时清理定时器和图表
onUnmounted(() => {
 
  // 销毁雷达图实例
  destroyRadarChart()
})
</script>

<style scoped>
/* 微信小程序375px适配基础样式 */
.report-detail-container {
  width: 100%;
  max-width: 375px;
  min-width: 375px;
  height: 100vh;
  margin: 0 auto;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
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
  color: #333;
  cursor: pointer;
  padding: 0;
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

.header-right {
  
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #333;
  cursor: pointer;
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

.capsule-btn {
  flex: 1;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0;
  color: #333;
  cursor: pointer;
}

.capsule-btn:active {
  opacity: 0.7;
}

.capsule-divider {
  width: 1px;
  height: 16px;
  background-color: #e8e8e8;
  margin: 0 4px;
}

/* 内容区域 */
.content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 24px;
}

/* 报告头部 */
.report-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
}

.report-date-info {
  flex: 1;
}

.report-date {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.report-store {
  font-size: 14px;
  color: #666;
}

.baseline-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background-color: #E6F7F2;
  color: #1AD299;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.baseline-badge svg {
  width: 12px;
  height: 12px;
}

/* 脸部分析区域 */
.face-analysis-section {
  padding: 24px;
  background-color: #fff;
  margin-top: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.face-image-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.face-image-container {
  position: relative;
  width: 280px;
  height: 360px;
  border-radius: 12px;
  overflow: hidden;
  background-color: #f5f5f5;
}

.face-base-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 问题标注 */
.problem-marker {
  position: absolute;
  cursor: pointer;
  z-index: 10;
}

.marker-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: var(--marker-color, #FF6B6B);
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

.marker-label {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  background-color: var(--marker-color, #FF6B6B);
  opacity: 0.9;
  color: #fff;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* 标签区域 */
.tags-section {
  padding: 20px 24px;
  background-color: #fff;
  margin-top: 12px;
}

.tags-title {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 12px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.problem-tag {
  padding: 6px 16px;
  background-color: #F0F9F7;
  color: #1AD299;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
}

/* 分析区域 */
.analysis-section {
  padding: 24px;
  background-color: #fff;
  margin-top: 12px;
}

.analysis-content {
  margin-top: 12px;
}

.analysis-text {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
}

/* 问题详情区域 */
.problems-detail-section {
  padding: 24px;
  background-color: #fff;
  margin-top: 12px;
}

.problem-item {
  padding: 16px;
  background-color: #f9fafb;
  border-radius: 12px;
  margin-bottom: 16px;
}

.problem-item:last-child {
  margin-bottom: 0;
}

.problem-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.problem-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.problem-info {
  flex: 1;
  min-width: 0;
}

.problem-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.problem-location {
  font-size: 12px;
  color: #999;
}

.problem-severity {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.problem-severity.high {
  background-color: #FFE5E5;
  color: #E74C3C;
}

.problem-severity.medium {
  background-color: #FFF4E5;
  color: #F39C12;
}

.problem-severity.low {
  background-color: #E5F5FF;
  color: #3498DB;
}

.problem-description {
  font-size: 13px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 12px;
}

.problem-suggestion {
  padding: 12px;
  background-color: #fff;
  border-radius: 8px;
  border-left: 3px solid #1AD299;
}

.suggestion-title {
  font-size: 13px;
  font-weight: 600;
  color: #1AD299;
  margin-bottom: 6px;
}

.suggestion-content {
  font-size: 13px;
  line-height: 1.6;
  color: #333;
}

/* 护理建议区域 */
.care-suggestions-section {
  padding: 24px;
  background-color: #fff;
  margin-top: 12px;
}

.suggestions-list {
  margin-top: 16px;
}

.suggestion-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 12px;
}

.suggestion-item:last-child {
  margin-bottom: 0;
}

.suggestion-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #1AD299;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.suggestion-text {
  flex: 1;
  font-size: 13px;
  line-height: 1.6;
  color: #333;
}

/* 加载状态 */
.loading-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  color: #999;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e8e8e8;
  border-top-color: #1AD299;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 14px;
  color: #999;
}

/* 总览卡片 */
.overview-card {
  padding: 24px;
  background: linear-gradient(135deg, #1AD299 0%, #17C088 100%);
  margin: 12px;
  border-radius: 16px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.score-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.1);
  position: relative;
}

.score-circle::before {
  content: '';
  position: absolute;
  z-index:-1;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.2) calc(var(--score) * 1%), transparent calc(var(--score) * 1%));
}

.score-healthy {
  --score: 90;
  border-color: #1AD299;
}

.score-warning {
  --score: 70;
  border-color: #F39C12;
}

.score-danger {
  --score: 30;
  border-color: #E74C3C;
}

.score-value {
  font-size: 32px;
  font-weight: bold;
  z-index: 1;
  position: relative;
}

.score-label {
  font-size: 12px;
  opacity: 0.9;
  z-index: 1;
  position: relative;
}

.skin-type-tags {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skin-type-tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.radar-section {
  text-align: center;
  margin-top: 20px;
}

.radar-title {
  font-size: 16px;
  color: #fff;
  margin-bottom: 10px;
  font-weight: 600;
}

.radar-chart {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.radar-container {
  width: 90%;
  height:280px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
}

/* 问题详情区域 */
.problems-section {
  padding: 24px;
  background-color: #fff;
  margin-top: 12px;
}

.face-heatmap-wrapper {
  margin-bottom: 24px;
}

.face-heatmap-container {
  position: relative;
  width: 280px;
  height: 360px;
  border-radius: 12px;
  overflow: hidden;
  background-color: #f5f5f5;
  margin: 0 auto;
}

.face-heatmap-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.heatmap-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.region-highlight {
  position: absolute;
  background: rgba(255, 0, 0, 0.6);
  transition: opacity 0.3s ease;
}

.region-highlight.active {
  opacity: 0.8;
  animation: pulse-heatmap 2s infinite;
}

@keyframes pulse-heatmap {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.9;
  }
}

.problems-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.problem-card {
  background: #f9fafb;
  border-radius: 12px;
  padding: 16px;
  border: 2px solid transparent;
  transition: border-color 0.3s ease;
}

.problem-card.active {
  border-color: #1AD299;
}

.problem-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 0;
  transition: margin-bottom 0.3s ease;
}

.problem-card-header .expand-btn {
  margin-left: auto;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.problem-card-header .expand-btn.rotated {
  transform: rotate(180deg);
}

.problem-detail-content {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e8e8e8;
}

.problem-detail-content h4 {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.problem-detail-content p {
  font-size: 13px;
  line-height: 1.6;
  color: #666;
  margin: 0 0 12px 0;
}

/* 护肤建议区域 */
.care-suggestions-section {
  padding: 24px;
  background-color: #fff;
  margin-top: 12px;
}

.care-routine {
  margin-bottom: 24px;
}

.routine-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.routine-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.routine-step {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.step-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #1AD299;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
}

.step-product {
  font-size: 12px;
  color: #666;
}

.dos-donts {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dos-section, .donts-section {
  padding: 16px;
  border-radius: 12px;
}

.dos-section {
  background: linear-gradient(135deg, #F0F9F7 0%, #E6F7F2 100%);
  border: 1px solid #1AD299;
}

.donts-section {
  background: linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%);
  border: 1px solid #F87171;
}

.dos-title, .donts-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
}

.dos-list, .donts-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dos-item, .donts-item {
  font-size: 13px;
  line-height: 1.5;
  color: #333;
  position: relative;
  padding-left: 16px;
}

.dos-item::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #1AD299;
  font-weight: bold;
}

.donts-item::before {
  content: '✗';
  position: absolute;
  left: 0;
  color: #E74C3C;
  font-weight: bold;
}

/* 商品推荐区域 */
.recommendations-section {
  padding: 24px;
  background-color: #fff;
  margin-top: 12px;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.recommendation-card {
  background: #f9fafb;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.recommendation-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-image {
  position: relative;
  width: 100%;
  height: 120px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  color: white;
}

.product-badge {
  background: #1AD299;
}

.service-badge {
  background: #1AD299;
}

.item-info {
  padding: 12px;
}

.item-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  line-height: 1.3;
}

.item-desc {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
  line-height: 1.4;
}

.item-price {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.price-value {
  font-size: 14px;
  font-weight: 600;
  color: #E74C3C;
}

.original-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
}

.item-action-btn {
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.cart-btn {
  background: #1AD299;
  color: white;
}

.cart-btn:hover {
  background: #17C088;
}

.book-btn {
  background: #1AD299;
  color: white;
}

.book-btn:hover {
  background: #17C088;
}

/* 底部悬浮 */
.floating-actions {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 1000;
}

.floating-actions .consult-btn, .floating-actions .share-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  border-radius: 24px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.consult-btn {
  background: linear-gradient(135deg, #1AD299 0%, #17C088 100%);
  color: white;
  flex-shrink:0 ;
}
.consult-btn span,svg{
    flex-shrink: 0;
}
.consult-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.share-btn {
  background: white;
  color: #333;
  border: 1px solid #e8e8e8;
  flex-shrink:0 ;
}
.share-btn span,svg {
  flex-shrink: 0;
}
.share-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

/* 响应式设计 */
@media (max-width: 375px) {
  .overview-card {
    margin: 8px;
    padding: 20px;
  }

  .score-circle {
    width: 100px;
    height: 100px;
  }

  .score-value {
    font-size: 28px;
  }

  .face-heatmap-container {
    width: 260px;
    height: 340px;
  }

  .recommendations-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
</style>






