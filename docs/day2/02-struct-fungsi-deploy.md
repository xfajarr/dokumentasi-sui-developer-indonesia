---
sidebar_position: 3
title: "Struct, Fungsi dan Deploy Smart Contract Pertamamu"
description: Panduan lengkap untuk membuat dan mendeploy smart contract pertama di Sui blockchain.
keywords: [sui, blockchain, smart contract, pemula, indonesia]
---

# Struct, Fungsi dan Deploy Smart Contract Pertamamu

Selamat datang di sesi paling praktis hari ini! Di sesi ini, kita akan menggabungkan semua konsep yang telah kita pelajari untuk membuat smart contract pertama kita di blockchain Sui.

## Apa yang Akan Kita Pelajari Hari Ini?

- ✅ **Membuat Blueprint Aset**: Memahami `struct` dan `abilities` di Move
- ✅ **Menulis Logika Smart Contract**: Membuat `functions` yang dapat dijalankan
- ✅ **Mendeploy ke Blockchain**: Membangun dan mempublikasikan smart contract kita

---

## 1. Membuat Blueprint Aset: Struct dan Abilities

### Apa itu Struct?

Bayangkan `struct` seperti **cetak biru (blueprint)** untuk membuat objek di blockchain. Sama seperti cetak biru rumah yang mendefinisikan bagaimana rumah akan dibangun, `struct` mendefinisikan bagaimana aset digital kita akan terlihat dan berperilaku.

### Contoh: Profile Object

Mari kita buat contoh sederhana: sebuah Profile object yang menggambarkan konsep object-centric di Sui.

```rust
use sui::object::UID;
use std::string::String;

// Blueprint untuk sebuah "Profile"
struct Profile has key, store {
    id: UID,
    name: String,
    level: u64
}
```

### Memahami Kode di Atas

Mari kita pecah kode ini bagian per bagian:

```rust
struct Profile has key, store {
    // Field-field (properti) dari Profile
    id: UID,                    // ID unik untuk setiap object
    name: String,              // Nama user
    level: u64                 // Level user (u64 = bilangan bulat positif)
}
```

- **`Profile`**: Nama blueprint/struct kita
- **`id: UID`**: Setiap object akan memiliki ID unik yang dihasilkan oleh sistem
- **`name: String`**: Nama user dalam bentuk string
- **`level: u64`**: Level user yang dimulai dari 1

### Apa itu "Abilities"?

Teks `has key, store` yang muncul setelah nama struct disebut **Abilities**. Abilities adalah "kekuatan super" yang memberikan kemampuan khusus kepada struct kita.

#### Ability `key` - Kunci Utama

**`key` adalah ability paling penting di Sui!**

- **Apa fungsinya?**: Memberi tahu blockchain bahwa "Ini adalah aset utama yang bisa disimpan secara global"
- **Apa efeknya?**: 
  - Memberikan ID unik (UID) otomatis kepada setiap objek
  - Memungkinkan objek untuk dimiliki oleh alamat wallet
  - Memungkinkan objek untuk ditransfer antar wallet

**Aturan emas**: Semua aset bernilai di Sui (seperti NFT, koin, tiket, dll) HARUS memiliki ability `key`.

#### Ability `store` - Kemampuan Penyimpanan

**`store` memberikan kemampuan komposisi**

- **Apa fungsinya?**: Memungkinkan struct ini disimpan di dalam struct lain
- **Apa efeknya?**: 
  - Kita bisa membuat "kotak harta karun" yang berisi banyak NFT
  - Kita bisa membuat "karakter game" yang memiliki "pedang" dan "perisai"
  - Memungkinkan pembuatan aset yang lebih kompleks

#### Abilities Lainnya (Hati-hati!)

Ada dua abilities lain yang perlu diketahui, tapi **harus berhati-hati** saat menggunakannya:

- **`copy`**: Memungkinkan struct diduplikasi. ⚠️ **JANGAN gunakan untuk aset bernilai!**
- **`drop`**: Memungkinkan struct dihancurkan. ⚠️ **JANGAN gunakan untuk aset bernilai!**

---

## 2. Menulis Logika Smart Contract: Functions

Sekarang kita punya blueprint, tapi kita butuh cara untuk **membuat** dan **menggunakan** kartu peserta. Di sinilah `functions` berperan!

### Apa itu Function?

Function adalah **logika** atau **aksi** yang bisa dilakukan oleh smart contract kita. Jika struct adalah cetak biru, maka function adalah pabrik yang memproduksi objek dari cetak biru tersebut.

### Contoh: Fungsi untuk Membuat Profile

Mari kita buat fungsi yang akan membuat Profile object baru:

```rust
use sui::object::{Self, UID};
use sui::tx_context::{Self, TxContext};
use sui::transfer;
use std::string::String;

// ... struct Profile ...

// 'entry' berarti fungsi ini bisa dipanggil langsung sebagai transaksi
public entry fun create_profile(
    name: String,
    ctx: &mut TxContext
) {
    // Langkah 1: Membuat instance dari struct
    let profile = Profile {
        id: object::new(ctx),
        name,
        level: 1  // Level awal adalah 1
    };
    
    // Langkah 2: Mengirim objek ke si pembuat transaksi
    transfer::transfer(profile, tx_context::sender(ctx));
}
```

