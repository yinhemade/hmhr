import Layout from '@/layout'

export default
{
  path: '/socials',
  component: Layout,
  children: [
    {
      path: '',
      name: 'socials',
      component: () => import('@/views/socials/index'),
      meta: { title: '社保(socials)', icon: 'table' }
    }
    // ... 灵活的继续添加员工相关的二级路由
  ]
}
