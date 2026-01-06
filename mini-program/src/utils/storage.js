/**
 * 本地存储工具类 (uniapp版本)
 */

const storage = {
  /**
   * 设置存储
   * @param {string} key 键
   * @param {any} value 值
   */
  set(key, value) {
    try {
      uni.setStorageSync(key, value)
    } catch (error) {
      console.error('存储失败：', error)
    }
  },

  /**
   * 获取存储
   * @param {string} key 键
   * @param {any} defaultValue 默认值
   * @returns {any}
   */
  get(key, defaultValue = null) {
    try {
      const data = uni.getStorageSync(key)
      return data !== undefined && data !== null ? data : defaultValue
    } catch (error) {
      console.error('获取存储失败：', error)
      return defaultValue
    }
  },

  /**
   * 删除存储
   * @param {string} key 键
   */
  remove(key) {
    try {
      uni.removeStorageSync(key)
    } catch (error) {
      console.error('删除存储失败：', error)
    }
  },

  /**
   * 清空所有存储
   */
  clear() {
    try {
      uni.clearStorageSync()
    } catch (error) {
      console.error('清空存储失败：', error)
    }
  }
}

export default storage

