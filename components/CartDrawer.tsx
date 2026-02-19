
import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, CreditCard, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, updateQuantity, removeItem, clearCart }) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    setStep('checkout');
  };

  const handlePayment = () => {
    setTimeout(() => {
      setStep('success');
      clearCart();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="w-6 h-6" />
            {step === 'cart' ? 'Your Cart' : step === 'checkout' ? 'Checkout' : 'Order Confirmed'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          {step === 'cart' && (
            items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Your cart is empty</h3>
                <p className="text-slate-500 mb-6">Looks like you haven't added any screen guards yet.</p>
                <button onClick={onClose} className="text-red-600 font-bold">Start Shopping</button>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 p-4 bg-slate-50 rounded-2xl">
                    <img src={item.imageUrl} className="w-20 h-20 object-cover rounded-xl" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold">{item.productName}</h4>
                        <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-slate-500 mb-2">{item.model} • {item.type}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center bg-white rounded-lg border border-slate-200">
                          <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 hover:bg-slate-50">-</button>
                          <span className="px-3 font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 hover:bg-slate-50">+</button>
                        </div>
                        <span className="font-bold text-lg">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {step === 'checkout' && (
            <div className="space-y-6">
              <div className="bg-red-50 p-6 rounded-2xl">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-red-600" /> Payment Details
                </h3>
                <div className="space-y-4">
                  <input type="text" placeholder="Card Number" className="w-full p-3 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-500 outline-none" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="MM/YY" className="w-full p-3 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-500 outline-none" />
                    <input type="text" placeholder="CVC" className="w-full p-3 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-500 outline-none" />
                  </div>
                </div>
              </div>
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between font-bold text-xl pt-2 border-t">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
              <CheckCircle2 className="w-20 h-20 text-green-500 mb-2" />
              <h3 className="text-2xl font-bold">Order Confirmed!</h3>
              <p className="text-slate-500">Your screen guards are being prepared for dispatch. We've sent a receipt to your email.</p>
              <button 
                onClick={() => { setStep('cart'); onClose(); }}
                className="bg-slate-900 text-white w-full py-4 rounded-xl font-bold mt-8"
              >
                Done
              </button>
            </div>
          )}
        </div>

        {items.length > 0 && step !== 'success' && (
          <div className="p-6 border-t bg-slate-50">
            <div className="flex justify-between mb-4">
              <span className="text-slate-500">Total Amount</span>
              <span className="text-2xl font-bold">₹{total.toLocaleString('en-IN')}</span>
            </div>
            {step === 'cart' ? (
              <button onClick={handleCheckout} className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all">
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button onClick={handlePayment} className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all">
                Complete Payment
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
