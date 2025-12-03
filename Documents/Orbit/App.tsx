import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CRM from './components/CRM';
import Orders from './components/Orders';
import Inventory from './components/Inventory';
import Team from './components/Team';
import Tasks from './components/Tasks';
import Auth from './components/Auth';
import { AppState, OrderStatus, User, Client, Supplier, Order, Product, TeamMember, Task } from './types';
import { api } from './services/api.ts';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [clients, setClients] = useState<Client[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const appState: AppState = { clients, suppliers, orders, products, team, tasks };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [clientsData, suppliersData, ordersData, productsData, teamData, tasksData] = await Promise.all([
        api.getClients(),
        api.getSuppliers(),
        api.getOrders(),
        api.getProducts(),
        api.getTeam(),
        api.getTasks()
      ]);
      setClients(clientsData);
      setSuppliers(suppliersData);
      setOrders(ordersData);
      setProducts(productsData);
      setTeam(teamData);
      setTasks(tasksData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      const userData = await api.login(credentials);
      setUser(userData);
      setActiveTab('dashboard');
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('dashboard');
    setClients([]);
    setSuppliers([]);
    setOrders([]);
    setProducts([]);
    setTeam([]);
    setTasks([]);
  };

  const handleAddClient = async (client: Omit<Client, 'id'>) => {
    const newClient = await api.createClient(client);
    setClients([newClient, ...clients]);
  };

  const handleEditClient = async (updatedClient: Client) => {
    await api.updateClient(updatedClient);
    setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  const handleAddSupplier = async (supplier: Omit<Supplier, 'id'>) => {
    const newSupplier = await api.createSupplier(supplier);
    setSuppliers([newSupplier, ...suppliers]);
  };

  const handleEditSupplier = async (updatedSupplier: Supplier) => {
    await api.updateSupplier(updatedSupplier);
    setSuppliers(suppliers.map(s => s.id === updatedSupplier.id ? updatedSupplier : s));
  };

  const handleAddOrder = async (orderData: Omit<Order, 'id' | 'clientName'>) => {
    const newOrder = await api.createOrder(orderData);
    setOrders([newOrder, ...orders]);
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const updatedOrder = { ...order, status };
      await api.updateOrder(updatedOrder);
      setOrders(orders.map(o => o.id === orderId ? updatedOrder : o));
    }
  };

  const handleAddProduct = async (product: Omit<Product, 'id'>) => {
    const newProduct = await api.createProduct(product);
    setProducts([newProduct, ...products]);
  };

  const handleEditProduct = async (updatedProduct: Product) => {
    await api.updateProduct(updatedProduct);
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleAddTeamMember = async (member: Omit<TeamMember, 'id'>) => {
    const newMember = await api.createTeamMember(member);
    setTeam([newMember, ...team]);
  };

  const handleEditTeamMember = async (updatedMember: TeamMember) => {
    await api.updateTeamMember(updatedMember);
    setTeam(team.map(m => m.id === updatedMember.id ? updatedMember : m));
  };

  const handleAddTask = async (task: Omit<Task, 'id'>) => {
    const newTask = await api.createTask(task);
    setTasks([newTask, ...tasks]);
  };

  const handleEditTask = async (updatedTask: Task) => {
    await api.updateTask(updatedTask);
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleDeleteTask = async (taskId: string) => {
    await api.deleteTask(taskId);
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (isLoading && clients.length === 0) {
      return <div className="flex items-center justify-center h-full text-slate-500">Loading...</div>;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard state={appState} onNavigate={setActiveTab} />;
      case 'clients':
        return <CRM type="clients" data={clients} onAdd={handleAddClient} onEdit={handleEditClient} />;
      case 'suppliers':
        return <CRM type="suppliers" data={suppliers} onAdd={handleAddSupplier} onEdit={handleEditSupplier} />;
      case 'orders':
        return <Orders orders={orders} clients={clients} onAdd={handleAddOrder} onUpdateStatus={handleUpdateOrderStatus} />;
      case 'inventory':
        return <Inventory products={products} onAdd={handleAddProduct} onEdit={handleEditProduct} />;
      case 'team':
        return <Team members={team} onAdd={handleAddTeamMember} onEdit={handleEditTeamMember} />;
      case 'tasks':
        return <Tasks tasks={tasks} team={team} onAdd={handleAddTask} onEdit={handleEditTask} onDelete={handleDeleteTask} />;
      default:
        return <Dashboard state={appState} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-30">
          <div className="font-bold text-lg text-slate-900">Orbit</div>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
