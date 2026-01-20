
export type Role = 'ADMIN' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  status: 'Active' | 'Invited' | 'Suspended';
  joinDate: string;
}

export interface Category {
  id: string;
  name: string;
  parentId?: string | null;
  order: number;
}

export interface ArchiveFile {
  id: string;
  name: string;
  size: string;
  mimeType: string;
}

export interface ArchiveDocument {
  id: string;
  title: string;
  description: string;
  category: string; 
  uploadDate: string;
  totalSize: string;
  files: ArchiveFile[];
  contentSnippet?: string;
  aiSummary?: string;
  documentNumber?: string;
  year?: string;
  isCloudSynced?: boolean; // New: status sinkronisasi
  lastSynced?: string; // New: waktu sinkronisasi terakhir
}

export type ViewType = 'DASHBOARD' | 'LIST' | 'UPLOAD' | 'AI_SEARCH' | 'CATEGORIES' | 'MAINTENANCE' | 'PROFILE' | 'SETTINGS' | 'FILE_MANAGER' | 'USERS' | 'DOWNLOAD_HISTORY';

export interface NavMenuItem {
  id: ViewType;
  label: string;
  icon: string;
  show: boolean;
  section?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface AppSettings {
  appName: string;
  themeColor: 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
  menus: NavMenuItem[];
  auditLogs: AuditLog[];
}

export interface BackupData {
  version: string;
  timestamp: string;
  archives: ArchiveDocument[];
  categories: Category[];
}
