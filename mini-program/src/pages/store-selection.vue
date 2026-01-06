<template>
  <div class="store-selection-container">
    <!-- 顶部导航 -->
    <div class="header">
      <button @click="handleBack" class="back-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="header-title">选择门店</h1>
      <div class="header-right"></div>
    </div>

    <!-- 主体内容 -->
    <div class="content">
      <!-- 搜索区域 -->
      <div class="search-section">
        <div class="search-bar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索门店名称或地址"
            class="search-input"
          />
        </div>

        <!-- 排序选项 -->
        <div class="sort-options">
          <button
            @click="sortBy = 'distance'"
            class="sort-btn"
            :class="{ active: sortBy === 'distance' }"
          >
            距离最近
          </button>
          <button
            @click="sortBy = 'status'"
            class="sort-btn"
            :class="{ active: sortBy === 'status' }"
          >
            营业状态
          </button>
        </div>
      </div>

      <!-- 当前位置 -->
      <div class="location-section">
        <div class="location-info">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="location-icon">
            <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span class="location-text">
            当前位置：
            <span v-if="currentLocation.loading">定位中...</span>
            <span v-else-if="currentLocation.error" class="location-error">{{ currentLocation.address }}</span>
            <span v-else>{{ currentLocation.address }}</span>
          </span>
          <button @click="getCurrentLocation" class="refresh-location-btn" :disabled="currentLocation.loading">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" :class="{ 'spinning': currentLocation.loading }">
              <path d="M4 4V9H4.582M4.582 9C5.245 7.359 6.737 6.129 8.515 6.024M4.582 9H9M20 20V15H19.418M19.418 15C18.755 16.641 17.263 17.871 15.485 17.976M19.418 15H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- 门店列表 -->
      <div class="store-list">
        <div class="store-items">
          <div
            v-for="store in filteredStores"
            :key="store.id"
            @click="handleStoreSelect(store)"
            class="store-item"
            :class="{ active: selectedStoreId === store.id }"
          >
            <!-- 门店信息 -->
            <div class="store-info">
              <div class="store-header">
                <div class="store-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="store-basic">
                  <h3 class="store-name">{{ store.name }}</h3>
                  <div class="store-tags">
                    <span v-for="tag in store.tags" :key="tag" class="store-tag">{{ tag }}</span>
                  </div>
                </div>
                <div v-if="selectedStoreId === store.id" class="selected-indicator">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>

              <div class="store-details">
                <div class="store-address">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="address-icon">
                    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <span>{{ store.address }}</span>
                </div>
                <div class="store-meta">
                  <span class="store-distance">{{ store.distance }}</span>
                  <span class="store-status" :class="store.status">{{ store.statusText }}</span>
                </div>
              </div>

              <!-- 服务特色 -->
              <div v-if="store.features && store.features.length > 0" class="store-features">
                <span v-for="feature in store.features" :key="feature" class="feature-tag">{{ feature }}</span>
              </div>

              <!-- 导航按钮 -->
              <div class="store-actions">
                <button @click.stop="navigateToStore(store)" class="navigate-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  导航前往
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部确认按钮 -->
      <div class="bottom-section">
        <button
          @click="handleConfirmSelection"
          class="confirm-btn"
          :disabled="!selectedStoreId"
        >
          确认选择
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 搜索关键词
const searchQuery = ref('')

// 选中的门店ID
const selectedStoreId = ref(null)

// 当前位置信息
const currentLocation = ref({
  latitude: null,
  longitude: null,
  address: '杭州市滨江区',
  loading: false,
  error: null
})

// 排序方式
const sortBy = ref('distance')

// 门店数据（添加经纬度坐标）
const stores = ref([
  {
    id: 1,
    name: '滨江路美肤管理中心',
    address: '杭州市滨江区滨江路888号江陵路地铁站B出口200米',
    distance: '1.2km',
    latitude: 30.2094,  // 纬度
    longitude: 120.2100, // 经度
    status: 'open',
    statusText: '营业中',
    tags: ['旗舰店', '专业团队'],
    features: ['AI测肤', '专家咨询', '高端护理', '会员优惠']
  },
  {
    id: 2,
    name: '西湖文化广场店',
    address: '杭州市西湖区文三路文化广场1号楼',
    distance: '3.5km',
    latitude: 30.2764,
    longitude: 120.1550,
    status: 'open',
    statusText: '营业中',
    tags: ['新店', '环境优雅'],
    features: ['AI测肤', '美容SPA', '产品体验']
  },
  {
    id: 3,
    name: '钱江世纪城店',
    address: '杭州市江干区钱江世纪城星耀城购物中心5F',
    distance: '5.8km',
    latitude: 30.2456,
    longitude: 120.1850,
    status: 'open',
    statusText: '营业中',
    tags: ['购物中心', '便捷交通'],
    features: ['AI测肤', '专家咨询', '产品销售']
  },
  {
    id: 4,
    name: '萧山银隆店',
    address: '杭州市萧山区银隆百货B1层',
    distance: '8.2km',
    latitude: 30.1550,
    longitude: 120.2500,
    status: 'close',
    statusText: '休息中',
    tags: ['社区店', '贴心服务'],
    features: ['AI测肤', '基础护理']
  },
  {
    id: 5,
    name: '城西银泰城店',
    address: '杭州市拱墅区城西银泰城生活馆3F',
    distance: '6.1km',
    latitude: 30.2850,
    longitude: 120.1250,
    status: 'open',
    statusText: '营业中',
    tags: ['高端体验', '专业团队'],
    features: ['AI测肤', '专家咨询', '高端护理', '医美项目']
  }
])

