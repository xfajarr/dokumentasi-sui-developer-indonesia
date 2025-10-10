---
sidebar_position: 1
title: "Sesi 1: Struktur Proyek & Modul Move"
description: Panduan lengkap struktur proyek dan modul di Move untuk pemula.
keywords: [sui, blockchain, move, struktur, modul, pemula, indonesia]
---

# Struktur Proyek & Modul Move

Selamat datang di sesi pertama hari ini! Di sesi ini, kita akan mempelajari "kerangka rumah" dari smart contract di Sui. Sebelum kita bisa membangun sesuatu yang hebat, kita perlu memahami di mana dan bagaimana kode kita akan hidup.

## Apa yang Akan Kita Pelajari Hari Ini?

- ✅ **Membuat Proyek Move**: Cara membuat proyek smart contract baru
- ✅ **Struktur Folder**: Memahami folder-folder penting dalam proyek Move
- ✅ **File Move.toml**: Mengelola konfigurasi proyek dan dependencies
- ✅ **Konsep Modul**: Memahami unit dasar kode di Move
- ✅ **Praktik Langsung**: Membuat dan menjelajahi proyek pertama kita

---

## 1. Membuat Proyek Move Baru

### Apa itu Proyek Move?

Bayangkan proyek Move seperti **rumah** yang akan kita bangun. Setiap rumah memerlukan denah (struktur folder) dan material (dependencies) sebelum kita bisa mulai membangun.

Di Sui, setiap smart contract dikemas dalam sebuah **Package**. Package ini berisi semua kode, konfigurasi, dan dependencies yang dibutuhkan.

### Langkah-langkah Membuat Proyek

Mari kita buat proyek pertama kita bersama-sama:

1. **Buka Terminal**
   - Windows: Buka Command Prompt atau PowerShell
   - Mac/Linux: Buka Terminal

2. **Jalankan Perintah Berikut**
   ```shell
   sui move new sui_workshop_day2
   ```

3. **Hasilnya**
   Perintah ini akan membuat sebuah folder baru bernama `sui_workshop_day2` dengan struktur tertentu.

### Memahami Perintah

```shell
sui move new sui_workshop_day2
```
- **`sui move new`**: Perintah untuk membuat proyek Move baru
- **`sui_workshop_day2`**: Nama proyek kita (bisa diganti sesuai keinginan)

---

## 2. Struktur Folder Proyek Move

Setelah menjalankan perintah di atas, kita akan memiliki struktur folder seperti ini:

![Move Smart Contract structure folder](/img/sui_sc_structure.png)

### Memahami Struktur Folder

Bayangkan struktur folder ini seperti **ruangan dalam sebuah rumah**:

| Folder | Fungsi | Analogi Rumah |
|--------|--------|---------------|
| **`Move.toml`** | File konfigurasi utama | Denah rumah |
| **`sources/`** | Kode smart contract | Ruang kerja utama |
| **`tests/`** | Unit testing (opsional) | Laboratorium uji coba |

### Penjelasan Detail

#### 1. File `Move.toml`
Ini adalah file konfigurasi utama proyek kita. Anggap saja seperti **identitas** dan **daftar belanja** proyek kita.

#### 2. Folder `sources/`
Ini adalah folder paling penting! Semua logika smart contract kita akan ditulis di sini dalam file-file `.move`.

#### 3. Folder `tests/` (Opsional)
Folder ini digunakan untuk menulis tes otomatis untuk smart contract kita. Sangat berguna untuk memastikan kode kita berjalan dengan benar.

### Contoh Isi Folder

```
sui_workshop_day2/
├── Move.toml          # File konfigurasi
├── sources/           # Folder untuk kode smart contract
│   └── (kosong awalnya)
└── tests/             # Folder untuk testing (opsional)
    └── (kosong awalnya)
```

---

## 3. Mengenal Move.toml (Manifest Proyek)

### Apa itu Move.toml?

Bayangkan `Move.toml` seperti **KTP** dan **daftar belanja** proyek kita sekaligus. File ini mendefinisikan:
- Siapa kita (identitas proyek)
- Apa yang kita butuhkan (dependencies)
- Di mana kita tinggal (alamat kontrak)

### Isi Default Move.toml

```toml
[package]
name = "sui_workshop_day2"
version = "0.0.1"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }

[addresses]
sui_workshop_day2 = "0x0"
```

### Memecah Move.toml

Mari kita bahas bagian per bagian:

#### 1. Bagian `[package]`
```toml
[package]
name = "sui_workshop_day2"
version = "0.0.1"
```

Ini adalah **identitas** proyek kita:
- **`name`**: Nama proyek (harus unik)
- **`version`**: Versi proyek (format: MAJOR.MINOR.PATCH)

#### 2. Bagian `[dependencies]`
```toml
[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }
```

