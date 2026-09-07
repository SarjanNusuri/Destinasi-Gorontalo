# Website Profil Desa Tolomato

Website profil desa modern yang menampilkan informasi seputar Desa Tolomato — profil desa, demografi, aparat, galeri foto, berita, dan data zakat — lengkap dengan panel admin untuk mengelola semua konten dan data.

Dibangun dengan **Laravel 12** sebagai backend, **Inertia.js v3 + React 19** sebagai frontend, dan **Tailwind CSS v4** untuk styling.

## Fitur

### Halaman Publik

| Route | Keterangan |
|---|---|
| `/` | Beranda — hero, statistik, sambutan, peta, program, berita terbaru (3), dan kontak |
| `/profil` | Profil desa — sambutan, sejarah, demografi, aparat, bagan organisasi, dan peta |
| `/galeri` | Galeri foto dengan filter kategori dan paginasi server-side |
| `/berita` | Daftar berita (6 per halaman) dengan paginasi server-side |
| `/berita/{hash}` | Detail berita + bagian "Berita Lainnya" |
| `/login` | Halaman login admin |

### Panel Admin (login diperlukan)

| Route | Keterangan |
|---|---|
| `/admin` | Dashboard — ringkasan seluruh data desa |
| `/admin/penduduk` | Kelola data penduduk — CRUD + filter + pencarian |
| `/admin/aparat` | Kelola aparat desa — CRUD + upload foto + struktur organisasi |
| `/admin/data-zakat` | Kelola data zakat — CRUD + filter + pencarian + export Excel |
| `/admin/berita` | Kelola berita — CRUD + upload gambar + slug otomatis |
| `/admin/galeri` | Kelola galeri — CRUD + upload gambar |

### Fitur Dashboard

Dashboard admin menampilkan ringkasan seluruh data desa dalam satu halaman:

- **6 kartu statistik** — Total Penduduk, Kepala Keluarga, Zakat Terkumpul, Berita, Galeri, Aparat (klik langsung ke halaman terkait)
- **Demografi Penduduk** — breakdown Laki-laki/Perempuan + per dusun dengan progress bar
- **Koleksi Zakat** — status Lunas/Sebagian/Belum Bayar + per dusun + pembayaran terbaru
- **Berita Terbaru** — 5 berita terakhir beserta status publish/draft
- **Galeri** — jumlah foto per kategori
- **Aparat Desa** — jumlah per kategori (Pimpinan/Pelaksana/Kewilayahan)
- **Akses Cepat** — shortcut ke form tambah/unggah data

### Fitur Lainnya

- **Searchable dropdown** — form input nama penduduk bisa diketik (autocomplete) dengan sumber dari database
- **Filter & pencarian** — zakat (status, jenis), berita (kategori, status), penduduk (jenis kelamin, status, hubungan keluarga), aparat (kategori)
- **Pagination server-side** — semua data ditampilkan per halaman dari database
- **Export Excel** — data zakat dapat diunduh dalam format Excel (`.xlsx`) via `maatwebsite/excel`
- **Head title** di setiap halaman admin untuk identifikasi halaman di browser tab
- **Upload gambar** otomatis disimpan ke `public/assets/images/` dengan nama acak, file lama terhapus saat ganti/hapus
- **Slug otomatis** dari judul berita (unik, dengan penomoran `-2`, `-3`, dst)
- **ID ter-hash** di URL — halaman edit memakai karakter acak (`/admin/zakat/{hash}/edit`) sehingga id numerik tidak terlihat

## Tech Stack

- **PHP** >= 8.2, **Laravel 12**
- **MySQL** (atau SQLite untuk development)
- **Inertia.js v3** + **React 19**
- **Tailwind CSS v4** + **Vite 7**
- `lucide-react` untuk ikon
- `react-leaflet` + `leaflet` untuk peta
- `maatwebsite/excel` untuk export data zakat

## Struktur Kode

