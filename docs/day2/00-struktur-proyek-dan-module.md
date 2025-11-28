---
sidebar_position: 1
title: "Struktur Proyek & Modul Move"
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
   sui move new sui_workshop
   ```

3. **Hasilnya**
   Perintah ini akan membuat sebuah folder baru bernama `sui_workshop` dengan struktur tertentu.

### Memahami Perintah

```shell
sui move new sui_workshop
```
- **`sui move new`**: Perintah untuk membuat proyek Move baru
- **`sui_workshop`**: Nama proyek kita (bisa diganti sesuai keinginan)

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
sui_workshop/
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
name = "sui_workshop"
version = "0.0.1"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }

[addresses]
sui_workshop = "0x0"
```

### Memecah Move.toml

Mari kita bahas bagian per bagian:

#### 1. Bagian `[package]`
```toml
[package]
name = "sui_workshop"
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
sui_workshop = "0x0"
```

Ini adalah **alamat** proyek kita di blockchain:
- **`sui_workshop`**: Nama alias untuk alamat
- **`"0x0"`**: Alamat placeholder (sementara)

**Mengapa 0x0?**
Saat development, kita menggunakan `0x0` sebagai placeholder. Nanti setelah di-publish ke blockchain, kita akan menggantinya dengan alamat asli.

### Contoh Move.toml yang Lebih Kompleks

```toml
[package]
name = "sui_workshop"
version = "0.0.1"
authors = ["Nama Anda <email@anda.com>"]
license = "Apache-2.0"
published_at = "2023-01-01T00:00:00Z"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }
NftProtocol = { local = "../nft-protocol" }

[addresses]
sui_workshop = "0x0"
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
module sui_workshop::learning_move {
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
module sui_workshop::learning_move {
```

- **`sui_workshop`**: Nama package (dari Move.toml)
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

## 5. Praktik: Membuat Contract Pertama

Sekarang mari kita praktekkan membuat contract pertama kita! Kali ini kita akan membuat contract yang menggambarkan konsep **object-centric** di Sui dengan cara yang sederhana.

### Langkah 1: Buat Contract Baru

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

### Langkah 5: Buat Module dengan Object

Buat file baru di `sources/profile.move`. Contract ini akan membuat **Profile** object yang bisa dimiliki oleh user:

```rust
module latihan_pertama::profile {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    // Struct Profile - ini adalah object yang akan kita buat
    struct Profile has key, store {
        id: UID,
        name: String,
        level: u64,
    }

    // Function untuk membuat Profile baru
    public entry fun create_profile(
        name: String,
        ctx: &mut TxContext
    ) {
        // Membuat Profile object baru
        let profile = Profile {
            id: object::new(ctx),
            name,
            level: 1,  // Level awal adalah 1
        };

        // Transfer object ke sender (pembuat)
        transfer::transfer(profile, tx_context::sender(ctx));
    }

    // Function untuk meningkatkan level
    public entry fun level_up(
        profile: &mut Profile
    ) {
        profile.level = profile.level + 1;
    }

    // View function untuk melihat level
    public fun get_level(profile: &Profile): u64 {
        profile.level
    }
}
```

**Penjelasan Kode:**

1. **`struct Profile`**: Ini adalah object yang akan kita buat. Memiliki:
   - `has key`: Artinya ini adalah object yang bisa dimiliki (owned object)
   - `has store`: Artinya object ini bisa disimpan di dalam object lain atau ditransfer
   - `id: UID`: Unique identifier untuk object ini
   - `name` dan `level`: Data yang disimpan dalam object

2. **`create_profile`**: Function untuk membuat Profile object baru dan mentransfernya ke pembuat

3. **`level_up`**: Function untuk meningkatkan level (mengubah data dalam object)

4. **`get_level`**: View function untuk membaca level tanpa mengubah object

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

### Langkah 7: Deploy Contract ke Sui Network

Setelah build berhasil, kita perlu deploy contract ke Sui network (bisa testnet atau devnet):

```shell
sui client publish
```

**Penjelasan Perintah:**
- `sui client publish`: Deploy contract ke Sui network

