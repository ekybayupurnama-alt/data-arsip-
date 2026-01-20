
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Download, 
  Search, 
  RotateCw, 
  X,
  ArrowUpDown,
  Upload,
  FileText,
  Info,
  HardDrive,
  Trash2,
  Share2,
  Clock,
  FileBox,
  FileArchive,
  FileSpreadsheet,
  Eye,
  ImageIcon,
  PlayCircle,
  FileSearch,
  CheckCircle2,
  Edit,
  Save,
  Cloud,
  CloudOff,
  RefreshCw,
  CloudDownload,
  Copy,
  Check,
  Link2,
  Hash,
  CalendarDays,
  Sparkles,
  Paperclip,
  ChevronDown,
  Tags
} from 'lucide-react';
import { ArchiveDocument, ArchiveFile, Category } from '../types';

interface FileManagerProps {
  archives: ArchiveDocument[];
  categories: Category[];
  onDownload: (doc: ArchiveDocument) => void;
  onDownloadFromCloud: (doc: ArchiveDocument) => void;
  onUpdate: (doc: ArchiveDocument) => void;
  onUploadClick: () => void;
  initialCategory?: string | null;
}

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return <FileText className="w-12 h-12 text-rose-500" />;
  if (['zip', 'rar', '7z'].includes(ext || '')) return <FileArchive className="w-12 h-12 text-amber-500" />;
  if (['xlsx', 'xls', 'csv'].includes(ext || '')) return <FileSpreadsheet className="w-12 h-12 text-emerald-500" />;
  if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext || '')) return <ImageIcon className="w-12 h-12 text-blue-500" />;
  if (['mp4', 'mov', 'avi'].includes(ext || '')) return <PlayCircle className="w-12 h-12 text-purple-500" />;
  return <FileBox className="w-12 h-12 text-slate-400" />;
};

const getSmallFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return <FileText className="w-5 h-5 text-rose-500" />;
  if (['zip', 'rar', '7z'].includes(ext || '')) return <FileArchive className="w-5 h-5 text-amber-500" />;
  if (['xlsx', 'xls'].includes(ext || '')) return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return <ImageIcon className="w-5 h-5 text-blue-500" />;
  return <FileBox className="w-5 h-5 text-slate-400" />;
};

