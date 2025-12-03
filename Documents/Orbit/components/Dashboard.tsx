import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from './StatCard';
import { Users, Truck, ShoppingCart, Sparkles, ArrowUpRight, Package, Shield, ClipboardList } from './Icons';
import { AppState, OrderStatus } from '../types';

interface DashboardProps {
    state: AppState;
    onNavigate: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ state, onNavigate }) => {
    const totalRevenue = state.orders.reduce((acc, order) => acc + order.amount, 0);
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(Math.round(value));
    };
    const activeClients = state.clients.filter(c => c.status === 'Active').length;
    const pendingOrders = state.orders.filter(o => o.status === OrderStatus.PENDING).length;
    const lowStockItems = state.products.filter(p => p.status === 'Low Stock' || p.stock < 10).length;

    const chartData = [
        { name: 'Jan', value: 4000 },
        { name: 'Feb', value: 3000 },
        { name: 'Mar', value: 2000 },
        { name: 'Apr', value: 2780 },
        { name: 'May', value: 1890 },
        { name: 'Jun', value: 2390 },
        { name: 'Jul', value: 3490 },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Overview of your business performance.</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600">v2.4.0</span>
                    <span className="px-3 py-1 bg-emerald-100 rounded-full text-xs font-medium text-emerald-700">System Online</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={formatCurrency(totalRevenue)}
                    trend="12%"
                    trendUp={true}
                    icon={<span className="text-lg font-bold text-emerald-600">$</span>}
                />
                <StatCard
                    title="Active Clients"
                    value={activeClients}
                    trend="4%"
                    trendUp={true}
                    icon={<Users className="w-5 h-5 text-blue-600" />}
                />
                <StatCard
                    title="Pending Orders"
                    value={pendingOrders}
                    trend="2%"
                    trendUp={false}
                    icon={<ShoppingCart className="w-5 h-5 text-amber-600" />}
                />
                <StatCard
                    title="Low Stock Items"
                    value={lowStockItems}
                    trend={lowStockItems > 0 ? "Attention" : "Good"}
                    trendUp={lowStockItems === 0}
                    icon={<Package className="w-5 h-5 text-purple-600" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-slate-800">Revenue Overview</h3>
                        <button
                            onClick={() => onNavigate('orders')}
                            className="text-sm text-violet-600 font-medium hover:text-violet-700 flex items-center gap-1 transition-colors"
                        >
                            View Report <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#64748b' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Links</h3>
                    <div className="flex-1 space-y-3">
                        <button onClick={() => onNavigate('inventory')} className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-violet-50 hover:text-violet-700 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-violet-200 transition-colors">
                                    <Package className="w-5 h-5 text-slate-600 group-hover:text-violet-700" />
                                </div>
                                <span className="font-medium">Manage Inventory</span>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-violet-700" />
                        </button>

                        <button onClick={() => onNavigate('tasks')} className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-violet-50 hover:text-violet-700 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-violet-200 transition-colors">
                                    <ClipboardList className="w-5 h-5 text-slate-600 group-hover:text-violet-700" />
                                </div>
                                <span className="font-medium">Task Board</span>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-violet-700" />
                        </button>

                        <button onClick={() => onNavigate('team')} className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-violet-50 hover:text-violet-700 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-violet-200 transition-colors">
                                    <Shield className="w-5 h-5 text-slate-600 group-hover:text-violet-700" />
                                </div>
                                <span className="font-medium">Team Settings</span>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-violet-700" />
                        </button>

                        <button onClick={() => onNavigate('suppliers')} className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-violet-50 hover:text-violet-700 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-violet-200 transition-colors">
                                    <Truck className="w-5 h-5 text-slate-600 group-hover:text-violet-700" />
                                </div>
                                <span className="font-medium">Supplier Database</span>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-violet-700" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;