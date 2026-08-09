'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { MOCK_USERS, MockUser } from '@/data/auth';
import { headingFont, bodyFont } from '@/app/fonts';

const ROLE_BADGE: Record<string, string> = {
  super_admin: 'text-red-400 bg-red-950/30 border-red-900/40',
  admin: 'text-orange-400 bg-orange-950/30 border-orange-900/40',
  moderator: 'text-amber-400 bg-amber-950/30 border-amber-900/40',
  support: 'text-blue-400 bg-blue-950/30 border-blue-900/40',
  premium_user: 'text-purple-400 bg-purple-950/30 border-purple-900/40',
  regular_user: 'text-[#555555] bg-[#0F0F0F] border-[#1A1A1A]',
};

const STATUS_BADGE: Record<string, string> = {
  active: 'text-emerald-400',
  suspended: 'text-amber-400',
  banned: 'text-red-400',
  pending: 'text-blue-400',
};

const STATUS_DOT: Record<string, string> = {
  active: 'bg-emerald-500',
  suspended: 'bg-amber-500',
  banned: 'bg-red-500',
  pending: 'bg-blue-500',
};

const PAGE_SIZE = 8;

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [actionUser, setActionUser] = useState<MockUser | null>(null);
  const [users, setUsers] = useState<MockUser[]>(MOCK_USERS);

  const filtered = users.filter((u) => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAction = (action: string, user: MockUser) => {
    setUsers((prev) => prev.map((u) => {
      if (u.id !== user.id) return u;
      switch (action) {
        case 'suspend': return { ...u, status: 'suspended' as const };
        case 'ban': return { ...u, status: 'banned' as const };
        case 'unban': case 'unsuspend': return { ...u, status: 'active' as const };
        case 'verify': return { ...u, emailVerified: true };
        default: return u;
      }
    }));
    setActionUser(null);
  };

  return (
    <AdminLayout title="Users" breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Users' }]}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className={`${headingFont.className} text-lg text-white font-semibold`}>User Management</h1>
          <p className={`${bodyFont.className} text-[#555555] text-sm mt-0.5`}>{filtered.length} users found</p>
        </div>
        <button className={`${headingFont.className} bg-white text-black text-[10px] uppercase tracking-[0.12em] px-4 py-2.5 hover:bg-[#E8E8E8] transition-colors`}>
          + Invite User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444444]">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className={`${bodyFont.className} w-full bg-[#0A0A0A] border border-[#111111] text-white text-sm pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#222222] placeholder:text-[#333333]`}
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className={`${bodyFont.className} bg-[#0A0A0A] border border-[#111111] text-[#767676] text-sm px-4 py-2.5 focus:outline-none focus:border-[#222222]`}
        >
          <option value="all">All Roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
          <option value="support">Support</option>
          <option value="premium_user">Premium User</option>
          <option value="regular_user">Regular User</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className={`${bodyFont.className} bg-[#0A0A0A] border border-[#111111] text-[#767676] text-sm px-4 py-2.5 focus:outline-none focus:border-[#222222]`}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="banned">Banned</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className={`${bodyFont.className} flex items-center gap-3 px-4 py-2.5 bg-[#111111] border border-[#1A1A1A] mb-3 text-sm`}>
          <span className="text-white">{selected.size} selected</span>
          <span className="text-[#333333]">|</span>
          <button className="text-amber-400 hover:text-amber-300 transition-colors">Suspend</button>
          <button className="text-red-400 hover:text-red-300 transition-colors">Ban</button>
          <button className="text-[#555555] hover:text-white transition-colors" onClick={() => setSelected(new Set())}>Clear</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#0A0A0A] border border-[#111111] overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#111111]">
              <th className="w-10 px-4 py-3 text-left">
                <input type="checkbox" className="accent-white" onChange={(e) => {
                  if (e.target.checked) setSelected(new Set(paged.map(u => u.id)));
                  else setSelected(new Set());
                }} />
              </th>
              {['User', 'Role', 'Status', 'Verified', 'Orders', 'Last Login', 'Actions'].map((h) => (
                <th key={h} className={`${headingFont.className} text-left text-[10px] uppercase tracking-[0.12em] text-[#333333] px-3 py-3 font-normal`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0D0D0D]">
            {paged.map((user) => (
              <tr key={user.id} className={`hover:bg-[#0D0D0D] transition-colors ${selected.has(user.id) ? 'bg-[#0D0D0D]' : ''}`}>
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.has(user.id)} onChange={() => toggleSelect(user.id)} className="accent-white" />
                </td>
                <td className="px-3 py-3">
                  <div>
                    <p className={`${bodyFont.className} text-sm text-white`}>{user.name}</p>
                    <p className={`${bodyFont.className} text-[11px] text-[#444444]`}>{user.email}</p>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className={`${bodyFont.className} text-[10px] px-2 py-0.5 border ${ROLE_BADGE[user.role]} capitalize`}>
                    {user.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className={`${bodyFont.className} text-xs flex items-center gap-1.5 ${STATUS_BADGE[user.status]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[user.status]}`} />
                    {user.status}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className={`${bodyFont.className} text-xs ${user.emailVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {user.emailVerified ? 'Verified' : 'Unverified'}
                  </span>
                </td>
                <td className={`${bodyFont.className} px-3 py-3 text-sm text-[#555555]`}>{user.orders}</td>
                <td className={`${bodyFont.className} px-3 py-3 text-sm text-[#555555]`}>{user.lastLogin}</td>
                <td className="px-3 py-3">
                  <div className="relative">
                    <button
                      onClick={() => setActionUser(actionUser?.id === user.id ? null : user)}
                      className="text-[#444444] hover:text-white transition-colors p-1"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
                      </svg>
                    </button>
                    {actionUser?.id === user.id && (
                      <div className="absolute right-0 top-8 z-20 bg-[#111111] border border-[#1E1E1E] py-1 w-44 shadow-xl">
                        {[
                          { label: 'Edit', action: 'edit' },
                          { label: 'Reset Password', action: 'reset_password' },
                          { label: 'Verify Account', action: 'verify', hidden: user.emailVerified },
                          { label: user.status === 'suspended' ? 'Unsuspend' : 'Suspend', action: user.status === 'suspended' ? 'unsuspend' : 'suspend', color: 'text-amber-400' },
                          { label: user.status === 'banned' ? 'Unban' : 'Ban', action: user.status === 'banned' ? 'unban' : 'ban', color: 'text-red-400' },
                          { label: 'Delete', action: 'delete', color: 'text-red-400' },
                        ].filter((a) => !a.hidden).map((a) => (
                          <button
                            key={a.action}
                            onClick={() => handleAction(a.action, user)}
                            className={`${bodyFont.className} w-full text-left px-4 py-2 text-sm hover:bg-[#1A1A1A] transition-colors ${a.color || 'text-[#767676]'}`}
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paged.length === 0 && (
          <div className="py-16 text-center">
            <p className={`${bodyFont.className} text-[#333333]`}>No users match your filters.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className={`${bodyFont.className} text-xs text-[#444444]`}>
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`${bodyFont.className} text-xs px-3 py-2 border border-[#111111] text-[#555555] hover:text-white hover:border-[#222222] disabled:opacity-30 transition-colors`}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`${bodyFont.className} text-xs w-8 h-8 border transition-colors ${p === page ? 'border-white text-white bg-[#111111]' : 'border-[#111111] text-[#555555] hover:text-white hover:border-[#222222]'}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`${bodyFont.className} text-xs px-3 py-2 border border-[#111111] text-[#555555] hover:text-white hover:border-[#222222] disabled:opacity-30 transition-colors`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
