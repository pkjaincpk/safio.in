
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Package, TrendingUp, Users, Settings, Plus, LayoutDashboard, Search, Bell, X, Laptop, LogOut, ShieldCheck, Key, Save, CheckCircle, Image as ImageIcon, Edit2, Trash2, ChevronRight, PlusCircle, Bookmark, RefreshCw, Eraser } from 'lucide-react';
import { Product, GuardType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BRANDS } from '../constants';

interface AdminPanelProps {
  products: Product[];
  updateStock: (productId: string, screenSize: string, newStock: number) => void;
  addProduct: (product: Product) => void;
  editProduct: (product: Product) => void;
  onLogout?: () => void;
}

const salesData = [
  { name: 'Mon', sales: 4000 }, { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 6000 }, { name: 'Thu', sales: 8000 },
  { name: 'Fri', sales: 5000 }, { name: 'Sat', sales: 9000 },
  { name: 'Sun', sales: 11000 },
];

const AdminPanel: React.FC<AdminPanelProps> = ({ products, updateStock, addProduct, editProduct, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'stock' | 'orders' | 'account'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [activeStockProductId, setActiveStockProductId] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeOrders: 0,
    totalCustomers: 2400,
    lowStockCount: 0
  });
  
  const urlInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to fetch stats:', err));
  }, [products]);

  // Stock Modal Local State
  const [newScreenSize, setNewScreenSize] = useState('');
  const [selectedPresetSize, setSelectedPresetSize] = useState('');

  // Form States for Add/Edit Product
  const [formState, setFormState] = useState({
    name: '', brand: BRANDS[0].brand, type: 'Privacy' as GuardType, basePrice: 999,
    description: '', imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600',
    features: ''
  });

  const [creds, setCreds] = useState({
    username: 'admin',
    password: 'admin123'
  });

  useEffect(() => {
    const stored = localStorage.getItem('safio_admin_creds');
    if (stored) setCreds(JSON.parse(stored));
  }, []);

  const activeStockProduct = useMemo(() => {
    return products.find(p => p.id === activeStockProductId) || null;
  }, [products, activeStockProductId]);

  const handleUpdateCreds = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('safio_admin_creds', JSON.stringify(creds));
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 3000);
  };

  const openAddModal = () => {
    setEditingProductId(null);
    setFormState({
      name: '', brand: BRANDS[0].brand, type: 'Privacy', basePrice: 999,
      description: '', imageUrl: '',
      features: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProductId(product.id);
    setFormState({
      name: product.name,
      brand: product.brand,
      type: product.type,
      basePrice: product.basePrice,
      description: product.description,
      imageUrl: product.imageUrl,
      features: product.features.join(', ')
    });
    setIsModalOpen(true);
  };

  const openStockModal = (product: Product) => {
    setActiveStockProductId(product.id);
    setIsStockModalOpen(true);
    setNewScreenSize('');
    setSelectedPresetSize('');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProductId) {
      const existingProduct = products.find(p => p.id === editingProductId);
      if (existingProduct) {
        const updated: Product = {
          ...existingProduct,
          name: formState.name,
          brand: formState.brand,
          type: formState.type,
          basePrice: formState.basePrice,
          description: formState.description,
          features: formState.features.split(',').map(f => f.trim()).filter(f => f !== ''),
          imageUrl: formState.imageUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600',
        };
        editProduct(updated);
      }
    } else {
      const initialStock: Record<string, number> = {};
      const product: Product = {
        id: `p-${Date.now()}`, 
        name: formState.name, 
        brand: formState.brand,
        type: formState.type,
        basePrice: formState.basePrice, 
        description: formState.description,
        features: formState.features.split(',').map(f => f.trim()).filter(f => f !== ''),
        imageUrl: formState.imageUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600', 
        stock: initialStock
      };
      addProduct(product);
    }
    
    setIsModalOpen(false);
  };

  const handleAddNewScreenSizeStock = (productId: string, size: string) => {
    const trimmedSize = size.trim();
    if (!trimmedSize) return;
    updateStock(productId, trimmedSize, 0);
    setNewScreenSize('');
    setSelectedPresetSize('');
  };

  const handleRemoveScreenSize = (productId: string, size: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const newStock = { ...product.stock };
    delete newStock[size];
    editProduct({ ...product, stock: newStock });
  };

  const triggerImageChange = () => {
    urlInputRef.current?.focus();
    urlInputRef.current?.select();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-400 p-6 flex flex-col hidden lg:flex">
        <div className="flex items-center gap-2 text-white font-bold text-xl mb-12">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white">
            <TrendingUp className="w-5 h-5" />
          </div>
          Safio<span className="text-red-500">.in</span>
        </div>
        
        <nav className="space-y-2 flex-1">
          {[
            { id: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
            { id: 'stock', icon: <Package className="w-5 h-5" />, label: 'Inventory' },
            { id: 'orders', icon: <TrendingUp className="w-5 h-5" />, label: 'Sales Report' },
            { id: 'account', icon: <ShieldCheck className="w-5 h-5" />, label: 'Account' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'hover:bg-slate-800'}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-800 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-2 hover:text-white transition-colors font-medium">
            <Settings className="w-5 h-5" /> Settings
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar">
        <header className="bg-white p-6 flex justify-between items-center border-b sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input type="text" placeholder="Search orders, stock..." className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-slate-100 rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-full border">
                <span className="text-sm font-bold text-slate-700">{creds.username}</span>
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold uppercase">{creds.username[0]}</div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, change: '+20.1%', icon: <TrendingUp className="text-green-600" /> },
                  { label: 'Active Orders', value: stats.activeOrders.toString(), change: '+12', icon: <Package className="text-blue-600" /> },
                  { label: 'Total Customers', value: stats.totalCustomers.toLocaleString(), change: '+180', icon: <Users className="text-purple-600" /> },
                  { label: 'Stock Alerts', value: `${stats.lowStockCount} Low`, change: '-2', icon: <Package className="text-red-600" /> },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <div className="flex justify-between mb-4">
                      <span className="text-slate-500 font-medium">{stat.label}</span>
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-xs font-bold text-slate-400">{stat.change} vs prev. month</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-lg mb-6">Revenue Performance (INR)</h3>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                        <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                        <Line type="monotone" dataKey="sales" stroke="#ef4444" strokeWidth={3} dot={{r: 4, fill: '#ef4444'}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-lg mb-6">Units Sold by Type</h3>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'Privacy', val: 145 },
                        { name: 'Blue Light', val: 210 },
                        { name: 'Self-Heal', val: 95 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="val" fill="#ef4444" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stock' && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="font-bold text-lg">Inventory Management</h3>
                <button 
                  onClick={openAddModal}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Product Info</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Stock Status</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4 text-center">Manage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-sm">
                    {products.map(product => {
                      const totalStock = (Object.values(product.stock) as number[]).reduce((a, b) => a + b, 0);
                      const modelCount = Object.keys(product.stock).length;
                      return (
                        <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={product.imageUrl} className="w-12 h-12 rounded-xl object-cover shadow-sm border" />
                              <div>
                                <p className="font-black text-slate-900 leading-none mb-1">{product.name}</p>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-red-600 font-black uppercase tracking-tight">{product.brand}</span>
                                  <span className="text-[10px] text-slate-400 font-bold uppercase">{product.id}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-red-50 text-red-600 px-2 py-1 rounded-md text-[10px] font-black uppercase">{product.type}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${(totalStock as number) > 20 ? 'bg-green-500' : (totalStock as number) > 0 ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                                <span className="font-bold text-slate-700">{totalStock} Units Total</span>
                              </div>
                              <p className="text-[10px] text-slate-400 font-bold">{modelCount} Sizes Supported</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-black text-slate-900 italic">₹{product.basePrice.toLocaleString('en-IN')}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => openStockModal(product)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
                              >
                                <Package className="w-3.5 h-3.5" /> Manage Stock
                              </button>
                              <button 
                                onClick={() => openEditModal(product)}
                                className="p-2 bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors border"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Stock Management Modal */}
      {isStockModalOpen && activeStockProduct && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsStockModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Manage Screen Size Stock</h2>
                  <p className="text-xs text-slate-500 font-medium">{activeStockProduct.name}</p>
                </div>
              </div>
              <button onClick={() => setIsStockModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto no-scrollbar">
              {/* Add New Model Section */}
              <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200 space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Add Support for New Screen Size</label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold px-1 mb-1">Select Preset (By Brand)</p>
                    <select 
                      value={selectedPresetSize}
                      onChange={(e) => {
                        setSelectedPresetSize(e.target.value);
                        setNewScreenSize(''); 
                      }}
                      className="w-full p-3 rounded-xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-red-500 text-sm font-bold"
                    >
                      <option value="">Choose from common sizes...</option>
                      {BRANDS.map(brandGroup => (
                        <optgroup key={brandGroup.brand} label={brandGroup.brand}>
                          {brandGroup.screenSizes
                            .filter(s => !activeStockProduct.stock[s])
                            .map(size => (
                              <option key={size} value={size}>{size}</option>
                            ))
                          }
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold px-1 mb-1">Or Type Manually</p>
                    <input 
                      type="text" 
                      value={newScreenSize}
                      onChange={(e) => {
                        setNewScreenSize(e.target.value);
                        setSelectedPresetSize('');
                      }}
                      placeholder="e.g. 15.6 inch"
                      className="w-full p-3 rounded-xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-red-500 text-sm font-bold"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => handleAddNewScreenSizeStock(activeStockProduct.id, selectedPresetSize || newScreenSize)}
                  disabled={!selectedPresetSize && !newScreenSize.trim()}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" /> Add Size to Inventory
                </button>
              </div>

              {/* Current Stock Table */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Inventory per Screen Size</h4>
                {Object.keys(activeStockProduct.stock).length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-2xl border">
                    <p className="text-sm text-slate-400 font-bold italic">No size records found. Add one above.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(activeStockProduct.stock).map(([size, count]) => (
                      <div key={size} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-red-100 transition-colors group">
                        <div className="flex-1">
                          <p className="text-sm font-black text-slate-800">{size}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Screen Size</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <input 
                              type="number"
                              min="0"
                              value={count}
                              onChange={(e) => updateStock(activeStockProduct.id, size, parseInt(e.target.value) || 0)}
                              className="w-24 pl-4 pr-10 py-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-red-500 font-black text-sm"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">PCS</span>
                          </div>
                          <button 
                            onClick={() => handleRemoveScreenSize(activeStockProduct.id, size)}
                            className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t bg-slate-50 flex justify-end">
              <button 
                onClick={() => setIsStockModalOpen(false)}
                className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all"
              >
                Close Stock Manager
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                <Laptop className="w-6 h-6 text-red-600" />
                {editingProductId ? 'Edit Safio Guard' : 'Add New Safio Guard'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar text-sm">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 md:col-span-1 space-y-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-2">Product Name</label>
                    <input required type="text" value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} placeholder="e.g. UltraClear Pro Guard" className="w-full p-3 rounded-xl bg-slate-100 border-none outline-none focus:ring-red-500 ring-2 ring-transparent transition-all font-bold" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-2">Target Brand</label>
                      <select value={formState.brand} onChange={e => setFormState({...formState, brand: e.target.value})} className="w-full p-3 rounded-xl bg-slate-100 border-none outline-none focus:ring-red-500 ring-2 ring-transparent transition-all font-bold">
                        {BRANDS.map(b => (
                          <option key={b.brand} value={b.brand}>{b.brand}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-2">Guard Type</label>
                      <select value={formState.type} onChange={e => setFormState({...formState, type: e.target.value as GuardType})} className="w-full p-3 rounded-xl bg-slate-100 border-none outline-none focus:ring-red-500 ring-2 ring-transparent transition-all font-bold">
                        <option value="Privacy">Privacy</option>
                        <option value="Blue Light">Blue Light</option>
                        <option value="Self-Healing">Self-Healing</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-2">Base Price (₹)</label>
                    <input required type="number" step="1" value={formState.basePrice} onChange={e => setFormState({...formState, basePrice: parseFloat(e.target.value)})} className="w-full p-3 rounded-xl bg-slate-100 border-none outline-none focus:ring-red-500 ring-2 ring-transparent transition-all font-bold" />
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block font-bold text-slate-700 mb-2">Product Image</label>
                  <div className="space-y-4">
                    <div 
                      className="relative group cursor-pointer"
                      onClick={triggerImageChange}
                    >
                      <div className="w-full h-40 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300 transition-all hover:border-red-400">
                        {formState.imageUrl ? (
                          <>
                            <img src={formState.imageUrl} alt="Preview" className="w-full h-full object-cover group-hover:opacity-75 transition-opacity" />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                              <RefreshCw className="w-8 h-8 mb-1 animate-spin-slow" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Change Image</span>
                            </div>
                            <div className="absolute top-2 right-2 bg-green-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
                              Live Preview
                            </div>
                          </>
                        ) : (
                          <div className="text-center text-slate-400">
                            <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                            <p className="text-xs font-bold">Paste URL to load image</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input 
                            ref={urlInputRef}
                            required 
                            type="url" 
                            value={formState.imageUrl} 
                            onChange={e => setFormState({...formState, imageUrl: e.target.value})} 
                            placeholder="Paste Image URL..." 
                            className="w-full p-3 text-xs rounded-xl bg-slate-100 border-none outline-none focus:ring-red-500 ring-2 ring-transparent transition-all font-medium pr-10" 
                          />
                          {formState.imageUrl && (
                            <button 
                              type="button"
                              onClick={() => setFormState({...formState, imageUrl: ''})}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-red-500 transition-colors"
                              title="Clear Image URL"
                            >
                              <Eraser className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <button 
                          type="button"
                          onClick={triggerImageChange}
                          className="bg-slate-900 text-white px-3 rounded-xl hover:bg-slate-800 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold px-1 italic">Note: Use a direct link to a JPG/PNG/WebP file.</p>
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-2">Detailed Description</label>
                  <textarea required rows={3} value={formState.description} onChange={e => setFormState({...formState, description: e.target.value})} placeholder="What makes this guard special?..." className="w-full p-3 rounded-xl bg-slate-100 border-none outline-none focus:ring-red-500 ring-2 ring-transparent transition-all font-medium" />
                </div>
                
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-2">Key Features (comma separated)</label>
                  <input type="text" value={formState.features} onChange={e => setFormState({...formState, features: e.target.value})} placeholder="e.g. 4K Clarity, Zero Bubbles, Anti-Smudge..." className="w-full p-3 rounded-xl bg-slate-100 border-none outline-none focus:ring-red-500 ring-2 ring-transparent transition-all font-medium" />
                </div>
              </div>
            </form>

            <div className="p-6 border-t bg-slate-50 flex gap-4">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-bold text-slate-600 hover:bg-slate-200 rounded-2xl transition-all">Cancel</button>
              <button onClick={handleSaveProduct} className="flex-1 py-4 font-bold text-white bg-red-600 hover:bg-red-700 rounded-2xl shadow-lg shadow-red-500/20 transition-all active:scale-95">
                {editingProductId ? 'Update Product' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
