import axios from 'axios'
import store from '@/store'
import { Toast } from 'vant'
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})
request.interceptors.request.use(function (config) {
  const { user } = store.state
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  console.log(error)
})
request.interceptors.response.use(function (data) {
  return data
}, error => {
  console.log(error)
  Toast({
    message: '接口出错请重新刷新',
    position: 'bottom'
  })
  return { data: {} }
})
export default request
