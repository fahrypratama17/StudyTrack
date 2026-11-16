# StudyTrack

Aplikasi pengelolaan mata kuliah dan tugas dengan reminder deadline. Frontend React + TypeScript + Vite terhubung ke REST API Express + TypeScript. Data disimpan di **PostgreSQL**, bukan file JSON.

## Fitur

- Registrasi, login, logout, serta pemulihan sesi melalui JWT. Halaman aplikasi memerlukan login.
- Dashboard dengan statistik, progres, tugas prioritas, dan tugas terbaru dari database pengguna.
- Tambah, lihat, edit, hapus, dan cari mata kuliah. Menghapus mata kuliah juga menghapus tugas terkait.
- Tambah, edit, hapus, cari, filter, dan tandai tugas sebagai selesai/belum selesai.
- Penanda deadline berdasarkan kategori dari backend: mendesak (sisa kurang dari 24 jam), terlambat (deadline tercapai/terlewati), dan normal. Tugas selesai tidak memicu reminder.
- Profil pengguna: lihat email, ubah nama, dan ganti password dengan verifikasi password lama.

## Prasyarat

- Node.js **22.12+** dan npm.
- **Docker Desktop yang sudah berjalan** dengan Docker Compose, atau PostgreSQL 18 lokal.
- Port default: frontend `5173`, backend `4000`, dan PostgreSQL Docker `5433`.

Perintah berikut menggunakan **PowerShell** dan dimulai dari folder utama proyek. Untuk Bash, ganti perintah salin konfigurasi dengan `cp backend/.env.example backend/.env` dan `cp frontend/.env.example frontend/.env` apabila file belum ada.

## Setup pertama kali

### 1. Instal dependency dan siapkan konfigurasi

```powershell
npm --prefix backend ci
npm --prefix frontend ci

if (!(Test-Path backend/.env)) { Copy-Item backend/.env.example backend/.env }
if (!(Test-Path frontend/.env)) { Copy-Item frontend/.env.example frontend/.env }
```

Jika `.env` sudah ada dari versi sebelumnya, **lengkapi variabelnya** menggunakan contoh di bawah. Perintah di atas mempertahankan file yang sudah ada.

Isi `backend/.env` untuk database Docker bawaan:

```dotenv
PORT=4000
JWT_SECRET=studytrack-secret-key-change-this
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/studytrack
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Isi `frontend/.env`:

```dotenv
VITE_API_BASE_URL=/api
VITE_API_PROXY_TARGET=http://localhost:4000
```

`VITE_API_BASE_URL` adalah alamat API yang digunakan browser dan harus menyertakan `/api`. Pada development, nilai `/api` diteruskan oleh proxy Vite ke `VITE_API_PROXY_TARGET`. Jika port backend diubah, sesuaikan target proxy. Jangan memasukkan password database atau JWT secret ke variabel `VITE_*`, karena nilainya dapat dibaca browser.

### 2. Jalankan database

**Pilihan A — Docker (paling praktis):** buka Docker Desktop, tunggu sampai engine aktif, lalu:

```powershell
docker compose -f backend/compose.yaml up -d --wait
```

Database `studytrack` dibuat otomatis pada `localhost:5433` dengan user/password development `postgres`/`postgres`. Port ini berbeda dari PostgreSQL lokal yang biasanya memakai `5432`. Data bertahan di volume Docker.

**Pilihan B — PostgreSQL lokal:** jika PostgreSQL sudah berjalan, buat database:

```powershell
createdb -h localhost -p 5432 -U postgres studytrack
```

Jika database sudah ada, lewati pembuatan. Ubah `DATABASE_URL` di `backend/.env` sesuai kredensial dan port lokal, misalnya `postgresql://postgres:PASSWORD_ANDA@localhost:5432/studytrack`. Karakter khusus pada username/password harus di-URL-encode. Docker tidak diperlukan untuk pilihan ini.

### 3. Buat tabel dan data demo

```powershell
cd backend
npm run db:migrate
npm run db:seed
cd ..
```

