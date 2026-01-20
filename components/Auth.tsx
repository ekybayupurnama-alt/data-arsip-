
import React, { useState } from 'react';
import { 
  Files, 
  ShieldCheck, 
  UserCheck, 
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  UserPlus,
  ArrowLeft,
  User as UserIcon
} from 'lucide-react';
import { Role, User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onRegister }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('ADMIN');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const LOGO_URL = 'https://iili.io/f5dXVCF.png';

  const handleLogin = () => {
    const user: User = {
      id: selectedRole === 'ADMIN' ? 'admin-1' : 'user-2', // Using IDs from constants for consistency
      name: selectedRole === 'ADMIN' ? 'Administrator Utama' : 'Budi Hartono',
      email: selectedRole === 'ADMIN' ? 'admin@ypib.ac.id' : 'budi.hartono@ypib.ac.id',
      role: selectedRole,
      status: 'Active',
      joinDate: '2023-01-15',
      avatar: `https://i.pravatar.cc/150?u=${selectedRole === 'ADMIN' ? 'admin-1' : 'user-2'}`
    };
    onLogin(user);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      role: selectedRole,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
    };
    onRegister(newUser);
    onLogin(newUser);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 min-h-[600px]">
        {/* Left Side: Info */}
        <div className="p-12 bg-indigo-700 text-white flex flex-col justify-between relative overflow-hidden transition-colors duration-700">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-10">
              <img src={LOGO_URL} className="w-14 h-14 object-contain" alt="Logo YPIB" />
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight leading-none">DATA ARSIP</span>
                <span className="text-xs font-bold text-indigo-200 mt-1 uppercase tracking-widest">UNIV YPIB MAJALENGKA</span>
              </div>
            </div>
            <h1 className="text-3xl font-black leading-tight mb-4">
              {isRegistering ? "Pendaftaran Akses Baru" : "Sistem Digitalisasi Arsip Terpadu"}
            </h1>
            <p className="text-indigo-100 text-base opacity-80 leading-relaxed">
              {isRegistering 
                ? "Daftarkan akun staf atau administrasi Anda untuk memulai manajemen dokumen digital berbasis cloud di lingkungan Universitas YPIB."
                : "Optimalkan manajemen dokumen kampus dengan integrasi kecerdasan buatan untuk pengarsipan yang lebih aman dan terorganisir."}
            </p>
          </div>

          <div className="relative z-10 pt-12 space-y-6">
            <div className="flex items-center space-x-2 text-indigo-300">
              <Sparkles className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Teknologi Cerdas Gemini AI</span>
            </div>
            <div className="p-6 bg-white/10 rounded-3xl border border-white/10 backdrop-blur-md">
              <p className="text-xs font-bold italic">"Memudahkan pencarian dokumen akreditasi, kepegawaian, dan kemahasiswaan dalam satu platform terpusat."</p>
              <p className="text-[10px] mt-2 opacity-50 uppercase tracking-widest">— Biro Administrasi Akademik</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-12 flex flex-col justify-center animate-fadeIn">
          {isRegistering ? (
            <div className="space-y-8">
              <div>
                <button onClick={() => setIsRegistering(false)} className="flex items-center space-x-2 text-indigo-600 font-bold text-sm mb-6 hover:translate-x-1 transition-transform">
                  <ArrowLeft className="w-4 h-4" /> <span>Kembali ke Login</span>
                </button>
                <h2 className="text-2xl font-black text-slate-800 mb-2">Buat Akun Staf</h2>
                <p className="text-slate-400 text-sm">Lengkapi data di bawah ini untuk mendaftar ke sistem.</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Lengkap</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      required
                      type="text" 
                      placeholder="Masukkan nama lengkap..."
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alamat Email Institusi</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      required
                      type="email" 
                      placeholder="staf@ypib.ac.id"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Level Hak Akses</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setSelectedRole('ADMIN')} className={`py-3 rounded-xl border-2 font-bold text-xs transition-all ${selectedRole === 'ADMIN' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-400'}`}>ADMIN</button>
                    <button type="button" onClick={() => setSelectedRole('USER')} className={`py-3 rounded-xl border-2 font-bold text-xs transition-all ${selectedRole === 'USER' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-400'}`}>USER</button>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-bold flex items-center justify-center space-x-2 hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all group mt-6"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Daftarkan Akun</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-black text-slate-800 mb-2">Portal Login</h2>
                <p className="text-slate-400 text-sm">Selamat datang kembali di sistem kearsipan Universitas YPIB.</p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => setSelectedRole('ADMIN')}
                  className={`w-full p-5 rounded-3xl border-2 transition-all flex items-center space-x-4 ${
                    selectedRole === 'ADMIN' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 hover:border-indigo-200'
                  }`}
                >
                  <div className={`p-3 rounded-2xl ${selectedRole === 'ADMIN' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-800">Administrator</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kelola Seluruh Struktur & User</p>
                  </div>
                </button>

                <button 
                  onClick={() => setSelectedRole('USER')}
                  className={`w-full p-5 rounded-3xl border-2 transition-all flex items-center space-x-4 ${
                    selectedRole === 'USER' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 hover:border-indigo-200'
                  }`}
                >
                  <div className={`p-3 rounded-2xl ${selectedRole === 'USER' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-800">Staf Pengguna</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Akses Lihat & Unduh Dokumen</p>
                  </div>
                </button>
              </div>

              <div className="space-y-4 pt-4">
                <button 
                  onClick={handleLogin}
                  className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-bold flex items-center justify-center space-x-2 hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all group"
                >
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="text-center">
                  <span className="text-xs text-slate-400 font-medium">Butuh akun baru? </span>
                  <button onClick={() => setIsRegistering(true)} className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">Daftar Di Sini</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
