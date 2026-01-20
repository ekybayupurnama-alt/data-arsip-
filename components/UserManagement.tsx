
import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  ChevronDown, 
  Edit, 
  Trash2, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Mail,
  ShieldCheck,
  Save,
  X,
  Loader2,
  User as UserIcon,
  Briefcase
} from 'lucide-react';
import { User, Role } from '../types';

interface UserManagementProps {
  users: User[];
  onAddUser: (user: { name: string; email: string; role: Role }) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onAddUser, onUpdateUser, onDeleteUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'USER' as Role });

  const openModal = (user: User | null = null) => {
    setEditingUser(user);
    setFormData(user ? { name: user.name, email: user.email, role: user.role } : { name: '', email: '', role: 'USER' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      onUpdateUser({ ...editingUser, ...formData });
    } else {
      onAddUser(formData);
    }
    closeModal();
  };
  
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const statusStyles = {
    Active: { dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
    Invited: { dot: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
    Suspended: { dot: 'bg-rose-500', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100' },
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Manajemen Pengguna</h1>
          <p className="text-slate-400 text-sm font-medium mt-1">Kelola staf dan administrator yang memiliki akses ke platform.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-[0.15em] hover:bg-primary-hover transition-all shadow-xl active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengguna</span>
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300" />
            <input 
              type="text" 
              placeholder="Cari berdasarkan nama atau email..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-sm" 
            />
          </div>
          <div className="relative min-w-[200px]">
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="appearance-none w-full pl-6 pr-12 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-700 uppercase tracking-widest outline-none shadow-sm cursor-pointer focus:border-primary">
              <option value="ALL">Semua Peran</option>
              <option value="ADMIN">Administrator</option>
              <option value="USER">User</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 text-[10px] font-black uppercase tracking-[0.15em] border-b border-slate-100">
                <th className="px-8 py-6">Identitas Pengguna</th>
                <th className="px-8 py-6">Hak Akses</th>
                <th className="px-8 py-6">Status Akun</th>
                <th className="px-8 py-6">Tanggal Bergabung</th>
                <th className="px-8 py-6 text-center">Operasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-primary-light transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-primary text-lg border border-slate-200 shadow-sm shrink-0">
                        {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-2xl" /> : user.name.charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-black text-sm text-slate-800 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter border ${
                      user.role === 'ADMIN' 
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-100' 
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {user.role === 'ADMIN' ? <ShieldCheck className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                      <span>{user.role}</span>
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter border ${statusStyles[user.status].bg} ${statusStyles[user.status].text} ${statusStyles[user.status].border}`}>
                       <div className={`w-1.5 h-1.5 rounded-full ${statusStyles[user.status].dot}`}></div>
                       <span>{user.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-xs text-slate-500 font-medium">{new Date(user.joinDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal(user)} className="p-2.5 bg-white text-amber-500 rounded-xl border border-slate-100 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all shadow-sm active:scale-95" title="Edit Pengguna">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDeleteUser(user.id)} className="p-2.5 bg-white text-rose-600 rounded-xl border border-slate-100 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all shadow-sm active:scale-95" title="Hapus Pengguna">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={closeModal}></div>
          <div className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-slideUp">
            <div className="p-8 bg-slate-50 border-b border-slate-100 flex items-center space-x-4">
              <div className={`p-3 rounded-2xl ${editingUser ? 'bg-amber-100 text-amber-600' : 'bg-primary-light text-primary'}`}>
                {editingUser ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">{editingUser ? 'Edit Detail Pengguna' : 'Tambah Pengguna Baru'}</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">{editingUser ? 'Perbarui informasi dan hak akses pengguna.' : 'Undang anggota tim baru ke platform.'}</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Lengkap</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3 bg-slate-100 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alamat Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-3 bg-slate-100 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Peran / Hak Akses</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as Role})} className="w-full px-5 py-3 bg-slate-100 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary font-bold appearance-none">
                  <option value="USER">User (Akses Terbatas)</option>
                  <option value="ADMIN">Administrator (Akses Penuh)</option>
                </select>
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button type="button" onClick={closeModal} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Batal</button>
                <button type="submit" className="px-6 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all">
                  {editingUser ? 'Simpan Perubahan' : 'Kirim Undangan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp { from { transform: translateY(20px) scale(0.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        .animate-slideUp { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default UserManagement;
