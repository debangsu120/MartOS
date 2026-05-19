'use client';

import { Header } from '@/components/Header';
import { Users, Shield, Mail, Clock } from 'lucide-react';

const users = [
  { id: '1', name: 'Arjun K.', email: 'manager@boutiquemart.com', role: 'Manager', status: 'Active', lastActive: '2 min ago' },
  { id: '2', name: 'Priya S.', email: 'priya@boutiquemart.com', role: 'Cashier', status: 'Active', lastActive: '15 min ago' },
  { id: '3', name: 'Vikram R.', email: 'vikram@boutiquemart.com', role: 'Inventory', status: 'Active', lastActive: '1 hour ago' },
  { id: '4', name: 'Meera D.', email: 'meera@boutiquemart.com', role: 'Cashier', status: 'Inactive', lastActive: '3 days ago' },
];

export default function UsersPage() {
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
            <button className="bg-[#3e5219] text-white text-xs px-6 py-2.5 rounded-xl hover:bg-[#556b2f] transition-colors shadow-sm flex items-center gap-2">
              <Users size={16} /> Add User
            </button>
          </div>

          {/* User Table */}
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
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-[#231a0f] text-sm">{user.name}</div>
                          <div className="text-xs text-[#45483c] flex items-center gap-1"><Mail size={12} /> {user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 text-sm text-[#45483c]">
                        <Shield size={14} className="text-[#3e5219]" /> {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        user.status === 'Active' ? 'bg-[#3e5219]/10 text-[#3e5219]' : 'bg-[#f1e0cd] text-[#45483c]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.status === 'Active' ? 'bg-[#3e5219]' : 'bg-[#c5c8b8]'}`}></span>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-[#45483c] flex items-center gap-1">
                      <Clock size={14} /> {user.lastActive}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-sm text-[#3e5219] font-semibold hover:underline">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}