
import React, { useState, useMemo } from 'react';
import { 
  Download, 
  History, 
  Search, 
  Trash2, 
  Calendar, 
  User as UserIcon, 
  FileSpreadsheet,
  FileText,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Archive,
  FileDown,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { AuditLog, ArchiveDocument, User } from '../types';

interface DownloadHistoryProps {
  logs: AuditLog[];
  archives: ArchiveDocument[];
  users: User[];
  onDownloadRequest: (doc: ArchiveDocument) => void;
  onClearHistory: () => void;
}

const DownloadHistory: React.FC<DownloadHistoryProps> = ({ logs, archives, users, onDownloadRequest, onClearHistory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [exporting, setExporting] = useState(false);

  const enrichedLogs = useMemo(() => {
    const downloadLogs = logs.filter(log => log.action === 'DOWNLOAD');
    return downloadLogs.map(log => {
      // Ekstrak nama file dari string detail "Unduh file (Local): nama.pdf" atau "Unduh file: nama.pdf"
      const fileName = log.details.split(': ').pop() || '';
      const doc = archives.find(archive => archive.files.some(file => file.name === fileName));
      const file = doc?.files.find(f => f.name === fileName);
      return {
        ...log,
        fileName,
        size: file?.size || 'N/A',
        docRef: doc,
        ext: fileName.split('.').pop()?.toUpperCase() || 'FILE'
      };
    }).filter(log => log.docRef);
  }, [logs, archives]);

  const filteredLogs = useMemo(() => {
    return enrichedLogs.filter(log => {
      const matchSearch = log.fileName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchUser = userFilter === 'ALL' || log.userId === userFilter;
      
      let matchDate = true;
      if (dateFilter !== 'ALL') {
        // Parsing log.timestamp yang formatnya "15 Jun 2024, 10:30"
        try {
          const logDateStr = log.timestamp.split(',')[0];
          const parts = logDateStr.split(' ');
          const months: { [key: string]: number } = { 
            "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "Mei": 4, "Jun": 5, 
            "Jul": 6, "Agu": 7, "Sep": 8, "Okt": 9, "Nov": 10, "Des": 11 
          };
          const logDate = new Date(parseInt(parts[2]), months[parts[1]], parseInt(parts[0]));
          const now = new Date();
          const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

          if (dateFilter === 'TODAY') matchDate = logDate >= startOfToday;
          else if (dateFilter === 'WEEK') matchDate = logDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          else if (dateFilter === 'MONTH') matchDate = logDate >= new Date(now.getFullYear(), now.getMonth(), 1);
        } catch(e) { matchDate = true; }
      }
      return matchSearch && matchUser && matchDate;
    });
  }, [enrichedLogs, searchTerm, userFilter, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / entriesPerPage));
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) return alert('Tidak ada data untuk diekspor.');
    
    setExporting(true);
    
    setTimeout(() => {
      const headers = ["ID Log", "Nama File", "Ekstensi", "Ukuran", "Kategori", "Diunduh Oleh", "Role", "Waktu Unduh"];
      
      const rows = filteredLogs.map(log => {
        const user = users.find(u => u.id === log.userId);
        return [
          log.id,
          `"${log.fileName.replace(/"/g, '""')}"`, // Escaping quotes
          log.ext,
          log.size,
          `"${log.docRef?.category || 'Umum'}"`,
          `"${log.userName.replace(/"/g, '""')}"`,
          user?.role || 'USER',
          `"${log.timestamp}"`
        ].join(',');
      });

      const csvContent = "\uFEFF" + [headers.join(','), ...rows].join('\n'); // Add BOM for Excel UTF-8 support
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Log_Unduhan_YPIB_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setExporting(false);
    }, 500);
  };
  
  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Riwayat Unduhan</h1>
          <p className="text-slate-400 text-sm font-medium mt-1">Laporan aktivitas akses file digital Universitas YPIB.</p>
        </div>
        <div className="flex items-center gap-3">
            <button 
              onClick={handleExportCSV} 
              disabled={exporting || filteredLogs.length === 0}
              className="flex items-center space-x-2 px-6 py-3.5 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50"
            >
                {exporting ? <Clock className="w-4 h-4 animate-spin"/> : <FileDown className="w-4 h-4"/>}
                <span>Ekspor CSV</span>
            </button>
            <button onClick={onClearHistory} className="p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm" title="Bersihkan Riwayat">
                <Trash2 className="w-5 h-5"/>
            </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Pencarian File</label>
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300"/>
                <input type="text" placeholder="Ketik nama file..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-primary shadow-sm"/>
             </div>
          </div>
          <div className="md:col-span-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Filter Aktor</label>
            <select value={userFilter} onChange={e => setUserFilter(e.target.value)} className="w-full py-3 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-primary shadow-sm appearance-none cursor-pointer">
              <option value="ALL">Semua Pengguna</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Rentang Waktu</label>
            <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-full py-3 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-primary shadow-sm appearance-none cursor-pointer">
              <option value="ALL">Semua Waktu</option>
              <option value="TODAY">Hari Ini</option>
              <option value="WEEK">Minggu Ini</option>
              <option value="MONTH">Bulan Ini</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 text-[10px] font-black uppercase tracking-[0.15em] border-b border-slate-100">
                <th className="px-8 py-6">Informasi Dokumen</th>
                <th className="px-8 py-6">Oleh Staf</th>
                <th className="px-8 py-6">Stempel Waktu</th>
                <th className="px-8 py-6 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedLogs.map(log => {
                const user = users.find(u => u.id === log.userId);
                return (
                  <tr key={log.id} className="hover:bg-primary-light transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-4">
                          <div className={`p-3 bg-white border border-slate-100 rounded-xl shadow-sm text-slate-400 group-hover:text-primary transition-colors`}>
                            <FileText className="w-5 h-5"/>
                          </div>
                          <div className="overflow-hidden">
                              <p className="font-black text-sm text-slate-700 truncate max-w-[200px]">{log.fileName}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] text-slate-400 font-black uppercase">{log.size}</span>
                                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                <span className="text-[9px] text-primary font-black uppercase">{log.ext}</span>
                              </div>
                          </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-black text-slate-400 shrink-0 shadow-inner">
                              {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-xl" /> : log.userName.charAt(0)}
                          </div>
                          <div className="overflow-hidden">
                            <p className="font-bold text-xs text-slate-800 truncate">{log.userName}</p>
                            <p className="text-[10px] text-slate-400 font-medium truncate">{user?.email || 'N/A'}</p>
                          </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                        <Clock className="w-3.5 h-3.5 opacity-30"/>
                        {log.timestamp}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <button 
                        onClick={() => log.docRef && onDownloadRequest(log.docRef)} 
                        className="p-2.5 bg-white text-primary rounded-xl border border-slate-200 hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95"
                        title="Unduh Kembali"
                      >
                          <Download className="w-4 h-4"/>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {paginatedLogs.length === 0 && (
                <tr>
                    <td colSpan={4} className="text-center py-24">
                        <div className="flex flex-col items-center opacity-10">
                            <Archive className="w-16 h-16 mb-4"/>
                            <p className="font-black text-sm uppercase tracking-widest">Data Tidak Ditemukan</p>
                        </div>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
            <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-400 uppercase">Halaman {currentPage} / {totalPages}</p>
                <div className="flex items-center gap-1.5">
                    <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-30"><ChevronsLeft className="w-4 h-4"/></button>
                    <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-30"><ChevronLeft className="w-4 h-4"/></button>
                    <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-30"><ChevronRight className="w-4 h-4"/></button>
                    <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-30"><ChevronsRight className="w-4 h-4"/></button>
                </div>
            </div>
        )}
      </div>

      <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] flex items-start gap-4 shadow-sm shadow-emerald-50/50">
        <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-100">
           <CheckCircle2 className="w-5 h-5"/>
        </div>
        <div>
          <h4 className="text-sm font-black text-emerald-900 uppercase tracking-tight">Kepatuhan Data (Data Compliance)</h4>
          <p className="text-[11px] text-emerald-700/80 leading-relaxed font-medium mt-1">
            Log unduhan direkam secara otomatis dan tidak dapat dimodifikasi oleh pengguna biasa. Ini memastikan transparansi akses data sesuai dengan standar tata kelola arsip digital universitas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DownloadHistory;