Migrasi aman diulang. Seed bersifat opsional: membuat akun demo beserta tiga mata kuliah dan tiga tugas, lalu melewati pengisian jika akun tersebut sudah ada. Seed tidak menghapus data yang sudah tersimpan dan tidak dijalankan otomatis saat server dinyalakan.

## Menjalankan aplikasi

Pastikan database sudah berjalan dan migrasi sudah diterapkan.

**Terminal 1 — backend**, dari folder utama proyek:

```powershell
cd backend
npm run dev
```

**Terminal 2 — frontend**, dari folder utama proyek:

```powershell
cd frontend
npm run dev
```

Buka **http://localhost:5173**. Gunakan menu daftar untuk membuat akun, atau login menggunakan:

| Email | Password |
| --- | --- |
| `demo@studytrack.test` | `demo1234` |

Akun demo hanya tersedia setelah menjalankan `npm run db:seed`. Tugas seed memakai deadline Juli 2026, sehingga akan tampil terlambat apabila tanggal tersebut sudah lewat. Tambahkan tugas dengan deadline beberapa jam mendatang untuk mencoba reminder mendesak.

Cek koneksi backend dan database dari terminal lain:

```powershell
Invoke-RestMethod http://localhost:4000/api/health
# Cek jalur proxy frontend -> backend -> database:
Invoke-RestMethod http://localhost:5173/api/health
```

Keduanya harus mengembalikan `status: ok` dan `database: connected`. Dashboard dan daftar tugas mengambil ulang data setiap 60 detik ketika tab terlihat, serta saat tab kembali aktif. Perubahan tugas langsung memperbarui daftar dan kategorinya dari respons API. Reminder berupa penanda dalam aplikasi; tidak ada pengiriman email atau notifikasi latar belakang.

Pada penggunaan berikutnya cukup nyalakan database, lalu jalankan backend dan frontend di dua terminal. Jalankan migrasi kembali jika ada file migrasi baru. Setelah mengubah `.env`, restart proses terkait.

Untuk berhenti, tekan `Ctrl+C` pada kedua terminal. Jika menggunakan Docker:

```powershell
docker compose -f backend/compose.yaml down
```

Perintah tersebut mempertahankan volume data database.

## Build dan pengujian

Jalankan dari folder utama proyek:

```powershell
npm --prefix backend run typecheck
npm --prefix backend test
npm --prefix backend run build
npm --prefix frontend run typecheck
npm --prefix frontend run build
```

Tes integrasi API memerlukan database development/test yang mengizinkan pembuatan schema:

```powershell
cd backend
$env:TEST_DATABASE_URL = 'postgresql://postgres:postgres@localhost:5433/studytrack'
npm run test:integration
Remove-Item Env:TEST_DATABASE_URL
cd ..
```

Tes membuat schema acak sendiri dan menghapus schema tersebut setelah selesai; tabel aplikasi tidak direset. Pengujian mencakup autentikasi, perubahan profil/password, CRUD, isolasi data pengguna, validasi input, dan batas kategori deadline.

Untuk mencoba hasil build secara lokal, jalankan `npm start` dari folder `backend` dan `npm run preview` dari folder `frontend` di dua terminal. Preview tersedia pada **http://localhost:4173** dan tetap meneruskan `/api` ke target proxy. Database dan hasil migrasi tetap diperlukan.

## Deployment

- Backend: isi `DATABASE_URL`, `PORT`, `NODE_ENV=production`, `CORS_ORIGIN` dengan origin frontend, dan `JWT_SECRET` acak minimal 32 karakter. Kredensial Docker contoh hanya untuk development.
- Jalankan `npm ci` dan `npm run build` dari `backend`. Sertakan folder `migrations/` bersama `dist/`, lalu jalankan `node dist/scripts/migrate.js` sebelum `npm start`. Seed demo ditolak pada production.
- Frontend: sebelum build, isi `VITE_API_BASE_URL=https://alamat-backend-anda/api`, lalu jalankan `npm ci` dan `npm run build` dari `frontend`. Publikasikan isi `frontend/dist/` pada hosting statis dengan fallback route ke `index.html` agar `/dashboard`, `/courses`, `/tasks`, dan `/profile` dapat dibuka langsung.
- Alternatif satu domain: pertahankan `VITE_API_BASE_URL=/api` dan atur reverse proxy hosting untuk meneruskan `/api/*` ke backend. Proxy Vite hanya bekerja pada development/preview lokal, bukan pada file statis hasil build.
- Nilai `VITE_*` dimasukkan saat build. Setelah mengganti URL API, build dan publikasikan ulang frontend. Konfigurasi TLS database mengikuti connection URL penyedia PostgreSQL.

