import React, { useState } from 'react';
import { Product } from '../types';
import { Search, Plus, Package } from './Icons';
import Modal from './Modal';

interface InventoryProps {
  products: Product[];
  onAdd: (product: Omit<Product, 'id'>) => void;
  onEdit: (product: Product) => void;
}

const Inventory: React.FC<InventoryProps> = ({ products, onAdd, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Product | null>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    price: 0,
    stock: 0,
    category: '',
    status: 'In Stock'
  });

  const filteredData = products.filter((item) =>
    (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.sku || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (item?: Product) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        sku: '',
        price: 0,
        stock: 0,
        category: '',
        status: 'In Stock'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      onEdit({ ...formData, id: editingItem.id } as Product);
    } else {
      onAdd(formData as Omit<Product, 'id'>);
    }
    setIsModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Low Stock': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Out of Stock': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Inventory</h1>
          <p className="text-slate-500 mt-1">Manage your products and stock levels.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-slate-200"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
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
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        <Package className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-slate-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-500">
                    {item.sku}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {item.stock}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
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
              No products found matching "{searchTerm}"
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${editingItem ? 'Edit' : 'Add'} Product`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock Qty</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  let status: any = 'In Stock';
                  if (val === 0) status = 'Out of Stock';
                  else if (val < 10) status = 'Low Stock';
                  setFormData({ ...formData, stock: val, status });
                }}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
            >
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-medium transition-colors"
            >
              {editingItem ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Inventory;