### Memahami Kode di Atas

Mari kita pecah fungsi ini langkah demi langkah:

#### 1. Deklarasi Fungsi
```rust
public entry fun create_profile(
    name: String,
    ctx: &mut TxContext
) {
```
- **`public entry`**: Kata kunci yang berarti fungsi ini bisa dipanggil langsung sebagai transaksi oleh pengguna
- **`create_profile`**: Nama fungsi kita
- **`name: String`**: Parameter untuk nama user
- **`ctx: &mut TxContext`**: Parameter khusus yang berisi informasi tentang transaksi (siapa pengirim, dll)

#### 2. Membuat Objek
```rust
let profile = Profile {
    id: object::new(ctx),
    name,
    level: 1
};
```
- **`let profile = Profile { ... }`**: Membuat instance baru dari struct Profile
- **`id: object::new(ctx)`**: Membuat ID unik untuk objek ini
- **`name`**: Menggunakan parameter name yang diberikan
- **`level: 1`**: Mengisi level dengan 1 (level awal)

#### 3. Mengirim Objek
```rust
transfer::transfer(profile, tx_context::sender(ctx));
```
- **`transfer::transfer`**: Fungsi bawaan Sui untuk mengirim owned object ke alamat tertentu
- **`profile`**: Objek yang ingin kita kirim
- **`tx_context::sender(ctx)`**: Alamat tujuan (dalam hal ini, alamat pengirim)

### Jenis-jenis Fungsi di Move

Ada beberapa jenis fungsi di Move yang perlu diketahui:

1. **`entry fun`**: Fungsi yang bisa dipanggil langsung sebagai transaksi
2. **`public fun`**: Fungsi yang bisa dipanggil dari modul lain
3. **`fun`** (tanpa kata kunci): Fungsi privat yang hanya bisa dipanggil di dalam modul yang sama

---

## 3. Menggabungkan Semua: Smart Contract Lengkap

Sekarang mari kita lihat bagaimana semua bagian ini digabungkan menjadi satu smart contract utuh. Ini adalah contract yang sama dengan yang kita buat di sesi sebelumnya:

```rust
// File: sources/profile.move
module latihan_pertama::profile {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::String;

    // Blueprint untuk Profile
    struct Profile has key, store {
        id: UID,
        name: String,
        level: u64,
    }

    // Fungsi untuk membuat Profile baru
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

### Penjelasan Struktur Smart Contract

1. **`module latihan_pertama::profile`**: Mendefinisikan modul dengan nama package `latihan_pertama` dan nama modul `profile`
2. **`use ...`**: Mengimpor fungsi-fungsi yang kita butuhkan dari framework Sui
3. **`struct Profile`**: Mendefinisikan blueprint untuk Profile object dengan `key` dan `store` abilities
4. **`public entry fun create_profile`**: Mendefinisikan fungsi untuk membuat Profile baru
5. **`public entry fun level_up`**: Mendefinisikan fungsi untuk meningkatkan level
6. **`public fun get_level`**: View function untuk membaca level tanpa mengubah object

---

## 4. Momen Puncak: Build & Deploy Smart Contract

Sekarang saatnya yang paling ditunggu-tunggu! Kita akan membangun dan mendeploy smart contract pertama kita ke blockchain Sui.

### Langkah 1: Build Kode

Sebelum mendeploy, kita perlu memastikan kode kita tidak memiliki error.

1. Buka terminal di folder proyek kamu (`latihan_pertama`)
2. Jalankan perintah berikut:

```shell
sui move build
```

3. Jika semuanya berjalan lancar, kamu akan melihat pesan seperti ini:
```
INCLUDING DEPENDENCY Sui
INCLUDING DEPENDENCY MoveStdlib
BUILDING latihan_pertama
Successfully built modules
```

Jika ada error, baca pesan error dengan teliti dan perbaiki kode kamu.

### Langkah 2: Publish ke Testnet

Setelah kode berhasil dibangun, saatnya mendeploy ke blockchain Sui Testnet.

1. Pastikan kamu sudah mengatur environment Sui Client dengan benar (jika belum, lihat panduan di sesi sebelumnya)
2. Jalankan perintah berikut untuk mendeploy smart contract:

```shell
sui client publish
```

### Memahami Perintah Publish

- **`sui client publish`**: Perintah untuk mempublikasikan smart contract ke blockchain

### Hasil yang Diharapkan

Jika berhasil, terminal akan menampilkan informasi penting seperti ini:

```
Successfully verified dependencies on-chain against source.
Transaction Digest: <Transaction_Digest_Here>
Object ID: <Package_ID_Here>

