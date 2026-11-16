# StudyTrack Backend — PostgreSQL

Backend Express + TypeScript untuk autentikasi, profil, mata kuliah, tugas, dan reminder deadline. Semua data aplikasi disimpan di PostgreSQL, dengan query berparameter dan connection pool. Panduan menjalankan seluruh aplikasi tersedia di [README utama](../README.md).

## Menjalankan

Prasyarat: Node.js 22.12+ dan PostgreSQL 18 (atau Docker dengan Compose).

Jalankan dari folder `backend`:

```powershell
npm install
```

Jika belum memiliki `.env`:

```powershell
Copy-Item .env.example .env
```

Jika `.env` sudah ada, tambahkan `DATABASE_URL` dan `CORS_ORIGIN` dari contoh tanpa menimpa konfigurasi yang sudah diisi.

**Pilihan A — PostgreSQL lokal:** buat database kosong menggunakan akun PostgreSQL Anda, misalnya:

```powershell
createdb -h localhost -p 5432 -U postgres studytrack
```

Sesuaikan `.env` dengan username, password, dan port PostgreSQL lokal:

```dotenv
DATABASE_URL=postgresql://postgres:PASSWORD_ANDA@localhost:5432/studytrack
PORT=4000
JWT_SECRET=studytrack-secret-key-change-this
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Karakter khusus di username/password dalam URL harus di-URL-encode.

**Pilihan B — Docker:** konfigurasi `compose.yaml` menyediakan database development terpisah pada port host **5433**, sehingga dapat berjalan bersama PostgreSQL lokal pada 5432.

```powershell
docker compose up -d --wait
```

Gunakan `DATABASE_URL=postgresql://postgres:postgres@localhost:5433/studytrack`, sesuai `.env.example`. Volume Docker mempertahankan data setelah container dimatikan. Kredensial contoh hanya untuk development lokal.

Setelah database tersedia:

```powershell
npm run db:migrate
npm run db:seed
npm run dev
```

Server: `http://localhost:4000/api`. Cek `GET /api/health`; hasil `200` berarti koneksi database tersedia. Startup gagal dengan pesan yang jelas jika database/tabel belum siap. Akun demo: `demo@studytrack.test` / `demo1234`.

Migrasi tersimpan di `migrations/`, dijalankan dalam transaksi, dan dicatat di `schema_migrations`; perintah aman diulang. Seed opsional dan idempotent: jika akun demo sudah ada, datanya tidak diubah. Tidak ada endpoint reset database melalui HTTP. File JSON lama tidak diimpor otomatis; data contoh disediakan oleh seed.

Build dan jalankan hasil kompilasi:

```powershell
npm run build
npm start
```

Untuk deployment, sertakan folder `migrations/` bersama `dist/` dan jalankan `node dist/scripts/migrate.js` sebelum start. Set `NODE_ENV=production`, `DATABASE_URL`, `CORS_ORIGIN`, dan JWT secret acak minimal 32 karakter. Seed demo ditolak pada production. Konfigurasi TLS mengikuti connection URL PostgreSQL Anda.

## Skema database

```text
users
  id integer identity PK
  nama varchar(200), email varchar(254) UNIQUE, password_hash text
    │ 1
    ├──── N courses
    │        id integer identity PK, user_id FK users
    │        name varchar(200), kode varchar(50), dosen varchar(200)
    │        UNIQUE(user_id, id)
    │            │ 1
    └──── N tasks ─┘ N
             id integer identity PK, user_id FK users
             mata_kuliah_id integer
             judul varchar(300), deskripsi text
             deadline timestamptz, created_at timestamptz DEFAULT now()
             status task_status ENUM ('belum', 'selesai') DEFAULT 'belum'
             FK(user_id, mata_kuliah_id) → courses(user_id, id)
```

Foreign key gabungan memastikan tugas dan mata kuliah mempunyai pemilik yang sama. Menghapus mata kuliah menghapus tugasnya secara atomik melalui `ON DELETE CASCADE`. Indeks mendukung pencarian tugas per pemilik dan relasi mata kuliah. Kolom kategori/sisa waktu tidak disimpan karena berubah mengikuti waktu saat ini.

