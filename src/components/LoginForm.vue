<template>
  <div class="login-form">
    <h2>登录</h2>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">邮箱：</label>
        <input
          type="email"
          id="email"
          v-model="form.email"
          required
        />
      </div>
      
      <div class="form-group">
        <label for="password">密码：</label>
        <input
          type="password"
          id="password"
          v-model="form.password"
          required
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? '登录中...' : '登录' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { login } from '@/services/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const error = ref('')

const form = reactive({
  email: '',
  password: ''
})

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    
    await login(form)
    // router.push('/dashboard')
  } catch (err: any) {
    error.value = err.response?.data?.message || '登录失败'
    console.error('登录失败：', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
}

.error-message {
  color: #ff4444;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #ffe6e6;
  border-radius: 4px;
}
</style> 