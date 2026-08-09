export type Permission =
  | 'view_dashboard'
  | 'manage_users'
  | 'delete_users'
  | 'manage_products'
  | 'delete_products'
  | 'manage_orders'
  | 'manage_roles'
  | 'view_audit_logs'
  | 'manage_settings'
  | 'view_analytics'
  | 'send_notifications'
  | 'manage_categories'
  | 'manage_collections'
  | 'moderate_content'
  | 'view_server_status';

export interface RoleDefinition {
  id: string;
  name: string;
  label: string;
  description: string;
  color: string;
  permissions: Permission[];
  userCount: number;
}

export const ALL_PERMISSIONS: { key: Permission; label: string; category: string }[] = [
  { key: 'view_dashboard', label: 'View Dashboard', category: 'Dashboard' },
  { key: 'view_analytics', label: 'View Analytics', category: 'Dashboard' },
  { key: 'view_server_status', label: 'View Server Status', category: 'Dashboard' },
  { key: 'manage_users', label: 'Manage Users', category: 'Users' },
  { key: 'delete_users', label: 'Delete Users', category: 'Users' },
  { key: 'manage_roles', label: 'Manage Roles & Permissions', category: 'Users' },
  { key: 'manage_products', label: 'Manage Products', category: 'Products' },
  { key: 'delete_products', label: 'Delete Products', category: 'Products' },
  { key: 'manage_categories', label: 'Manage Categories', category: 'Products' },
  { key: 'manage_collections', label: 'Manage Collections', category: 'Products' },
  { key: 'manage_orders', label: 'Manage Orders', category: 'Orders' },
  { key: 'moderate_content', label: 'Moderate Content', category: 'Content' },
  { key: 'view_audit_logs', label: 'View Audit Logs', category: 'Security' },
  { key: 'manage_settings', label: 'Manage Site Settings', category: 'Settings' },
  { key: 'send_notifications', label: 'Send Notifications', category: 'Settings' },
];

export const ROLES: RoleDefinition[] = [
  {
    id: 'super_admin',
    name: 'super_admin',
    label: 'Super Admin',
    description: 'Full access to all platform features and settings.',
    color: '#EF4444',
    permissions: ALL_PERMISSIONS.map((p) => p.key),
    userCount: 1,
  },
  {
    id: 'admin',
    name: 'admin',
    label: 'Admin',
    description: 'Manages users, products, and platform operations.',
    color: '#F97316',
    permissions: [
      'view_dashboard', 'view_analytics', 'view_server_status',
      'manage_users', 'manage_products', 'delete_products',
      'manage_categories', 'manage_collections', 'manage_orders',
      'view_audit_logs', 'send_notifications',
    ],
    userCount: 4,
  },
  {
    id: 'moderator',
    name: 'moderator',
    label: 'Moderator',
    description: 'Moderates content and handles community interactions.',
    color: '#EAB308',
    permissions: [
      'view_dashboard', 'manage_users', 'moderate_content', 'view_audit_logs',
    ],
    userCount: 7,
  },
  {
    id: 'support',
    name: 'support',
    label: 'Support',
    description: 'Handles customer support and order inquiries.',
    color: '#3B82F6',
    permissions: [
      'view_dashboard', 'manage_users', 'manage_orders', 'view_analytics',
    ],
    userCount: 12,
  },
  {
    id: 'premium_user',
    name: 'premium_user',
    label: 'Premium User',
    description: 'Paying members with access to exclusive content.',
    color: '#A855F7',
    permissions: [],
    userCount: 284,
  },
  {
    id: 'regular_user',
    name: 'regular_user',
    label: 'Regular User',
    description: 'Standard registered account with base access.',
    color: '#6B7280',
    permissions: [],
    userCount: 1842,
  },
];

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'suspended' | 'banned' | 'pending';
  emailVerified: boolean;
  createdAt: string;
  lastLogin: string;
  country: string;
  orders: number;
}

