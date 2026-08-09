'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { ROLES, ALL_PERMISSIONS, RoleDefinition, Permission } from '@/data/auth';
import { headingFont, bodyFont } from '@/app/fonts';

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<RoleDefinition[]>(ROLES);
  const [editing, setEditing] = useState<string | null>(null);
  const [editPerms, setEditPerms] = useState<Set<Permission>>(new Set());
  const [saved, setSaved] = useState<string | null>(null);

  const startEdit = (role: RoleDefinition) => {
    setEditing(role.id);
    setEditPerms(new Set(role.permissions));
    setSaved(null);
  };

  const togglePerm = (p: Permission) => {
    setEditPerms((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
  };

  const saveEdit = (roleId: string) => {
    setRoles((prev) => prev.map((r) => r.id === roleId ? { ...r, permissions: Array.from(editPerms) } : r));
    setEditing(null);
    setSaved(roleId);
    setTimeout(() => setSaved(null), 3000);
  };

  const categories = Array.from(new Set(ALL_PERMISSIONS.map((p) => p.category)));

  return (
    <AdminLayout title="Roles & Permissions" breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Roles & Permissions' }]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`${headingFont.className} text-lg text-white font-semibold`}>Roles & Permissions</h1>
          <p className={`${bodyFont.className} text-[#555555] text-sm mt-0.5`}>Configure what each role can access and do</p>
        </div>
        <button className={`${headingFont.className} bg-white text-black text-[10px] uppercase tracking-[0.12em] px-4 py-2.5 hover:bg-[#E8E8E8] transition-colors`}>
          + New Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {roles.map((role) => (
          <div key={role.id} className="bg-[#0A0A0A] border border-[#111111]">
            <div className="p-5 border-b border-[#111111]">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: role.color }} />
                    <h3 className={`${headingFont.className} text-sm text-white font-semibold`}>{role.label}</h3>
                  </div>
                  <p className={`${bodyFont.className} text-[11px] text-[#555555]`}>{role.description}</p>
                </div>
                <span className={`${bodyFont.className} text-[10px] text-[#444444] shrink-0`}>{role.userCount} users</span>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => editing === role.id ? setEditing(null) : startEdit(role)}
                  className={`${bodyFont.className} text-xs border px-3 py-1.5 transition-colors ${editing === role.id ? 'border-[#333333] text-white' : 'border-[#1A1A1A] text-[#555555] hover:border-[#333333] hover:text-white'}`}
                >
                  {editing === role.id ? 'Cancel' : 'Edit Permissions'}
                </button>
                {editing === role.id && (
                  <button
                    onClick={() => saveEdit(role.id)}
                    className={`${bodyFont.className} text-xs bg-white text-black px-3 py-1.5 hover:bg-[#E8E8E8] transition-colors`}
                  >
                    Save
                  </button>
                )}
                {saved === role.id && (
                  <span className={`${bodyFont.className} text-xs text-emerald-400`}>Saved ✓</span>
                )}
              </div>
            </div>

            <div className="p-4">
              {editing === role.id ? (
                <div className="flex flex-col gap-4">
                  {categories.map((cat) => (
                    <div key={cat}>
                      <p className={`${headingFont.className} text-[9px] uppercase tracking-[0.12em] text-[#333333] mb-2`}>{cat}</p>
                      <div className="flex flex-col gap-1.5">
                        {ALL_PERMISSIONS.filter((p) => p.category === cat).map((p) => (
                          <label key={p.key} className={`${bodyFont.className} flex items-center gap-2.5 text-xs cursor-pointer ${editPerms.has(p.key) ? 'text-white' : 'text-[#444444]'}`}>
                            <input
                              type="checkbox"
                              checked={editPerms.has(p.key)}
                              onChange={() => togglePerm(p.key)}
                              className="accent-white w-3 h-3"
                            />
                            {p.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <p className={`${bodyFont.className} text-[10px] text-[#333333] mb-2`}>{role.permissions.length} permissions granted</p>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.slice(0, 8).map((p) => (
                      <span key={p} className={`${bodyFont.className} text-[9px] text-[#444444] bg-[#0D0D0D] border border-[#111111] px-1.5 py-0.5`}>
                        {ALL_PERMISSIONS.find((ap) => ap.key === p)?.label || p}
                      </span>
                    ))}
                    {role.permissions.length > 8 && (
                      <span className={`${bodyFont.className} text-[9px] text-[#333333]`}>+{role.permissions.length - 8} more</span>
                    )}
                    {role.permissions.length === 0 && (
                      <span className={`${bodyFont.className} text-[11px] text-[#333333]`}>No special permissions</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
