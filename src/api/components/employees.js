import request from '@/utils/request'

/**
 * @description: 获取员工列表
 * @param {*} params {page:当前页,size：每页条数}
 * @return {*}
 */
export function requestGetEmployeeList(params) {
  return request({
    methods: 'get',
    url: '/sys/user',
    params
  })
}

/**
 * @description: 删除员工
 * @param {*} id 员工id
 * @return {*}
 */
export function requestDelEmployee(id) {
  return request({
    method: 'delete',
    url: `/sys/user/${id}`
  })
}
/**
 * @description: 添加员工
 * @param {*} data
 * @return {*}
 */
export function requestAddEmployee(data) {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}

/**
 * @description: 导入excel
 * @param {*} data
    [{
          correctionTime: "2019-09-09T16:00:00.000Z"
          mobile: 15751786320
          timeOfEntry: "2019-03-09T16:00:00.000Z"
          username: "测试人员1"
          workNumber: 88088
      }
      ...
    ]
 * @return {*}
 */
export function requestImportEmployee(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}
/**
 * 主要用于更新密码
 * @param {*} id 用户id
 * @param {*} data 用户名，密码
 * @returns Promise
 */
export function requestUploadEmployee(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}
/**
 * 为员工分配角色
 * @param {*} data {id:员工id, roleIds:[] 角色id数组}
 * @returns Promise
 */
export function requestAssignRole(data) {
  return request({
    url: '/sys/user/assignRoles',
    method: 'put',
    data
  })
}