export const MOCK_USERS: MockUser[] = [
  { id: 'u000', name: 'Andriy Pozhoga', email: 'pozhogaandriy@gmail.com', role: 'admin', status: 'active', emailVerified: true, createdAt: '2024-03-15', lastLogin: '2026-08-06', country: 'UA', orders: 0 },
  { id: 'u001', name: 'Oleksandr Shevchenko', email: 'o.shevchenko@gmail.com', role: 'regular_user', status: 'active', emailVerified: true, createdAt: '2024-01-15', lastLogin: '2026-08-02', country: 'UA', orders: 3 },
  { id: 'u002', name: 'Mariya Kovalenko', email: 'm.kovalenko@ukr.net', role: 'premium_user', status: 'active', emailVerified: true, createdAt: '2024-02-20', lastLogin: '2026-08-01', country: 'UA', orders: 12 },
  { id: 'u003', name: 'Ivan Petrenko', email: 'ivan.p@gmail.com', role: 'regular_user', status: 'suspended', emailVerified: true, createdAt: '2024-03-10', lastLogin: '2026-07-15', country: 'UA', orders: 1 },
  { id: 'u004', name: 'Natalia Sydorenko', email: 'n.sydorenko@gmail.com', role: 'regular_user', status: 'active', emailVerified: false, createdAt: '2024-04-05', lastLogin: '2026-07-30', country: 'UA', orders: 0 },
  { id: 'u005', name: 'Dmytro Bondarenko', email: 'd.bondarenko@ukr.net', role: 'premium_user', status: 'active', emailVerified: true, createdAt: '2024-04-22', lastLogin: '2026-08-03', country: 'UA', orders: 8 },
  { id: 'u006', name: 'Oksana Tkachenko', email: 'oksana.t@gmail.com', role: 'regular_user', status: 'active', emailVerified: true, createdAt: '2024-05-11', lastLogin: '2026-07-28', country: 'UA', orders: 2 },
  { id: 'u007', name: 'Vasyl Moroz', email: 'v.moroz@gmail.com', role: 'regular_user', status: 'banned', emailVerified: true, createdAt: '2024-05-18', lastLogin: '2026-06-01', country: 'UA', orders: 0 },
  { id: 'u008', name: 'Iryna Kravchenko', email: 'iryna.k@ukr.net', role: 'support', status: 'active', emailVerified: true, createdAt: '2024-01-05', lastLogin: '2026-08-03', country: 'UA', orders: 0 },
  { id: 'u009', name: 'Sergiy Lysenko', email: 's.lysenko@gmail.com', role: 'moderator', status: 'active', emailVerified: true, createdAt: '2024-01-08', lastLogin: '2026-08-02', country: 'UA', orders: 0 },
  { id: 'u010', name: 'Tetyana Marchenko', email: 't.marchenko@gmail.com', role: 'regular_user', status: 'active', emailVerified: true, createdAt: '2024-06-01', lastLogin: '2026-08-01', country: 'UA', orders: 4 },
  { id: 'u011', name: 'Andriy Savchenko', email: 'a.savchenko@ukr.net', role: 'premium_user', status: 'active', emailVerified: true, createdAt: '2024-06-15', lastLogin: '2026-08-03', country: 'UA', orders: 19 },
  { id: 'u012', name: 'Larysa Kuzenko', email: 'l.kuzenko@gmail.com', role: 'regular_user', status: 'pending', emailVerified: false, createdAt: '2026-08-03', lastLogin: '—', country: 'UA', orders: 0 },
];

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  email: string;
  action: string;
  type: 'login' | 'logout' | 'password_change' | 'failed_login' | 'user_created' | 'user_deleted' | 'role_change' | 'admin_action' | 'security';
  ip: string;
  status: 'success' | 'failed' | 'warning';
  details?: string;
}

