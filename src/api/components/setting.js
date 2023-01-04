import request from '@/utils/request'

/**
 * 输入页码、页数，返回角色列表
 * @param {*} params page页码/pagesize每页条数
 * @returns Promise
 */
export function requestGetRoleList(params) {
  return request({
    url: '/sys/role',
    params
  })
}
/**
 * 输入公司id，获取公司信息
 * @param {*} id 公司id
 * @returns Promise
 */
export function requestGetCompanyInfo(id) {
  return request.get(`/company/${id}`)
}
/**
 * 根据角色id，删除角色
 * @param {*} id 角色id
 * @returns Promise
 */
export function requestDelRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}
/**
 * 输入名字和描述 ， 添加新角色
 * @param {*} data name	角色名称 /description	描述
 * @returns Promise
 */
export function requestAddRole(data) {
  return request({
    url: '/sys/role',
    data,
    method: 'post'
  })
}
/**
 * 根据id，获取角色详情
 * @param {*} id 角色id
 * @returns Promise
 */
export function requestGetRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}
/**
 * 根据data，更新角色信息
 * @param {*} data id，和另外五项
 * @returns Promise
 */
export function requestUpdateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    data,
    method: 'put'
  })
}
