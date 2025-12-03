import React, { useState } from 'react';
import { Order, OrderStatus, Client } from '../types';
import { Search, Plus, Eye, Check, X } from './Icons';
import Modal from './Modal';

interface OrdersProps {
    orders: Order[];
    clients: Client[];
    onAdd: (order: Omit<Order, 'id' | 'clientName'>) => void;
    onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

const Orders: React.FC<OrdersProps> = ({ orders, clients, onAdd, onUpdateStatus }) => {
    const [filter, setFilter] = useState<OrderStatus | 'All'>('All');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const [newOrder, setNewOrder] = useState({
        clientId: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        status: OrderStatus.PENDING
    });

    const filteredOrders = orders.filter(o => filter === 'All' || o.status === filter);

    const statusColors = {
        [OrderStatus.PENDING]: 'bg-amber-50 text-amber-700 border-amber-100',
        [OrderStatus.PROCESSING]: 'bg-blue-50 text-blue-700 border-blue-100',
        [OrderStatus.COMPLETED]: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        [OrderStatus.CANCELLED]: 'bg-rose-50 text-rose-700 border-rose-100',
    };

    const handleCreateOrder = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd(newOrder);
        setIsCreateModalOpen(false);
        setNewOrder({
            clientId: '',
            amount: 0,
            date: new Date().toISOString().split('T')[0],
            status: OrderStatus.PENDING
        });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
                    <p className="text-slate-500 mt-1">Track and manage your orders.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-slate-200"
                >
                    <Plus className="w-4 h-4" />
                    Create Order
                </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
                {['All', ...Object.values(OrderStatus)].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status as OrderStatus | 'All')}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filter === status
                            ? 'bg-slate-800 text-white shadow-md'
                            : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredOrders.map(order => (
                            <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="px-6 py-4 font-mono text-sm text-slate-500">{order.id}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">{order.clientName}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">{order.date}</td>
                                <td className="px-6 py-4 font-bold text-slate-800">${order.amount.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[order.status]}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="text-slate-400 hover:text-violet-600 transition-colors flex items-center justify-end gap-1 ml-auto"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredOrders.length === 0 && (
                    <div className="p-12 text-center text-slate-400">
                        No orders found.
                    </div>
                )}
            </div>

            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New Order"
            >
                <form onSubmit={handleCreateOrder} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Client</label>
                        <select
                            required
                            value={newOrder.clientId}
                            onChange={(e) => setNewOrder({ ...newOrder, clientId: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                        >
                            <option value="">Select a client...</option>
                            {clients.map(c => (
                                <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            value={newOrder.amount}
                            onChange={(e) => setNewOrder({ ...newOrder, amount: Number(e.target.value) })}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                        <input
                            type="date"
                            required
                            value={newOrder.date}
                            onChange={(e) => setNewOrder({ ...newOrder, date: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                        <select
                            value={newOrder.status}
                            onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value as OrderStatus })}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                        >
                            {Object.values(OrderStatus).map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-medium transition-colors"
                        >
                            Create Order
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                title="Order Details"
            >
                {selectedOrder && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wide">Order ID</p>
                                <p className="font-mono font-medium text-slate-900">{selectedOrder.id}</p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[selectedOrder.status]}`}>
                                {selectedOrder.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wide">Client</p>
                                <p className="font-medium text-slate-900">{selectedOrder.clientName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wide">Date</p>
                                <p className="font-medium text-slate-900">{selectedOrder.date}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wide">Amount</p>
                                <p className="text-xl font-bold text-slate-900">${selectedOrder.amount.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <p className="text-sm font-medium text-slate-700 mb-3">Update Status</p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => {
                                        onUpdateStatus(selectedOrder.id, OrderStatus.COMPLETED);
                                        setSelectedOrder(null);
                                    }}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-sm transition-colors"
                                >
                                    <Check className="w-3 h-3" /> Mark Complete
                                </button>
                                <button
                                    onClick={() => {
                                        onUpdateStatus(selectedOrder.id, OrderStatus.CANCELLED);
                                        setSelectedOrder(null);
                                    }}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-sm transition-colors"
                                >
                                    <X className="w-3 h-3" /> Cancel Order
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Orders;