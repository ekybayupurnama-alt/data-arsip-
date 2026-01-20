
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Folder, 
  ChevronRight,
  X,
  Check,
  FolderPlus,
  ArrowUp,
  ArrowDown,
  Save,
  ChevronDown,
  Search,
  Maximize2,
  Minimize2,
  Layers,
  MoreVertical,
  PlusCircle
} from 'lucide-react';
import { Category, ArchiveDocument } from '../types';

interface CategoryManagerProps {
  categories: Category[];
  setCategories: (cats: Category[]) => void;
  archives: ArchiveDocument[];
}

const CategoryModal = ({ isOpen, onClose, onSave, category, parentId, categories }) => {
  if (!isOpen) return null;

  const [name, setName] = useState(category?.name || '');
  const [currentParentId, setCurrentParentId] = useState(category?.parentId || parentId || null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      ...category,
      name,
      parentId: currentParentId,
    });
    onClose();
  };

  const renderCategoryOptions = (parentId = null, depth = 0) => {
    return categories
      .filter(c => c.parentId === parentId)
      .sort((a,b) => a.order - b.order)
      .flatMap(c => [
        <option key={c.id} value={c.id} disabled={category?.id === c.id}>
          {'\u00A0'.repeat(depth * 4)} L {c.name}
        </option>,
        ...renderCategoryOptions(c.id, depth + 1)
      ]);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp">
        <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">
            {category ? 'Edit Kategori' : 'Tambah Kategori Baru'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200"><X className="w-4 h-4 text-slate-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nama Kategori</label>
            <input 
              autoFocus
              type="text" 
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 font-bold shadow-inner"
              placeholder="e.g., Laporan Keuangan"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Kategori Induk (Opsional)</label>
            <select
              value={currentParentId || ''}
              onChange={(e) => setCurrentParentId(e.target.value || null)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary appearance-none font-bold"
            >
              <option value="">-- Kategori Utama --</option>
              {renderCategoryOptions()}
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-3 text-xs font-black text-slate-500 hover:bg-slate-100 rounded-xl transition-colors uppercase tracking-widest">
              Batal
            </button>
            <button type="submit" className="px-6 py-3 bg-primary text-white text-xs font-black rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all uppercase tracking-widest flex items-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Simpan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, setCategories, archives }) => {
  const [modalState, setModalState] = useState<{ isOpen: boolean; category: Category | null; parentId: string | null }>({ isOpen: false, category: null, parentId: null });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const documentCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    archives.forEach(doc => {
      counts[doc.category] = (counts[doc.category] || 0) + 1;
    });
    return counts;
  }, [archives]);

  const handleExpandAll = () => {
    setCollapsedIds(new Set());
  };

  const handleCollapseAll = () => {
    const allIds = categories.filter(c => categories.some(child => child.parentId === c.id)).map(c => c.id);
    setCollapsedIds(new Set(allIds));
  };
  
  const handleSaveCategory = (catData: Partial<Category> & { name: string }) => {
    if (catData.id) { // Update
      setCategories(categories.map(c => c.id === catData.id ? { ...c, name: catData.name, parentId: catData.parentId || null } : c));
    } else { // Create
      const newCat: Category = {
        id: `cat-${Math.random().toString(16).slice(2, 10)}`,
        name: catData.name,
        parentId: catData.parentId || null,
        order: categories.filter(c => c.parentId === (catData.parentId || null)).length
      };
      setCategories([...categories, newCat]);
    }
  };

  const handleDelete = (id: string) => {
    const getDescendants = (parentId: string): string[] => {
      const children = categories.filter(c => c.parentId === parentId);
      return children.reduce((acc, child) => [...acc, child.id, ...getDescendants(child.id)], [] as string[]);
    };
    const toDelete = [id, ...getDescendants(id)];
    setCategories(categories.filter(c => !toDelete.includes(c.id)));
    setConfirmDeleteId(null);
  };
  
  const handleMove = (id: string, direction: 'up' | 'down') => {
    const cat = categories.find(c => c.id === id);
    if (!cat) return;
    const siblings = categories.filter(c => c.parentId === cat.parentId).sort((a,b)=>a.order - b.order);
    const currentIndex = siblings.findIndex(s => s.id === id);
    
    if (direction === 'up' && currentIndex > 0) {
      const prevSibling = siblings[currentIndex - 1];
      const updated = categories.map(c => {
        if (c.id === id) return {...c, order: prevSibling.order};
        if (c.id === prevSibling.id) return {...c, order: cat.order};
        return c;
      });
      setCategories(updated);
    } else if (direction === 'down' && currentIndex < siblings.length - 1) {
      const nextSibling = siblings[currentIndex + 1];
      const updated = categories.map(c => {
        if (c.id === id) return {...c, order: nextSibling.order};
        if (c.id === nextSibling.id) return {...c, order: cat.order};
        return c;
      });
      setCategories(updated);
    }
  };

  const renderCategory = (cat: Category, depth = 0) => {
    const children = categories.filter(c => c.parentId === cat.id).sort((a,b)=>a.order - b.order);
    const isCollapsed = collapsedIds.has(cat.id);
    
    // Simple search filter
    if (searchQuery && !cat.name.toLowerCase().includes(searchQuery.toLowerCase()) && !children.some(child => child.name.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return null;
    }

    const siblings = categories.filter(c => c.parentId === cat.parentId).sort((a,b)=>a.order - b.order);
    const currentIndex = siblings.findIndex(s => s.id === cat.id);
    const canMoveUp = currentIndex > 0;
    const canMoveDown = currentIndex < siblings.length - 1;

    return (
      <div key={cat.id} className="relative">
        <div 
          className="flex items-center group space-x-3 my-1 relative"
          style={{ paddingLeft: `${depth * 32}px` }}
        >
          {/* Vertical Guide Line */}
          {depth > 0 && (
            <div 
              className="absolute left-[14px] top-[-20px] bottom-0 w-px bg-slate-200"
              style={{ left: `${(depth - 1) * 32 + 14}px` }}
            ></div>
          )}
          {/* Horizontal Connector Line */}
          {depth > 0 && (
            <div 
              className="absolute w-4 h-px bg-slate-200"
              style={{ left: `${(depth - 1) * 32 + 14}px`, top: '50%' }}
            ></div>
          )}

          <button 
            onClick={() => setCollapsedIds(prev => { const next = new Set(prev); if(next.has(cat.id)) next.delete(cat.id); else next.add(cat.id); return next; })} 
            className={`w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-primary transition-all z-10 bg-white border border-transparent hover:border-slate-200 ${children.length === 0 ? 'invisible' : ''}`}
          >
            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${!isCollapsed ? 'rotate-90' : ''}`} />
          </button>

          <div className={`flex-1 flex items-center justify-between p-3 pl-4 bg-white border border-slate-200 rounded-2xl hover:border-primary hover:shadow-md transition-all group/card ${confirmDeleteId === cat.id ? 'border-rose-300 bg-rose-50/30' : ''}`}>
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-xl transition-colors ${confirmDeleteId === cat.id ? 'bg-rose-100 text-rose-600' : 'bg-slate-50 text-slate-400 group-hover/card:bg-primary/10 group-hover/card:text-primary'}`}>
                <Folder className="w-5 h-5" />
              </div>
              <div>
                <span className={`text-sm font-black transition-colors ${confirmDeleteId === cat.id ? 'text-rose-700' : 'text-slate-800 group-hover/card:text-primary'}`}>{cat.name}</span>
                <div className="flex items-center mt-0.5 space-x-3">
                   <span className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                     <Layers className="w-3 h-3 mr-1 opacity-50" />
                     {documentCounts[cat.name] || 0} Arsip
                   </span>
                   {children.length > 0 && (
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">
                        {children.length} Sub
                      </span>
                   )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
              {confirmDeleteId !== cat.id ? (
                <>
                  <div className="flex items-center mr-2 pr-2 border-r border-slate-100 space-x-1">
                    <button 
                      onClick={() => handleMove(cat.id, 'up')} 
                      disabled={!canMoveUp}
                      className={`p-2 rounded-lg transition-colors ${canMoveUp ? 'hover:bg-slate-100 text-slate-500' : 'text-slate-200 cursor-not-allowed'}`} 
                      title="Naik"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleMove(cat.id, 'down')} 
                      disabled={!canMoveDown}
                      className={`p-2 rounded-lg transition-colors ${canMoveDown ? 'hover:bg-slate-100 text-slate-500' : 'text-slate-200 cursor-not-allowed'}`} 
                      title="Turun"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button onClick={() => setModalState({ isOpen: true, category: null, parentId: cat.id })} className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors" title="Tambah Sub-Kategori"><FolderPlus className="w-4 h-4" /></button>
                  <button onClick={() => setModalState({ isOpen: true, category: cat, parentId: null })} className="p-2 rounded-lg hover:bg-amber-100 text-amber-600 transition-colors" title="Edit"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => setConfirmDeleteId(cat.id)} className="p-2 rounded-lg hover:bg-rose-100 text-rose-600 transition-colors" title="Hapus"><Trash2 className="w-4 h-4" /></button>
                </>
              ) : (
                <div className="flex items-center space-x-2 bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl animate-fadeIn">
                  <span className="text-[10px] font-black text-rose-700 uppercase tracking-widest mr-2">Hapus?</span>
                  <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-sm"><Check className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setConfirmDeleteId(null)} className="p-1.5 rounded-lg bg-white text-slate-600 hover:bg-slate-100 transition-colors border border-rose-200"><X className="w-3.5 h-3.5" /></button>
                </div>
              )}
            </div>
          </div>
        </div>
        {!isCollapsed && (
          <div className="relative">
            {children.map((child) => renderCategory(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16 relative min-h-full">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Manajemen Klasifikasi</h1>
          <p className="text-slate-400 text-sm font-medium mt-1">Strukturisasi hierarki arsip untuk organisasi data yang maksimal.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-white border border-slate-200 rounded-2xl p-1 flex shadow-sm">
             <button onClick={handleExpandAll} className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-500 transition-all flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest" title="Expand All">
               <Maximize2 className="w-4 h-4" />
               <span className="hidden sm:inline">Buka Semua</span>
             </button>
             <div className="w-px h-6 bg-slate-100 my-auto"></div>
             <button onClick={handleCollapseAll} className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-500 transition-all flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest" title="Collapse All">
               <Minimize2 className="w-4 h-4" />
               <span className="hidden sm:inline">Tutup Semua</span>
             </button>
           </div>
           <button 
             onClick={() => setModalState({ isOpen: true, category: null, parentId: null })}
             className="flex items-center space-x-2 px-6 py-4 bg-primary text-white rounded-[1.5rem] text-xs font-black uppercase tracking-[0.15em] hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 active:scale-95"
           >
             <Plus className="w-5 h-5" />
             <span>Tambah Kategori Utama</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Search & Filter Bar with Add Button */}
        <div className="bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
           <div className="relative flex-1 w-full flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300" />
                <input 
                  type="text" 
                  placeholder="Cari kategori spesifik..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
                />
              </div>
              <button 
                onClick={() => setModalState({ isOpen: true, category: null, parentId: null })}
                className="bg-primary/10 text-primary p-4 rounded-2xl hover:bg-primary hover:text-white transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest shadow-sm"
                title="Cepat Tambah Kategori"
              >
                <PlusCircle className="w-5 h-5" />
                <span className="hidden md:inline">Tambah Baru</span>
              </button>
           </div>
           <div className="flex items-center gap-3 px-4">
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Struktur</p>
                <p className="text-sm font-black text-slate-800 mt-1">{categories.length} Unit</p>
             </div>
             <div className="w-px h-8 bg-slate-100 mx-2"></div>
             <Folder className="w-8 h-8 text-primary/20" />
           </div>
        </div>

        {/* Categories Tree Container */}
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm p-10 min-h-[400px]">
          {categories.filter(c => !c.parentId).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                 <FolderPlus className="w-12 h-12 text-slate-300 opacity-20" />
              </div>
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest">Database Kategori Kosong</h3>
              <p className="text-sm font-medium text-slate-500 mt-2 max-w-xs mb-8">Tekan tombol di bawah untuk mulai membuat struktur organisasi arsip Anda.</p>
              <button 
                onClick={() => setModalState({ isOpen: true, category: null, parentId: null })}
                className="flex items-center space-x-2 px-8 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary-hover transition-all shadow-xl shadow-primary/20"
              >
                <Plus className="w-5 h-5" />
                <span>Buat Kategori Pertama</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {categories
                .filter(c => !c.parentId)
                .sort((a,b)=>a.order - b.order)
                .map(cat => renderCategory(cat))
              }
              
              {/* Empty state during search */}
              {searchQuery && categories.every(cat => !cat.name.toLowerCase().includes(searchQuery.toLowerCase())) && (
                <div className="py-20 text-center text-slate-400">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="font-bold uppercase text-[10px] tracking-widest">Tidak ada kategori yang cocok dengan "{searchQuery}"</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setModalState({ isOpen: true, category: null, parentId: null }); }}
                    className="mt-4 text-primary font-black uppercase text-[10px] tracking-widest hover:underline"
                  >
                    Tambah "{searchQuery}" sebagai kategori baru?
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button (FAB) for quick add */}
      <button 
        onClick={() => setModalState({ isOpen: true, category: null, parentId: null })}
        className="fixed bottom-10 right-10 w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[40] group"
        title="Tambah Kategori Baru"
      >
        <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
        <div className="absolute right-20 bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-lg">
          Tambah Kategori
        </div>
      </button>
      
      <CategoryModal 
        isOpen={modalState.isOpen} 
        onClose={() => setModalState({ isOpen: false, category: null, parentId: null })} 
        onSave={handleSaveCategory}
        category={modalState.category}
        parentId={modalState.parentId}
        categories={categories}
      />
      
      <style>{`
        @keyframes slideUp { from { transform: translateY(20px) scale(0.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        .animate-slideUp { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default CategoryManager;
