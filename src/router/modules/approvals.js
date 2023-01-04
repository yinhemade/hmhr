import Layout from '@/layout'

export default {
  path: '/approvals',
  component: Layout,
  children: [
    {
      path: '',
      name: 'approvals',
      component: () => import('@/views/approvals/index'),
      meta: { title: '审批(approvals)', icon: 'tree-table' }
    }
    // ... 继续添加相关的二级路由
  ]
}
