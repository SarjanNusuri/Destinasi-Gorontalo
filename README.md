# GO360 — Gorontalo Living Heritage

Platform digital interaktif untuk menjelajahi destinasi wisata dan warisan budaya Gorontalo. Fitur: peta interaktif Leaflet, diorama 3D Three.js, rute navigasi OSRM, rekomendasi penginapan, dan panel admin untuk mengelola konten.

Dibangun dengan **Laravel 12** sebagai backend, **Inertia.js v3 + React 19** sebagai frontend, **Tailwind CSS v4** untuk styling, **Leaflet** untuk peta, dan **Three.js** untuk visualisasi 3D.

## Fitur

### Landing Page

| Section | Keterangan |
|---|---|
| Hero | Background image + headline + CTA |
| Stats | Statistik: 127+ destinasi, 43 warisan budaya, 5 kabupaten, 200k+ wisatawan |
| Peta Interaktif | Leaflet OpenStreetMap — marker destinasi (emas) + hotel (🏨), klik popup navigate ke detail |
| Explore | Filter kategori (Semua/Alam/Pantai/Sejarah/Kuliner/Petualangan) — single-select dengan Lucide icons |
| Heritage | Budaya tradisional Gorontalo (Tari Saronde, Upacara Adat Maulid, Kerajinan Karawo) |
| Hotels | Rekomendasi 12 penginapan dari 4 destinasi — grid cards dengan rating, harga, jarak |
| Trip Planner | Form perencanaan perjalanan |
| CTA Banner | Call-to-action |

### Halaman Destinasi (`/destination/{id}`)

- Hero image + info (lokasi, durasi, rating)
- **Diorama 3D** — 4 scene (lake, coral, fort, waterfall) dengan Three.js, interaktif rotate/zoom
- Deskripsi + highlights
- **Leaflet map** — marker destinasi + hotel + tombol **Kunjungi** → **Mulai Navigasi** → OSRM route + turn-by-turn panel
- **Floating navigation popup** (Google Maps style) — hotel cards + rute ke hotel di peta
- Rekomendasi penginapan (3 hotel per destinasi)

### Peta Penuh (`/map`)

- Full-screen Leaflet OpenStreetMap dengan dark CSS filter
- **Search** — dropdown real-time + Enter untuk fly ke lokasi + alert jika tidak ditemukan
- **Category filter** — fly ke destinasi pertama saat kategori dipilih
- **Lokasi Saya** — geolocation + marker hijau
- Semua marker destinasi + hotel dengan popup

### Panel Admin

| Route | Keterangan |
|---|---|
| `/login` | Login form (UI) |
| `/admin` | Dashboard — stats + quick actions + destinasi terbaru |
| `/admin/destinations` | Tabel destinasi + thumbnail + edit/hapus |
| `/admin/destinations/create` | Form tambah destinasi — 2/3 + 1/3 columns, gambar, koordinat, highlights, hotels accordion |
| `/admin/destinations/{id}/edit` | Form edit destinasi |
| `/admin/budaya` | Card grid budaya + edit/hapus |
| `/admin/budaya/create` | Form tambah budaya — judul, kategori, deskripsi, gambar |
| `/admin/budaya/{id}/edit` | Form edit budaya |

## Tech Stack

- **PHP** >= 8.2, **Laravel 12**
- **MySQL** (`lomba` database)
- **Inertia.js v3** + **React 19**
- **Tailwind CSS v4** + **Vite 7**
- **Leaflet** + OpenStreetMap (peta interaktif)
- **Three.js** (diorama 3D)
- **OSRM** (rute navigasi — gratis, tanpa API key)
- `lucide-react` untuk ikon

## Struktur Kode

