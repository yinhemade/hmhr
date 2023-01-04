import request from '@/utils/request'
/**
 * 用手机号和密码获取token登录
 * @param {*} data 传入mobile、password
 * @returns 返回Promise对象
 */
export function requestOfLogin(data) {
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}
/**
 * 用token获取用户信息, token已经加在请求头里
 * @returns 返回Promise对象
 */
export function requestOfUserMessage() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}
/**
 * 用用户登录信息的id，获取用户基本信息
 * @param {*} id 用户的userId
 * @returns 返回Promise对象
 */
export function requestOfBaseInfo(id) {
  return request.get(`/sys/user/${id}`)
}