Ini adalah **daftar belanja** proyek kita:
- **`Sui`**: Nama dependency (framework Sui)
- **`git = "..."`**: Lokasi repository GitHub
- **`subdir = "..."`**: Subfolder spesifik dalam repository
- **`rev = "..."`**: Versi spesifik (commit/branch)

**Apa artinya?**
Kita memberi tahu proyek kita: "Hey, kita butuh framework Sui. Ambil dari GitHub di lokasi X, versi Y."

#### 3. Bagian `[addresses]`
```toml
[addresses]
sui_workshop_day2 = "0x0"
```

Ini adalah **alamat** proyek kita di blockchain:
- **`sui_workshop_day2`**: Nama alias untuk alamat
- **`"0x0"`**: Alamat placeholder (sementara)

**Mengapa 0x0?**
Saat development, kita menggunakan `0x0` sebagai placeholder. Nanti setelah di-publish ke blockchain, kita akan menggantinya dengan alamat asli.

### Contoh Move.toml yang Lebih Kompleks

```toml
[package]
name = "sui_workshop_day2"
version = "0.0.1"
authors = ["Nama Anda <email@anda.com>"]
license = "Apache-2.0"
published_at = "2023-01-01T00:00:00Z"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }
NftProtocol = { local = "../nft-protocol" }

[addresses]
sui_workshop_day2 = "0x0"
nft_protocol = "0x0"
```

---

## 4. Folder sources dan Konsep Module

### Apa itu Module?

Bayangkan module seperti **ruangan** dalam sebuah rumah. Setiap ruangan memiliki fungsi spesifik:
- **Dapur**: Untuk memasak (logika terkait makanan)
- **Kamar Tidur**: Untuk istirahat (logika terkait istirahat)
- **Ruang Tamu**: Untuk bersosialisasi (logika terkait sosial)

Di Move, module adalah unit dasar kode yang berfungsi sebagai kontainer untuk:
- **Struct**: Blueprint untuk data
- **Functions**: Logika atau aksi

### Hubungan Antara File dan Module

Setiap file `.move` di dalam folder `sources/` adalah sebuah module.

Contoh:
- File `sources/learning_move.move` → Module `learning_move`
- File `sources/nft.move` → Module `nft`
- File `sources/token.move` → Module `token`

### Struktur Dasar Module

```rust
module nama_package::nama_module {
    // Kode smart contract kita akan ditulis di sini
}
```

### Contoh Nyata

File: `sources/learning_move.move`

```rust
module sui_workshop_day2::learning_move {
    // Import library yang dibutuhkan
    use sui::object::UID;
    use sui::transfer;
    use sui::tx_context::TxContext;
    
    // Struct (blueprint data)
    struct WorkshopCard has key, store {
        id: UID,
        participant_name: String,
        attendance_count: u64
    }
    
    // Function (logika)
    public fun create_card(name: String, ctx: &mut TxContext) {
        // Logika untuk membuat kartu baru
    }
}
```

### Memahami Nama Module

```rust
module sui_workshop_day2::learning_move {
```

- **`sui_workshop_day2`**: Nama package (dari Move.toml)
- **`learning_move`**: Nama module (nama file tanpa ekstensi .move)

### Aturan Penamaan Module

1. **Huruf Kecil**: Nama module harus menggunakan huruf kecil
2. **Snake Case**: Gunakan underscore `_` untuk memisahkan kata
3. **Deskriptif**: Beri nama yang menjelaskan fungsi module
4. **Unik**: Tidak ada dua module dengan nama yang sama

### Contoh Nama Module yang Baik

```
✅ nft
✅ token_management
✅ user_profile
✅ voting_system

❌ NFT (huruf besar)
❌ TokenManagement (camel case)
❌ module1 (tidak deskriptif)
```

---

## 5. Praktik: Membuat Project Pertama

Sekarang mari kita praktekkan membuat project pertama kita!

### Langkah 1: Buat Project Baru

```shell
sui move new latihan_pertama
```

### Langkah 2: Masuk ke Folder Project

```shell
cd latihan_pertama
```

### Langkah 3: Lihat Struktur Folder

```shell
ls -la
```

Hasilnya akan terlihat seperti ini:

```
total 16
drwxr-xr-x  4 user  staff   128 Jan 1 12:00 .
drwxr-xr-x  3 user  staff    96 Jan 1 12:00 ..
-rw-r--r--  1 user  staff   245 Jan 1 12:00 Move.toml
drwxr-xr-x  2 user  staff    64 Jan 1 12:00 sources
```

### Langkah 4: Lihat Isi Move.toml

```shell
cat Move.toml
```

### Langkah 5: Buat Module Pertama

Buat file baru di `sources/halo_dunia.move`:

```rust
module latihan_pertama::halo_dunia {
    public fun halo() {
        // Fungsi sederhana untuk mencetak "Halo, Dunia!"
        // Di Move, kita tidak bisa langsung print, tapi ini contoh dasar
    }
}
```

