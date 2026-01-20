
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Menu as MenuIcon, 
  X, 
  Tags,
  Database,
  LogOut,
  User as UserIcon,
  Settings,
  FileText,
  Search,
  ChevronDown,
  ChevronRight,
  Bell,
  Zap,
  Lock,
  ChevronLeft,
  Navigation,
  Activity,
  FolderPlus
} from 'lucide-react';
import { ViewType, User, AppSettings, Category } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewType;
  setView: (view: ViewType) => void;
  currentUser: User | null;
  onLogout: () => void;
  appSettings: AppSettings;
  categories: Category[];
  onCategorySelect: (categoryName: string | null) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeView, 
  setView, 
  currentUser, 
  onLogout, 
  appSettings, 
  categories,
  onCategorySelect
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isViewDocsOpen, setIsViewDocsOpen] = useState(true);

  if (!currentUser) return <>{children}</>;

  const handleCategoryClick = (catName: string) => {
    onCategorySelect(catName);
    setView('FILE_MANAGER');
  };

  const handleMainViewDocsClick = () => {
    setIsViewDocsOpen(!isViewDocsOpen);
    if (!isViewDocsOpen) {
       onCategorySelect(null);
       setView('FILE_MANAGER');
    }
  };

  const handleQuickAddCategory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setView('CATEGORIES');
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex overflow-hidden font-sans">
      {/* Sidebar - Dark theme */}
      <aside className={`bg-[#1a1f2e] text-slate-300 transition-all duration-300 ease-in-out flex flex-col shadow-xl z-50 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 flex items-center gap-2 border-b border-slate-700/50">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{isSidebarOpen ? 'Navigation' : ''}</span>
          <Navigation className={`w-3 h-3 text-slate-500 ${!isSidebarOpen && 'mx-auto'}`} />
        </div>

        <nav className="flex-1 mt-4 overflow-y-auto no-scrollbar">
          {/* Dashboard Item */}
          <button 
            onClick={() => setView('DASHBOARD')}
            className={`w-full flex items-center px-4 py-3 transition-colors hover:bg-white/5 ${activeView === 'DASHBOARD' ? 'bg-white/5 text-white' : ''}`}
          >
            <div className={`p-1.5 rounded-lg bg-blue-500 text-white mr-3 shadow-lg shadow-blue-500/20`}>
              <Activity className="w-4 h-4" />
            </div>
            {isSidebarOpen && (
              <div className="flex-1 flex items-center justify-between">
                <span className="text-sm font-medium">Dashboard</span>
                <span className="bg-blue-500 text-[9px] font-black px-1.5 py-0.5 rounded text-white tracking-tighter">HOME</span>
              </div>
            )}
          </button>

          {/* View Dokumen Dropdown */}
          <div className="mt-1">
            <div 
              onClick={handleMainViewDocsClick}
              className={`w-full flex items-center px-4 py-3 transition-colors hover:bg-white/5 cursor-pointer ${activeView === 'FILE_MANAGER' ? 'bg-white/5 text-white' : ''}`}
            >
              <div className={`p-1.5 rounded-lg bg-rose-500 text-white mr-3 shadow-lg shadow-rose-500/20`}>
                <FileText className="w-4 h-4" />
              </div>
              {isSidebarOpen && (
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm font-medium">View Dokumen</span>
                  <div className="flex items-center gap-2">
                    {currentUser.role === 'ADMIN' && (
                      <button 
                        onClick={handleQuickAddCategory}
                        className="p-1 rounded hover:bg-white/10 text-rose-300 transition-colors"
                        title="Tambah Kategori"
                      >
                        <FolderPlus className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isViewDocsOpen ? '' : '-rotate-90'}`} />
                  </div>
                </div>
              )}
            </div>

            {isSidebarOpen && isViewDocsOpen && (
              <div className="bg-black/20 pb-2">
                {categories.map((cat) => (
                  <button 
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.name)}
                    className="w-full text-left pl-14 pr-4 py-2 text-xs hover:text-white hover:bg-white/5 flex items-center gap-2"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Settings & Maintenance (Admins) */}
          {currentUser.role === 'ADMIN' && (
            <div className="mt-4 pt-4 border-t border-slate-700/30">
              <button onClick={() => setView('CATEGORIES')} className={`w-full flex items-center px-4 py-3 hover:bg-white/5 transition-colors ${activeView === 'CATEGORIES' ? 'bg-white/5 text-white' : ''}`}>
                <Tags className="w-5 h-5 mr-3 text-slate-500" />
                {isSidebarOpen && <span className="text-sm">Kategori Arsip</span>}
              </button>
              <button onClick={() => setView('SETTINGS')} className={`w-full flex items-center px-4 py-3 hover:bg-white/5 transition-colors ${activeView === 'SETTINGS' ? 'bg-white/5 text-white' : ''}`}>
                <Settings className="w-5 h-5 mr-3 text-slate-500" />
                {isSidebarOpen && <span className="text-sm">Settings</span>}
              </button>
              <button onClick={() => setView('MAINTENANCE')} className={`w-full flex items-center px-4 py-3 hover:bg-white/5 transition-colors ${activeView === 'MAINTENANCE' ? 'bg-white/5 text-white' : ''}`}>
                <Database className="w-5 h-5 mr-3 text-slate-500" />
                {isSidebarOpen && <span className="text-sm">Maintenance</span>}
              </button>
            </div>
          )}
        </nav>

        {/* Footer Sidebar Area */}
        <div className="border-t border-slate-700/30">
          <button onClick={() => setView('PROFILE')} className="w-full flex items-center px-4 py-4 hover:bg-white/5 transition-colors group">
            <div className="p-1.5 rounded-lg bg-orange-500 text-white mr-3 shadow-lg shadow-orange-500/20">
              <Lock className="w-4 h-4" />
            </div>
            {isSidebarOpen && (
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">Profile</p>
              </div>
            )}
          </button>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="w-full py-4 flex items-center justify-center hover:bg-white/5 transition-colors bg-black/40"
          >
            {isSidebarOpen ? (
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                <ChevronLeft className="w-4 h-4" /> Collapse
              </div>
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area - Ditambahkan min-w-0 untuk mencegah Recharts error lebar -1 */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-30 shrink-0">
          <div className="flex items-center gap-4">
             <h2 className="text-xl font-medium text-slate-800">
              {activeView === 'DASHBOARD' ? 'Dashboard' : 'Data'} 
              <span className="text-slate-400 font-normal ml-2 text-sm">
                {activeView === 'FILE_MANAGER' ? 'Dokumen' : 
                 activeView === 'SETTINGS' ? 'Pengaturan' :
                 activeView === 'CATEGORIES' ? 'Kategori' :
                 activeView === 'MAINTENANCE' ? 'Pemeliharaan' : ''}
              </span>
             </h2>
          </div>
          <div className="flex items-center gap-6">
             <div className="relative group hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search..." className="pl-9 pr-4 py-1.5 bg-slate-100 border-none rounded-full text-xs outline-none focus:ring-2 focus:ring-blue-500/20 w-48" />
             </div>
             <button className="relative p-1.5 text-slate-500 hover:text-blue-600 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
             </button>
             <div className="h-6 w-px bg-slate-200"></div>
             <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                   <p className="text-xs font-bold text-slate-700 leading-none">{currentUser.name}</p>
                   <p className="text-[10px] text-slate-400 mt-1 uppercase font-black">{currentUser.role}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden ring-2 ring-slate-100">
                   <img src={currentUser.avatar} alt="avatar" className="w-full h-full object-cover" />
                </div>
                <button onClick={onLogout} title="Logout" className="p-1.5 text-slate-400 hover:text-rose-600">
                  <LogOut className="w-4 h-4" />
                </button>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f4f6f9]">
          <div className="max-w-[1600px] mx-auto animate-fadeIn min-w-0">
            {children}
          </div>
          <footer className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-[11px] text-slate-500 pb-10">
             <p>© 2026. <span className="text-blue-500 font-bold hover:underline cursor-pointer">E-ARSIP</span> Version 2.0 - All Rights Reserved</p>
          </footer>
        </div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Layout;
