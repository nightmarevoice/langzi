<template>
  <Transition name="fade">
    <div v-if="visible" class="toast" :class="type">
      <div class="toast-icon">
        <span v-if="type === 'success'">✓</span>
        <span v-else-if="type === 'error'">✕</span>
        <span v-else-if="type === 'warning'">!</span>
        <span v-else>ℹ</span>
      </div>
      <p class="toast-message">{{ message }}</p>
    </div>
  </Transition>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'info', // success, error, warning, info
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    duration: {
      type: Number,
      default: 3000
    }
  },
  data() {
    return {
      visible: false,
      timer: null
    }
  },
  watch: {
    message(newVal) {
      if (newVal) {
        this.show()
      }
    }
  },
  methods: {
    show() {
      this.visible = true
      if (this.timer) clearTimeout(this.timer)

      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          this.visible = false
        }, this.duration)
      }
    },
    hide() {
      this.visible = false
    }
  }
}
</script>

<style scoped>
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 200px;
  max-width: 80%;
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 10000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.toast-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 16px;
  font-weight: bold;
}

.toast.success .toast-icon {
  background: #52c41a;
}

.toast.error .toast-icon {
  background: #f5222d;
}

.toast.warning .toast-icon {
  background: #faad14;
}

.toast.info .toast-icon {
  background: #1890ff;
}

.toast-message {
  font-size: 14px;
  line-height: 1.5;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from {
  opacity: 0;
  transform: translate(-50%, -60%);
}

.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -40%);
}
</style>