### Langkah 6: Build Project

```shell
sui move build
```

Jika berhasil, akan muncul pesan:
```
INCLUDING DEPENDENCY Sui
INCLUDING DEPENDENCY MoveStdlib
BUILDING latihan_pertama
Successfully built modules
```

---

## 6. Tips dan Best Practices

### Tips untuk Pemula

1. **Nama Project yang Jelas**: Gunakan nama yang menjelaskan fungsi project
   ```
   ✅ workshop_nft
   ✅ voting_dApp
   ❌ project1
   ❌ test_project
   ```

2. **Struktur Folder yang Rapi**: Jangan sembarangan meletakkan file
   ```
   ✅ sources/nft.move
   ✅ sources/token.move
   ❌ sources/NFT dengan spasi.move
   ❌ sources/nft_v2_final.move
   ```

3. **Versi yang Konsisten**: Update versi di Move.toml saat ada perubahan besar
   ```toml
   version = "0.0.1" → version = "0.1.0"
   ```

### Common Mistakes yang Harus Dihindari

1. **Nama Module dengan Huruf Besar**
   ```rust
   module latihan_pertama::NFT {  // ❌ Salah
   module latihan_pertama::nft {  // ✅ Benar
   ```

2. **Lupa Import Library**
   ```rust
   module latihan_pertama::contoh {
       public fun contoh_fungsi() {
           let obj = object::new(ctx);  // ❌ Error: object tidak dikenal
       }
   }
   
   module latihan_pertama::contoh {
       use sui::object;  // ✅ Benar: import library dulu
       
       public fun contoh_fungsi(ctx: &mut TxContext) {
           let obj = object::new(ctx);
       }
   }
   ```

3. **Alamat yang Tidak Konsisten**
   ```toml
   [addresses]
   latihan_pertama = "0x0"  // Nama harus sama dengan nama package
   ```

---

## 7. Latihan Praktis untuk Pemula

### Latihan 1: Membuat Project Sederhana

1. Buat project baru dengan nama `belajar_move`
2. Lihat struktur folder yang dibuat
3. Buka file Move.toml dan pahami isinya
4. Buat module pertama dengan nama `salam`
5. Tambahkan fungsi `public fun pagi()` di dalamnya
6. Build project dan pastikan tidak ada error

### Latihan 2: Memahami Dependencies

1. Buat project baru dengan nama `latihan_dependency`
2. Buka file Move.toml
3. Coba tambahkan dependency baru (meskipun mungkin belum digunakan):
   ```toml
   [dependencies]
   Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }
   ```
4. Build project dan lihat apa yang terjadi

### Latihan 3: Membuat Multiple Module

1. Buat project baru dengan nama `multi_module`
2. Buat 3 module berbeda:
   - `sources/user.move`
   - `sources/product.move`
   - `sources/order.move`
3. Setiap module harus memiliki struktur dasar:
   ```rust
   module multi_module::nama_module {
       // Kosong dulu, fokus pada struktur
   }
   ```
4. Build project dan pastikan semua module terdeteksi

---

## 8. Kesimpulan

### Apa yang Sudah Kita Pelajari?

- ✅ **Membuat Proyek Move**: Cara membuat proyek smart contract baru dengan `sui move new`
- ✅ **Struktur Folder**: Memahami fungsi Move.toml, sources/, dan tests/
- ✅ **File Move.toml**: Mengelola konfigurasi proyek, dependencies, dan alamat
- ✅ **Konsep Modul**: Memahami module sebagai unit dasar kode di Move
- ✅ **Praktik Langsung**: Membuat, menjelajahi, dan membuild proyek pertama

### Konsep Kunci yang Perlu Diingat

1. **Project = Rumah**: Proyek Move seperti rumah dengan struktur yang terorganisir
2. **Move.toml = KTP + Daftar Belanja**: Mendefinisikan identitas dan kebutuhan proyek
3. **Module = Ruangan**: Setiap module adalah ruangan dengan fungsi spesifik
4. **Sources = Ruang Kerja**: Tempat semua logika smart contract ditulis
5. **Build = Mengecek**: Proses memastikan semua kode benar dan siap digunakan

### Tips untuk Pemula

1. **Mulai dari Sederhana**: Jangan langsung membuat proyek kompleks
2. **Pahami Struktur**: Kuasai struktur dasar sebelum melangkah ke konsep lanjut
3. **Sering Build**: Build project secara reguler untuk mendeteksi error sejak dini
4. **Baca Error Messages**: Pesan error di Move biasanya sangat membantu

### Langkah Selanjutnya

Selamat! Kamu sudah memahami struktur proyek dan konsep module di Move! 🎉

Di sesi berikutnya, kita akan mempelajari:
- Sintaks dasar bahasa Move
- Variabel dan tipe data
- Logika kondisional
- Error handling

**GMove!**