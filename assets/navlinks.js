export const navlinks = [
  { name: 'Главная', path: '/', icon: 'el-icon-s-home' },
  { name: 'Главная', path: '/admin', icon: 'el-icon-s-home' },
  { name: 'Главная', path: '/admin/orders', icon: 'el-icon-s-home' },
  { name: 'Мои Заявки', path: '/admin/my_orders', icon: 'el-icon-s-order' },
  { name: 'Документы', path: '/admin/documents', icon: 'el-icon-document' },
  { name: 'Архив', path: '/admin/admin_archive', icon: 'el-icon-s-cooperation' },
  { name: 'Статистика', path: '/admin/statistics', icon: 'el-icon-s-data' },
  { name: 'Доступ', path: '/admin/access', icon: 'el-icon-unlock' },
  { name: 'Категория', path: '/category' },
  { name: 'Документы', path: '/document' },
]
export const routes = [
  { name: 'Главная', path: '/admin', origin: '/admin' },
  { name: 'Главная', path: '/', origin: '/' },
  { name: 'Заявки', path: '/orders', hidden: true },
  { name: 'Заявки', path: '/detail', hidden: true },
  { name: 'Мои Заявки', path: '/my_orders', origin: '/admin/my_orders' },
  { name: 'Документы', path: '/documents', origin: '/admin/documents' },
  { name: 'Архив', path: '/admin_archive', origin: '/admin/admin_archive' },
  { name: 'Статистика', path: '/statistics', origin: '/admin/statistics' },
  { name: 'Доступ', path: '/access', origin: '/admin/access' },

  { name: 'Категория документов', path: '/category' },
  { name: 'Документы', path: '/document' },
]
export const adminLinks = [
  { path: '/admin/orders' },
  { path: '/admin/documents' },
  { path: '/admin/admin_archive' },
  { path: '/admin/access' },
]
export const declarantLinks = [
  { path: '/admin' },
  { path: '/admin/my_orders' }
]

export const clientLinks = [
  { path: '/' },
]
export const hiddenChildren = [
  'accesss_form',
  'organization_form',
  'orders_form',
  'detail',
]