// 计算两点间距离（使用Haversine公式）
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // 地球半径，单位km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const distance = R * c
  return distance
}

// 更新门店距离
const updateStoreDistances = () => {
  if (!currentLocation.value.latitude || !currentLocation.value.longitude) {
    return
  }

  stores.value.forEach(store => {
    const distance = calculateDistance(
      currentLocation.value.latitude,
      currentLocation.value.longitude,
      store.latitude,
      store.longitude
    )

    if (distance < 1) {
      store.distance = `${(distance * 1000).toFixed(0)}m`
    } else {
      store.distance = `${distance.toFixed(1)}km`
    }
    store.calculatedDistance = distance // 保存计算距离用于排序
  })

  // 按距离排序
  stores.value.sort((a, b) => a.calculatedDistance - b.calculatedDistance)
}

// 获取当前位置
const getCurrentLocation = () => {
  currentLocation.value.loading = true
  currentLocation.value.error = null

  if (typeof wx !== 'undefined' && wx.getLocation) {
    // 微信小程序环境
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        currentLocation.value.latitude = res.latitude
        currentLocation.value.longitude = res.longitude
        currentLocation.value.address = '定位中...'
        updateStoreDistances()
        currentLocation.value.loading = false
      },
      fail: (err) => {
        console.log('定位失败:', err)
        currentLocation.value.error = '定位失败，请检查定位权限'
        currentLocation.value.loading = false
      }
    })
  } else if (navigator.geolocation) {
    // 浏览器环境
    navigator.geolocation.getCurrentPosition(
      (position) => {
        currentLocation.value.latitude = position.coords.latitude
        currentLocation.value.longitude = position.coords.longitude
        currentLocation.value.address = '定位中...'
        updateStoreDistances()
        currentLocation.value.loading = false
      },
      (error) => {
        console.log('定位失败:', error)
        currentLocation.value.error = '定位失败，请检查定位权限'
        currentLocation.value.loading = false
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    )
  } else {
    currentLocation.value.error = '浏览器不支持定位功能'
    currentLocation.value.loading = false
  }
}

// 过滤和排序门店列表
const filteredStores = computed(() => {
  let filtered = stores.value

  // 按搜索关键词过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(store =>
      store.name.toLowerCase().includes(query) ||
      store.address.toLowerCase().includes(query) ||
      store.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // 排序
  if (sortBy.value === 'distance') {
    // 按距离排序（需要确保有计算距离）
    filtered = [...filtered].sort((a, b) => {
      if (a.calculatedDistance !== undefined && b.calculatedDistance !== undefined) {
        return a.calculatedDistance - b.calculatedDistance
      }
      return 0
    })
  } else if (sortBy.value === 'status') {
    // 营业中的排在前面
    filtered = [...filtered].sort((a, b) => {
      if (a.status === 'open' && b.status !== 'open') return -1
      if (a.status !== 'open' && b.status === 'open') return 1
      return 0
    })
  }

  return filtered
})

// 返回上一页
const handleBack = () => {
  router.back()
}

// 选择门店
const handleStoreSelect = (store) => {
  selectedStoreId.value = store.id
}

// 导航到门店
const navigateToStore = (store) => {
  if (typeof wx !== 'undefined' && wx.openLocation) {
    wx.openLocation({
      latitude: store.latitude,
      longitude: store.longitude,
      name: store.name,
      address: store.address,
      scale: 18
    })
  } else {
    // 浏览器环境下的处理
    const url = `https://maps.google.com/?q=${store.latitude},${store.longitude}(${encodeURIComponent(store.name)})`
    window.open(url, '_blank')
  }
}

