import Layout from '@/layout'

export default
{
  path: '/employees',
  component: Layout,
  children: [
    {
      path: '',
      name: 'employees',
      component: () => import('@/views/employees/index'),
      meta: { title: '员工(employees)', icon: 'people' }
    },
    {
      path: '/detail',
      name: 'employeeDetail',
      component: () => import('@/views/employees/detail'),
      hidden: true
    }
    // ... 灵活的继续添加员工相关的二级路由
  ]
}
