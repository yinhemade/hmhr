import request from '@/utils/request'

/**
 * 获取权限列表
 * @returns Promise=>权限列表
 */
export function requestGetPermissionList() {
  return request({
    url: '/sys/permission'
  })
}
// 新增权限
export function requestAddPermission(data) {
  return request({
    url: '/sys/permission',
    method: 'post',
    data
  })
}

// 更新权限
export function requestUpdatePermission(data) {
  return request({
    url: `/sys/permission/${data.id}`,
    method: 'put',
    data
  })
}

// 删除权限
export function requestDelPermission(id) {
  return request({
    url: `/sys/permission/${id}`,
    method: 'delete'
  })
}

// 获取权限详情
export function requestGetPermissionDetail(id) {
  return request({
    url: `/sys/permission/${id}`
  })
}