## Pemecahan masalah

| Gejala | Yang perlu diperiksa |
| --- | --- |
| Docker gagal terhubung ke engine | Jalankan Docker Desktop dan tunggu engine siap, lalu ulangi perintah Compose. |
| Backend menampilkan PostgreSQL belum siap | Cek database aktif, `DATABASE_URL`, port `5433` untuk Docker atau `5432` untuk lokal, lalu jalankan migrasi. |
| Login demo gagal | Jalankan seed pada database yang sama dengan backend; jika password pernah diubah, gunakan password terbaru. |
| `/api` gagal atau frontend menampilkan gagal memuat | Cek health backend lalu health melalui port frontend; samakan `VITE_API_PROXY_TARGET` dengan alamat backend. |
| CORS ketika frontend memakai URL API absolut | Set `CORS_ORIGIN` ke origin frontend yang persis sama (protokol, host, dan port), kemudian restart backend. |
| Port `5173`/`4173` terpakai | Hentikan proses yang memakai port tersebut. Vite memakai port tetap agar alamat akses konsisten. |
| Tugas demo seluruhnya terlambat | Deadline seed sudah lewat; tambahkan tugas baru dengan deadline mendatang. |

## Struktur dan API

```text
backend/
  server.ts, app.ts       # Server dan route Express
  config.ts, db.ts       # Environment dan pool PostgreSQL
  routes/                # Auth/profil, mata kuliah, tugas
  middleware/            # JWT dan penanganan error
  services/deadlines.ts  # Kategori dan urutan reminder
  migrations/, scripts/  # Migrasi SQL dan seed
  tests/                 # Unit dan integrasi API
  compose.yaml           # PostgreSQL development
frontend/
  src/app/               # Entry point dan routing
  src/features/          # Home, auth, dashboard, courses, tasks, profile
  src/service/api.ts     # Axios, URL API, dan token JWT
  src/shared/            # Komponen, layout, dan repository API
  vite.config.js         # Proxy development/preview
```

Semua endpoint memakai prefix `/api`. Selain health, register, dan login, request memerlukan `Authorization: Bearer <token>`.

| Method | Path | Fungsi |
| --- | --- | --- |
| GET | `/health` | Kesehatan server dan koneksi database |
| POST | `/auth/register`, `/auth/login` | Autentikasi; menghasilkan `{ token, user }` |
| GET | `/auth/me` | Profil pengguna login |
| PATCH | `/auth/profile` | Ubah nama; menghasilkan `{ token, user }` |
| PATCH | `/auth/password` | Ganti password dengan `{ currentPassword, newPassword }` |
| GET, POST | `/courses` | Daftar/tambah mata kuliah |
| PUT, DELETE | `/courses/:id` | Ubah/hapus mata kuliah |
| GET, POST | `/tasks` | Daftar/tambah tugas |
| GET, PUT, DELETE | `/tasks/:id` | Detail/ubah/hapus tugas |

Deadline dengan zona waktu dikonversi ke UTC; input tanpa zona diasumsikan WIB oleh backend. Form frontend mengirim ISO UTC berdasarkan waktu lokal perangkat. Urutan tugas mengikuti backend: mendesak, terlambat, lalu normal; kategori normal diurutkan dari `created_at` terbaru. Detail skema, kontrak respons, dan aturan reminder tersedia di [backend/README.md](backend/README.md).
