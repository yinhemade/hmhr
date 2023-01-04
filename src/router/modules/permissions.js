import Layout from '@/layout'

export default
{
  path: '/permissions',
  component: Layout,
  children: [
    {
      path: '',
      name: 'permissions',
      component: () => import('@/views/permissions/index'),
      meta: { title: '权限点管理(permissions)', icon: 'lock' }
    }
    // ... 灵活的继续添加员工相关的二级路由
  ]
}