## Aturan reminder dan asumsi

Satu snapshot waktu server digunakan untuk seluruh tugas dalam satu respons. Waktu masukan dengan `Z` atau offset dihormati; waktu tanpa zona dari input `datetime-local` diasumsikan **Asia/Jakarta (UTC+07:00)**. Database memakai `TIMESTAMPTZ`; keluaran API menggunakan ISO 8601 UTC.

| Kondisi | `deadline_category` |
| --- | --- |
| `status = selesai`, kapan pun deadline-nya | `normal` |
| `status = belum` dan `deadline <= now` | `overdue` |
| `status = belum` dan `0 < deadline - now < 24 jam` | `mendekati_deadline` |
| `status = belum` dan sisa waktu ≥ 24 jam | `normal` |

Interpretasi yang ditetapkan karena belum eksplisit di soal: tugas selesai tidak memicu peringatan; tepat deadline dianggap overdue. Tepat 24 jam adalah normal karena syaratnya **kurang dari** 24 jam.

Urutan daftar: **mendekati_deadline → overdue → normal**. Pada dua kategori peringatan, deadline paling awal didahulukan. Pada normal, `created_at` terbaru didahulukan sesuai perilaku awal. Jika waktu sama, gunakan `created_at DESC`, lalu `id DESC` untuk urutan yang konsisten. Semua kategori tetap tampil dan seluruh query dibatasi ke pengguna dari token, lintas mata kuliah.

Kategori dihitung saat request, tanpa scheduler/email. Frontend menggunakan `deadline_category` untuk penanda, memperbarui data dari respons perubahan tugas, dan mengambil ulang daftar setiap 60 detik ketika tab terlihat atau saat tab kembali aktif.

## API

Semua path diawali `/api`. Selain health/register/login, wajib header `Authorization: Bearer <token>`. Password di-hash dengan bcrypt; token JWT HS256 berlaku tujuh hari. Identitas pengguna diambil dari token dan diverifikasi terhadap database; `user_id` dari body diabaikan.

| Method | Path | Body / fungsi |
| --- | --- | --- |
| GET | `/health` | Status koneksi DB; 503 jika tidak tersedia |
| POST | `/auth/register` | `{ nama, email, password }`; 201 `{ token, user }` |
| POST | `/auth/login` | `{ email, password }`; 200 `{ token, user }` |
| GET | `/auth/me` | `{ user: { id, nama, email } }` |
| PATCH | `/auth/profile` | `{ nama }` (2–100 karakter); `{ token, user }` |
| PATCH | `/auth/password` | `{ currentPassword, newPassword }`; verifikasi password lama, lalu `{ success: true }` |
| GET | `/courses` | `{ courses: [...] }` milik pengguna |
| POST | `/courses` | `{ name, kode?, dosen? }`; 201 `{ course }` |
| PUT | `/courses/:id` | `{ name?, kode?, dosen? }`; `{ course }` |
| DELETE | `/courses/:id` | Hapus beserta tugas; `{ success: true }` |
| GET | `/tasks` | Daftar terurut; `{ tasks, server_time }` |
| GET | `/tasks/:id` | `{ task, server_time }` |
| POST | `/tasks` | `{ mata_kuliah_id, judul, deadline, deskripsi? }`; 201 `{ task, server_time }` |
| PUT | `/tasks/:id` | `{ judul?, deskripsi?, deadline?, status? }`; `{ task, server_time }` |
| DELETE | `/tasks/:id` | `{ success: true }` |

Contoh respons satu tugas pada **3 Juli 2026 12:00 WIB**:

```json
{
  "task": {
    "id": 1,
    "user_id": 1,
    "mata_kuliah_id": 1,
    "mata_kuliah": "Database Systems",
    "judul": "Lab 4: Query Optimization Report",
    "deskripsi": "Laporan hasil eksperimen optimasi query beserta analisis query plan.",
    "deadline": "2026-07-03T16:59:00.000Z",
    "status": "belum",
    "created_at": "2026-06-15T02:00:00.000Z",
    "deadline_category": "mendekati_deadline",
    "remaining_seconds": 43140
  },
  "server_time": "2026-07-03T05:00:00.000Z"
}
```