// 确认选择
const handleConfirmSelection = () => {
  if (!selectedStoreId.value) return

  const selectedStore = stores.value.find(store => store.id === selectedStoreId.value)
  if (selectedStore) {
    // 这里可以保存选中的门店到本地存储或全局状态
    if (typeof wx !== 'undefined' && wx.setStorageSync) {
      wx.setStorageSync('selectedStore', selectedStore)
      wx.showToast({
        title: '门店切换成功',
        icon: 'success',
        duration: 2000
      })
    } else {
      // 浏览器环境下的处理
      localStorage.setItem('selectedStore', JSON.stringify(selectedStore))
      alert('门店切换成功')
    }

    // 延迟返回上一页
    setTimeout(() => {
      router.back()
    }, typeof wx !== 'undefined' ? 2000 : 500)
  }
}

// 初始化时检查当前选中的门店和获取位置
onMounted(() => {
  // 获取当前位置
  getCurrentLocation()

  // 检查已选中的门店
  let savedStore = null

  if (typeof wx !== 'undefined' && wx.getStorageSync) {
    savedStore = wx.getStorageSync('selectedStore')
  } else {
    // 浏览器环境下的处理
    const storeStr = localStorage.getItem('selectedStore')
    if (storeStr) {
      try {
        savedStore = JSON.parse(storeStr)
      } catch (e) {
        console.log('解析门店数据失败:', e)
      }
    }
  }

  if (savedStore && savedStore.id) {
    selectedStoreId.value = savedStore.id
  } else {
    // 默认选中第一个营业中的门店
    const defaultStore = stores.value.find(store => store.status === 'open')
    if (defaultStore) {
      selectedStoreId.value = defaultStore.id
    }
  }
})
</script>

<style scoped>
.store-selection-container {
  width: 100%;
  height: 100vh;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
}

/* 顶部导航 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
}

.back-btn {
  width: 32px;
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

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.header-right {
  width: 32px;
}

/* 主体内容 */
.content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* 搜索区域 */
.search-section {
  padding: 16px 24px;
  background-color: #fff;
  border-bottom: 1px solid #f5f5f5;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: #f5f5f5;
  border-radius: 20px;
}

.search-bar svg {
  color: #999;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: #333;
}

.search-input::placeholder {
  color: #999;
}

/* 排序选项 */
.sort-options {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.sort-btn {
  padding: 6px 12px;
  background-color: #f5f5f5;
  color: #666;
  border: 1px solid #e8e8e8;
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.sort-btn:hover {
  background-color: #e8e8e8;
}

.sort-btn.active {
  background-color: #1AD299;
  color: white;
  border-color: #1AD299;
}

/* 位置信息 */
.location-section {
  padding: 12px 24px;
  background-color: #fff;
}

.location-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.location-icon {
  color: #1AD299;
  flex-shrink: 0;
}

.location-text {
  font-size: 14px;
  color: #666;
}

.location-error {
  color: #ef4444;
}

.refresh-location-btn {
  margin-left: 8px;
  padding: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: #1AD299;
  border-radius: 4px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.refresh-location-btn:hover:not(:disabled) {
  background-color: rgba(26, 210, 153, 0.1);
}

.refresh-location-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 门店列表 */
.store-list {
  flex: 1;
  padding: 0 24px 24px;
}

.store-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.store-item {
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.store-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.store-item.active {
  border-color: #1AD299;
  background-color: #f0fdf9;
}

.store-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.store-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.store-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #1AD299 0%, #17C088 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.store-basic {
  flex: 1;
  min-width: 0;
}

.store-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.store-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.store-tag {
  font-size: 12px;
  color: #1AD299;
  background-color: #f0fdf9;
  padding: 2px 8px;
  border-radius: 12px;
  border: 1px solid #dcfce7;
}

.selected-indicator {
  color: #1AD299;
  flex-shrink: 0;
}

.store-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.store-address {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.address-icon {
  color: #999;
  flex-shrink: 0;
  margin-top: 2px;
}

.store-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.store-distance {
  font-size: 12px;
  color: #999;
}

.store-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.store-status.open {
  background-color: #f0fdf9;
  color: #166534;
}

.store-status.close {
  background-color: #fef2f2;
  color: #dc2626;
}

.store-features {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.feature-tag {
  font-size: 11px;
  color: #6b7280;
  background-color: #f9fafb;
  padding: 3px 8px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.store-actions {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.navigate-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: #f0f9ff;
  color: #1AD299;
  border: 1px solid #dcfce7;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.navigate-btn:hover {
  background-color: #dcfce7;
}

/* 底部确认按钮 */
.bottom-section {
  padding: 16px 24px;
  background-color: #fff;
  border-top: 1px solid #e8e8e8;
  flex-shrink: 0;
}

.confirm-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #1AD299 0%, #17C088 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.confirm-btn:not(:disabled):active {
  transform: scale(0.98);
  opacity: 0.9;
}

.confirm-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 微信小程序适配 */
@media screen and (max-width: 375px) {
  .store-selection-container {
    width: 100vw;
    max-width: 100vw;
    min-width: 100vw;
  }
}
</style>
