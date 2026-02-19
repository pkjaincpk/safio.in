
import React, { useState } from 'react';
import { ShoppingCart, Shield, Eye, Lock, Zap, Search, ChevronRight } from 'lucide-react';
import { Product, CartItem } from '../types';
import { BRANDS } from '../constants';

interface StorefrontProps {
  products: Product[];
  addToCart: (item: CartItem) => void;
  openCart: () => void;
  cartCount: number;
}

const Storefront: React.FC<StorefrontProps> = ({ products, addToCart, openCart, cartCount }) => {
  const [selectedBrand, setSelectedBrand] = useState(BRANDS[0].brand);
  const [selectedModel, setSelectedModel] = useState(BRANDS[0].models[0]);
  const [filterType, setFilterType] = useState<'All' | 'Privacy' | 'Blue Light' | 'Self-Healing'>('All');

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: `${product.id}-${selectedModel}`,
      productId: product.id,
      productName: product.name,
      type: product.type,
      model: selectedModel,
      price: product.basePrice,
      quantity: 1,
      imageUrl: product.imageUrl
    });
  };

  const filteredProducts = products.filter(p => {
    const brandMatch = p.brand === selectedBrand;
    const typeMatch = filterType === 'All' || p.type === filterType;
    return brandMatch && typeMatch;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center bg-gradient-to-br from-slate-950 to-red-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-red-600 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600 rounded-full blur-[120px]"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl border border-white/20">
               <span className="text-4xl font-black tracking-tighter flex items-center gap-2">
                 SAFIO<span className="text-red-500">.IN</span>
               </span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">Shield Your <span className="text-red-500">Laptop</span></h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">Premium laptop screen guards engineered for clarity and eye-health. High-precision protection by Safio.in.</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <div className="flex bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20">
              <select 
                value={selectedBrand} 
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  const brand = BRANDS.find(b => b.brand === e.target.value);
                  if (brand) setSelectedModel(brand.models[0]);
                }}
                className="bg-transparent text-white p-3 outline-none cursor-pointer border-r border-white/10"
              >
                {BRANDS.map(b => <option key={b.brand} value={b.brand} className="text-black font-bold">{b.brand}</option>)}
              </select>
              <select 
                value={selectedModel} 
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-transparent text-white p-3 outline-none cursor-pointer"
              >
                {BRANDS.find(b => b.brand === selectedBrand)?.models.map(m => (
                  <option key={m} value={m} className="text-black font-bold">{m}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-red-600/25 flex items-center justify-center gap-2"
            >
              Shop {selectedBrand} Guards <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: <Lock className="text-red-500" />, title: "Secure Checkout", desc: "PCI Compliant" },
            { icon: <Zap className="text-red-500" />, title: "Fast Delivery", desc: "Ships in 24h" },
            { icon: <Shield className="text-red-500" />, title: "3 Month Warranty", desc: "Defects coverage" },
            { icon: <Eye className="text-red-500" />, title: "Full Clarity", desc: "4K Optimized" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-3">
                {item.icon}
              </div>
              <h3 className="font-bold text-slate-800">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <section id="products" className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Safio.in {selectedBrand} Collection</h2>
            <p className="text-slate-500">Selected for: <span className="text-red-600 font-semibold">{selectedModel}</span></p>
          </div>
          <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
            {['All', 'Privacy', 'Blue Light', 'Self-Healing'].map((filter: any) => (
              <button 
                key={filter} 
                onClick={() => setFilterType(filter)}
                className={`px-4 py-2 rounded-md transition-all text-sm font-bold ${filterType === filter ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredProducts.map(product => {
              const stockLevel = product.stock[selectedModel] || 0;
              return (
                <div key={product.id} className="group bg-white rounded-3xl border border-slate-100 overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1">
                  <div className="relative h-64 overflow-hidden">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase text-slate-900 shadow-sm">
                        {product.brand}
                      </span>
                      <span className="bg-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase text-white shadow-sm">
                        {product.type}
                      </span>
                    </div>
                    {stockLevel <= 5 && stockLevel > 0 && (
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                          Low Stock: {stockLevel} units
                        </span>
                      </div>
                    )}
                    {stockLevel === 0 && (
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                        <span className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold">Out of Stock for {selectedModel}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="space-y-2 mb-6">
                      {product.features.map(f => (
                        <div key={f} className="flex items-center gap-2 text-xs text-slate-600">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                          {f}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-slate-400 block">Unit Price</span>
                        <span className="text-2xl font-bold text-slate-900">₹{product.basePrice.toLocaleString('en-IN')}</span>
                      </div>
                      <button 
                        disabled={stockLevel === 0}
                        onClick={() => handleAddToCart(product)}
                        className="bg-slate-900 hover:bg-red-600 text-white p-4 rounded-2xl transition-all active:scale-95 group-hover:bg-red-600 disabled:bg-slate-200"
                      >
                        <ShoppingCart className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
            <h3 className="text-2xl font-bold text-slate-400">No {filterType !== 'All' ? filterType : ''} guards currently listed for {selectedBrand}.</h3>
            <p className="text-slate-400 mt-2">Try another brand or check back later!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Storefront;
