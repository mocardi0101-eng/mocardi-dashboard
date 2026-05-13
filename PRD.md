# Product Requirements Document
## Mocardi Internal Operational Dashboard

**Versi:** 1.0  
**Tanggal:** 13 Mei 2026  
**Author:** Mocardi Team  
**Status:** Shipped ✅

---

## 1. Latar Belakang

Mocardi adalah usaha F&B mahasiswa yang menjual produk cream & cake (Brookies, Brownies, Matcha Brownies). Sebelum dashboard ini ada, operasional harian dikelola secara manual — pencatatan order di kertas, pengecekan stok dari ingatan, dan perhitungan revenue dilakukan di akhir hari.

Masalah yang muncul:
- Order sering terlewat atau tercampur
- Stok bahan baku tidak terpantau real-time, menyebabkan kehabisan bahan di tengah operasional
- Tidak ada visibilitas kapasitas produksi yang tersisa
- Rekap harian memakan waktu dan rawan salah hitung

---

## 2. Tujuan Produk

Membangun dashboard operasional internal berbasis web yang dapat diakses dari perangkat apapun (HP, laptop) untuk membantu tim Mocardi mengelola order, stok, dan laporan harian secara efisien dan real-time.

**Success metrics:**
- Waktu input order < 30 detik
- Stok bahan selalu terbarui otomatis setiap order masuk
- Rekap harian bisa diunduh dalam < 10 detik
- Dapat diakses oleh semua anggota tim dari HP manapun

---

## 3. Target Pengguna

| Pengguna | Kebutuhan Utama |
|----------|----------------|
| Operator (penerima order) | Input order cepat, lihat antrian aktif |
| Tim dapur | Tahu stok bahan, flow produksi |
| Owner/Manager | Lihat revenue, profit, dan alert stok |

---

## 4. Fitur yang Dibangun

### 4.1 Autentikasi PIN
- Login screen dengan PIN 4 digit
- Sesi tersimpan 24 jam di localStorage
- Animasi shake saat PIN salah
- Tombol logout di header

### 4.2 Kapasitas Harian
- Tampilkan max capacity, slot terisi, dan sisa slot
- Progress bar berwarna (hijau → kuning → merah)
- Edit kapasitas maksimum via modal
- Integrasi Mode UTS/UAS (kapasitas otomatis turun ke 60%)

### 4.3 Kondisi Tim (Team Wellbeing)
- Toggle Normal Mode / UTS-UAS Mode
- Mode UTS otomatis batasi kapasitas untuk jaga stamina tim

### 4.4 Manajemen Order
- Form pilih menu dengan grid visual (emoji + nama + harga)
- Stepper +/- per item
- Konfirmasi order → tersimpan ke database + stok otomatis berkurang
- Antrian order aktif dengan nomor urut
- Tombol "Selesai" per order
- Efek confetti saat order dikonfirmasi

### 4.5 Kitchen Flow
- Checklist 3 langkah: Siapkan Bahan → Proses Masak (10 mnt) → Packing & QC
- Progress bar visual
- State lokal (tidak perlu disimpan ke database)

### 4.6 Stok Bahan Baku
- Tabel stok semua bahan dengan progress bar level
- Status Aman / Menipis / Kritis per bahan
- Edit stok inline (klik ✏️ → input → Enter)
- Modal atur minimum stok per bahan
- Alert "Perlu dibeli segera" untuk bahan kritis

### 4.7 Estimasi Produksi
- **Mode Estimasi:** Hitung otomatis max porsi per menu dari stok saat ini + identifikasi bottleneck bahan
- **Mode Rencanakan:** Input target produksi per menu, cek apakah stok cukup, tampilkan estimasi revenue

### 4.8 Ringkasan Harian
- Metrik: Total Order, Total Revenue, Est. Profit (40%)
- Smart Alerts otomatis (kapasitas, stok kritis, slot hampir habis)
- Download rekap sebagai **PDF** (print-ready, berformat tabel rapi) atau **TXT**
- Tombol Reset Hari Baru dengan konfirmasi

---

## 5. Arsitektur Teknis

```
Frontend         : Next.js 14 (App Router) — deployed di Vercel
Database         : Supabase (PostgreSQL)
Realtime         : Supabase Realtime (WebSocket)
Styling          : Tailwind CSS + Fredoka/Nunito font
Icons            : Lucide React
Auth             : PIN-based (localStorage, 24h TTL)
State            : React hooks (useState, useEffect, useCallback)
Data fetching    : Supabase JS client (optimistic UI + rollback)
```

**URL Live:** https://mocardi.vercel.app  
**Database:** Supabase project `xktfcmgeguejfzsqwvvf`

### Tabel Database
| Tabel | Fungsi |
|-------|--------|
| `orders` | Menyimpan semua order (active/done) |
| `inventory` | Stok bahan baku + min/max threshold |
| `settings` | Konfigurasi (max_capacity, mode) |

---

## 6. Keputusan Desain

| Keputusan | Alasan |
|-----------|--------|
| PIN login (bukan OAuth) | Lebih cepat dipakai tim, tidak butuh akun per orang |
| Optimistic UI | Tampilan langsung update tanpa tunggu DB, lebih responsif |
| Supabase Realtime | Semua perangkat sync otomatis tanpa refresh manual |
| Stok otomatis berkurang | Menghilangkan langkah manual yang sering terlupa |
| localStorage untuk session | Tidak butuh backend auth tambahan |
| PDF via window.print() | Tidak perlu library berat, works di semua browser & HP |

---

## 7. Out of Scope (v1.0)

- Multi-user dengan role berbeda (owner vs operator)
- Manajemen menu via dashboard (tambah/hapus menu)
- Laporan mingguan/bulanan
- Integrasi payment gateway
- Notifikasi push

---

## 8. Timeline

| Milestone | Tanggal |
|-----------|---------|
| Inisiasi proyek & desain | 12 Mei 2026 |
| Development & deployment | 12 Mei 2026 |
| Live di production | 12 Mei 2026 |
| Dokumentasi & PRD | 13 Mei 2026 |

---

*Mocardi — "Delight in every bite" 🍰*
