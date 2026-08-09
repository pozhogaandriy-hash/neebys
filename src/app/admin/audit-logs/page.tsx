'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AUDIT_LOGS, AuditLog } from '@/data/auth';
import { headingFont, bodyFont } from '@/app/fonts';

const TYPE_BADGE: Record<AuditLog['type'], { label: string; color: string }> = {
  login: { label: 'Login', color: 'text-blue-400 bg-blue-950/30 border-blue-900/40' },
  logout: { label: 'Logout', color: 'text-[#555555] bg-[#111111] border-[#1A1A1A]' },
  password_change: { label: 'Pwd Change', color: 'text-purple-400 bg-purple-950/30 border-purple-900/40' },
  failed_login: { label: 'Failed Login', color: 'text-red-400 bg-red-950/30 border-red-900/40' },
  user_created: { label: 'User Created', color: 'text-emerald-400 bg-emerald-950/30 border-emerald-900/40' },
  user_deleted: { label: 'User Action', color: 'text-amber-400 bg-amber-950/30 border-amber-900/40' },
  role_change: { label: 'Role Change', color: 'text-orange-400 bg-orange-950/30 border-orange-900/40' },
  admin_action: { label: 'Admin Action', color: 'text-white bg-[#1A1A1A] border-[#2A2A2A]' },
  security: { label: 'Security', color: 'text-red-400 bg-red-950/30 border-red-900/40' },
};

const STATUS_BADGE: Record<string, string> = {
  success: 'text-emerald-400',
  failed: 'text-red-400',
  warning: 'text-amber-400',
};

const PAGE_SIZE = 10;

export default function AuditLogsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = AUDIT_LOGS.filter((l) => {
    const matchSearch = !search || l.user.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase()) || l.ip.includes(search);
    const matchType = typeFilter === 'all' || l.type === typeFilter;
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <AdminLayout title="Audit Logs" breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Audit Logs' }]}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className={`${headingFont.className} text-lg text-white font-semibold`}>Audit & Security Logs</h1>
          <p className={`${bodyFont.className} text-[#555555] text-sm mt-0.5`}>{filtered.length} events</p>
        </div>
        <button className={`${bodyFont.className} text-xs border border-[#1A1A1A] text-[#555555] px-4 py-2.5 hover:text-white hover:border-[#333333] transition-colors`}>
          Export CSV
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
            placeholder="Search user, action, IP..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className={`${bodyFont.className} w-full bg-[#0A0A0A] border border-[#111111] text-white text-sm pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#222222] placeholder:text-[#333333]`}
          />
        </div>
        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} className={`${bodyFont.className} bg-[#0A0A0A] border border-[#111111] text-[#767676] text-sm px-4 py-2.5 focus:outline-none`}>
          <option value="all">All Types</option>
          <option value="login">Login</option>
          <option value="logout">Logout</option>
          <option value="failed_login">Failed Login</option>
          <option value="password_change">Password Change</option>
          <option value="user_created">User Created</option>
          <option value="role_change">Role Change</option>
          <option value="admin_action">Admin Action</option>
          <option value="security">Security</option>
        </select>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className={`${bodyFont.className} bg-[#0A0A0A] border border-[#111111] text-[#767676] text-sm px-4 py-2.5 focus:outline-none`}>
          <option value="all">All Statuses</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="warning">Warning</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#0A0A0A] border border-[#111111] overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#111111]">
              {['Timestamp', 'User', 'Action', 'Type', 'IP Address', 'Status'].map((h) => (
                <th key={h} className={`${headingFont.className} text-left text-[10px] uppercase tracking-[0.12em] text-[#333333] px-4 py-3 font-normal`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0D0D0D]">
            {paged.map((log) => {
              const typeDef = TYPE_BADGE[log.type];
              return (
                <tr key={log.id} className="hover:bg-[#0D0D0D] transition-colors">
                  <td className={`${bodyFont.className} px-4 py-3 text-xs text-[#555555] whitespace-nowrap`}>{log.timestamp}</td>
                  <td className="px-4 py-3">
                    <p className={`${bodyFont.className} text-sm text-white`}>{log.user}</p>
                    <p className={`${bodyFont.className} text-[11px] text-[#444444]`}>{log.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className={`${bodyFont.className} text-sm text-[#767676]`}>{log.action}</p>
                    {log.details && <p className={`${bodyFont.className} text-[11px] text-[#333333]`}>{log.details}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`${bodyFont.className} text-[10px] px-2 py-0.5 border ${typeDef.color}`}>{typeDef.label}</span>
                  </td>
                  <td className={`${bodyFont.className} px-4 py-3 text-xs text-[#444444] font-mono`}>{log.ip}</td>
                  <td className="px-4 py-3">
                    <span className={`${bodyFont.className} text-xs flex items-center gap-1.5 ${STATUS_BADGE[log.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${log.status === 'success' ? 'bg-emerald-500' : log.status === 'failed' ? 'bg-red-500' : 'bg-amber-500'}`} />
                      {log.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {paged.length === 0 && (
          <div className="py-12 text-center">
            <p className={`${bodyFont.className} text-[#333333]`}>No logs match your filters.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className={`${bodyFont.className} text-xs text-[#444444]`}>
            {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className={`${bodyFont.className} text-xs px-3 py-2 border border-[#111111] text-[#555555] hover:text-white disabled:opacity-30 transition-colors`}>Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`${bodyFont.className} text-xs w-8 h-8 border transition-colors ${p === page ? 'border-white text-white bg-[#111111]' : 'border-[#111111] text-[#555555] hover:text-white'}`}>{p}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className={`${bodyFont.className} text-xs px-3 py-2 border border-[#111111] text-[#555555] hover:text-white disabled:opacity-30 transition-colors`}>Next</button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
