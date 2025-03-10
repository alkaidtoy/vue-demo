<template>
  <div class="user-info">
    <h2>用户信息</h2>
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">加载失败</div>
    <div v-else-if="user" class="user-data">
      <pre>{{ JSON.stringify(user, null, 2) }}</pre>
      <button @click="handleLogout">登出</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUserInfo, logout } from '@/services/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(null)
const loading = ref(true)
const error = ref(false)

const fetchUserInfo = async () => {
  try {
    loading.value = true
    const response = await getUserInfo()
    user.value = response.data
  } catch (err) {
    error.value = true
  } finally {
    loading.value = false
  }
}

const handleLogout = async () => {
  try {
    await logout()
    router.push('/login')
  } catch (error) {
    console.error('登出失败：', error)
  }
}

onMounted(fetchUserInfo)
</script>

<style scoped>
.user-info {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.user-data {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
}

button {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style> 