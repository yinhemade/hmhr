import Layout from '@/layout'

export default
{
  path: '/departments',
  component: Layout,
  children: [
    {
      path: '',
      name: 'departments',
      component: () => import('@/views/departments/index'),
      meta: { title: '组织架构(departments)', icon: 'tree' }
    }
    // ... 灵活的继续添加员工相关的二级路由
  ]
}
