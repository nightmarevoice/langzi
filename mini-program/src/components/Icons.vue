<template>
  <!-- SVG 图标组件 -->
</template>

<script setup>
// 地址图标
export const LocationIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 1.25C6.54875 1.25 3.75 4.04875 3.75 7.5C3.75 12.1875 10 18.75 10 18.75C10 18.75 16.25 12.1875 16.25 7.5C16.25 4.04875 13.4512 1.25 10 1.25ZM10 9.375C8.96375 9.375 8.125 8.53625 8.125 7.5C8.125 6.46375 8.96375 5.625 10 5.625C11.0362 5.625 11.875 6.46375 11.875 7.5C11.875 8.53625 11.0362 9.375 10 9.375Z" fill="currentColor"/>
    </svg>
  `
}

// 搜索图标
export const SearchIcon = {
  template: `
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z" fill="currentColor"/>
    </svg>
  `
}

// AI测肤图标
export const AISkinIcon = {
  template: `
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#1AD299" fill-opacity="0.1"/>
      <path d="M24 12C17.3726 12 12 17.3726 12 24C12 30.6274 17.3726 36 24 36C30.6274 36 36 30.6274 36 24C36 17.3726 30.6274 12 24 12ZM24 32C19.5817 32 16 28.4183 16 24C16 19.5817 19.5817 16 24 16C28.4183 16 32 19.5817 32 24C32 28.4183 28.4183 32 24 32Z" fill="#1AD299"/>
      <path d="M20 24C20 21.7909 21.7909 20 24 20C26.2091 20 28 21.7909 28 24C28 26.2091 26.2091 28 24 28C21.7909 28 20 26.2091 20 24Z" fill="#1AD299"/>
    </svg>
  `
}

// 问诊图标
export const ConsultationIcon = {
  template: `
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#FFB84D" fill-opacity="0.1"/>
      <path d="M24 16C20.6863 16 18 18.6863 18 22V26C18 29.3137 20.6863 32 24 32C27.3137 32 30 29.3137 30 26V22C30 18.6863 27.3137 16 24 16ZM26 26C26 26.5523 25.5523 27 25 27H23C22.4477 27 22 26.5523 22 26V22C22 21.4477 22.4477 21 23 21H25C25.5523 21 26 21.4477 26 22V26Z" fill="#FFB84D"/>
      <path d="M20 32H28V34H20V32Z" fill="#FFB84D"/>
    </svg>
  `
}

// 报告图标
export const ReportIcon = {
  template: `
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#6C9EFF" fill-opacity="0.1"/>
      <path d="M16 14H32V16H16V14Z" fill="#6C9EFF"/>
      <path d="M16 20H32V22H16V20Z" fill="#6C9EFF"/>
      <path d="M16 26H28V28H16V26Z" fill="#6C9EFF"/>
      <path d="M16 32H24V34H16V32Z" fill="#6C9EFF"/>
      <rect x="14" y="12" width="20" height="24" rx="2" stroke="#6C9EFF" stroke-width="2"/>
    </svg>
  `
}

// 商品图标
export const ProductIcon = {
  template: `
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#FF6B9D" fill-opacity="0.1"/>
      <path d="M24 16L18 20V30C18 31.1046 18.8954 32 20 32H28C29.1046 32 30 31.1046 30 30V20L24 16Z" fill="#FF6B9D"/>
      <path d="M20 20L24 17L28 20V28H20V20Z" stroke="#FF6B9D" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `
}

// 首页图标
export const HomeIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

// 测肤图标
export const SkinIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
      <circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="2"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  `
}

// 我的图标
export const UserIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}
</script>