**Output yang Akan Muncul:**
```
Transaction Digest: 0x1234567890abcdef...
Published Objects:
  - PackageID: 0xabcdef1234567890...
  - ObjectID: 0x9876543210fedcba...
```

> **Penting:** Simpan **PackageID** yang muncul, karena kita akan membutuhkannya untuk memanggil function!

### Langkah 8: Memanggil Function dengan Sui Client

Setelah contract di-deploy, kita bisa memanggil function yang sudah dibuat menggunakan `sui client call`.

#### 8.1. Memanggil `create_profile`

Untuk membuat Profile object baru:

```shell
sui client call \
  --package <PACKAGE_ID> \
  --module profile \
  --function create_profile \
  --args "Sui Developer" \
  --gas-budget 10000000
```

**Penjelasan Perintah:**
- `--package <PACKAGE_ID>`: Ganti dengan PackageID yang didapat dari deploy
- `--module profile`: Nama module kita
- `--function create_profile`: Nama function yang ingin dipanggil
- `--args "Sui Developer"`: Argument untuk function (nama dalam bentuk string)
- `--gas-budget 10000000`: Budget gas untuk transaksi

**Contoh dengan PackageID:**
```shell
sui client call \
  --package 0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890 \
  --module profile \
  --function create_profile \
  --args "Sui Developer" \
  --gas-budget 10000000
```

**Output:**
```
Transaction Digest: 0x...
Created Objects:
  - ObjectID: 0x... (Profile object yang baru dibuat)
```

**Penting:** Simpan **ObjectID** dari Profile yang baru dibuat, karena kita akan membutuhkannya untuk memanggil `level_up`!

#### 8.2. Memanggil `level_up`

Untuk meningkatkan level Profile yang sudah dibuat:

```shell
sui client call \
  --package <PACKAGE_ID> \
  --module profile \
  --function level_up \
  --args <PROFILE_OBJECT_ID> \
  --gas-budget 10000000
```

**Penjelasan Perintah:**
- `--args <PROFILE_OBJECT_ID>`: ObjectID dari Profile yang ingin di-update

**Contoh dengan ObjectID:**
```shell
sui client call \
  --package 0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890 \
  --module profile \
  --function level_up \
  --args 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef \
  --gas-budget 10000000
```

**Output:**
```
Transaction Digest: 0x...
Mutated Objects:
  - ObjectID: 0x... (Profile object yang di-update)
```

### Langkah 9: Melihat Object yang Dibuat

Untuk melihat detail Profile object yang sudah dibuat:

```shell
sui client object <PROFILE_OBJECT_ID>
```

**Contoh:**
```shell
sui client object 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

**Output:**
```json
{
  "data": {
    "objectId": "0x...",
    "type": "0x...::profile::Profile",
    "content": {
      "dataType": "moveObject",
      "fields": {
        "id": {...},
        "level": 2,
        "name": "Sui Developer"
      }
    }
  }
}
```

### Tips Praktis

1. **Menyimpan PackageID dan ObjectID**: Gunakan alias atau simpan di file untuk memudahkan:
   ```shell
   export PACKAGE_ID=0xabcdef1234567890...
   export PROFILE_ID=0x1234567890abcdef...
   
   sui client call --package $PACKAGE_ID --module profile --function level_up --args $PROFILE_ID --gas-budget 10000000
   ```

2. **Menggunakan Active Address**: Pastikan kamu sudah set active address:
   ```shell
   sui client active-address
   ```

3. **Melihat Semua Object yang Dimiliki**:
   ```shell
   sui client objects
   ```

### Apa yang Sudah Kita Pelajari?

✅ **Membuat Object**: Membuat struct dengan `key` dan `store` abilities  
✅ **Create Function**: Membuat function untuk membuat object baru  
✅ **Update Function**: Membuat function untuk mengubah data dalam object  
✅ **Deploy Contract**: Menggunakan `sui client publish`  
✅ **Call Function**: Menggunakan `sui client call` untuk memanggil function  
✅ **View Object**: Menggunakan `sui client object` untuk melihat detail object

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

## 7. Kesimpulan

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