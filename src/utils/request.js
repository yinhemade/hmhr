import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = store.getters.token
    if (token) {
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const { success, message } = response.data
    if (success) {
      return response.data
    } else {
      Message.error(message)
      return Promise.reject(message)
    }
  },
  error => {
    Message.error((error.response && error.response.data && error.response.data.message) || error.message)
    return Promise.reject(error)
  }
)

export default service
