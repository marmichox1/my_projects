import React, { useState } from 'react';
import { TeamMember } from '../types';
import { Search, Plus, Shield, Users } from './Icons';
import Modal from './Modal';

interface TeamProps {
  members: TeamMember[];
  onAdd: (member: Omit<TeamMember, 'id'>) => void;
  onEdit: (member: TeamMember) => void;
}

const Team: React.FC<TeamProps> = ({ members, onAdd, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TeamMember | null>(null);

  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: '',
    email: '',
    role: 'Viewer',
    status: 'Active',
    lastActive: new Date().toLocaleDateString()
  });

  const filteredData = members.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (item?: TeamMember) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        email: '',
        role: 'Viewer',
        status: 'Active',
        lastActive: new Date().toLocaleDateString()
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      onEdit({ ...formData, id: editingItem.id } as TeamMember);
    } else {
      onAdd(formData as Omit<TeamMember, 'id'>);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Team Management</h1>
          <p className="text-slate-500 mt-1">Manage users, roles, and access permissions.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-slate-200"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Active</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Shield className={`w-3 h-3 ${item.role === 'Admin' ? 'text-violet-600' : 'text-slate-400'}`} />
                      <span className="text-sm text-slate-700">{item.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${item.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {item.lastActive}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="text-slate-400 hover:text-violet-600 transition-colors"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${editingItem ? 'Edit' : 'Add'} Team Member`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Viewer">Viewer</option>
            </select>
            <p className="text-xs text-slate-400 mt-1">
              Admins have full access. Managers can edit content. Viewers can only read.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-medium transition-colors"
            >
              {editingItem ? 'Save Changes' : 'Invite Member'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Team;