<template>
  <div>
    <router-view />
    <TabBar />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import TabBar from './components/TabBar.vue'

// uni-app 生命周期模拟
onMounted(() => {
  console.log('App Launch')
})

// 其他生命周期可以在需要时添加
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  overflow: hidden;
  width: 100%;
}

#app {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  box-align: border-box;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 防止页面级滚动条 */
.page-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 防止内容超出容器 */
.page-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>

