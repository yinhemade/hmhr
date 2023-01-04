import Layout from '@/layout'

export default {
  path: '/attendances',
  component: Layout,
  children: [
    {
      path: '',
      name: 'attendances',
      component: () => import('@/views/attendances/index'),
      meta: { title: '考勤(attendances)', icon: 'skill' }
    }
    // ... 灵活的继续添加员工相关的二级路由
  ]
}
