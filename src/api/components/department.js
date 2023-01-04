import request from '@/utils/request'
/**
 * 获取部门列表
 * @returns Promise.data
 */
export function requestGetDepartmentList() {
  return request.get('/company/department')
}
/**
 * 获取员工的最简单的信息，姓名、id
 * @returns Promise.data
 */
export function requestGetSimpleUserList() {
  return request.get('/sys/user/simple')
}
/**
 * 新增部门
 * @param {*} data 5对key-val
 * @returns Promise对象
 */
export function requestAddDept(data) {
  return request({
    url: '/company/department',
    method: 'POST',
    data
  })
}
/**
 * 根据部门id 查看部门详情
 * @param {*} id 部门id
 * @returns Promise对象
 */
export function requestDeptDeta(id) {
  return request(`/company/department/${id}`)
}
/**
 * 传入部门信息，修改部门
 * @param {*} dataObj 部门详情
 * @returns Promise
 */
export const requestUpdateDept = (dataObj) => request.put(`/company/department/${dataObj.id}`, dataObj)

export const requestDelDept = (id) => request.delete(`/company/department/${id}`)
