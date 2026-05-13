# Product Requirements Document
## Mocardi — Internal Operational Dashboard

**Versi:** 1.0 | **Tanggal:** 13 Mei 2026 | **Status:** Shipped ✅

---

## 1. Problem Statement

Mahasiswa pemilik bisnis dessert/bakery kehilangan potensi pendapatan dan mengalami risiko burnout karena harus mengelola produksi, pencatatan keuangan, promosi, dan pelayanan pelanggan sendirian tanpa sistem yang terstruktur. Akibatnya, pencatatan keuangan sering terlewat saat event (menyebabkan kerugian yang tidak terdeteksi), konsistensi rasa sulit dijaga antar batch, dan bahan baku terbuang sia-sia karena tidak ada forecasting — semuanya terjadi bersamaan dengan beban kuliah penuh.

---

## 2. Target User

- **Primer:** Mahasiswa aktif usia 19–22 tahun yang menjalankan bisnis F&B (dessert/bakery) secara mandiri atau dengan tim kecil (1–3 orang), berjualan secara online via Instagram/WhatsApp dengan sistem pre-order, dan mengandalkan event kampus sebagai channel utama penjualan.
- **Sekunder:** Pemilik usaha dessert rumahan skala mikro yang belum memiliki karyawan tetap, sudah merasakan masalah operasional berulang, dan memiliki ambisi ekspansi ke offline store atau model bisnis yang lebih profesional.

---

## 3. User Stories

- Sebagai **operator**, saya mau **mencatat order masuk dalam beberapa tap**, supaya saya tidak perlu bolak-balik menulis manual dan bisa langsung fokus melayani pelanggan berikutnya.

- Sebagai **tim dapur**, saya mau **tahu stok bahan baku secara real-time setelah setiap order dikonfirmasi**, supaya saya tidak kehabisan bahan di tengah produksi tanpa peringatan sebelumnya.

- Sebagai **owner**, saya mau **melihat estimasi berapa porsi yang bisa diproduksi hari ini berdasarkan stok yang ada**, supaya saya bisa mengambil keputusan berapa order yang masih bisa diterima tanpa harus menghitung manual.

- Sebagai **owner**, saya mau **mengatur batas kapasitas order harian dan mengaktifkan mode UTS/UAS yang otomatis memangkas kapasitas**, supaya tim tidak kelelahan saat musim ujian sambil tetap bisa menerima pesanan.

- Sebagai **owner**, saya mau **mengunduh rekap penjualan harian dalam format PDF**, supaya saya punya laporan yang rapi untuk dievaluasi tanpa harus merekap ulang dari nol setiap malam.

---

## 4. Features (MVP)

1. **Order Management** — Input order via grid menu visual, konfirmasi langsung simpan ke database dan otomatis kurangi stok bahan sesuai resep. Termasuk: antrian order aktif bernomor urut + tombol selesai per order. *Tidak termasuk: notifikasi WhatsApp ke customer, sistem DP/pembayaran.*

2. **Inventory Tracker** — Pantau stok semua bahan baku secara real-time dengan status Aman/Menipis/Kritis, edit stok inline, dan alert otomatis daftar bahan yang perlu dibeli. *Tidak termasuk: integrasi supplier, pembelian otomatis.*

3. **Production Estimator** — Hitung otomatis maksimal porsi per menu dari stok saat ini (mode Estimasi), dan simulasi apakah stok cukup untuk target produksi yang diinginkan (mode Rencanakan) lengkap dengan estimasi revenue. *Tidak termasuk: jadwal produksi otomatis.*

4. **Kapasitas & Mode Tim** — Atur batas order harian yang bisa diedit, dengan Mode UTS/UAS yang otomatis memangkas kapasitas ke 60% untuk menjaga stamina tim mahasiswa saat musim ujian. *Tidak termasuk: jadwal shift, absensi.*

5. **Daily Summary & Rekap** — Tampilkan total order, revenue, dan estimasi profit (40%) secara live, dilengkapi smart alerts otomatis (kapasitas hampir penuh, stok kritis), dan unduh laporan harian sebagai PDF siap-cetak atau TXT. *Tidak termasuk: laporan mingguan/bulanan, grafik historis.*

---

## 5. Tech Stack

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS + Lucide React
- **Backend/DB:** Supabase (PostgreSQL + Realtime WebSocket + Row Level Security)
- **Auth:** PIN-based login (localStorage, session 24 jam) — tanpa akun per user
- **Hosting:** Vercel (edge deployment, auto-deploy dari GitHub)
- **AI Tools:** Claude Code — digunakan untuk membantu generate komponen, debug RLS policy, dan menyusun schema database

---

## 6. Success Metrics

- Waktu input order **< 30 detik** (vs ±2 menit pencatatan manual sebelumnya)
- **0 order terlewat** akibat lupa karena semua antrian tercatat dan visible di dashboard
- Stok bahan baku **selalu terupdate** dalam hitungan detik setelah order dikonfirmasi — tanpa langkah manual terpisah
- Rekap harian dapat diunduh sebagai PDF dalam **< 10 detik**
- Dashboard dapat diakses dari **semua perangkat tim** (HP/laptop) tanpa instalasi apapun

---

## 7. Out of Scope

- Notifikasi otomatis ke customer via WhatsApp atau push notification
- Laporan mingguan/bulanan dengan grafik historis
- Manajemen menu (tambah/hapus/edit produk) via dashboard
- Sistem multi-user dengan role berbeda (owner vs operator vs dapur)
- Integrasi payment gateway (Midtrans, dll)
- Mobile app native (iOS/Android)
- Fitur CRM / database pelanggan

---

*Mocardi — "Delight in every bite" 🍰*
