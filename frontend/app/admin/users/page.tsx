"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  FiSearch,
  FiFilter,
  FiUserPlus, 
  FiMail, 
  FiShield, 
  FiTrash2, 
  FiCheckCircle, 
  FiUser
} from "react-icons/fi";
import { toast } from "sonner";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "recruiter" | "candidate";
  isApproved: boolean;
  createdAt: string;
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "pending">("all");
  const [search, setSearch] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      const endpoint = activeTab === "all" ? "/api/admin/users" : "/api/admin/users/pending";
      const res = await fetch(endpoint);
      if (res.ok) {
        const result = await res.json();
        setUsers(result.data || []);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch {
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    Promise.resolve().then(() => fetchUsers());
  }, [fetchUsers]);

  const handleApprove = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/approve/${userId}`, {
        method: "PUT",
      });
      if (res.ok) {
        toast.success("Recruiter approved successfully");
        fetchUsers(); // Refresh list
      } else {
        const error = await res.json();
        toast.error(error.message || "Approval failed");
      }
    } catch {
      toast.error("Failed to approve recruiter");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">User Management</h1>
          <p className="text-text-muted mt-1 font-medium">Manage accounts, roles, and platform permissions.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-foreground px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 w-fit">
          <FiUserPlus size={18} />
          Add New User
        </button>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-surface-2 rounded-2xl w-fit border border-border-subtle">
        <button 
          onClick={() => { setLoading(true); setActiveTab("all"); }}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === 'all' ? 'bg-primary text-foreground shadow-lg shadow-primary/20' : 'text-text-muted hover:text-foreground'
          }`}
        >
          All Users
        </button>
        <button 
          onClick={() => { setLoading(true); setActiveTab("pending"); }}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
            activeTab === 'pending' ? 'bg-amber-500 text-foreground shadow-lg shadow-amber-500/20' : 'text-text-muted hover:text-foreground'
          }`}
        >
          Pending Approvals
          {activeTab !== 'pending' && users.some(u => u.role === 'recruiter' && !u.isApproved) && (
             <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          )}
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full h-14 bg-surface-2 border border-border-subtle rounded-2xl pl-12 pr-6 text-sm text-foreground placeholder:text-text-muted outline-none focus:border-primary/50 transition-all"
          />
        </div>
        <button className="h-14 px-6 rounded-2xl bg-surface-2 border border-border-subtle text-foreground font-bold flex items-center gap-3 hover:bg-surface-2 transition-all">
          <FiFilter size={18} className="text-primary" />
          Filters
        </button>
      </div>

      {/* Users Table */}
      <div className="rounded-[2.5rem] bg-surface-2 border border-border-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-white/[0.02]">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">User</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Role</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Verification</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Joined Date</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">Syncing user directory...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                     <p className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">No users found in this view.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="group hover:bg-white/[0.01] transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-surface-1 border border-border-medium flex items-center justify-center font-bold text-slate-300">
                          {user.name?.charAt(0) || <FiUser />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground leading-none">{user.name}</p>
                          <p className="text-xs text-text-muted mt-1.5">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border ${
                        user.role === 'admin' ? 'border-amber-500/30 text-amber-500 bg-amber-500/5' :
                        user.role === 'recruiter' ? 'border-purple-500/30 text-purple-500 bg-purple-500/5' :
                        'border-blue-500/30 text-primary bg-primary/5'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      {user.role === 'recruiter' ? (
                        <div className="flex items-center gap-2">
                          <div className={`h-1.5 w-1.5 rounded-full ${user.isApproved ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <span className={`text-xs font-bold ${user.isApproved ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {user.isApproved ? 'Approved' : 'Pending'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-text-muted">N/A</span>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-medium text-text-secondary">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.role === 'recruiter' && !user.isApproved && (
                          <button 
                            onClick={() => handleApprove(user._id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-foreground transition-all"
                          >
                            <FiCheckCircle size={14} />
                            Approve
                          </button>
                        )}
                        <button className="p-2.5 rounded-xl border border-border-subtle text-text-muted hover:text-foreground hover:bg-surface-2 transition-all">
                          <FiMail size={16} />
                        </button>
                        <button className="p-2.5 rounded-xl border border-border-subtle text-text-muted hover:text-primary hover:bg-primary/5 transition-all">
                          <FiShield size={16} />
                        </button>
                        <button className="p-2.5 rounded-xl border border-border-subtle text-text-muted hover:text-rose-500 hover:bg-rose-500/5 transition-all">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