```
├── app/
│   ├── Exports/
│   │   └── ZakatExport.php              # export data zakat ke Excel
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Controller.php           # base controller
│   │   │   ├── LandingPageController.php # halaman publik
│   │   │   ├── Auth/AuthController.php  # login & logout
│   │   │   └── Admin/
│   │   │       ├── AdminController.php  # dashboard (semua data)
│   │   │       ├── PendudukController.php # CRUD penduduk + filter + search
│   │   │       ├── AparatController.php # CRUD aparat + upload foto
│   │   │       ├── ZakatController.php  # CRUD zakat + filter + search + export
│   │   │       ├── BeritaController.php # CRUD berita + upload + slug
│   │   │       └── GaleriController.php # CRUD galeri + upload gambar
│   │   ├── Middleware/
│   │   │   └── HandleInertiaRequests.php
│   │   └── Requests/
│   │       ├── Auth/LoginRequest.php
│   │       └── Admin/
│   │           ├── PendudukRequest.php
│   │           ├── AparatRequest.php
│   │           ├── ZakatRequest.php
│   │           ├── BeritaRequest.php
│   │           └── GaleriRequest.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Penduduk.php
│   │   ├── Aparat.php
│   │   ├── Zakat.php
│   │   ├── Berita.php
│   │   └── Galeri.php
│   ├── Providers/
│   │   └── AppServiceProvider.php
│   └── Support/
│       └── IdHasher.php                 # encode/decode id -> string acak
├── database/
│   ├── migrations/
│   │   ├── 0001_01_01_000000_create_users_table.php
│   │   ├── 0001_01_01_000001_create_cache_table.php
│   │   ├── 0001_01_01_000002_create_jobs_table.php
│   │   ├── 2026_08_10_*_create_penduduks_table.php
│   │   ├── 2026_08_15_*_create_beritas_table.php
│   │   ├── 2026_08_15_*_create_galeris_table.php
│   │   ├── 2026_08_16_*_create_aparat_table.php
│   │   └── 2026_08_17_*_create_zakat_table.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       ├── AdminUserSeeder.php
│       ├── PendudukSeeder.php
│       ├── AparatSeeder.php
│       ├── ZakatSeeder.php
│       ├── BeritaSeeder.php
│       └── GaleriSeeder.php
├── resources/
│   ├── views/
│   │   └── app.blade.php                # shell Blade untuk Inertia
│   └── js/
│       ├── app.jsx                      # entry point Inertia + React
│       ├── data/
│       │   ├── landing.js               # data statis landing page
│       │   ├── zakat.js                 # label, style, constant zakat
│       │   ├── berita-admin.js          # opsi kategori berita
│       │   ├── galeri-admin.js          # opsi kategori galeri
│       │   └── aparat-admin.js          # opsi kategori aparat
│       ├── components/
│       │   ├── AlertComponent.jsx       # notifikasi sukses/error
│       │   ├── Pagination.jsx           # paginasi
│       │   ├── SearchableSelect.jsx     # dropdown pencarian (autocomplete)
│       │   ├── LandingPage/
│       │   │   ├── Navbar.jsx
│       │   │   ├── Footer.jsx
│       │   │   ├── AnchorLink.jsx
│       │   │   ├── AvatarInitial.jsx
│       │   │   ├── Sambutan.jsx
│       │   │   ├── Sejarah.jsx
│       │   │   ├── Demografi.jsx
│       │   │   ├── Statistik.jsx
│       │   │   ├── Program.jsx
│       │   │   ├── Berita.jsx
│       │   │   ├── Bagan.jsx
│       │   │   ├── Aparat.jsx
│       │   │   └── Map.jsx
│       │   ├── Auth/
│       │   │   └── FormLogin.jsx
│       │   └── Admin/
│       │       ├── Layout.jsx
│       │       ├── Sidebar.jsx
│       │       ├── Topbar.jsx
│       │       ├── ActionMenu.jsx
│       │       └── ImageUploader.jsx
│       └── Pages/
│           ├── LandingPage/
│           │   ├── Index.jsx
│           │   ├── Profil.jsx
│           │   ├── Galeri.jsx
│           │   ├── Berita.jsx
│           │   └── BeritaDetail.jsx
│           ├── Auth/
│           │   └── Login.jsx
│           └── Admin/
│               ├── Index.jsx            # dashboard komprehensif
│               ├── Berita/              # Index, Create, Edit
│               ├── Galeri/              # Index, Create, Edit
│               ├── Zakat/               # Index, Create, Edit
│               ├── Penduduk/            # Index, Create, Edit
│               └── Aparat/              # Index, Create, Edit
├── config/                              # konfigurasi Laravel default
├── routes/
│   ├── web.php                          # semua route publik & admin
│   └── console.php
├── tests/
│   ├── TestCase.php
│   ├── Feature/ExampleTest.php
│   └── Unit/ExampleTest.php
├── public/
│   └── assets/images/                   # upload gambar (aparat, berita, galeri)
├── vite.config.js
├── composer.json
└── package.json
```

## Persyaratan

- PHP >= 8.2 (disarankan 8.3) dengan ekstensi umum Laravel
- Composer
- Node.js >= 20 + npm
- MySQL

## Cara Clone & Menjalankan

1. **Clone repository**
   ```bash
   git clone <url-repo> web_desa
   cd web_desa
   ```

2. **Install dependency backend & frontend**
   ```bash
   composer install
   npm install
   ```

3. **Buat file environment & generate key**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   Atur koneksi database di `.env`:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=web_desa
   DB_USERNAME=root
   DB_PASSWORD=
   APP_URL=http://127.0.0.1:8000
   ```

4. **Jalankan migrasi & seeder** (membuat tabel + data contoh)
   ```bash
   php artisan migrate --seed
   ```
   Untuk migrasi bersih dari awal:
   ```bash
   php artisan migrate:fresh --seed
   ```

5. **Build aset frontend**
   ```bash
   npm run build
   ```
   > Untuk pengembangan, pakai `npm run dev` (hot reload di `http://127.0.0.1:5173`).