export const AUDIT_LOGS: AuditLog[] = [
  { id: 'al000', timestamp: '2026-08-06 10:14:37', user: 'Andriy Pozhoga', email: 'pozhogaandriy@gmail.com', action: 'Admin login', type: 'login', ip: '93.175.22.XX', status: 'success' },
  { id: 'al001', timestamp: '2026-08-03 09:42:11', user: 'Admin User', email: 'admin@gymfriends.ua', action: 'Admin login', type: 'login', ip: '91.200.81.XX', status: 'success' },
  { id: 'al002', timestamp: '2026-08-03 09:31:05', user: 'Unknown', email: 'unknown@fake.com', action: 'Failed login attempt', type: 'failed_login', ip: '185.220.101.XX', status: 'failed', details: '5 attempts in 2 minutes' },
  { id: 'al003', timestamp: '2026-08-03 08:55:22', user: 'Oleksandr Shevchenko', email: 'o.shevchenko@gmail.com', action: 'User login', type: 'login', ip: '95.133.45.XX', status: 'success' },
  { id: 'al004', timestamp: '2026-08-02 22:17:39', user: 'Admin User', email: 'admin@gymfriends.ua', action: 'Role changed: Ivan Petrenko → suspended', type: 'role_change', ip: '91.200.81.XX', status: 'success' },
  { id: 'al005', timestamp: '2026-08-02 21:44:01', user: 'Admin User', email: 'admin@gymfriends.ua', action: 'Product published: STEALTH TECH TEE BLACK', type: 'admin_action', ip: '91.200.81.XX', status: 'success' },
  { id: 'al006', timestamp: '2026-08-02 18:33:55', user: 'Mariya Kovalenko', email: 'm.kovalenko@ukr.net', action: 'Password changed', type: 'password_change', ip: '78.111.23.XX', status: 'success' },
  { id: 'al007', timestamp: '2026-08-02 16:21:10', user: 'Larysa Kuzenko', email: 'l.kuzenko@gmail.com', action: 'Account created', type: 'user_created', ip: '176.38.112.XX', status: 'success' },
  { id: 'al008', timestamp: '2026-08-02 14:08:44', user: 'Vasyl Moroz', email: 'v.moroz@gmail.com', action: 'Account banned', type: 'user_deleted', ip: '91.200.81.XX', status: 'warning', details: 'Policy violation' },
  { id: 'al009', timestamp: '2026-08-02 12:55:19', user: 'Unknown', email: 'brute@attack.net', action: 'Brute force detected', type: 'security', ip: '45.155.205.XX', status: 'failed', details: 'IP blocked automatically' },
  { id: 'al010', timestamp: '2026-08-02 10:40:07', user: 'Sergiy Lysenko', email: 's.lysenko@gmail.com', action: 'User login', type: 'login', ip: '94.178.XX.XX', status: 'success' },
  { id: 'al011', timestamp: '2026-08-02 09:18:33', user: 'Admin User', email: 'admin@gymfriends.ua', action: 'Admin logout', type: 'logout', ip: '91.200.81.XX', status: 'success' },
  { id: 'al012', timestamp: '2026-08-01 23:05:42', user: 'Dmytro Bondarenko', email: 'd.bondarenko@ukr.net', action: 'User logout', type: 'logout', ip: '212.90.XX.XX', status: 'success' },
];

export interface AdminNotification {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  type: 'registration' | 'security' | 'server' | 'contact' | 'order' | 'system';
  severity: 'info' | 'warning' | 'critical';
  read: boolean;
}

export const ADMIN_NOTIFICATIONS: AdminNotification[] = [
  { id: 'n001', timestamp: '2026-08-03 09:31', title: 'Brute Force Attempt Detected', message: '12 failed login attempts from IP 185.220.101.XX in the last 5 minutes. IP has been flagged.', type: 'security', severity: 'critical', read: false },
  { id: 'n002', timestamp: '2026-08-03 09:15', title: 'New User Registration', message: 'Larysa Kuzenko (l.kuzenko@gmail.com) registered a new account.', type: 'registration', severity: 'info', read: false },
  { id: 'n003', timestamp: '2026-08-03 08:44', title: 'New Contact Form Submission', message: 'New inquiry received from d.bondarenko@ukr.net — Order #4891.', type: 'contact', severity: 'info', read: false },
  { id: 'n004', timestamp: '2026-08-02 22:10', title: 'User Account Suspended', message: 'Account of Ivan Petrenko (ivan.p@gmail.com) has been suspended by Admin.', type: 'security', severity: 'warning', read: true },
  { id: 'n005', timestamp: '2026-08-02 18:00', title: 'Server Response Latency Spike', message: 'Average response time exceeded 800ms threshold for 3 minutes. Auto-resolved.', type: 'server', severity: 'warning', read: true },
  { id: 'n006', timestamp: '2026-08-02 14:00', title: 'New Contact Form Submission', message: 'New inquiry received from m.kovalenko@ukr.net — Order #4887.', type: 'contact', severity: 'info', read: true },
  { id: 'n007', timestamp: '2026-08-02 09:00', title: 'System Update Complete', message: 'Scheduled maintenance completed successfully. Downtime: 0 seconds.', type: 'system', severity: 'info', read: true },
];

