# Refleksi Proyek: Mocardi Internal Operational Dashboard

**Nama:** Adellisyana  
**Tanggal:** 13 Mei 2026

---

## Latar Belakang

Mocardi adalah usaha cream & cake yang saya jalankan di tengah kesibukan kuliah. Setiap hari, kami menerima order dari teman-teman kampus — mulai dari Brookies, Brownies, sampai Matcha Brownies. Tapi selama ini, semua pencatatan dilakukan secara manual: order dicatat di kertas, stok bahan dicek dari ingatan, dan rekap penjualan dihitung di akhir hari dengan kalkulator. Tidak efisien, dan sering kali berujung pada kesalahan kecil yang cukup menganggu operasional.

Dari masalah nyata itu, saya memutuskan untuk membangun **Mocardi Internal Operational Dashboard** — sebuah web app yang bisa diakses siapa saja di tim, dari perangkat apapun, kapanpun.

---

## Proses Membangun

Proyek ini dibangun dalam satu hari penuh menggunakan **Next.js 14**, **Supabase**, dan **Tailwind CSS** — dan di-deploy ke Vercel sehingga bisa langsung diakses dari HP anggota tim melalui link `mocardi.vercel.app`.

Yang paling menarik dari proses ini adalah bagaimana sebuah masalah operasional yang sangat konkret bisa diterjemahkan menjadi fitur-fitur teknis. Misalnya:

- **Masalah:** Stok sering habis di tengah operasional tanpa disadari  
  **Solusi:** Stok otomatis berkurang setiap order dikonfirmasi, menggunakan resep bahan yang sudah diprogramkan

- **Masalah:** Tim tidak tahu berapa order yang masih bisa diterima hari ini  
  **Solusi:** Kapasitas harian yang bisa di-set, dengan progress bar visual dan smart alert

- **Masalah:** Saat UTS/UAS, tim kewalahan karena order tetap penuh  
  **Solusi:** Mode UTS/UAS yang otomatis memangkas kapasitas ke 60%

Saya juga menambahkan fitur **Estimasi Produksi** yang menghitung berapa porsi tiap menu bisa dibuat dari stok yang ada saat ini — sesuatu yang sebelumnya harus dihitung manual di kepala.

---

## Tantangan

Tantangan terbesar bukan pada bagian coding, melainkan pada **memikirkan alur kerja yang sesuai dengan cara tim bekerja**. Dashboard yang bagus secara teknis belum tentu berguna kalau tidak sesuai dengan kebiasaan pengguna. Saya harus benar-benar memikirkan: apa yang pertama dilihat operator saat buka dashboard? Informasi apa yang paling kritis?

Dari sisi teknis, challenge terbesar adalah mengimplementasikan **Supabase Row Level Security (RLS)** yang awalnya memblokir semua operasi write dari client, dan memahami bagaimana **Supabase Realtime** bekerja agar semua perangkat tim bisa sync otomatis tanpa refresh manual.

---

## Pembelajaran

Proyek ini mengajarkan saya beberapa hal penting:

1. **Teknologi yang tepat menyelesaikan masalah nyata.** Supabase Realtime memungkinkan semua HP anggota tim melihat update order yang sama secara bersamaan — sesuatu yang tidak mungkin dilakukan dengan pencatatan manual.

2. **MVP bisa kuat jika fokus pada kebutuhan inti.** Daripada membangun sistem yang kompleks, saya fokus pada tiga pertanyaan utama: order apa yang masuk, stok bahan ada berapa, dan berapa yang sudah terjual hari ini.

3. **Desain produk dimulai dari empati.** Fitur Mode UTS/UAS muncul bukan dari pertimbangan teknis, tapi dari kebutuhan nyata tim yang juga mahasiswa — yang kadang harus membatasi order saat jadwal ujian padat.

---

## Dampak

Sejak dashboard ini digunakan, proses input order turun dari ±2 menit (tulis manual) menjadi **kurang dari 30 detik**. Stok bahan baku kini terpantau real-time, dan tim tidak lagi khawatir kehabisan bahan di tengah jalan. Rekap harian yang sebelumnya makan waktu 15 menit kini bisa diunduh sebagai PDF dalam hitungan detik.

---

## Ke Depan

Ada beberapa fitur yang ingin saya tambahkan di versi berikutnya: riwayat order per hari untuk analisis tren menu terlaris, papan pesan antar shift untuk koordinasi tim, dan laporan mingguan yang bisa dikirim otomatis ke WhatsApp.

Proyek ini membuktikan bahwa masalah operasional yang terlihat sederhana sekalipun bisa diselesaikan dengan teknologi — dan dampaknya terasa langsung dalam keseharian usaha.

---

*"Delight in every bite" — dan kini, delight in every line of code.* 🍰
