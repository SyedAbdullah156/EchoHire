"use client";

import { useState } from "react";
import { FiSearch, FiFilter, FiMoreVertical, FiUserPlus, FiMail, FiShield, FiTrash2 } from "react-icons/fi";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "recruiter" | "candidate";
  status: "active" | "inactive";
  joined: string;
};

const MOCK_USERS: User[] = [
  { id: "1", name: "System Admin", email: "admin@echohire.ai", role: "admin", status: "active", joined: "Jan 12, 2024" },
  { id: "2", name: "Alex Rivera", email: "alex@example.com", role: "candidate", status: "active", joined: "Feb 05, 2024" },
  { id: "3", name: "Samantha Bell", email: "sam@company.com", role: "recruiter", status: "active", joined: "Mar 10, 2024" },
  { id: "4", name: "Jordan Smith", email: "jordan@example.com", role: "candidate", status: "inactive", joined: "Apr 22, 2024" },
  { id: "5", name: "Hassan Ali", email: "hassan@tech.com", role: "recruiter", status: "active", joined: "May 01, 2024" },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">User Management</h1>
          <p className="text-text-muted mt-1 font-medium">Manage accounts, roles, and platform permissions.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 w-fit">
          <FiUserPlus size={18} />
          Add New User
        </button>
      </header>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full h-14 bg-surface-2 border border-white/5 rounded-2xl pl-12 pr-6 text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 transition-all"
          />
        </div>
        <button className="h-14 px-6 rounded-2xl bg-surface-2 border border-white/5 text-white font-bold flex items-center gap-3 hover:bg-white/5 transition-all">
          <FiFilter size={18} className="text-primary" />
          Filters
        </button>
      </div>

      {/* Users Table */}
      <div className="rounded-[2rem] bg-surface-2 border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">User</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Role</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Joined Date</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="group hover:bg-white/[0.01] transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-surface-1 border border-white/10 flex items-center justify-center font-bold text-slate-300">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white leading-none">{user.name}</p>
                        <p className="text-xs text-text-muted mt-1.5">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border ${
                      user.role === 'admin' ? 'border-amber-500/30 text-amber-500 bg-amber-500/5' :
                      user.role === 'recruiter' ? 'border-purple-500/30 text-purple-500 bg-purple-500/5' :
                      'border-blue-500/30 text-blue-500 bg-blue-500/5'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`h-1.5 w-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                      <span className={`text-xs font-bold ${user.status === 'active' ? 'text-emerald-500' : 'text-slate-600'}`}>
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-medium text-slate-400">{user.joined}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2.5 rounded-xl border border-white/5 text-slate-500 hover:text-white hover:bg-white/5 transition-all">
                        <FiMail size={16} />
                      </button>
                      <button className="p-2.5 rounded-xl border border-white/5 text-slate-500 hover:text-primary hover:bg-primary/5 transition-all">
                        <FiShield size={16} />
                      </button>
                      <button className="p-2.5 rounded-xl border border-white/5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 transition-all">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