```
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Controller.php
│   │   │   ├── AuthController.php           # login page
│   │   │   └── Admin/
│   │   │       ├── DestinationController.php # CRUD destinasi (UI)
│   │   │       └── BudayaController.php      # CRUD budaya (UI)
│   │   └── Middleware/
│   │       └── HandleInertiaRequests.php
│   └── Models/                               # (belum ada — hardcoded di frontend)
├── resources/
│   └── js/
│       ├── app.jsx                           # entry point Inertia + React
│       ├── data/
│       │   └── landing.js                    # data destinasi, heritage, hotels, kategori
│       ├── hooks/
│       │   ├── useLanding.js                 # useInView, useCountUp
│       │   └── useThreeViewer.js             # Three.js scene setup
│       ├── components/
│       │   ├── landing/
│       │   │   ├── LandingNavbar.jsx
│       │   │   ├── Hero.jsx
│       │   │   ├── Stats.jsx
│       │   │   ├── MapSection.jsx            # Leaflet map preview di landing
│       │   │   ├── Explore.jsx               # Filter kategori + grid destinasi
│       │   │   ├── Heritage.jsx              # Budaya tradisional
│       │   │   ├── Hotels.jsx                # Rekomendasi penginapan
│       │   │   ├── TripPlanner.jsx
│       │   │   ├── CtaBanner.jsx
│       │   │   └── Footer.jsx
│       │   └── Admin/
│       │       ├── Layout.jsx                # Sidebar + topbar
│       │       ├── Sidebar.jsx               # Navigasi admin
│       │       └── Topbar.jsx
│       └── Pages/
│           ├── Welcome.jsx                   # Landing page
│           ├── DestinationDetail.jsx          # Detail destinasi + 3D + peta + navigasi
│           ├── Map.jsx                       # Peta penuh full-screen
│           ├── Auth/
│           │   └── Login.jsx                 # Login form
│           └── Admin/
│               ├── Dashboard.jsx
│               ├── Destinations/
│               │   ├── Index.jsx
│               │   ├── Create.jsx
│               │   └── Edit.jsx
│               └── Budaya/
│                   ├── Index.jsx
│                   ├── Create.jsx
│                   └── Edit.jsx
├── routes/
│   └── web.php                               # 10 routes publik + admin
├── vite.config.js
├── composer.json
└── package.json
```

## Routes

| Method | Route | Keterangan |
|---|---|---|
| GET | `/` | Landing page |
| GET | `/destination/{id}` | Detail destinasi + 3D + peta |
| GET | `/map` | Peta penuh full-screen |
| GET | `/login` | Login admin |
| GET | `/admin` | Dashboard admin |
| GET | `/admin/destinations` | Daftar destinasi |
| GET | `/admin/destinations/create` | Form tambah destinasi |
| GET | `/admin/destinations/{id}/edit` | Form edit destinasi |
| GET | `/admin/budaya` | Daftar budaya |
| GET | `/admin/budaya/create` | Form tambah budaya |
| GET | `/admin/budaya/{id}/edit` | Form edit budaya |

## Persyaratan

- PHP >= 8.2 (disarankan 8.3) dengan ekstensi umum Laravel
- Composer
- Node.js >= 20 + npm
- MySQL

## Cara Clone & Menjalankan

1. **Clone repository**
   ```bash
   git clone <url-repo> lomba
   cd lomba
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
   DB_DATABASE=lomba
   DB_USERNAME=root
   DB_PASSWORD=
   ```

4. **Build aset frontend**
   ```bash
   npm run build
   ```
   > Untuk pengembangan, pakai `npm run dev` (hot reload di `http://127.0.0.1:5173`).

5. **Jalankan server**
   ```bash
   php artisan serve
   ```
   Buka `http://127.0.0.1:8000` di browser.

## Catatan Teknis

- **Data hardcoded**: destinasi, hotel, heritage, dan kategori masih di `resources/js/data/landing.js`. Belum terkoneksi ke database.
- **Leaflet peta**: pakai OpenStreetMap tiles (gratis, tanpa API key) + CSS filter `invert + hue-rotate` untuk dark theme.
- **OSRM routing**: menggunakan server demo `router.project-osrm.org` — gratis, rate-limited.
- **Three.js diorama**: 4 scene types (lake, coral, fort, waterfall) dengan custom orbit controls, di-load secara dinamis (`dynamic import`).
- **Custom markers**: destinasi (gold circle) + hotel (🏨) + user location (green pulse) — pakai `L.divIcon` dengan HTML inline.
- **Admin UI-only**: controller hanya return Inertia pages, belum ada logic CRUD ke database. Semua form dummy (alert + redirect).
- **Theme**: dark green (`#0f1f17`) + gold (`#d4a853`) + cream (`#f5efe6`).

## Skrip Umum

| Perintah | Fungsi |
|---|---|
| `php artisan serve` | Jalankan server dev `http://127.0.0.1:8000` |
| `npm run dev` | Jalankan Vite dev server (hot reload) |
| `npm run build` | Build aset produksi |