Owned Objects:
┌───┬──────────────────────────────┬──────────┬────────────────────────┐
│ # │ Object ID                   │ Version  │ Struct Name            │
├───┼──────────────────────────────┼──────────┼────────────────────────┤
│ 0 │ <Package_ID_Here>            │ 1        │ UpgradeCap             │
└───┴──────────────────────────────┴──────────┴────────────────────────┘

----- Events ----
Array [Event { ... }]
```

### Informasi Penting dari Hasil Deploy

Dari output di atas, yang paling penting untuk dicatat adalah:

1. **Package ID**: ID unik untuk smart contract kita (baris "Object ID: `<Package_ID_Here>`")
2. **Transaction Digest**: Bukti bahwa transaksi kita berhasil diproses

### Langkah 3: Verifikasi di Sui Explorer

Setelah berhasil mendeploy, mari kita verifikasi bahwa smart contract kita benar-benar ada di blockchain:

1. Salin **Package ID** dari hasil deploy
2. Buka [Sui Explorer Testnet](https://explorer.sui.testnet.sui.io/)
3. Paste Package ID di kolom pencarian
4. Tekan Enter

Kamu seharusnya melihat informasi tentang smart contract yang baru saja kamu deploy!

### Langkah 4: Menguji Smart Contract

Sekarang mari kita uji smart contract kita dengan memanggil fungsi `create_profile`:

```shell
sui client call \
  --package <PACKAGE_ID> \
  --module profile \
  --function create_profile \
  --args "Sui Developer" \
  --gas-budget 10000000
```

Ganti `<PACKAGE_ID>` dengan Package ID yang kamu dapatkan dari hasil deploy.

**Contoh dengan PackageID:**
```shell
sui client call \
  --package 0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890 \
  --module profile \
  --function create_profile \
  --args "Sui Developer" \
  --gas-budget 10000000
```

Jika berhasil, kamu akan melihat output yang menunjukkan bahwa sebuah objek `Profile` baru telah dibuat dan dikirim ke alamat kamu. Simpan **ObjectID** dari Profile yang baru dibuat!

Kamu juga bisa memanggil fungsi `level_up` untuk meningkatkan level:

```shell
sui client call \
  --package <PACKAGE_ID> \
  --module profile \
  --function level_up \
  --args <PROFILE_OBJECT_ID> \
  --gas-budget 10000000
```

---

## 5. Kesimpulan dan Langkah Selanjutnya

### Apa yang Sudah Kita Pelajari?

- ✅ **Struct**: Membuat cetak biru untuk aset digital
- ✅ **Abilities**: Memahami kemampuan khusus yang bisa dimiliki struct (`key`, `store`, `copy`, `drop`)
- ✅ **Functions**: Menulis logika untuk membuat dan memanipulasi objek
- ✅ **Deploy**: Membangun dan mempublikasikan smart contract ke blockchain Sui

### Konsep Kunci yang Perlu Diingat

1. **Struct = Blueprint**: Struct adalah cetak biru untuk membuat objek di blockchain
2. **Abilities = Superpowers**: Abilities memberikan kemampuan khusus kepada struct
3. **Functions = Actions**: Functions adalah logika atau aksi yang bisa dilakukan oleh smart contract
4. **Key Ability = Wajib**: Semua aset bernilai di Sui HARUS memiliki ability `key`
5. **Testing is Important**: Selalu uji smart contract kamu di testnet sebelum mainnet

### Langkah Selanjutnya

Selamat! Kamu baru saja berhasil membuat dan mendeploy smart contract pertama kamu di blockchain Sui! 🎉

Di sesi berikutnya, kita akan mempelajari:
- Cara membuat fungsi yang lebih kompleks
- Cara berinteraksi dengan objek yang sudah ada
- Cara membuat NFT (Non-Fungible Token) yang lebih menarik

Teruslah bereksperimen dan jangan takut untuk mencoba hal baru!

---

## 6. Troubleshooting Umum

### Error Saat Build

Jika kamu mendapatkan error saat menjalankan `sui move build`, periksa:

1. **Syntax Error**: Pastikan semua kurung, koma, dan titik koma sudah benar
2. **Import Error**: Pastikan semua modul yang dibutuhkan sudah diimpor dengan benar
3. **Type Error**: Pastikan tipe data yang digunakan sudah benar

### Error Saat Publish

Jika kamu mendapatkan error saat menjalankan `sui client publish`, periksa:

1. **Gas Budget**: Coba tingkatkan nilai `--gas-budget`
2. **Connection**: Pastikan kamu terhubung ke jaringan Sui Testnet
3. **Account Balance**: Pastikan akun kamu memiliki cukup SUI untuk membayar gas

### Error Saat Memanggil Fungsi

Jika kamu mendapatkan error saat memanggil fungsi, periksa:

1. **Package ID**: Pastikan Package ID yang digunakan sudah benar
2. **Module Name**: Pastikan nama modul sudah benar (case-sensitive)
3. **Function Name**: Pastikan nama fungsi sudah benar (case-sensitive)

Jika kamu masih mengalami masalah, jangan ragu untuk bertanya di komunitas Sui Indonesia!