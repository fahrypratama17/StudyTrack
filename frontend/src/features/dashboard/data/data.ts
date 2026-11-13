import type { DashboardCourse, DashboardTask } from "../types/type";

const hoursFromNow = (hours: number): string => {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
};

export const dummyCourses: DashboardCourse[] = [
  {
    id: 1,
    name: "Pemrograman Web",
    kode: "IF2201",
    dosen: "Budi Santoso",
  },
  {
    id: 2,
    name: "Basis Data",
    kode: "IF2202",
    dosen: "Siti Rahmawati",
  },
  {
    id: 3,
    name: "Rekayasa Perangkat Lunak",
    kode: "IF2203",
    dosen: "Andi Pratama",
  },
  {
    id: 4,
    name: "Jaringan Komputer",
    kode: "IF2204",
    dosen: "Dewi Lestari",
  },
];

export const dummyTasks: DashboardTask[] = [
  {
    id: 1,
    judul: "Mengerjakan Frontend Dashboard",
    deskripsi: "Implementasi UI dashboard menggunakan React.",
    deadline: hoursFromNow(3),
    status: "belum",
    created_at: hoursFromNow(-5),
    mata_kuliah_id: 1,
    mata_kuliah: "Pemrograman Web",
  },
  {
    id: 2,
    judul: "Laporan Praktikum SQL",
    deskripsi: "Menyelesaikan laporan query database.",
    deadline: hoursFromNow(20),
    status: "belum",
    created_at: hoursFromNow(-12),
    mata_kuliah_id: 2,
    mata_kuliah: "Basis Data",
  },
  {
    id: 3,
    judul: "Dokumentasi Use Case Diagram",
    deskripsi: "Membuat diagram kebutuhan sistem.",
    deadline: hoursFromNow(-6),
    status: "belum",
    created_at: hoursFromNow(-72),
    mata_kuliah_id: 3,
    mata_kuliah: "Rekayasa Perangkat Lunak",
  },
  {
    id: 4,
    judul: "Konfigurasi Routing Jaringan",
    deskripsi: "Simulasi routing menggunakan Packet Tracer.",
    deadline: hoursFromNow(72),
    status: "belum",
    created_at: hoursFromNow(-2),
    mata_kuliah_id: 4,
    mata_kuliah: "Jaringan Komputer",
  },
  {
    id: 5,
    judul: "Membuat ERD Database",
    deskripsi: "Merancang relasi antartabel.",
    deadline: hoursFromNow(-48),
    status: "selesai",
    created_at: hoursFromNow(-96),
    mata_kuliah_id: 2,
    mata_kuliah: "Basis Data",
  },
  {
    id: 6,
    judul: "Latihan React Components",
    deskripsi: "Membuat reusable components.",
    deadline: hoursFromNow(24),
    status: "selesai",
    created_at: hoursFromNow(-24),
    mata_kuliah_id: 1,
    mata_kuliah: "Pemrograman Web",
  },
];
