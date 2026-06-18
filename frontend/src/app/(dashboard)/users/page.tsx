'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Users, Shield, Mail, Clock, Plus, X, UserCheck, UserX } from 'lucide-react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  lastLoginAt?: string;
  roles?: { role: { id: string; name: string } }[];
}

interface Role {
  id: string;
  name: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    roleId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [usersData, rolesData] = await Promise.all([
        api.getUsers(),
        api.getRoles ? api.getRoles() : Promise.resolve([]),
      ]);
      setUsers(usersData || []);
      setRoles(rolesData || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.updateUser(editingUser.id, formData);
        toast.success('User updated successfully');
      } else {
        await api.createUser(formData);
        toast.success('User created successfully');
      }
      setShowAddModal(false);
      setEditingUser(null);
      resetForm();
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save user');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', password: '', roleId: '' });
  };

  const openEditModal = (user: UserData) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      password: '',
      roleId: user.roles?.[0]?.role?.id || '',
    });
    setShowAddModal(true);
  };

  const toggleUserStatus = async (user: UserData) => {
    try {
      await api.updateUser(user.id, { isActive: !user.isActive });
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}`);
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user status');
    }
  };

  const formatLastActive = (lastLogin?: string) => {
    if (!lastLogin) return 'Never';
    const date = new Date(lastLogin);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const getRoleBadgeColor = (roleName?: string) => {
    switch (roleName?.toLowerCase()) {
      case 'owner': return 'bg-[#6b4323] text-white';
      case 'manager': return 'bg-[#3e5219] text-white';
      case 'cashier': return 'bg-[#566342] text-white';
      case 'inventory': return 'bg-[#75796b] text-white';
      default: return 'bg-[#f1e0cd] text-[#45483c]';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff8f4] flex items-center justify-center">
        <div className="text-[#3e5219]">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fff8f4]">
      <Header 
        title="User Management"
        subtitle="Manage team members and their access permissions."
        showNav={false}
      />
      <main className="flex-1 p-8">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="font-display text-xl text-[#231a0f]">User Management</h2>
              <p className="text-[#45483c] mt-1">Manage team members and their access permissions.</p>
            </div>
            <button 
              onClick={() => { setEditingUser(null); resetForm(); setShowAddModal(true); }}
              className="bg-[#3e5219] text-white text-xs px-6 py-2.5 rounded-xl hover:bg-[#556b2f] transition-colors shadow-sm flex items-center gap-2"
            >
              <Users size={16} /> Add User
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-soft-ambient border border-[#c5c8b8]/10 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fff1e4] border-b border-[#c5c8b8]/20">
                  <th className="py-4 px-6 text-xs font-semibold text-[#45483c]">User</th>
                  <th className="py-4 px-6 text-xs font-semibold text-[#45483c]">Role</th>
                  <th className="py-4 px-6 text-xs font-semibold text-[#45483c]">Status</th>
                  <th className="py-4 px-6 text-xs font-semibold text-[#45483c]">Last Active</th>
                  <th className="py-4 px-6 text-xs font-semibold text-[#45483c] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c5c8b8]/10">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#fff8f4] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#556b2f] flex items-center justify-center text-white text-sm font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-[#231a0f] text-sm">{user.name}</div>
                          <div className="text-xs text-[#45483c] flex items-center gap-1">
                            <Mail size={12} /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.roles?.[0]?.role?.name)}`}>
                        <Shield size={12} /> {user.roles?.[0]?.role?.name || 'User'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        user.isActive 
                          ? 'bg-[#3e5219]/10 text-[#3e5219]' 
                          : 'bg-[#f1e0cd] text-[#45483c]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.isActive ? 'bg-[#3e5219]' : 'bg-[#c5c8b8]'}`}></span>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-[#45483c] flex items-center gap-1">
                      <Clock size={14} /> {formatLastActive(user.lastLoginAt)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(user)}
                          className="text-sm text-[#3e5219] font-semibold hover:underline"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => toggleUserStatus(user)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            user.isActive 
                              ? 'text-[#ba1a1a] hover:bg-[#ffdad6]' 
                              : 'text-[#3e5219] hover:bg-[#d0eba1]'
                          }`}
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {user.isActive ? <UserX size={18} /> : <UserCheck size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6 border-b border-[#c5c8b8]/20 flex items-center justify-between">
              <h3 className="font-display text-xl text-[#231a0f]">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h3>
              <button 
                onClick={() => { setShowAddModal(false); setEditingUser(null); resetForm(); }}
                className="p-2 hover:bg-[#f1e0cd] rounded-full transition-colors"
              >
                <X size={20} className="text-[#45483c]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#231a0f] mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#f1e0cd] border border-[#c5c8b8] rounded-xl text-[#231a0f] focus:outline-none focus:border-[#3e5219]"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#231a0f] mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[#f1e0cd] border border-[#c5c8b8] rounded-xl text-[#231a0f] focus:outline-none focus:border-[#3e5219]"
                    placeholder="Enter email address"
                    required
                    disabled={!!editingUser}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#231a0f] mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-[#f1e0cd] border border-[#c5c8b8] rounded-xl text-[#231a0f] focus:outline-none focus:border-[#3e5219]"
                    placeholder="Enter phone number"
                  />
                </div>

                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-[#231a0f] mb-2">Password *</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 bg-[#f1e0cd] border border-[#c5c8b8] rounded-xl text-[#231a0f] focus:outline-none focus:border-[#3e5219]"
                      placeholder="Enter password"
                      required={!editingUser}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-[#231a0f] mb-2">Role *</label>
                  <select
                    value={formData.roleId}
                    onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                    className="w-full px-4 py-3 bg-[#f1e0cd] border border-[#c5c8b8] rounded-xl text-[#231a0f] focus:outline-none focus:border-[#3e5219]"
                    required
                  >
                    <option value="">Select role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                    {roles.length === 0 && (
                      <>
                        <option value="cashier">Cashier</option>
                        <option value="manager">Manager</option>
                        <option value="inventory">Inventory Staff</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingUser(null); resetForm(); }}
                  className="flex-1 py-3 rounded-xl border border-[#c5c8b8] text-[#45483c] hover:bg-[#f1e0cd] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#3e5219] text-white hover:bg-[#556b2f] transition-colors"
                >
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}