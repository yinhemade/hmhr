import Layout from '@/layout'

export default
{
  path: '/settings',
  component: Layout,
  children: [
    {
      path: '',
      name: 'settings',
      component: () => import('@/views/settings/index'),
      meta: { title: '公司设置(settings)', icon: 'setting' }
    }
    // ... 灵活的继续添加员工相关的二级路由
  ]
}