export const DASHBOARD_STATS = {
  totalUsers: 2149,
  activeUsers: 843,
  newUsersToday: 12,
  totalProducts: 47,
  publishedProducts: 38,
  totalOrders: 1204,
  pendingOrders: 23,
  revenue: '₴ 1,482,600',
  revenueGrowth: '+18.4%',
  serverUptime: '99.98%',
  avgResponseTime: '142ms',
  errorRate: '0.04%',
  recentLogins: [
    { user: 'pozhogaandriy@gmail.com', time: '10:14', ip: '93.175.22.XX', role: 'admin' },
    { user: 'o.shevchenko@gmail.com', time: '09:55', ip: '95.133.45.XX', role: 'regular_user' },
    { user: 'admin@gymfriends.ua', time: '09:42', ip: '91.200.81.XX', role: 'super_admin' },
    { user: 's.lysenko@gmail.com', time: '09:28', ip: '94.178.XX.XX', role: 'moderator' },
    { user: 'd.bondarenko@ukr.net', time: '09:11', ip: '212.90.XX.XX', role: 'premium_user' },
  ],
  trafficData: [
    { label: 'Mon', sessions: 312 },
    { label: 'Tue', sessions: 428 },
    { label: 'Wed', sessions: 389 },
    { label: 'Thu', sessions: 504 },
    { label: 'Fri', sessions: 611 },
    { label: 'Sat', sessions: 723 },
    { label: 'Sun', sessions: 548 },
  ],
};

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category: string;
  subcategory: string;
  status: 'published' | 'draft' | 'archived' | 'scheduled';
  featured: boolean;
  price: number;
  salePrice?: number;
  stock: number;
  views: number;
  sales: number;
  revenue: number;
  image: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export const ADMIN_PRODUCTS: AdminProduct[] = [
  { id: 'p1', name: 'DISCIPLINE BUILDS FREEDOM TEE BLACK', slug: 'discipline-builds-freedom-tee-black', sku: 'GF-TTB-001', brand: 'Gymfriends', category: 'T-Shirts', subcategory: 'Performance', status: 'published', featured: true, price: 1200, stock: 48, views: 2341, sales: 187, revenue: 224400, image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_200/app/0780422a-f84c-42a0-a322-29fdbc3daccb/gf-tee-discipline-black.png', createdAt: '2024-01-10', updatedAt: '2026-07-20', tags: ['performance', 'black', 'bestseller'] },
  { id: 'p2', name: 'MENTALITY IS EVERYTHING TEE BEIGE', slug: 'mentality-is-everything-tee-beige', sku: 'GF-TTG-002', brand: 'Gymfriends', category: 'T-Shirts', subcategory: 'Performance', status: 'published', featured: false, price: 1100, stock: 34, views: 1890, sales: 143, revenue: 157300, image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_200/app/0780422a-f84c-42a0-a322-29fdbc3daccb/gf-tee-mentality-beige.png', createdAt: '2024-01-12', updatedAt: '2026-07-18', tags: ['performance', 'grey', 'unisex'] },
  { id: 'p3', name: 'BUILT DIFFERENT OVERSIZED TEE WHITE', slug: 'built-different-oversized-tee-white', sku: 'GF-OOT-003', brand: 'Gymfriends', category: 'T-Shirts', subcategory: 'Lifestyle', status: 'published', featured: true, price: 1350, stock: 22, views: 3102, sales: 211, revenue: 284850, image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_200/app/0780422a-f84c-42a0-a322-29fdbc3daccb/gf-tee-built-different-white.png', createdAt: '2024-02-01', updatedAt: '2026-07-25', tags: ['oversized', 'cotton', 'hit'] },
  { id: 'p4', name: 'COMPRESSION LONG-SLEEVE ASH', slug: 'compression-long-sleeve-ash', sku: 'GF-CLA-004', brand: 'Gymfriends', category: 'Long Sleeves', subcategory: 'Compression', status: 'published', featured: false, price: 1400, salePrice: 1190, stock: 15, views: 1245, sales: 98, revenue: 137200, image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_200/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-product-4.png', createdAt: '2024-02-15', updatedAt: '2026-07-30', tags: ['compression', 'ash', 'unisex'] },
  { id: 'p5', name: 'STRONGER EVERY DAY TEE BLACK', slug: 'stronger-every-day-tee-black', sku: 'GF-TMW-005', brand: 'Gymfriends', category: 'T-Shirts', subcategory: 'Performance', status: 'published', featured: false, price: 1150, stock: 29, views: 987, sales: 67, revenue: 77050, image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_200/app/0780422a-f84c-42a0-a322-29fdbc3daccb/gf-tee-stronger-womens-black.png', createdAt: '2024-03-01', updatedAt: '2026-07-10', tags: ['mesh', 'white', 'new'] },
  { id: 'p6', name: 'FOCUS ON YOU TEE BEIGE', slug: 'focus-on-you-tee-beige', sku: 'GF-VOT-006', brand: 'Gymfriends', category: 'T-Shirts', subcategory: 'Lifestyle', status: 'draft', featured: false, price: 1300, stock: 0, views: 0, sales: 0, revenue: 0, image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_200/app/0780422a-f84c-42a0-a322-29fdbc3daccb/gf-tee-focus-womens-beige.png', createdAt: '2024-03-10', updatedAt: '2026-07-31', tags: ['oversized', 'charcoal', 'vintage'] },
  { id: 'p7', name: 'MIND BODY SOUL TEE DARK', slug: 'mind-body-soul-tee-dark', sku: 'GF-CDO-007', brand: 'Gymfriends', category: 'T-Shirts', subcategory: 'Performance', status: 'archived', featured: false, price: 1250, stock: 0, views: 756, sales: 44, revenue: 55000, image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_200/app/0780422a-f84c-42a0-a322-29fdbc3daccb/gf-tee-mindbodysoul-womens-dark.png', createdAt: '2024-03-20', updatedAt: '2026-06-01', tags: ['performance', 'olive', 'hit'] },
];

export const PRODUCT_CATEGORIES = [
  { id: 'cat-1', name: 'T-Shirts', slug: 't-shirts', productCount: 5, status: 'active' },
  { id: 'cat-2', name: 'Long Sleeves', slug: 'long-sleeves', productCount: 1, status: 'active' },
  { id: 'cat-3', name: 'Hoodies', slug: 'hoodies', productCount: 0, status: 'active' },
  { id: 'cat-4', name: 'Shorts', slug: 'shorts', productCount: 0, status: 'draft' },
  { id: 'cat-5', name: 'Accessories', slug: 'accessories', productCount: 0, status: 'draft' },
];

export const PRODUCT_COLLECTIONS = [
  { id: 'col-1', name: 'New Arrivals', slug: 'new-arrivals', productCount: 3, status: 'active' },
  { id: 'col-2', name: 'Bestsellers', slug: 'bestsellers', productCount: 4, status: 'active' },
  { id: 'col-3', name: 'Sale', slug: 'sale', productCount: 1, status: 'active' },
  { id: 'col-4', name: 'Summer 2026', slug: 'summer-2026', productCount: 5, status: 'active' },
  { id: 'col-5', name: 'Premium Line', slug: 'premium-line', productCount: 2, status: 'draft' },
];
