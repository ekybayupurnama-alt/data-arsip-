
import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  Key, 
  Save, 
  CheckCircle2,
  Camera,
  AlertCircle
} from 'lucide-react';
import { User } from '../types';

interface ProfileProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ ...user, name, email });
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-20">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-indigo-800 relative">
          <div className="absolute -bottom-12 left-8 flex items-end space-x-4">
            <div className="relative group">
              <div className="w-24 h-24 bg-white rounded-[2rem] p-1 shadow-xl">
                <div className="w-full h-full bg-indigo-50 rounded-[1.8rem] flex items-center justify-center text-indigo-600 text-3xl font-black">
                  {name.charAt(0)}
                </div>
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white text-slate-600 rounded-xl shadow-lg border border-slate-100 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="pb-2">
              <h2 className="text-2xl font-black text-slate-800">{name}</h2>
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {user.role}
                </span>
                <span className="text-xs text-slate-400 font-medium">{email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 pt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                    <UserIcon className="w-3 h-3" />
                    <span>Nama Lengkap</span>
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold text-slate-700"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                    <Mail className="w-3 h-3" />
                    <span>Alamat Email</span>
                  </label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold text-slate-700"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50">
                <button 
                  type="submit"
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center space-x-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                >
                  <Save className="w-5 h-5" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>

              {isSuccess && (
                <div className="flex items-center space-x-2 text-emerald-600 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-bold">Profil berhasil diperbarui secara lokal!</span>
                </div>
              )}
            </form>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center space-x-2">
                <Key className="w-4 h-4 text-indigo-600" />
                <span>Keamanan</span>
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Terakhir kali mengganti kata sandi: <span className="font-bold text-slate-700">14 hari yang lalu</span>.
              </p>
              <button className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all">
                Ganti Kata Sandi
              </button>
            </div>

            <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
              <h4 className="text-sm font-black text-indigo-900 uppercase tracking-widest mb-4 flex items-center space-x-2">
                <Shield className="w-4 h-4 text-indigo-600" />
                <span>Hak Akses</span>
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-indigo-700 font-medium">Baca Dokumen</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-indigo-700 font-medium">Unduh Dokumen</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-indigo-700 font-medium">Hapus/Edit</span>
                  {user.role === 'ADMIN' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-slate-300" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
