import React, { useState } from 'react';
import { Client, Supplier } from '../types';
import { Search, Plus } from './Icons';
import Modal from './Modal';

interface CRMProps {
  type: 'clients' | 'suppliers';
  data: Client[] | Supplier[];
  onAdd: (item: any) => void;
  onEdit: (item: any) => void;
}

const CRM: React.FC<CRMProps> = ({ type, data, onAdd, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [formData, setFormData] = useState<any>({});

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (type === 'clients' ? (item as Client).company : (item as Supplier).category).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      if (type === 'clients') {
        setFormData({ name: '', company: '', email: '', status: 'Active', revenue: 0 });
      } else {
        setFormData({ name: '', contact: '', category: '', status: 'Active' });
      }
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      onEdit({ ...formData, id: editingItem.id });
    } else {
      onAdd(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 capitalize">{type}</h1>
          <p className="text-slate-500 mt-1">Manage your {type} and relationships.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-slate-200"
        >
          <Plus className="w-4 h-4" />
          Add {type === 'clients' ? 'Client' : 'Supplier'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${type}...`}
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
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">{type === 'clients' ? 'Company' : 'Category'}</th>
                <th className="px-6 py-4">{type === 'clients' ? 'Total Revenue' : 'Contact'}</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-200 to-indigo-200 flex items-center justify-center text-xs font-bold text-violet-700">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{item.name}</p>
                        {type === 'clients' && <p className="text-xs text-slate-400">{(item as Client).email}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {type === 'clients' ? (item as Client).company : (item as Supplier).category}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">
                    {type === 'clients' ? `$${(item as Client).revenue.toLocaleString()}` : (item as Supplier).contact}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${item.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                      {item.status}
                    </span>
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
          {filteredData.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              No results found for "{searchTerm}"
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${editingItem ? 'Edit' : 'Add'} ${type === 'clients' ? 'Client' : 'Supplier'}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {type === 'clients' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                <input
                  type="text"
                  required
                  value={formData.company || ''}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Revenue</label>
                <input
                  type="number"
                  required
                  value={formData.revenue || 0}
                  onChange={(e) => setFormData({ ...formData, revenue: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  required
                  value={formData.contact || ''}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              value={formData.status || 'Active'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
            >
              <option value="Active">Active</option>
              <option value={type === 'clients' ? 'Inactive' : 'Paused'}>{type === 'clients' ? 'Inactive' : 'Paused'}</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-medium transition-colors"
            >
              {editingItem ? 'Save Changes' : `Add ${type === 'clients' ? 'Client' : 'Supplier'}`}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CRM;