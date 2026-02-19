
import React, { useState } from 'react';
import { Lock, User, AlertCircle, ChevronRight, TrendingUp, Key } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (user: string, pass: string) => boolean;
  onCancel: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(username, password)) {
      setError(false);
    } else {
      setError(true);
    }
  };

  const fillDemo = () => {
    setUsername('admin');
    setPassword('admin123');
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="p-10 text-center bg-slate-50 border-b">
          <div className="flex justify-center mb-6">
             <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-red-500/40 transform rotate-3 hover:rotate-0 transition-transform cursor-pointer group">
               <TrendingUp className="text-white w-10 h-10 group-hover:scale-110 transition-transform" />
             </div>
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-slate-900">
            SAFIO<span className="text-red-600">.IN</span> <span className="text-slate-400 font-light">PRO</span>
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">Dashboard Authentication</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-bold">Invalid username or password.</p>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Identity</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-100 rounded-2xl border-none outline-none ring-2 ring-transparent focus:ring-red-500 transition-all text-slate-900 font-medium"
                  placeholder="Username"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Access Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-100 rounded-2xl border-none outline-none ring-2 ring-transparent focus:ring-red-500 transition-all text-slate-900 font-medium"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-5 rounded-[20px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 group shadow-xl shadow-red-500/20"
          >
            Enter Dashboard <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="flex flex-col gap-3 pt-2">
            <button 
              type="button"
              onClick={fillDemo}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-colors border border-slate-200"
            >
              <Key className="w-3 h-3" /> Quick Fill Demo Credentials
            </button>
            <button 
              type="button"
              onClick={onCancel}
              className="text-xs text-slate-400 font-bold hover:text-red-500 transition-colors uppercase tracking-widest"
            >
              Back to Safio Store
            </button>
          </div>
        </form>

        <div className="p-4 bg-slate-900 text-center">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                Protected by Safio Security Protocol v2.4
            </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
