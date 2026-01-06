# H5小程序项目

这是一个基于 Vue 3 + Vite 的现代化 H5 小程序框架。

## 特性

- ⚡️ **Vite** - 极速的开发体验
- 🎨 **Vue 3** - 现代化的渐进式框架
- 📱 **移动端优化** - 完善的移动端适配
- 🎯 **开箱即用** - 预设常用工具和样式
- 🛠️ **工具函数** - 丰富的工具函数库

## 项目结构

```
langzi/
├── src/
│   ├── App.vue              # 根组件
│   ├── main.js              # 入口文件
│   ├── styles/              # 样式文件
│   │   ├── reset.css        # 重置样式
│   │   └── common.css       # 通用样式
│   └── utils/               # 工具函数
│       ├── index.js         # 通用工具
│       ├── request.js       # 网络请求
│       └── storage.js       # 本地存储
├── index.html               # HTML 模板
├── vite.config.js           # Vite 配置
├── package.json             # 依赖配置
└── README.md                # 说明文档
```

## 快速开始

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 开发模式

```bash
npm run dev
```

项目将在 `http://localhost:3000` 启动

### 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist` 目录

### 预览生产版本

```bash
npm run preview
```

## 功能模块

### 网络请求

使用 `src/utils/request.js` 进行 API 调用：

```javascript
import request from '@/utils/request'

// GET 请求
request.get('/api/users')

// POST 请求
request.post('/api/login', { username, password })
```

### 本地存储

使用 `src/utils/storage.js` 管理本地存储：

```javascript
import storage from '@/utils/storage'

// 存储数据
storage.set('key', { name: 'value' })

// 获取数据
const data = storage.get('key')

// 删除数据
storage.remove('key')

// 清空所有
storage.clear()
```

### 工具函数

使用 `src/utils/index.js` 中的工具函数：

```javascript
import { debounce, formatDate, isMobile } from '@/utils'

// 防抖
const handleInput = debounce(() => {
  console.log('input')
}, 300)

// 格式化日期
formatDate(new Date(), 'YYYY-MM-DD')

// 判断是否移动端
if (isMobile()) {
  console.log('移动端')
}
```

## 环境变量

项目支持多环境配置：

- `.env.development` - 开发环境
- `.env.production` - 生产环境

## 技术栈

- Vue 3
- Vite 5
- Axios
- ES6+

## 浏览器支持

- Chrome（推荐）
- Safari（iOS）
- 微信内置浏览器
- 其他现代浏览器

## 开发建议

1. 组件放在 `src/components/` 目录
2. 页面放在 `src/views/` 目录
3. API 接口放在 `src/api/` 目录
4. 静态资源放在 `public/` 目录

## License

MIT