`remaining_seconds` dibulatkan ke bawah dan dapat negatif, termasuk untuk tugas selesai. Gunakan **`deadline_category`** sebagai dasar penanda; pembulatan sisa detik bukan dasar klasifikasi. Bentuk `{ tasks }`/`{ task }` dan field lama tetap tersedia.

Validasi: nama/judul tidak kosong, ID integer positif 32-bit, status hanya `belum`/`selesai`, tanggal harus nyata dan berbentuk ISO datetime. Password minimal enam karakter dan maksimal 72 byte UTF-8 (batas bcrypt). Email dinormalisasi menjadi lowercase dan unik. Field yang tidak dikirim pada PUT dipertahankan; nilai `null` pada field yang dikenali ditolak. Validasi selesai sebelum UPDATE sehingga input gagal tidak mengubah sebagian data.

Error JSON `{ "error": "pesan" }`: 400 input tidak valid, 401 token/login tidak sah, 404 data tidak ditemukan atau dimiliki orang lain, 409 email duplikat, 413 body >100 KB, 500 kesalahan internal. Detail SQL tidak dikirim ke klien.

## Pengujian

```powershell
npm run typecheck
npm test
npm run build
```

Uji integrasi membutuhkan database yang mengizinkan pembuatan schema. Gunakan database development/test, lalu:

```powershell
$env:TEST_DATABASE_URL = 'postgresql://postgres:postgres@localhost:5433/studytrack'
npm run test:integration
```

Tes membuat schema acak sendiri, menerapkan migrasi dua kali untuk memeriksa idempotensi, menjalankan HTTP API sungguhan, lalu menghapus schema tes itu. Tidak mereset tabel aplikasi. Jam hanya disuntikkan di dalam tes; endpoint tidak menerima parameter untuk mengganti waktu server.

| Jenis | Kondisi/input | Hasil yang diharapkan |
| --- | --- | --- |
| Positif | Data contoh; now = 3 Juli 2026 12:00 WIB | Lab 4 dekat (11j 59m), BSTMap overdue, Sprint 2 normal; urutan Lab 4 → BSTMap → Sprint 2 |
| Positif | Data contoh; now = 2 Juli 2026 12:00 WIB | BSTMap overdue; dua lainnya normal; urutan BSTMap → Sprint 2 → Lab 4 |
| Negatif | Pengguna B membuka/mengubah/menghapus tugas A | 404, tanpa perubahan data |
| Negatif | Tambah tugas pada mata kuliah pengguna lain | 400; foreign key juga menolak jika API dilewati |
| Negatif | 30 Februari / tanggal null / status invalid | 400, update tidak diterapkan |
| Edge case | Sisa tepat 24 jam / 24 jam dikurangi 1 ms | normal / mendekati_deadline |
| Edge case | 1 ms sebelum / tepat saat / sesudah deadline | mendekati_deadline / overdue / overdue |
| Edge case | Tugas selesai, kemudian dibuka kembali setelah deadline | normal, kemudian overdue |
| Edge case | Deadline WIB dan UTC yang menunjuk saat sama | Nilai tersimpan dan kategori sama |
| Regresi | Hapus mata kuliah A | Tugas mata kuliah A terhapus; data B tetap ada |

Data seed mempertahankan tanggal Juli 2026 sesuai soal. Saat dijalankan sesudah tanggal tersebut, semua tugas demo yang belum selesai memang overdue. Buat tugas baru dengan deadline mendatang untuk melihat kategori lain pada waktu nyata.

Referensi implementasi driver: [query berparameter](https://node-postgres.com/features/queries), [transaksi pada satu client](https://node-postgres.com/features/transactions). Override `qs` menggunakan versi yang telah diperbaiki untuk dependency Express.