6. **Jalankan server**
   ```bash
   php artisan serve
   ```
   Buka `http://127.0.0.1:8000` di browser.

### Akun Admin Default

Dibuat otomatis oleh seeder:

| Email | Password |
|---|---|
| `admin@tolomato.desa.id` | `tolomato2026` |

## Cara Menggunakan

1. Buka halaman publik (`/`) lalu login lewat `/login` dengan akun admin.
2. **Dashboard** — `/admin`: lihat ringkasan seluruh data desa (penduduk, zakat, berita, galeri, akses cepat).
3. **Kelola Penduduk** — `/admin/penduduk`:
   - Tambah/edit/hapus data penduduk (NIK, nama, jenis kelamin, tanggal lahir, agama, pendidikan, pekerjaan, dll).
   - Filter: jenis kelamin, status penduduk, hubungan keluarga.
   - Pencarian: nama, NIK, tempat lahir.
4. **Kelola Aparat** — `/admin/aparat`:
   - Tambah/edit/hapus aparat desa dengan foto, jabatan, kategori (Pimpinan/Pelaksana/Kewilayahan), dan struktur organisasi.
5. **Kelola Zakat** — `/admin/data-zakat`:
   - Input zakat dengan dropdown nama penduduk (ketik untuk mencari).
   - Data penduduk (NIK, dusun) otomatis terisi dari database.
   - Filter: status bayar (lunas/sebagian/belum), jenis zakat (fitrah/maal/infaq).
   - Pencarian: nama, NIK, dusun.
   - Export data zakat ke Excel melalui tombol "Export".
   - Jumlah jiwa x Rp40.000 otomatis dihitung untuk zakat fitrah.
6. **Kelola Berita** — `/admin/berita`:
   - Tambah/edit/hapus berita dengan kategori, judul, konten, dan gambar.
   - Slug otomatis dari judul, status publish/draft.
7. **Kelola Galeri** — `/admin/galeri`:
   - Tambah/edit/hapus foto galeri dengan kategori.
8. Setelah mengubah kode frontend, jalankan `npm run build` dan muat ulang browser (Ctrl+F5).

## Database

### Model Utama

| Model | Tabel | Keterangan |
|---|---|---|
| **Penduduk** | `penduduk` | Data kependudukan (14 kolom), sumber data untuk dropdown zakat & aparat |
| **Zakat** | `zakat` | Catatan pembayaran zakat, `belongsTo(Penduduk)` |
| **Aparat** | `aparat` | Data aparat desa dengan foto dan struktur organisasi, `belongsTo(Penduduk)` |
| **Berita** | `beritas` | Artikel berita, `belongsTo(User)`, slug otomatis |
| **Galeri** | `galeris` | Foto galeri dengan kategori |

### Schema Zakat

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | bigint (PK) | Auto-increment |
| `penduduk_id` | bigint (FK) | Relasi ke tabel `penduduk` |
| `nama` | varchar | Nama (denormalisasi dari penduduk) |
| `nik` | varchar(16) | NIK (denormalisasi dari penduduk) |
| `dusun` | varchar | Dusun (denormalisasi dari penduduk) |
| `jenis_zakat` | enum | fitrah, maal, infaq |
| `jumlah_jiwa` | int | Jumlah jiwa |
| `nominal` | int | Nominal rupiah |
| `status_bayar` | enum | belum, sebagian, lunas |
| `tanggal_bayar` | date | Tanggal pembayaran |
| `catatan` | text | Catatan tambahan |

## Catatan Teknis

- **ID ter-hash**: `app/Support/IdHasher.php` mengubah id numerik menjadi string acak. URL admin memakai `hash_id`, controller mendekode kembali ke id asli.
- **Upload gambar**: disk `assets` (`public/assets/images/`) dengan nama acak; file lama otomatis dihapus.
- **Zakat denormalisasi**: saat zakat dibuat/diupdate, nama/NIK/dusun disalin dari tabel `penduduk` untuk keperluan historis.
- **SearchableSelect**: komponen React yang bisa diketik untuk mencari data dari daftar panjang (dipakai di form zakat & aparat).
- **Idempoten seeder**: semua seeder menggunakan `updateOrCreate` atau pengecekan exist, aman dijalankan ulang.
- **Konfigurasi filesystem**: disk kustom `assets` didefinisikan di `config/filesystems.php` untuk menyimpan gambar di luar folder `storage`.

## Skrip Umum

| Perintah | Fungsi |
|---|---|
| `php artisan serve` | Jalankan server dev `http://127.0.0.1:8000` |
| `npm run dev` | Jalankan Vite dev server (hot reload) |
| `npm run build` | Build aset produksi |
| `php artisan migrate:fresh --seed` | Reset database + isi data contoh |
| `php artisan migrate --seed` | Migrasi + isi data contoh |
| `php artisan db:seed` | Isi ulang data contoh |
