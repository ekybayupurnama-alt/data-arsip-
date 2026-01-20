
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ArchiveList from './components/ArchiveList';
import UploadForm from './components/UploadForm';
import GeminiAssistant from './components/GeminiAssistant';
import CategoryManager from './components/CategoryManager';
import Maintenance from './components/Maintenance';
import Profile from './components/Profile';
import Auth from './components/Auth';
import AppSettings from './components/AppSettings';
import FileManager from './components/FileManager';
import UserManagement from './components/UserManagement';
import DownloadHistory from './components/DownloadHistory';
import { ViewType, ArchiveDocument, Category, User, AppSettings as AppSettingsType, AuditLog, Role } from './types';
import { INITIAL_ARCHIVES, INITIAL_CATEGORIES, INITIAL_USERS } from './constants';

const STORAGE_KEYS = {
  ARCHIVES: 'ad_archives',
  CATEGORIES: 'ad_categories',
  SETTINGS: 'ad_settings',
  USERS: 'ad_users',
  SESSION: 'ad_session'
};

const DEFAULT_SETTINGS: AppSettingsType = {
  appName: 'DATA ARSIP UNIVERSITAS YPIB MAJALENGKA',
  themeColor: 'indigo',
  auditLogs: [],
  menus: [
    { id: 'DASHBOARD', label: 'Dashboard', icon: 'LayoutDashboard', show: true },
    { id: 'LIST', label: 'Eksplorasi Arsip', icon: 'FileText', show: true },
    { id: 'FILE_MANAGER', label: 'File Manager', icon: 'Archive', show: true },
    { id: 'CATEGORIES', label: 'Kategori Arsip', icon: 'Tags', show: true },
    { id: 'AI_SEARCH', label: 'AI Search Assistant', icon: 'Zap', show: true },
    { id: 'DOWNLOAD_HISTORY', label: 'Log Unduhan', icon: 'History', show: true },
    { id: 'USERS', label: 'User Management', icon: 'UserIcon', show: true },
    { id: 'SETTINGS', label: 'App Settings', icon: 'Settings', show: true },
    { id: 'MAINTENANCE', label: 'Sistem & Backup', icon: 'Database', show: true },
  ] 
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SESSION);
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });

  const [archives, setArchives] = useState<ArchiveDocument[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ARCHIVES);
      return saved ? JSON.parse(saved) : INITIAL_ARCHIVES;
    } catch (e) { return INITIAL_ARCHIVES; }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch (e) { return INITIAL_CATEGORIES; }
  });

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch (e) { return INITIAL_USERS; }
  });

  const [appSettings, setAppSettings] = useState<AppSettingsType>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch (e) { return DEFAULT_SETTINGS; }
  });

  const [activeView, setActiveView] = useState<ViewType>('DASHBOARD');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ARCHIVES, JSON.stringify(archives)); }, [archives]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(appSettings)); }, [appSettings]);
  useEffect(() => {
    if (currentUser) localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(currentUser));
    else localStorage.removeItem(STORAGE_KEYS.SESSION);
  }, [currentUser]);

  const addAuditLog = useCallback((action: string, details: string) => {
    if (!currentUser) return;
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      details,
      timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
    };
    setAppSettings(prev => ({
      ...prev,
      auditLogs: [newLog, ...(prev.auditLogs || [])].slice(0, 100)
    }));
  }, [currentUser]);

  const handleAddArchive = (newDoc: ArchiveDocument) => {
    setArchives(prev => [newDoc, ...prev]);
    addAuditLog('UPLOAD', `Dokumen baru: ${newDoc.title}`);
  };

  const handleUpdateArchive = (updatedDoc: ArchiveDocument) => {
    setArchives(prev => prev.map(a => a.id === updatedDoc.id ? updatedDoc : a));
    addAuditLog('EDIT', `Update metadata: ${updatedDoc.title}`);
  };

  const handleDeleteArchive = useCallback((id: string) => {
    const docToDelete = archives.find(a => a.id === id);
    if (!docToDelete) return;
    
    if (window.confirm(`Apakah Anda yakin ingin menghapus arsip "${docToDelete.title}" secara permanen?`)) {
      setArchives(prev => prev.filter(a => a.id !== id));
      addAuditLog('DELETE', `Hapus arsip: ${docToDelete.title}`);
    }
  }, [archives, addAuditLog]);

  // Fix: Added handleClearAllArchives function
  const handleClearAllArchives = useCallback(() => {
    if (window.confirm('Apakah Anda yakin ingin menghapus SELURUH arsip dokumen secara permanen? Tindakan ini tidak dapat dibatalkan.')) {
      setArchives([]);
      addAuditLog('DELETE_ALL', 'Menghapus seluruh database arsip dokumen');
    }
  }, [addAuditLog]);

  const handleDownload = useCallback((doc: ArchiveDocument) => {
    const file = doc.files[0];
    if (!file) return;
    const blob = new Blob([`Simulated physical file content for institutional record: ${file.name}`], { type: file.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    addAuditLog('DOWNLOAD', `Unduh file (Local): ${file.name}`);
  }, [addAuditLog]);

  const handleDownloadFromCloud = useCallback((doc: ArchiveDocument) => {
    const file = doc.files[0];
    if (!file) return;
    // Simulasi fetching dari Google Drive
    const blob = new Blob([`Google Drive Cloud Content: ${file.name}`], { type: file.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `[CLOUDSYNC]_${file.name}`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    addAuditLog('DOWNLOAD', `Unduh file (Google Drive): ${file.name}`);
  }, [addAuditLog]);

  const handleAddUser = useCallback((newUser: {name: string, email: string, role: Role}) => {
    const user: User = {
      ...newUser,
      id: `user-${Math.random().toString(16).slice(2, 10)}`,
      status: 'Invited',
      joinDate: new Date().toISOString().split('T')[0],
      avatar: `https://i.pravatar.cc/150?u=${Math.random().toString(16).slice(2, 10)}`
    };
    setUsers(prev => [user, ...prev]);
    addAuditLog('USER_ADD', `Undang pengguna baru: ${user.email}`);
  }, [addAuditLog]);

  const handleUpdateUser = useCallback((updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    addAuditLog('USER_UPDATE', `Perbarui profil: ${updatedUser.email}`);
  }, [addAuditLog]);

  const handleDeleteUser = useCallback((userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) return;
    if (userToDelete.role === 'ADMIN' && users.filter(u => u.role === 'ADMIN').length === 1) {
      alert('Tidak dapat menghapus Administrator terakhir.');
      return;
    }

    if (window.confirm(`Yakin ingin menghapus pengguna "${userToDelete.name}"?`)) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      addAuditLog('USER_DELETE', `Hapus pengguna: ${userToDelete.email}`);
    }
  }, [users, addAuditLog]);

  const handleClearDownloadHistory = useCallback(() => {
    if (window.confirm('Yakin ingin membersihkan seluruh riwayat unduhan? Tindakan ini tidak dapat dibatalkan.')) {
        setAppSettings(prev => ({
            ...prev,
            auditLogs: prev.auditLogs.filter(log => log.action !== 'DOWNLOAD')
        }));
        addAuditLog('SYSTEM', 'Membersihkan riwayat unduhan');
    }
  }, [addAuditLog]);

  const handleRegister = (user: User) => { setUsers(prev => [user, ...prev]); }

  const renderContent = () => {
    if (!currentUser) return <Auth onLogin={setCurrentUser} onRegister={handleRegister} />;

    switch (activeView) {
      case 'DASHBOARD':
        return <Dashboard archives={archives} setView={setActiveView} onDelete={handleDeleteArchive} />;
      case 'FILE_MANAGER':
        return (
          <FileManager 
            archives={archives} 
            categories={categories}
            onDownload={handleDownload}
            onDownloadFromCloud={handleDownloadFromCloud}
            onUpdate={handleUpdateArchive}
            onUploadClick={() => setActiveView('UPLOAD')}
            initialCategory={selectedCategory}
          />
        );
      case 'LIST':
        return (
          <ArchiveList 
            archives={archives} 
            categories={categories} 
            onDelete={handleDeleteArchive} 
            onUpdate={handleUpdateArchive} 
            onDownload={handleDownload}
            currentUser={currentUser} 
            setView={setActiveView} 
            onClearAll={handleClearAllArchives} 
          />
        );
      case 'CATEGORIES':
        return <CategoryManager categories={categories} setCategories={setCategories} archives={archives} />;
      case 'UPLOAD':
        return <UploadForm onAddArchive={handleAddArchive} categories={categories} onComplete={() => setActiveView('FILE_MANAGER')} />;
      case 'AI_SEARCH':
        return <GeminiAssistant archives={archives} />;
      case 'MAINTENANCE':
        return <Maintenance archives={archives} categories={categories} onRestore={(d) => { setArchives(d.archives); setCategories(d.categories); }} />;
      case 'PROFILE':
        return <Profile user={currentUser} onUpdate={setCurrentUser} />;
      case 'SETTINGS':
        return <AppSettings settings={appSettings} onUpdateSettings={setAppSettings} />;
      case 'USERS':
        return <UserManagement 
          users={users} 
          onAddUser={handleAddUser} 
          onUpdateUser={handleUpdateUser}
          onDeleteUser={handleDeleteUser} />;
      case 'DOWNLOAD_HISTORY':
        return <DownloadHistory 
          logs={appSettings.auditLogs}
          archives={archives}
          users={users}
          onDownloadRequest={handleDownload}
          onClearHistory={handleClearDownloadHistory}
        />;
      default:
        return <Dashboard archives={archives} setView={setActiveView} onDelete={handleDeleteArchive} />;
    }
  };

  return (
    <Layout 
      activeView={activeView} 
      setView={setActiveView} 
      currentUser={currentUser}
      onLogout={() => setCurrentUser(null)}
      appSettings={appSettings}
      categories={categories}
      onCategorySelect={setSelectedCategory}
    >
      <div className="animate-fadeIn transition-all duration-500 min-h-full">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;
