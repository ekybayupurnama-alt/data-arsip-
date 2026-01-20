
import { ArchiveDocument, Category, User } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-dasar', name: 'Arsip Dasar', parentId: null, order: 0 },
  { id: 'cat-internal', name: 'Arsip Internal', parentId: null, order: 1 },
  { id: 'cat-surat', name: 'Arsip Surat', parentId: null, order: 2 },
  { id: 'cat-umum', name: 'Arsip Umum', parentId: null, order: 3 },
  { id: 'cat-kerja', name: 'Berkas Kerja', parentId: null, order: 4 },
  { id: 'cat-sehat', name: 'Dokumen Kesehatan', parentId: null, order: 5 },
  { id: 'cat-sk', name: 'Surat Keputusan', parentId: null, order: 6 },
  { id: 'cat-tenaga', name: 'Urusan Tenaga', parentId: null, order: 7 },
];

export const INITIAL_ARCHIVES: ArchiveDocument[] = [
  {
    id: '1',
    title: 'Arsip 201608-D482',
    documentNumber: '201608-D482',
    year: '2016',
    description: 'Dokumen arsip dasar unit 482',
    category: 'Arsip Dasar',
    uploadDate: '2020-01-28',
    totalSize: '77',
    files: [{ id: 'f1', name: '201608-D482.pdf', size: '77 KB', mimeType: 'application/pdf' }]
  },
  {
    id: '2',
    title: 'Arsip 201608-D481',
    documentNumber: '201608-D481',
    year: '2016',
    description: 'Dokumen arsip dasar unit 481',
    category: 'Arsip Dasar',
    uploadDate: '2020-01-28',
    totalSize: '67',
    files: [{ id: 'f2', name: '201608-D481.pdf', size: '67 KB', mimeType: 'application/pdf' }]
  },
  {
    id: '3',
    title: 'Laporan Keuangan Internal',
    documentNumber: 'INT-2023-001',
    year: '2023',
    description: 'Rekapitulasi anggaran internal',
    category: 'Arsip Internal',
    uploadDate: '2023-10-15',
    totalSize: '124',
    files: [{ id: 'f3', name: 'internal_report.pdf', size: '124 KB', mimeType: 'application/pdf' }]
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'admin-1',
    name: 'Administrator',
    email: 'admin@e-arsip.com',
    role: 'ADMIN',
    avatar: 'https://i.pravatar.cc/150?u=admin-1',
    status: 'Active',
    joinDate: '2023-01-15',
  }
];
