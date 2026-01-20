
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Trash2, 
  FileText,
  Download,
  Edit,
  Plus,
  X,
  Check,
  AlertCircle,
  Eye,
  FileSpreadsheet,
  FileArchive,
  Trash
} from 'lucide-react';
import { ArchiveDocument, Category, User, ViewType } from '../types';

interface ArchiveListProps {
  archives: ArchiveDocument[];
  categories: Category[];
  onDelete: (id: string) => void;
  onUpdate: (updatedDoc: ArchiveDocument) => void;
  onDownload: (doc: ArchiveDocument) => void;
  currentUser: User | null;
  setView: (view: ViewType) => void;
  onClearAll: () => void;
}

const getFileIcon = (mimeType: string = '', fileName: string = '') => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'pdf' || mimeType.includes('pdf')) return <FileText className="w-4 h-4 text-rose-500" />;
  if (ext === 'xlsx' || ext === 'xls' || mimeType.includes('sheet')) return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
  if (['zip', 'rar', '7z', 'tar'].includes(ext || '')) return <FileArchive className="w-4 h-4 text-amber-500" />;
  return <FileText className="w-4 h-4 text-slate-400" />;
};

const ArchiveList: React.FC<ArchiveListProps> = ({ 
  archives, 
  categories, 
  onDelete, 
  onUpdate, 
  onDownload,
  currentUser, 
  setView, 
  onClearAll 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<{title: string, description: string, category: string}>({title: '', description: '', category: ''});

  const isAdmin = currentUser?.role === 'ADMIN';

  const filteredArchives = useMemo(() => {
    return archives.filter(doc => {
      const matchSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === 'all' || doc.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [archives, searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredArchives.length / entriesToShow);
  const currentEntries = filteredArchives.slice((currentPage - 1) * entriesToShow, currentPage * entriesToShow);

  const startEdit = (doc: ArchiveDocument) => {
    setEditingDocId(doc.id);
    setEditFormData({
      title: doc.title,
      description: doc.description,
      category: doc.category
    });
  };

  const saveEdit = (doc: ArchiveDocument) => {
    onUpdate({
      ...doc,
      title: editFormData.title,
      description: editFormData.description,
      category: editFormData.category
    });
    setEditingDocId(null);
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">
        <span className="hover:text-blue-600 cursor-pointer" onClick={() => setView('DASHBOARD')}>Home</span>
        <span className="mx-2 opacity-50">»</span>
        <span className="text-blue-600">Manajemen Dokumen</span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-sm font-black text-slate-700 uppercase tracking-tight">Data Arsip Universitas</h2>
          {isAdmin && (
            <button 
              onClick={() => setView('UPLOAD')}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all text-[10px] font-black uppercase shadow-md active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Unggah Dokumen Baru</span>
            </button>
          )}
        </div>

        <div className="p-5 space-y-5">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Cari Dokumen</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="text" 
                  placeholder="Ketik judul arsip..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="md:col-span-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Filter Kategori</label>
              <select 
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-400"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Semua Kategori</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-5 flex justify-end space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase hover:bg-slate-200 transition-all">
                <Download className="w-3.5 h-3.5" />
                <span>Export Tabel</span>
              </button>
              {isAdmin && (
                <button onClick={onClearAll} className="flex items-center space-x-2 px-4 py-2.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg text-[10px] font-black uppercase hover:bg-rose-600 hover:text-white transition-all">
                  <Trash className="w-3.5 h-3.5" />
                  <span>Hapus Semua</span>
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#f8f9fa] border-b border-slate-200 text-slate-500 font-black uppercase tracking-widest">
                <tr>
                  <th className="px-4 py-4 w-10">No</th>
                  <th className="px-4 py-4">Informasi Dokumen</th>
                  <th className="px-4 py-4">Kategori</th>
                  <th className="px-4 py-4 text-center">Ukuran</th>
                  <th className="px-4 py-4">Diupload Pada</th>
                  <th className="px-4 py-4 text-center">Aksi Operasional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentEntries.map((doc, idx) => {
                  const isEditing = editingDocId === doc.id;
                  return (
                    <tr key={doc.id} className={`transition-colors ${isEditing ? 'bg-blue-50/50' : 'hover:bg-slate-50/80'}`}>
                      <td className="px-4 py-4 text-slate-400 font-bold">{(currentPage - 1) * entriesToShow + idx + 1}</td>
                      <td className="px-4 py-4">
                        {isEditing ? (
                          <div className="space-y-2 max-w-xs">
                            <input 
                              className="w-full px-2 py-1 border border-blue-300 rounded outline-none" 
                              value={editFormData.title} 
                              onChange={e => setEditFormData({...editFormData, title: e.target.value})}
                            />
                            <textarea 
                              className="w-full px-2 py-1 border border-blue-300 rounded outline-none text-[10px]" 
                              value={editFormData.description}
                              onChange={e => setEditFormData({...editFormData, description: e.target.value})}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <div className="p-2.5 bg-white border border-slate-100 rounded-lg shadow-sm">
                              {getFileIcon(doc.files[0]?.mimeType, doc.files[0]?.name)}
                            </div>
                            <div>
                              <p className="font-black text-slate-700">{doc.title}</p>
                              <p className="text-[10px] text-slate-400 truncate max-w-[250px] font-medium">{doc.description}</p>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {isEditing ? (
                          <select 
                            className="px-2 py-1 border border-blue-300 rounded outline-none text-[10px]"
                            value={editFormData.category}
                            onChange={e => setEditFormData({...editFormData, category: e.target.value})}
                          >
                            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                          </select>
                        ) : (
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase border border-indigo-100">
                            {doc.category}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center text-slate-500 font-bold">{doc.totalSize}</td>
                      <td className="px-4 py-4 text-slate-400 font-medium">{doc.uploadDate}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center space-x-1.5">
                          {isEditing ? (
                            <>
                              <button onClick={() => saveEdit(doc)} className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 shadow-sm" title="Simpan"><Check className="w-3.5 h-3.5" /></button>
                              <button onClick={() => setEditingDocId(null)} className="p-2 bg-slate-400 text-white rounded-lg hover:bg-slate-500 shadow-sm" title="Batal"><X className="w-3.5 h-3.5" /></button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => onDownload(doc)} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm" title="Download File"><Download className="w-3.5 h-3.5" /></button>
                              {isAdmin && (
                                <>
                                  <button onClick={() => startEdit(doc)} className="p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 shadow-sm" title="Edit Metadata"><Edit className="w-3.5 h-3.5" /></button>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); onDelete(doc.id); }} 
                                    className="p-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 shadow-sm" 
                                    title="Hapus Permanen"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {currentEntries.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-20 text-center">
                      <div className="flex flex-col items-center opacity-20">
                        <AlertCircle className="w-16 h-16 mb-2" />
                        <p className="text-sm font-black uppercase tracking-[0.2em]">Data Tidak Ditemukan</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-50">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Total {filteredArchives.length} entitas dokumen arsip
            </p>
            <div className="flex items-center space-x-1">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase hover:bg-slate-50 disabled:opacity-30 transition-all"
              >
                Pertama
              </button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-400'}`}
                  >
                    {i + 1}
                  </button>
                )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
              </div>
              <button 
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(totalPages)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase hover:bg-slate-50 disabled:opacity-30 transition-all"
              >
                Terakhir
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start space-x-3">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <Eye className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-black text-blue-800 uppercase tracking-tight">Informasi Hak Akses</h4>
          <p className="text-[10px] text-blue-700 leading-relaxed font-medium mt-1">
            Sebagai <span className="font-black underline">{currentUser?.role}</span>, Anda memiliki akses untuk {isAdmin ? 'mengelola penuh seluruh dokumen arsip universitas termasuk modifikasi data.' : 'melihat dan mengunduh dokumen yang tersedia untuk keperluan administrasi.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArchiveList;
