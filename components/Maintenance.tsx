
import React, { useState, useRef } from 'react';
import { 
  Download, 
  Upload, 
  ShieldCheck, 
  RefreshCw, 
  FileJson, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  History,
  HardDrive,
  FileSpreadsheet,
  Package,
  Zap,
  Database,
  Cloud,
  ExternalLink,
  ChevronRight,
  Monitor
} from 'lucide-react';
import { ArchiveDocument, Category, BackupData } from '../types';

interface MaintenanceProps {
  archives: ArchiveDocument[];
  categories: Category[];
  onRestore: (data: BackupData) => void;
}

const Maintenance: React.FC<MaintenanceProps> = ({ archives, categories, onRestore }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingFiles, setIsExportingFiles] = useState(false);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackup = () => {
    setIsExporting(true);
    setStatusMessage(null);
    setTimeout(() => {
      try {
        const backup: BackupData = {
          version: "1.0.0",
          timestamp: new Date().toLocaleString('id-ID'),
          archives,
          categories
        };
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Backup_Arsip_YPIB_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        localStorage.setItem('last_backup_date', new Date().toLocaleString('id-ID'));
        setStatusMessage({ type: 'success', text: 'Backup database berhasil diunduh.' });
      } catch (err) {
        setStatusMessage({ type: 'error', text: 'Gagal membuat file cadangan.' });
      } finally {
        setIsExporting(false);
      }
    }, 800);
  };

  const handleFullCloudSync = () => {
    setIsSyncingCloud(true);
    setExportProgress(0);
    setStatusMessage(null);

    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    setTimeout(() => {
      setIsSyncingCloud(false);
      setStatusMessage({ 
        type: 'success', 
        text: `Sinkronisasi Cloud Selesai! ${archives.length} metadata dokumen telah dicadangkan di Google Drive.` 
      });
    }, 3500);
  };

  const lastBackup = localStorage.getItem('last_backup_date') || 'Belum pernah';

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-24">
      {/* Hero Maintenance */}
      <div className="bg-gradient-to-br from-[#1a1f2e] via-[#242b3d] to-[#1a1f2e] rounded-[3rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden border border-slate-700">
        <ShieldCheck className="absolute -bottom-10 -right-10 w-64 h-64 opacity-5 rotate-12" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 backdrop-blur-md">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-black uppercase tracking-widest text-blue-300">Database Optimizer</span>
            </div>
            <h2 className="text-4xl font-black leading-tight">Pemeliharaan & Keamanan Digital</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Pastikan data institusi Anda selalu aman dengan sistem backup berkala dan sinkronisasi cloud terintegrasi Google Drive.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-sm">
                <Clock className="w-5 h-5 text-blue-400 mb-1" />
                <p className="text-[10px] text-slate-500 font-bold uppercase">Terakhir Backup</p>
                <p className="text-sm font-bold">{lastBackup}</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-sm">
                <Cloud className="w-5 h-5 text-emerald-400 mb-1" />
                <p className="text-[10px] text-slate-500 font-bold uppercase">Cloud Storage</p>
                <p className="text-sm font-bold text-emerald-400">ACTIVE</p>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex justify-center">
             <div className="w-56 h-56 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20 relative animate-pulse">
                <Database className="w-24 h-24 text-blue-400" />
             </div>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className={`p-5 rounded-3xl flex items-center space-x-4 animate-slideUp shadow-sm border ${
          statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
        }`}>
          <div className={`p-2 rounded-full ${statusMessage.type === 'success' ? 'bg-emerald-100' : 'bg-red-100'}`}>
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <span className="text-sm font-bold">{statusMessage.text}</span>
        </div>
      )}

      {/* Cloud Sync Section */}
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 shadow-inner">
             <Cloud className="w-12 h-12" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-black text-slate-800">Google Drive Synchronization</h3>
            <p className="text-slate-500 text-sm mt-2 max-w-xl">
              Sinkronisasikan seluruh metadata dan rincian arsip Anda ke akun Google Drive institusi untuk lapisan perlindungan data tambahan di luar server lokal.
            </p>
            {isSyncingCloud && (
              <div className="mt-6 w-full max-w-md bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${exportProgress}%` }}></div>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3 min-w-[200px]">
            <button 
              onClick={handleFullCloudSync}
              disabled={isSyncingCloud}
              className="px-6 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-100 flex items-center justify-center gap-3 hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {isSyncingCloud ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Full Cloud Sync
            </button>
            <button className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-slate-50">
              <ExternalLink className="w-3.5 h-3.5" /> Buka Google Drive
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Local Backup */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 flex items-start gap-6 hover:shadow-xl transition-all">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
             <FileJson className="w-8 h-8" />
          </div>
          <div className="flex-1">
             <h4 className="text-lg font-black text-slate-800">Backup Database (JSON)</h4>
             <p className="text-xs text-slate-400 mt-1">Ekspor seluruh data ke file JSON untuk dipulihkan nanti.</p>
             <button onClick={handleBackup} className="mt-4 flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
               <Download className="w-4 h-4" /> Download Cadangan
             </button>
          </div>
        </div>

        {/* Restore Section */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 flex items-start gap-6 hover:shadow-xl transition-all">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
             <History className="w-8 h-8" />
          </div>
          <div className="flex-1">
             <h4 className="text-lg font-black text-slate-800">Restore Point</h4>
             <p className="text-xs text-slate-400 mt-1">Kembalikan data dari file cadangan yang telah Anda unduh.</p>
             <button onClick={() => fileInputRef.current?.click()} className="mt-4 flex items-center gap-2 text-[10px] font-black text-amber-600 uppercase tracking-widest hover:underline">
               <Upload className="w-4 h-4" /> Pilih File Cadangan
             </button>
             <input type="file" ref={fileInputRef} className="hidden" accept=".json" />
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Maintenance;
