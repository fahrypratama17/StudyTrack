import {
  UserRoundPlus,
  BookOpen,
  ClipboardList,
  CalendarCheck,
} from "lucide-react";

export const steps = [
  {
    id: 1,
    title: "Buat Akun",
    description:
      "Daftar dan masuk ke StudyTrack untuk mulai mengelola aktivitas kuliahmu.",
    icon: UserRoundPlus,
  },
  {
    id: 2,
    title: "Tambah Mata Kuliah",
    description:
      "Masukkan daftar mata kuliah yang kamu ambil pada semester ini.",
    icon: BookOpen,
  },
  {
    id: 3,
    title: "Catat Tugas",
    description:
      "Tambahkan tugas, pilih mata kuliah, dan tentukan deadline pengumpulannya.",
    icon: ClipboardList,
  },
  {
    id: 4,
    title: "Pantau Deadline",
    description:
      "Lihat tugas yang mendekati deadline dan tandai tugas yang sudah selesai.",
    icon: CalendarCheck,
  },
];
