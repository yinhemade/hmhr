import Layout from '@/layout'

export default
{
  path: '/salarys',
  component: Layout,
  children: [
    {
      path: '',
      name: 'salarys',
      component: () => import('@/views/salarys/index'),
      meta: { title: '工资(salarys)', icon: 'money' }
    }
    // ... 灵活的继续添加员工相关的二级路由
  ]
}
