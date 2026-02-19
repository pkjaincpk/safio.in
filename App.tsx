
import React, { useState, useEffect } from 'react';
import { ShoppingCart, LayoutDashboard, Store, ShieldCheck } from 'lucide-react';
import Storefront from './components/Storefront';
import AdminPanel from './components/AdminPanel';
import CartDrawer from './components/CartDrawer';
import AIAssistant from './components/AIAssistant';
import AdminLogin from './components/AdminLogin';
import { Product, CartItem } from './types';
import { INITIAL_PRODUCTS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<'store' | 'admin'>('store');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Persistence (Mock)
  useEffect(() => {
    const saved = localStorage.getItem('safio_products');
    if (saved) setProducts(JSON.parse(saved));
    
    // Check if was authenticated in this session
    const auth = sessionStorage.getItem('safio_auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('safio_products', JSON.stringify(products));
  }, [products]);

  const handleAdminClick = () => {
    if (view === 'admin') {
      setView('store');
      return;
    }

    if (isAuthenticated) {
      setView('admin');
    } else {
      setShowLogin(true);
    }
  };

  const handleLogin = (user: string, pass: string) => {
    const storedCreds = localStorage.getItem('safio_admin_creds');
    let validUser = 'admin';
    let validPass = 'admin123';

    if (storedCreds) {
      const { username, password } = JSON.parse(storedCreds);
      validUser = username;
      validPass = password;
    }

    if (user === validUser && pass === validPass) {
      setIsAuthenticated(true);
      setShowLogin(false);
      setView('admin');
      sessionStorage.setItem('safio_auth', 'true');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('store');
    sessionStorage.removeItem('safio_auth');
  };

  const addToCart = (newItem: CartItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === newItem.id);
      if (existing) {
        return prev.map(item => item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateStock = (productId: string, model: string, newStock: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, stock: { ...p.stock, [model]: newStock } };
      }
      return p;
    }));
  };

  const addProduct = (newProduct: Product) => {
    setProducts(prev => [...prev, newProduct]);
  };

  const editProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="relative">
      {/* Persistent Brand Badge - Top Left */}
      <div className="fixed top-6 left-6 z-50 pointer-events-none md:pointer-events-auto">
        <div 
          onClick={() => setView('store')}
          className="glass border border-slate-200/50 p-2 pr-5 rounded-2xl shadow-2xl flex items-center gap-3 cursor-pointer group hover:bg-white transition-all active:scale-95 border-l-4 border-l-red-600"
        >
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:rotate-6 transition-transform">
             <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter leading-none text-slate-900">
              SAFIO<span className="text-red-600">.IN</span>
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Premium Guards</span>
          </div>
        </div>
      </div>

      {/* Navigation Toggles - Top Right */}
      <nav className="fixed top-6 right-6 z-50 flex gap-2">
        <button 
          onClick={handleAdminClick}
          className="glass border border-slate-200 p-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold hover:bg-white transition-all active:scale-95"
        >
          {view === 'store' ? <LayoutDashboard className="w-5 h-5 text-red-600" /> : <Store className="w-5 h-5 text-red-600" />}
          <span className="hidden md:inline">{view === 'store' ? 'Admin Panel' : 'Back to Store'}</span>
        </button>
        {view === 'store' && (
          <button 
            onClick={() => setIsCartOpen(true)}
            className="glass border border-slate-200 p-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold hover:bg-white transition-all active:scale-95 relative"
          >
            <ShoppingCart className="w-5 h-5 text-slate-800" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
            <span className="hidden md:inline">Cart</span>
          </button>
        )}
      </nav>

      {view === 'store' ? (
        <Storefront 
          products={products} 
          addToCart={addToCart} 
          openCart={() => setIsCartOpen(true)}
          cartCount={cartCount}
        />
      ) : (
        <AdminPanel 
          products={products} 
          updateStock={updateStock} 
          addProduct={addProduct} 
          editProduct={editProduct}
          onLogout={handleLogout} 
        />
      )}

      {showLogin && (
        <AdminLogin onLogin={handleLogin} onCancel={() => setShowLogin(false)} />
      )}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        items={cart}
        updateQuantity={updateCartQuantity}
        removeItem={removeFromCart}
        clearCart={() => setCart([])}
      />

      {view === 'store' && <AIAssistant />}
      
      {/* Footer */}
      {view === 'store' && (
        <footer className="bg-slate-950 text-slate-400 py-12 px-4 border-t border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2 text-white font-bold text-2xl">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">S</div>
              Safio.in
            </div>
            <div className="flex gap-8 text-sm">
              <a href="#" className="hover:text-red-500 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-red-500 transition-colors">Refund Policy</a>
              <a href="#" className="hover:text-red-500 transition-colors cursor-pointer" onClick={() => setShowLogin(true)}>Staff Login</a>
            </div>
            <p className="text-xs">© 2024 Safio.in Premium Screen Guards. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
