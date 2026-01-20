
import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Palette, 
  Menu as MenuIcon, 
  Users, 
  Save, 
  CheckCircle2,
  LayoutDashboard,
  FolderTree,
  Tags,
  UploadCloud,
  Search,
  Database,
  User as UserIcon,
  Smartphone,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  GripVertical,
  Activity,
  History,
  Type,
  Layout as LayoutIcon,
  RefreshCcw,
  // Added missing icon imports to fix build errors
  Edit,
  UserPlus,
  Download,
  Trash2,
  Clock
} from 'lucide-react';
import { AppSettings as AppSettingsType, User, ViewType } from '../types';

interface AppSettingsProps {
  settings: AppSettingsType;
  onUpdateSettings: (settings: AppSettingsType) => void;
}

const iconMap: Record<string, any> = {
  LayoutDashboard, FolderTree, Tags, UploadCloud, Search, Database, UserIcon
};

const AppSettings: React.FC<AppSettingsProps> = ({ settings, onUpdateSettings }) => {
  const [activeTab, setActiveTab] = useState<'SYSTEM' | 'MENU' | 'LOGS'>('SYSTEM');
  const [localSettings, setLocalSettings] = useState<AppSettingsType>(settings);
  const [isSaved, setIsSaved] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Sync with prop if it changes externally
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const colors: { id: AppSettingsType['themeColor']; class: string; label: string; hex: string }[] = [
    { id: 'indigo', class: 'bg-indigo-600', hex: '#4f46e5', label: 'Indigo' },
    { id: 'emerald', class: 'bg-emerald-600', hex: '#059669', label: 'Emerald' },
    { id: 'rose', class: 'bg-rose-600', hex: '#e11d48', label: 'Professional Rose' },
    { id: 'amber', class: 'bg-amber-600', hex: '#d97706', label: 'Modern Amber' },
    { id: 'slate', class: 'bg-slate-600', hex: '#475569', label: 'Corporate Slate' },
  ];

  const handleSave = () => {
    if (!localSettings.appName.trim()) return;
    onUpdateSettings(localSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const toggleMenuVisibility = (menuId: ViewType) => {
    const updatedMenus = localSettings.menus.map(m => 
      m.id === menuId ? { ...m, show: !m.show } : m
    );
    setLocalSettings({ ...localSettings, menus: updatedMenus });
  };

  const updateMenuLabel = (menuId: ViewType, newLabel: string) => {
    const updatedMenus = localSettings.menus.map(m => 
      m.id === menuId ? { ...m, label: newLabel } : m
    );
    setLocalSettings({ ...localSettings, menus: updatedMenus });
  };

  const handleReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      setLocalSettings(settings);
      setIsResetting(false);
    }, 500);
  };

  const activeColorHex = colors.find(c => c.id === localSettings.themeColor)?.hex || '#4f46e5';

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-24">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Pusat Pengaturan Sistem</h1>
          <p className="text-slate-400 text-sm font-medium mt-1">Konfigurasi identitas, tema, dan manajemen akses platform.</p>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={handleReset}
             disabled={isResetting}
             className="px-4 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
           >
             <RefreshCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
             <span>Reset Perubahan</span>
           </button>
           <button 
             onClick={handleSave}
             className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
           >
             <Save className="w-4 h-4" />
             <span>Simpan Konfigurasi</span>
           </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        {/* Tabs Header */}
        <div className="flex border-b border-slate-100 overflow-x-auto no-scrollbar bg-slate-50/30">
          {[
            { id: 'SYSTEM', label: 'Sistem & Tema', icon: Palette },
            { id: 'MENU', label: 'Pengaturan Menu', icon: MenuIcon },
            { id: 'LOGS', label: 'Log Aktivitas', icon: History },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-[140px] py-6 flex items-center justify-center space-x-3 transition-all border-b-4 ${
                  activeTab === tab.id ? 'border-primary text-primary bg-white' : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-black text-[11px] uppercase tracking-widest">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-10">
          {activeTab === 'SYSTEM' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-10">
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Type className="w-4 h-4" /></div>
                    <h3 className="text-lg font-black text-slate-800">Identitas Aplikasi</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nama Platform / Institusi</label>
                      <input 
                        type="text" 
                        placeholder="Contoh: DATA ARSIP UNIVERSITAS YPIB"
                        value={localSettings.appName}
                        onChange={(e) => setLocalSettings({...localSettings, appName: e.target.value})}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-slate-700 text-sm shadow-inner"
                      />
                      <p className="text-[9px] text-slate-400 font-medium">Nama ini akan muncul pada header, sidebar, dan judul halaman.</p>
                    </div>
                  </div>
                </section>

                <section>
                   <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Palette className="w-4 h-4" /></div>
                    <h3 className="text-lg font-black text-slate-800">Personalisasi Tema</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {colors.map(color => (
                      <button
                        key={color.id}
                        onClick={() => setLocalSettings({...localSettings, themeColor: color.id})}
                        className={`p-5 rounded-[1.5rem] border-2 transition-all flex flex-col items-center space-y-3 group ${
                          localSettings.themeColor === color.id 
                          ? 'border-primary bg-primary/5 shadow-md scale-[1.02]' 
                          : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-[1rem] ${color.class} shadow-lg shadow-black/10 group-hover:rotate-6 transition-transform`}></div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{color.label}</span>
                        {localSettings.themeColor === color.id && <CheckCircle2 className="w-4 h-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Smartphone className="w-4 h-4" /></div>
                  <h3 className="text-lg font-black text-slate-800">Pratinjau Visual</h3>
                </div>
                <div className="bg-slate-900 rounded-[2.5rem] p-10 border border-slate-800 shadow-2xl relative overflow-hidden group">
                  {/* Glassmorphism elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                  
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center space-x-3 text-white border-b border-white/10 pb-6 mb-2">
                       <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                          <LayoutIcon className="w-5 h-5" style={{ color: activeColorHex }} />
                       </div>
                       <div className="overflow-hidden">
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest truncate">Sidebar Brand</p>
                          <p className="text-xs font-black truncate">{localSettings.appName || 'Nama Aplikasi'}</p>
                       </div>
                    </div>

                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-white/5 border-l-4 shadow-xl backdrop-blur-md flex items-center justify-between" style={{ borderColor: activeColorHex }}>
                        <div className="flex items-center space-x-3">
                          <LayoutDashboard className="w-4 h-4" style={{ color: activeColorHex }} />
                          <span className="text-xs font-bold text-white">Dashboard Overview</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-white/20" />
                      </div>
                      
                      <div className="p-4 rounded-2xl bg-white shadow-lg flex items-center justify-between group-hover:-translate-y-1 transition-transform">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${activeColorHex}20` }}>
                             <FolderTree className="w-4 h-4" style={{ color: activeColorHex }} />
                          </div>
                          <span className="text-xs font-bold text-slate-700">Manajemen Arsip</span>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">12</div>
                      </div>
                    </div>

                    <button 
                      className="w-full py-4 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl transition-all hover:brightness-110 active:scale-95"
                      style={{ backgroundColor: activeColorHex, boxShadow: `0 10px 25px -5px ${activeColorHex}40` }}
                    >
                      Tombol Simulasikan
                    </button>
                  </div>
                </div>
                <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start gap-3">
                   <ShieldCheck className="w-5 h-5 text-indigo-500 mt-0.5" />
                   <p className="text-[10px] text-indigo-700 font-medium leading-relaxed uppercase tracking-wide">
                     Pilih skema warna yang sesuai dengan identitas institusi untuk menjaga konsistensi branding di seluruh platform.
                   </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'MENU' && (
            <div className="space-y-8 animate-slideUp">
              <div className="flex justify-between items-center mb-4">
                <div>
                   <h3 className="text-xl font-black text-slate-800">Navigasi Dinamis</h3>
                   <p className="text-sm text-slate-400 mt-1">Aktifkan atau nonaktifkan modul navigasi dan ubah label tampilan.</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                   <div className="px-3 py-1 bg-white text-[10px] font-black uppercase text-slate-500 rounded-lg shadow-sm border border-slate-100">Drag to reorder</div>
                </div>
              </div>
              
              <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <tr>
                        <th className="px-8 py-5">Struktur Menu</th>
                        <th className="px-8 py-5">Tampilan Label</th>
                        <th className="px-8 py-5 text-center">Visibilitas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {localSettings.menus.map(menu => {
                        const Icon = iconMap[menu.icon] || Settings;
                        return (
                          <tr key={menu.id} className="hover:bg-blue-50/20 transition-all group">
                            <td className="px-8 py-5">
                              <div className="flex items-center space-x-5">
                                <div className="p-1 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity">
                                   <GripVertical className="w-4 h-4 text-slate-300" />
                                </div>
                                <div className={`p-3 rounded-xl transition-all shadow-sm border ${menu.show ? 'bg-white border-slate-100 text-primary' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="overflow-hidden">
                                   <p className={`text-xs font-black uppercase tracking-tight ${menu.show ? 'text-slate-700' : 'text-slate-300'}`}>{menu.id}</p>
                                   <p className="text-[9px] text-slate-400 font-medium">Internal Module ID</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="relative max-w-xs group/input">
                                <input 
                                  type="text" 
                                  value={menu.label}
                                  disabled={!menu.show}
                                  onChange={(e) => updateMenuLabel(menu.id, e.target.value)}
                                  className={`w-full bg-transparent border-b-2 outline-none font-bold text-xs transition-all py-1 ${
                                    menu.show 
                                    ? 'border-transparent group-hover/input:border-slate-200 focus:border-primary text-slate-700' 
                                    : 'border-transparent text-slate-300'
                                  }`}
                                />
                                {menu.show && <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover/input:opacity-100 transition-opacity"><Edit className="w-3 h-3 text-slate-300" /></div>}
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex justify-center">
                                <button 
                                  onClick={() => toggleMenuVisibility(menu.id)}
                                  className={`transition-transform active:scale-90`}
                                >
                                  {menu.show ? (
                                    <ToggleRight className="w-10 h-10 text-primary" />
                                  ) : (
                                    <ToggleLeft className="w-10 h-10 text-slate-200" />
                                  )}
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
            </div>
          )}

          {activeTab === 'LOGS' && (
            <div className="space-y-8 animate-slideUp">
              <div className="flex justify-between items-center mb-4">
                <div>
                   <h3 className="text-xl font-black text-slate-800">Jejak Audit (Audit Trail)</h3>
                   <p className="text-sm text-slate-400 mt-1">Rekaman kronologis seluruh aktivitas sistem untuk transparansi data.</p>
                </div>
                <div className="flex items-center gap-3">
                   <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50 transition-all">
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Log</span>
                   </button>
                   <button className="flex items-center space-x-2 px-4 py-2 bg-rose-50 border border-rose-100 rounded-xl text-[10px] font-black uppercase text-rose-600 hover:bg-rose-600 hover:text-white transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear History</span>
                   </button>
                </div>
              </div>
              <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest sticky top-0 z-10 border-b border-slate-100">
                      <tr>
                        <th className="px-8 py-5">Waktu Akses</th>
                        <th className="px-8 py-5">Identitas Aktor</th>
                        <th className="px-8 py-5">Modifikasi / Aksi</th>
                        <th className="px-8 py-5">Rincian Perubahan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {localSettings.auditLogs.map((log, idx) => (
                        <tr key={log.id} className={`transition-colors text-[11px] ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'} hover:bg-blue-50/30`}>
                          <td className="px-8 py-5 text-slate-400 font-bold whitespace-nowrap flex items-center gap-2">
                             <Clock className="w-3 h-3 opacity-50" />
                             {log.timestamp}
                          </td>
                          <td className="px-8 py-5">
                             <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-lg bg-slate-200 flex items-center justify-center text-[9px] font-black text-slate-500 uppercase">{log.userName.charAt(0)}</div>
                                <span className="font-black text-slate-700">{log.userName}</span>
                             </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                              log.action === 'LOGIN' ? 'bg-emerald-100 text-emerald-700' :
                              log.action === 'DELETE' ? 'bg-rose-100 text-rose-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {log.action}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-slate-500 font-medium italic">
                             {log.details}
                          </td>
                        </tr>
                      ))}
                      {localSettings.auditLogs.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-8 py-20 text-center">
                             <div className="flex flex-col items-center opacity-10">
                                <Activity className="w-16 h-16 mb-4" />
                                <p className="text-sm font-black uppercase tracking-[0.2em]">Belum Ada Aktivitas</p>
                             </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Persistent Save Section */}
          <div className="mt-16 pt-10 border-t border-slate-100 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center space-x-2 min-h-[48px]">
              {isSaved && (
                <div className="flex items-center space-x-3 text-emerald-600 animate-fadeIn bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 shadow-sm">
                  <div className="p-1 bg-emerald-500 text-white rounded-full"><CheckCircle2 className="w-4 h-4" /></div>
                  <span className="text-sm font-black uppercase tracking-tight">Perubahan Berhasil Disimpan ke Institusi</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
               <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status Sinkronisasi</p>
                  <p className="text-xs font-bold text-slate-700">Database Lokal (Simulated Cloud)</p>
               </div>
               <button 
                onClick={handleSave}
                className="px-10 py-5 bg-primary text-white rounded-[1.5rem] font-black uppercase tracking-[0.15em] text-xs shadow-2xl transition-all hover:scale-105 hover:brightness-110 active:scale-95 flex items-center space-x-3"
                style={{ boxShadow: `0 20px 40px -10px ${activeColorHex}40` }}
              >
                <Save className="w-5 h-5" />
                <span>Simpan Seluruh Perubahan</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        @keyframes slideUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slideUp { animation: slideUp 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default AppSettings;
