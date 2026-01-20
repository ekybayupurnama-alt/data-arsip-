
import React, { useMemo, useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  Folder, 
  Files, 
  FilePlus, 
  HardDrive,
  Maximize2,
  RotateCw,
  Minus,
  X,
  LayoutDashboard,
  Clock,
  ArrowUpRight,
  FileText
} from 'lucide-react';
import { ArchiveDocument, ViewType } from '../types';

interface DashboardProps {
  archives: ArchiveDocument[];
  setView: (view: ViewType) => void;
  onDelete?: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ archives = [], setView }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Logic untuk menghitung statistik terintegrasi
  const stats = useMemo(() => {
    const uniqueCategories = new Set(archives.map(a => a.category));
    const totalDocs = archives.length;
    
    // Hitung Dokumen Baru (7 hari terakhir)
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const newDocs = archives.filter(a => {
      const uploadDate = new Date(a.uploadDate);
      return uploadDate >= oneWeekAgo;
    }).length;

    // Hitung Total Storage (Parsing string size)
    const totalKB = archives.reduce((acc, curr) => {
      const sizeStr = curr.totalSize || '0';
      const sizeNum = parseFloat(sizeStr.replace(/[^0-9.]/g, ''));
      return acc + (isNaN(sizeNum) ? 0 : sizeNum);
    }, 0);

    const storageDisplay = totalKB > 1024 
      ? (totalKB / 1024).toFixed(2) + ' MB' 
      : totalKB.toFixed(0) + ' KB';

    // Data Grafik Kategori
    const categoryCounts = archives.reduce<Record<string, number>>((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      jumlah: value
    }));

    // Ambil 5 Aktivitas Terbaru
    const recentUploads = [...archives]
      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
      .slice(0, 5);

    return {
      totalCategories: uniqueCategories.size,
      totalDocs,
      newDocs,
      storageDisplay,
      chartData,
      recentUploads
    };
  }, [archives]);

  const BAR_COLORS = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'];

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      {/* 4 Kartu Statistik Atas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border-b-4 border-blue-600 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow group">
          <div className="p-6 flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Kategori</p>
              <h3 className="text-3xl font-black text-slate-800">{stats.totalCategories}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Folder className="w-6 h-6" />
            </div>
          </div>
          <div className="px-6 py-3 bg-slate-50/50 flex items-center justify-between">
            <span className="text-[9px] font-bold text-slate-500 uppercase">Unit Klasifikasi</span>
            <ArrowUpRight className="w-3 h-3 text-slate-300" />
          </div>
        </div>

        <div className="bg-white border-b-4 border-rose-600 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow group">
          <div className="p-6 flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Arsip</p>
              <h3 className="text-3xl font-black text-slate-800">{stats.totalDocs}</h3>
            </div>
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Files className="w-6 h-6" />
            </div>
          </div>
          <div className="px-6 py-3 bg-slate-50/50 flex items-center justify-between">
            <span className="text-[9px] font-bold text-slate-500 uppercase">Dokumen Terindeks</span>
            <ArrowUpRight className="w-3 h-3 text-slate-300" />
          </div>
        </div>

        <div className="bg-white border-b-4 border-amber-600 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow group">
          <div className="p-6 flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Minggu Ini</p>
              <h3 className="text-3xl font-black text-slate-800">+{stats.newDocs}</h3>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <FilePlus className="w-6 h-6" />
            </div>
          </div>
          <div className="px-6 py-3 bg-slate-50/50 flex items-center justify-between">
            <span className="text-[9px] font-bold text-slate-500 uppercase">Entri Baru</span>
            <ArrowUpRight className="w-3 h-3 text-slate-300" />
          </div>
        </div>

        <div className="bg-white border-b-4 border-emerald-600 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow group">
          <div className="p-6 flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Kapasitas Data</p>
              <h3 className="text-3xl font-black text-slate-800">{stats.storageDisplay}</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <HardDrive className="w-6 h-6" />
            </div>
          </div>
          <div className="px-6 py-3 bg-slate-50/50 flex items-center justify-between">
            <span className="text-[9px] font-bold text-slate-500 uppercase">Penyimpanan Server</span>
            <ArrowUpRight className="w-3 h-3 text-slate-300" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Grafik Distribusi (2/3) */}
        <div className="lg:col-span-2 bg-white shadow-sm rounded-[2rem] overflow-hidden border border-slate-200 flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-lg shadow-indigo-100">
                <LayoutDashboard className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Distribusi Kategori Arsip</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Visualisasi Frekuensi Data</p>
              </div>
            </div>
            <button onClick={() => setView('CATEGORIES')} className="text-[10px] font-black text-indigo-600 uppercase hover:underline">Kelola Struktur</button>
          </div>

          <div className="p-8 flex-1">
            <div className="h-[350px] w-full">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
                      interval={0}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
                    />
                    <Bar dataKey="jumlah" radius={[6, 6, 0, 0]} barSize={40}>
                      {stats.chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Recent Uploads (1/3) */}
        <div className="bg-white shadow-sm rounded-[2rem] border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 text-white rounded-lg">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Unggahan Terbaru</h4>
            </div>
          </div>
          <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[400px] custom-scrollbar">
            {stats.recentUploads.length > 0 ? (
              stats.recentUploads.map((doc) => (
                <div key={doc.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-black text-slate-700 truncate">{doc.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] font-bold text-indigo-600 uppercase">{doc.category}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span className="text-[9px] text-slate-400 font-medium">{doc.uploadDate}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-10 opacity-20">
                <Files className="w-12 h-12 mb-2" />
                <p className="text-[10px] font-black uppercase">Belum ada data</p>
              </div>
            )}
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <button 
              onClick={() => setView('FILE_MANAGER')}
              className="w-full py-2.5 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-indigo-600 transition-colors"
            >
              Lihat Semua Dokumen
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Dashboard;
