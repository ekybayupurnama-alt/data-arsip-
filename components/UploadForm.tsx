
import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Sparkles,
  X,
  FileCode,
  FileBox,
  Video,
  Music,
  Image as ImageIcon,
  ArrowRight
} from 'lucide-react';
import { ArchiveDocument, ArchiveFile, Category } from '../types';
import { summarizeDocument, suggestCategory } from '../services/geminiService';

interface UploadFormProps {
  onAddArchive: (archive: ArchiveDocument) => void;
  categories: Category[];
  onComplete?: () => void;
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return <FileText className="w-5 h-5 text-emerald-600" />;
  if (mimeType.includes('word') || mimeType.includes('officedocument')) return <FileText className="w-5 h-5 text-blue-600" />;
  if (mimeType.includes('image')) return <ImageIcon className="w-5 h-5 text-purple-500" />;
  if (mimeType.includes('video')) return <Video className="w-5 h-5 text-amber-500" />;
  if (mimeType.includes('audio')) return <Music className="w-5 h-5 text-pink-500" />;
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('compressed')) return <FileBox className="w-5 h-5 text-slate-600" />;
  return <FileCode className="w-5 h-5 text-slate-400" />;
};

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const UploadForm: React.FC<UploadFormProps> = ({ onAddArchive, categories, onComplete }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{ category: string; summary: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files) as File[];
      setSelectedFiles(prev => [...prev, ...newFiles]);
      if (title === '' && newFiles.length > 0) {
        const firstFileName = newFiles[0].name.split('.').slice(0, -1).join('.');
        setTitle(firstFileName || newFiles[0].name);
      }
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0 || !title) return;

    setIsProcessing(true);

    try {
      const fileList: ArchiveFile[] = selectedFiles.map(f => ({
        id: Math.random().toString(36).substr(2, 5),
        name: f.name,
        size: formatSize(f.size),
        mimeType: f.type
      }));

      const totalSizeBytes = selectedFiles.reduce((acc, f) => acc + f.size, 0);
      const totalSizeStr = formatSize(totalSizeBytes);

      const filesContext = selectedFiles.map(f => f.name).join(', ');
      const mockContent = `Dokumen "${title}" terdiri dari file: ${filesContext}. Deskripsi: ${description}`;
      
      const summary = await summarizeDocument(title, mockContent);
      
      const categoryNames = categories.map(c => c.name);
      const category = await suggestCategory(title, description, categoryNames);

      const newArchive: ArchiveDocument = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        description: description || `Arsip dengan ${selectedFiles.length} file pendukung.`,
        category: category,
        uploadDate: new Date().toISOString().split('T')[0],
        totalSize: totalSizeStr,
        files: fileList,
        contentSnippet: mockContent,
        aiSummary: summary
      };

      onAddArchive(newArchive);
      setAiSuggestions({ category, summary });
      setIsSuccess(true);
      
      setSelectedFiles([]);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn pb-12">
      {!isSuccess ? (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div className="p-10 bg-gradient-to-r from-blue-700 to-indigo-800 text-white relative overflow-hidden">
            <Sparkles className="absolute -top-4 -right-4 w-40 h-40 opacity-10 rotate-12" />
            <h3 className="text-3xl font-black mb-2">Unggah Arsip Digital</h3>
            <p className="text-blue-100 text-sm font-medium opacity-80 uppercase tracking-widest">Digitalisasi Dokumen Universitas YPIB</p>
          </div>

          <form onSubmit={handleUpload} className="p-8 space-y-6">
            <div className="relative">
              <input type="file" multiple onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 flex flex-col items-center justify-center bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer">
                <div className="p-5 bg-white rounded-full shadow-md mb-4 text-blue-600"><UploadCloud className="w-12 h-12" /></div>
                <p className="font-black text-slate-800 text-center uppercase text-sm tracking-widest">Pilih Dokumen Anda</p>
                <p className="text-[10px] text-slate-400 mt-2 font-bold">Mendukung PDF, Excel, Word, Zip, dsb.</p>
              </div>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                  <span>Antrian Upload ({selectedFiles.length})</span>
                </h4>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {selectedFiles.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-2xl group shadow-sm">
                      <div className="flex items-center space-x-3 overflow-hidden">
                        {getFileIcon(f.type)}
                        <div className="overflow-hidden">
                          <p className="text-sm font-black text-slate-700 truncate">{f.name}</p>
                          <p className="text-[9px] text-slate-400 uppercase font-black">{formatSize(f.size)}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => removeFile(i)} className="p-2 text-slate-300 hover:text-rose-600 transition-colors"><X className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6 pt-2">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Judul Dokumen Resmi</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Misal: Laporan Keuangan Semester 1" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-black text-slate-700" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Keterangan / Abstraksi Dokumen</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Jelaskan isi singkat dokumen untuk mempermudah pencarian..." rows={4} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none font-medium text-slate-600" />
              </div>
            </div>

            <button type="submit" disabled={selectedFiles.length === 0 || isProcessing} className={`w-full py-5 rounded-[2rem] font-black flex items-center justify-center space-x-3 transition-all uppercase text-xs tracking-[0.2em] shadow-xl ${selectedFiles.length === 0 || isProcessing ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'}`}>
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> <span>Mengindeks Arsip...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> <span>Simpan Permanen</span>
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] shadow-2xl p-16 text-center border border-slate-100 space-y-8">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-50"><CheckCircle2 className="w-14 h-14" /></div>
          <h3 className="text-4xl font-black text-slate-800">Berhasil Disimpan!</h3>
          <div className="max-w-md mx-auto p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 text-left space-y-6">
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Klasifikasi AI Otomatis</p>
              <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase">{aiSuggestions?.category}</span>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Analisis Singkat AI</p>
              <p className="text-slate-600 italic text-sm leading-relaxed font-medium">"{aiSuggestions?.summary}"</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button onClick={() => { setIsSuccess(false); setAiSuggestions(null); }} className="px-10 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-50 transition-all">Upload Lagi</button>
            <button onClick={onComplete} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center space-x-2">
              <span>Kembali Ke Daftar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