const FileManager: React.FC<FileManagerProps> = ({ archives, categories, onDownload, onDownloadFromCloud, onUpdate, onUploadClick, initialCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{key: keyof ArchiveDocument, direction: 'asc' | 'desc'} | null>(null);
  const [selectedArchive, setSelectedArchive] = useState<ArchiveDocument | null>(null);
  
  // States
  const [isEditing, setIsEditing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isFetchingCloud, setIsFetchingCloud] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', description: '', category: '' });

  useEffect(() => {
    if (initialCategory) {
      setSearchTerm(initialCategory);
    } else {
      setSearchTerm('');
    }
    setCurrentPage(1);
    setSelectedArchive(null);
    setIsEditing(false);
  }, [initialCategory]);

  useEffect(() => {
    setIsEditing(false);
    setIsSyncing(false);
    setIsFetchingCloud(false);
    setIsDetailModalOpen(false);
  }, [selectedArchive?.id]);

  const handleStartEdit = () => {
    if (!selectedArchive) return;
    setEditForm({
      title: selectedArchive.title,
      description: selectedArchive.description,
      category: selectedArchive.category
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (!selectedArchive) return;
    const updatedDoc = {
      ...selectedArchive,
      title: editForm.title,
      description: editForm.description,
      category: editForm.category
    };
    onUpdate(updatedDoc);
    setSelectedArchive(updatedDoc);
    setIsEditing(false);
  };

  const handleSyncToDrive = () => {
    if (!selectedArchive) return;
    setIsSyncing(true);
    
    // Simulasi integrasi API Google Drive
    setTimeout(() => {
      const updatedDoc = {
        ...selectedArchive,
        isCloudSynced: true,
        lastSynced: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
      };
      onUpdate(updatedDoc);
      setSelectedArchive(updatedDoc);
      setIsSyncing(false);
    }, 2500);
  };

  const handleFetchFromCloud = () => {
    if (!selectedArchive || !selectedArchive.isCloudSynced) return;
    setIsFetchingCloud(true);
    setTimeout(() => {
      onDownloadFromCloud(selectedArchive);
      setIsFetchingCloud(false);
    }, 1500);
  };

  const handleCopyLink = () => {
    if (!selectedArchive) return;
    const shareLink = `https://e-arsip.ypib.ac.id/share/${selectedArchive.id}`;
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleShareQuickAction = (doc: ArchiveDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedArchive(doc);
    setIsShareModalOpen(true);
  };

  const filteredArchives = useMemo(() => {
    let result = archives.filter(doc => 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = (a[sortConfig.key] || '').toString();
        const bValue = (b[sortConfig.key] || '').toString();
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [archives, searchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredArchives.length / entriesToShow);
  const paginatedArchives = filteredArchives.slice((currentPage - 1) * entriesToShow, currentPage * entriesToShow);

  const handleSort = (key: keyof ArchiveDocument) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderFilePreview = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext || '')) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
          <div className="w-full h-full rounded-lg bg-slate-200 flex items-center justify-center overflow-hidden">
             <img 
               src={`https://placehold.co/600x400/f1f5f9/64748b?text=${fileName}`} 
               alt="Image Preview" 
               className="max-w-full max-h-full object-contain"
             />
          </div>
          <p className="mt-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Image Preview: {fileName}</p>
        </div>
      );
    }

    if (ext === 'pdf') {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-100">
           <div className="w-4/5 h-4/5 bg-white shadow-lg rounded border border-slate-200 p-6 overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500"></div>
              <div className="space-y-4">
                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                <div className="h-2 bg-slate-50 rounded w-full"></div>
                <div className="h-2 bg-slate-50 rounded w-full"></div>
                <div className="h-2 bg-slate-50 rounded w-5/6"></div>
                <div className="h-32 bg-slate-50 rounded-lg w-full mt-4 flex items-center justify-center">
                   <FileText className="w-12 h-12 text-rose-200" />
                </div>
                <div className="h-2 bg-slate-50 rounded w-full"></div>
                <div className="h-2 bg-slate-50 rounded w-3/4"></div>
              </div>
           </div>
           <p className="mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">PDF Preview: {fileName}</p>
        </div>
      );
    }

    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white group-hover:bg-slate-50 transition-colors">
        {getFileIcon(fileName)}
        <span className="text-[10px] font-black uppercase text-slate-400 mt-3 tracking-widest">{fileName}</span>
        <div className="mt-4 flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-180px)] overflow-hidden relative items-start">
      <div className={`flex flex-col gap-4 transition-all duration-500 ease-in-out h-full overflow-hidden ${selectedArchive ? 'w-2/3' : 'w-full'}`}>
        {/* Results Bar */}
        <div className="bg-[#1a1a1a] rounded-sm p-3 px-5 flex justify-between items-center text-white shadow-lg shrink-0">
          <div className="flex items-center gap-2">
             <span className="text-[11px] font-bold">Ditemukan <span className="text-blue-400">{filteredArchives.length}</span> arsip dokumen</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-1 hover:bg-white/10 rounded transition-colors" title="Refresh"><RotateCw className="w-3.5 h-3.5 text-emerald-400" /></button>
            <button className="p-1 hover:bg-white/10 rounded transition-colors" onClick={() => setSelectedArchive(null)} title="Close Panel"><X className="w-3.5 h-3.5 text-rose-500" /></button>
          </div>
        </div>

        <div className="bg-white rounded-sm shadow-sm p-6 border border-slate-200 flex flex-col overflow-hidden h-full">
          {/* Table Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 shrink-0">
            <div className="flex items-center gap-3">
              <button 
                onClick={onUploadClick}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded hover:bg-emerald-700 transition-all shadow-sm active:scale-95"
              >
                <Upload className="w-3.5 h-3.5" /> Unggah Baru
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs outline-none focus:border-blue-500 min-w-[250px]" 
                  placeholder="Cari nama atau nomor arsip..."
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span>Tampilkan</span>
              <select 
                value={entriesToShow} 
                onChange={(e) => { setEntriesToShow(parseInt(e.target.value)); setCurrentPage(1); }}
                className="bg-slate-50 border border-slate-200 rounded px-1.5 py-1 outline-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Table Area */}
          <div className="flex-1 overflow-auto border border-slate-200 rounded-sm custom-scrollbar bg-[#f8fafc]">
            <table className="w-full text-left text-sm border-collapse table-fixed min-w-[800px]">
              <thead className="bg-[#f1f5f9] border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-widest sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-4 cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => handleSort('title')}>
                    <div className="flex items-center gap-2">
                      Informasi Arsip <ArrowUpDown className="w-3 h-3 opacity-30" />
                    </div>
                  </th>
                  <th className="px-6 py-4 w-48 cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => handleSort('uploadDate')}>
                    <div className="flex items-center gap-2">
                      Tanggal Upload <ArrowUpDown className="w-3 h-3 opacity-30" />
                    </div>
                  </th>
                  <th className="px-6 py-4 w-44 text-center">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {paginatedArchives.map((doc) => {
                  const isSelected = selectedArchive?.id === doc.id;
                  return (
                    <tr 
                      key={doc.id} 
                      onClick={() => setSelectedArchive(doc)}
                      className={`cursor-pointer text-slate-600 transition-all duration-200 border-l-4 group/row ${
                        isSelected 
                        ? 'bg-blue-50/80 border-l-blue-600' 
                        : 'hover:bg-slate-50 border-l-transparent'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4 overflow-hidden">
                          <div className={`p-2 rounded-xl shrink-0 transition-all ${isSelected ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                            {getSmallFileIcon(doc.title)}
                          </div>
                          <div className="truncate">
                            <p className={`text-sm font-bold truncate ${isSelected ? 'text-blue-800' : 'text-slate-700'}`}>{doc.title}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{doc.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                          <Clock className={`w-3.5 h-3.5 opacity-30 ${isSelected ? 'text-blue-500 opacity-100' : ''}`} />
                          {doc.uploadDate}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Quick Detail Button */}
                          <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedArchive(doc); }}
                            className={`p-2 rounded-lg transition-all shadow-sm active:scale-90 flex items-center gap-1.5 ${
                              isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600'
                            }`}
                            title="Buka Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {/* Quick Download Button */}
                          <button 
                            onClick={(e) => { e.stopPropagation(); onDownload(doc); }}
                            className={`p-2 rounded-lg transition-all shadow-sm active:scale-90 flex items-center gap-1.5 ${
                              isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'
                            }`}
                            title="Unduh Berkas"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          {/* Quick Share Button */}
                          <button 
                            onClick={(e) => handleShareQuickAction(doc, e)}
                            className={`p-2 rounded-lg transition-all shadow-sm active:scale-90 flex items-center gap-1.5 ${
                              isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
                            }`}
                            title="Bagikan Akses"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {paginatedArchives.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-20 text-center text-slate-400">
                      <FileSearch className="w-12 h-12 mx-auto mb-3 opacity-10" />
                      <p className="text-xs font-black uppercase tracking-widest">Tidak ada arsip yang ditemukan</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 shrink-0 gap-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Halaman {currentPage} dari {totalPages || 1}
            </p>
            <div className="flex items-center gap-1.5">
              <button 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(prev => prev - 1)} 
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-[10px] font-black uppercase text-slate-500 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all"
              >
                Prev
              </button>
              <button 
                disabled={currentPage === totalPages || totalPages === 0} 
                onClick={() => setCurrentPage(prev => prev + 1)} 
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-[10px] font-black uppercase text-slate-500 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Sidebar Panel */}
      <aside className={`transition-all duration-500 ease-in-out border-l border-slate-200 bg-white flex flex-col shadow-2xl h-full sticky top-0 ${selectedArchive ? 'w-1/3 opacity-100' : 'w-0 opacity-0 invisible translate-x-10'}`}>
        {selectedArchive && (
          <div className="flex flex-col h-full animate-fadeIn overflow-hidden">
            {/* Header Panel */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg shadow-md transition-colors ${isEditing ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'}`}>
                  <div className="relative">
                    {isEditing ? <Edit className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                    {selectedArchive.isCloudSynced && <Cloud className="w-2.5 h-2.5 absolute -top-1 -right-1 text-emerald-400" />}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{isEditing ? 'Edit Metadata' : 'Ringkasan Arsip'}</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
                    {isEditing ? 'Sedang Melakukan Perubahan' : 'Record Quick View'}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedArchive(null)} className="p-2 rounded-full hover:bg-slate-200 transition-all text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-slate-50/20">
              {/* Preview */}
              {!isEditing && (
                <div className="aspect-[16/9] bg-white rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 relative group overflow-hidden shadow-sm">
                   {renderFilePreview(selectedArchive.title)}
                </div>
              )}

              {/* Status Cloud - Hanya muncul saat tidak edit */}
              {!isEditing && (
                <div className={`p-5 rounded-3xl flex items-center justify-between border-2 transition-all shadow-sm ${selectedArchive.isCloudSynced ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${selectedArchive.isCloudSynced ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-slate-100 text-slate-400'}`}>
                      {selectedArchive.isCloudSynced ? <Cloud className="w-5 h-5" /> : <CloudOff className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-700 uppercase tracking-tighter">Google Drive Sync</p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {selectedArchive.isCloudSynced ? `Terakhir disinkron: ${selectedArchive.lastSynced}` : 'Belum dicadangkan di Cloud'}
                      </p>
                    </div>
                  </div>
                  {selectedArchive.isCloudSynced ? (
                    <button 
                      onClick={handleFetchFromCloud}
                      disabled={isFetchingCloud}
                      title="Unduh Dari Google Drive"
                      className="p-2.5 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all active:scale-95 text-blue-600 disabled:opacity-50"
                    >
                      {isFetchingCloud ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CloudDownload className="w-4 h-4" />}
                    </button>
                  ) : (
                    <button 
                      onClick={handleSyncToDrive}
                      disabled={isSyncing}
                      title="Sinkronkan ke Cloud"
                      className="p-2.5 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all active:scale-95 text-slate-600 disabled:opacity-50"
                    >
                      {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin text-blue-600" /> : <RefreshCw className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              )}

              {/* Metadata Form / Display */}
              <div className="space-y-6">
                 {isEditing ? (
                   <div className="space-y-5 animate-slideIn">
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Judul Arsip Digital</label>
                       <div className="relative group">
                          <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                          <input 
                            value={editForm.title} 
                            onChange={e => setEditForm({...editForm, title: e.target.value})}
                            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-amber-100 focus:border-amber-400 transition-all shadow-sm"
                            placeholder="Ketik judul arsip baru..."
                          />
                       </div>
                     </div>

                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Pilih Kategori</label>
                       <div className="relative group">
                          <Tags className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-amber-500 transition-colors pointer-events-none" />
                          <select 
                            value={editForm.category} 
                            onChange={e => setEditForm({...editForm, category: e.target.value})}
                            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-amber-100 focus:border-amber-400 transition-all shadow-sm appearance-none cursor-pointer"
                          >
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                       </div>
                     </div>

                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Keterangan / Abstraksi</label>
                       <textarea 
                         value={editForm.description} 
                         onChange={e => setEditForm({...editForm, description: e.target.value})}
                         rows={5}
                         className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-4 focus:ring-amber-100 focus:border-amber-400 transition-all resize-none shadow-sm font-medium leading-relaxed"
                         placeholder="Berikan deskripsi tambahan..."
                       />
                     </div>
                   </div>
                 ) : (
                   <>
                     <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-blue-100 flex items-center gap-1.5">
                         <Tags className="w-3 h-3" />
                         {selectedArchive.category}
                       </span>
                       <span className="text-[10px] font-black text-slate-300 italic">#{selectedArchive.id}</span>
                     </div>
                     <h4 className="text-xl font-black text-slate-800 leading-tight">{selectedArchive.title}</h4>
                     <p className="text-xs text-slate-500 leading-relaxed font-medium bg-white p-5 rounded-2xl border border-slate-100 shadow-sm min-h-[100px]">
                       {selectedArchive.description || "Tidak ada rincian deskripsi tambahan untuk arsip ini."}
                     </p>
                   </>
                 )}
              </div>

              {/* Quick Info Grid - Hanya saat tidak edit */}
              {!isEditing && (
                <div className="grid grid-cols-2 gap-3">
                   <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Ukuran</p>
                      <p className="text-sm font-bold text-slate-700">{selectedArchive.totalSize} KB</p>
                   </div>
                   <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Tanggal Upload</p>
                      <p className="text-sm font-bold text-slate-700">{selectedArchive.uploadDate}</p>
                   </div>
                </div>
              )}

              {/* Files - Hanya saat tidak edit */}
              {!isEditing && (
                <div className="space-y-3 pb-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
                    <Paperclip className="w-3.5 h-3.5" />
                    Lampiran Berkas ({selectedArchive.files.length})
                  </p>
                  {selectedArchive.files.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-400 hover:shadow-md transition-all group/file shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-slate-50 rounded-lg group-hover/file:bg-blue-50 transition-colors">
                          {getSmallFileIcon(file.name)}
                        </div>
                        <div className="overflow-hidden max-w-[150px]">
                          <p className="text-xs font-bold text-slate-700 truncate">{file.name}</p>
                          <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">{file.size}</p>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-slate-300 group-hover/file:text-blue-600 cursor-pointer transition-colors" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions Sidebar Bottom */}
            <div className="p-6 border-t border-slate-100 bg-white flex flex-col gap-3 shrink-0">
              {isEditing ? (
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleSaveEdit} 
                    className="py-4 bg-amber-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-amber-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Simpan
                  </button>
                  <button 
                    onClick={handleCancelEdit} 
                    className="py-4 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 border border-slate-200 hover:bg-slate-200"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => onDownload(selectedArchive)} 
                    className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-200 flex items-center justify-center gap-3 hover:bg-blue-700 transition-all active:scale-95"
                  >
                    <Download className="w-5 h-5" /> Download Seluruh Berkas
                  </button>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={handleStartEdit} 
                      className="flex-1 py-3 bg-white border border-slate-200 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-amber-50 hover:border-amber-200 transition-all active:scale-95"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit Metadata
                    </button>
                    <button 
                      onClick={() => setIsShareModalOpen(true)}
                      className="flex-1 py-3 bg-white border border-slate-200 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-50 hover:border-indigo-200 transition-all active:scale-95"
                    >
                      <Share2 className="w-3.5 h-3.5" /> Share
                    </button>
                    <button 
                      className="flex-1 py-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-600 hover:text-white transition-all active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* Detail Modal & Share Modal ... Tetap Seperti Sebelumnya ... */}
      {isDetailModalOpen && selectedArchive && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-fadeIn" onClick={() => setIsDetailModalOpen(false)}></div>
          <div className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-modalPop transition-all border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="p-8 pb-4 flex justify-between items-start bg-slate-50/50 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-primary rounded-[1.5rem] text-white shadow-xl shadow-primary/20">
                  <FileSearch className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">{selectedArchive.category}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: #{selectedArchive.id}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">{selectedArchive.title}</h3>
                </div>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="p-3 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                  <section className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Info className="w-4 h-4 text-primary" /> Informasi Dasar Dokumen</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary transition-colors">
                         <div className="flex items-center gap-3 mb-2">
                           <Hash className="w-4 h-4 text-slate-400" />
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nomor Dokumen</p>
                         </div>
                         <p className="text-sm font-bold text-slate-700">{selectedArchive.documentNumber || 'Tidak Tersedia'}</p>
                      </div>
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary transition-colors">
                         <div className="flex items-center gap-3 mb-2">
                           <CalendarDays className="w-4 h-4 text-slate-400" />
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tahun Terbit</p>
                         </div>
                         <p className="text-sm font-bold text-slate-700">{selectedArchive.year || 'Tidak Tersedia'}</p>
                      </div>
                    </div>
                  </section>
                  <section className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Deskripsi & Abstraksi</h4>
                    <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm italic text-slate-600 leading-relaxed text-sm">
                      {selectedArchive.description || "Tidak ada deskripsi rinci yang tersedia untuk arsip ini."}
                    </div>
                  </section>
                </div>
                <div className="space-y-8">
                  <section className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Paperclip className="w-4 h-4 text-primary" /> Daftar Lampiran ({selectedArchive.files.length})</h4>
                    <div className="space-y-3">
                      {selectedArchive.files.map(file => (
                        <div key={file.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group/fitem hover:bg-white hover:shadow-md hover:border-primary/20 transition-all">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2 bg-white rounded-lg group-hover/fitem:bg-primary/5 transition-colors">{getSmallFileIcon(file.name)}</div>
                            <div className="overflow-hidden">
                              <p className="text-xs font-bold text-slate-700 truncate">{file.name}</p>
                              <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">{file.size}</p>
                            </div>
                          </div>
                          <button className="p-2 text-slate-300 hover:text-primary transition-colors"><Download className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-4 justify-between items-center shrink-0">
               <div className="flex gap-3 ml-auto">
                 <button onClick={() => setIsDetailModalOpen(false)} className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-100 transition-all">Tutup</button>
                 <button onClick={() => onDownload(selectedArchive)} className="px-10 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-hover transition-all flex items-center gap-2">
                   <Download className="w-4 h-4" /> Unduh Seluruh Berkas
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes modalPop { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
        .animate-modalPop { animation: modalPop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default FileManager;
