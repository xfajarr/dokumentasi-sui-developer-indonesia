---
sidebar_position: 2
title: "Sintaks Dasar Move"
description: Panduan lengkap sintaks dasar bahasa Move untuk pemula.
keywords: [sui, blockchain, move, sintaks, pemula, indonesia]
---

# Sintaks Dasar Move

Selamat datang di sesi kedua hari ini! Di sesi ini, kita akan mempelajari "balok LEGO" dasar dari bahasa Move yang akan kita gunakan untuk membangun smart contract. Memahami sintaks dasar ini sangat penting sebelum kita melangkah ke konsep yang lebih kompleks.

## Apa yang Akan Kita Pelajari Hari Ini?

- ✅ **Variabel & Tipe Data**: Cara menyimpan dan mengelola data di Move
- ✅ **Logika Kondisional**: Membuat keputusan dengan `if-else`
- ✅ **Penanganan Error**: Melindungi smart contract dengan `assert!`
- ✅ **Praktik Langsung**: Mencoba kode sederhana untuk memahami konsep

---

## 1. Variabel & Tipe Data

### Apa itu Variabel?

Bayangkan variabel seperti **kotak penyimpanan** dengan label. Setiap kotak memiliki:
- **Nama label** (nama variabel)
- **Jenis isi** (tipe data)
- **Isi** (nilai)

Di Move, kita membuat variabel menggunakan kata kunci `let`.

### Membuat Variabel

```rust
// Variabel immutable (tidak bisa diubah nilainya setelah dibuat)
let umur: u64 = 25;

// Variabel mutable (bisa diubah nilainya)
let mut skor: u64 = 0;
skor = skor + 10; // Sekarang nilai skor adalah 10
```

### Memahami Kode di Atas

Mari kita pecah kode ini:

```rust
let umur: u64 = 25;
```
- **`let`**: Kata kunci untuk membuat variabel baru
- **`umur`**: Nama variabel kita
- **`: u64`**: Tipe data variabel (bilangan bulat positif 64-bit)
- **`= 25`**: Memberikan nilai awal 25 ke variabel
- **`;`**: Mengakhiri pernyataan

```rust
let mut skor: u64 = 0;
skor = skor + 10;
```
- **`mut`**: Singkatan dari "mutable", berarti nilai variabel bisa diubah
- **`skor = skor + 10`**: Mengubah nilai skor menjadi nilai lama + 10

### Immutable vs Mutable

| Jenis | Keterangan | Contoh |
|-------|------------|--------|
| **Immutable** | Nilai tidak bisa diubah setelah dibuat | `let nama: String = "Budi";` |
| **Mutable** | Nilai bisa diubah setelah dibuat | `let mut umur: u64 = 20;` |

### Tipe Data Primitif di Move

Tipe data primitif adalah tipe data paling dasar yang sudah tersedia di Move:

#### 1. Bilangan Bulat (Integers)

Move memiliki beberapa tipe untuk bilangan bulat positif:

```rust
let angka_kecil: u8 = 255;       // 0 - 255
let angka_sedang: u32 = 100000;  // 0 - 4,294,967,295
let angka_besar: u64 = 1000000;  // 0 - 18,446,744,073,709,551,615 (paling umum)
let angka_very_besar: u128 = 10000000; // Lebih besar lagi
```

> **💡 Tips**: `u64` adalah yang paling umum digunakan di smart contract Sui!

#### 2. Boolean (Benar/Salah)

```rust
let is_active: bool = true;   // Benar
let is_complete: bool = false; // Salah
```

#### 3. Address (Alamat)

```rust
let alamat_wallet: address = 0x2a3b4c5d6e7f890123456789abcdef;
```

Address adalah alamat unik 64-karakter yang mengidentifikasi akun di blockchain Sui.

### Tipe Data Lanjutan

Untuk data yang lebih kompleks, kita perlu mengimpor dari library:

#### 1. String (Teks)

```rust
use std::string::String;

let nama: String = string::utf8(b"xfajarr");
let pesan: String = string::utf8(b"Selamat datang di Sui!");
```

#### 2. URL (Alamat Web)

```rust
use sui::url::Url;

let website: Url = url::new_unsafe_from_bytes(b"https://sui.io");
```

#### 3. Vector (Array/Daftar)

```rust
// Vector adalah seperti daftar atau array di bahasa pemrograman lain
let daftar_angka: vector<u64> = vector[10, 20, 30, 40];
let daftar_nama: vector<String> = vector[
    string::utf8(b"Budi"),
    string::utf8(b"Ahmad"),
    string::utf8(b"Siti")
];
```

### Contoh Praktis: Menggabungkan Semua Tipe Data

```rust
module latihan_pertama::data_types {
    use std::string::String;

    // Fungsi contoh yang menggunakan berbagai tipe data
    public fun contoh_data() {
        // Tipe data primitif
        let level: u64 = 25;
        let is_active: bool = true;
        let alamat: address = 0x1234;
        
        // Tipe data lanjutan
        let nama: String = string::utf8(b"Sui Developer");
        let level_history: vector<u64> = vector[1, 5, 10, 15, 20, 25];
        
        // Kita bisa menggunakan variabel-variabel ini
        // dalam logika smart contract kita
    }
}
```

---

## 2. Logika Kondisional: if-else

### Apa itu Logika Kondisional?

Bayangkan logika kondisional seperti **persimpangan jalan**. Berdasarkan kondisi tertentu, program akan memilih jalan yang berbeda.

Di Move, kita menggunakan `if-else` untuk membuat logika seperti ini.

### Sintaks Dasar if-else

```rust
if (kondisi) {
    // Kode yang dijalankan jika kondisi benar
} else {
    // Kode yang dijalankan jika kondisi salah
}
```

### Contoh Praktis: Mengecek Nilai

```rust
public fun cek_kelulusan(nilai: u64): bool {
    if (nilai >= 75) {
        // Jika nilai 75 atau lebih, return true (lulus)
        true
    } else {
        // Jika tidak, return false (tidak lulus)
        false
    }
}
```

### Memahami Kode di Atas

Mari kita pecah fungsi ini:

```rust
public fun cek_kelulusan(nilai: u64): bool {
```
- **`public fun`**: Fungsi yang bisa dipanggil dari luar modul
- **`cek_kelulusan`**: Nama fungsi kita
- **`nilai: u64`**: Parameter dengan nama `nilai` dan tipe `u64`
- **`: bool`**: Tipe data yang dikembalikan oleh fungsi (boolean)

```rust
if (nilai >= 75) {
    true
} else {
    false
}
```
- **`if (nilai >= 75)`**: Mengecek apakah nilai lebih besar atau sama dengan 75
- **`true`**: Mengembalikan nilai `true` jika kondisi terpenuhi
- **`false`**: Mengembalikan nilai `false` jika kondisi tidak terpenuhi

### Cara Kerja Return di Move

Di Move, nilai terakhir dalam sebuah blok kode akan menjadi nilai return dari blok tersebut. Ini disebut **"implicit return"**.

```rust
public fun contoh_return(): u64 {
    let x = 10;
    let y = 20;
    
    // Nilai terakhir (30) akan menjadi return value
    x + y
}
```

### Contoh Lain: if-else Bertingkat (Nested if)

```rust
public fun beri_grade(nilai: u64): u8 {
    if (nilai >= 90) {
        100  // A
    } else if (nilai >= 80) {
        90   // B
    } else if (nilai >= 70) {
        80   // C
    } else if (nilai >= 60) {
        70   // D
    } else {
        60   // E
    }
}
```

### Logika Kondisional dengan Boolean

```rust
public fun cek_akses(umur: u64, punya_ijin: bool): bool {
    // Bisa akses jika umur >= 18 ATAU punya ijin
    if (umur >= 18 || punya_ijin) {
        true
    } else {
        false
    }
}
```

### Operator Logika di Move

| Operator | Keterangan | Contoh |
|----------|------------|--------|
| `&&` | AND (dan) | `if (a > 0 && b > 0)` |
| `||` | OR (atau) | `if (a > 0 || b > 0)` |
| `!` | NOT (negasi) | `if (!is_complete)` |
| `>` | Lebih besar | `if (umur > 18)` |
| `>=` | Lebih besar atau sama dengan | `if (nilai >= 75)` |
| `<` | Lebih kecil | `if (umur < 18)` |
| `<=` | Lebih kecil atau sama dengan | `if (nilai <= 75)` |
| `==` | Sama dengan | `if (nilai == 100)` |
| `!=` | Tidak sama dengan | `if (nilai != 0)` |

---

## 3. Keamanan Pertama: Error Handling dengan assert!

### Apa itu Error Handling?

Bayangkan `assert!` seperti **penjaga keamanan** di smart contract kita. Tugasnya adalah memeriksa apakah kondisi tertentu terpenuhi sebelum melanjutkan eksekusi.

Jika kondisi tidak terpenuhi, `assert!` akan menghentikan eksekusi dan mengembalikan pesan error.

### Sintaks Dasar assert!

```rust
assert!(kondisi, kode_error);
```

- **`kondisi`**: Ekspresi boolean yang akan dicek
- **`kode_error`**: Kode error (biasanya bilangan bulat) yang akan dikembalikan jika kondisi salah

### Contoh Praktis: Validasi Input

```rust
// Mendefinisikan konstanta untuk kode error
const ERROR_AMOUNT_ZERO: u64 = 0;
const ERROR_INSUFFICIENT_BALANCE: u64 = 1;

public fun transfer(amount: u64, balance: u64) {
    // Pastikan amount tidak nol
    assert!(amount > 0, ERROR_AMOUNT_ZERO);
    
    // Pastikan balance cukup
    assert!(balance >= amount, ERROR_INSUFFICIENT_BALANCE);
    
    // ... logika transfer akan berjalan jika semua assert lolos ...
}
```

### Memahami Kode di Atas

```rust
const ERROR_AMOUNT_ZERO: u64 = 0;
```
- **`const`**: Mendefinisikan konstanta (nilai yang tidak bisa diubah)
- **`ERROR_AMOUNT_ZERO`**: Nama konstanta
- **`: u64`**: Tipe data konstanta
- **`= 0`**: Nilai konstanta

```rust
assert!(amount > 0, ERROR_AMOUNT_ZERO);
```
- **`assert!`**: Fungsi untuk validasi kondisi
- **`amount > 0`**: Kondisi yang dicek (amount harus lebih besar dari 0)
- **`ERROR_AMOUNT_ZERO`**: Kode error yang dikembalikan jika kondisi salah

### Mengapa assert! Sangat Penting?

1. **Keamanan**: Mencegah eksekusi kode yang berpotensi berbahaya
2. **Validasi Input**: Memastikan input pengguna valid sebelum diproses
3. **Debugging**: Membantu mengidentifikasi masalah dengan kode error yang jelas
4. **Transaksi Atomic**: Jika assert gagal, seluruh transaksi dibatalkan (tidak ada perubahan di blockchain)

### Contoh Lain: Validasi Alamat

```rust
const ERROR_INVALID_ADDRESS: u64 = 100;

public fun send_tokens(to_address: address, amount: u64) {
    // Pastikan alamat tujuan bukan alamat nol
    assert!(to_address != @0x0, ERROR_INVALID_ADDRESS);
    
    // Pastikan amount lebih dari 0
    assert!(amount > 0, 0);
    
    // ... logika pengiriman token ...
}
```

### Best Practices untuk assert!

1. **Gunakan Konstanta untuk Kode Error**: Lebih mudah dibaca dan di-maintain
2. **Beri Nama yang Jelas**: Nama konstanta harus menjelaskan jenis error
3. **Validasi Semua Input**: Selalu validasi input pengguna sebelum diproses
4. **Pesan Error yang Spesifik**: Berikan kode error yang berbeda untuk setiap jenis error

---

## 4. Praktik: Menggabungkan Semua Konsep

Sekarang mari kita lihat contoh yang menggabungkan semua konsep yang telah kita pelajari. Contoh ini menggunakan contract `Profile` yang sama dengan yang kita buat di sesi sebelumnya:

```rust
module latihan_pertama::profile {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};
    
    // Konstanta untuk kode error
    const ERROR_NAME_EMPTY: u64 = 0;
    const ERROR_LEVEL_TOO_HIGH: u64 = 1;
    
    // Struct Profile - ini adalah object yang akan kita buat
    struct Profile has key, store {
        id: UID,
        name: String,
        level: u64,
    }
    
    // Fungsi untuk membuat Profile baru dengan validasi
    public entry fun create_profile(
        name: String,
        ctx: &mut TxContext
    ) {
        // Validasi input dengan assert!
        assert!(string::length(&name) > 0, ERROR_NAME_EMPTY);
        
        // Membuat Profile object baru
        let profile = Profile {
            id: object::new(ctx),
            name,
            level: 1,  // Level awal adalah 1
        };

        // Transfer object ke sender (pembuat)
        transfer::transfer(profile, tx_context::sender(ctx));
    }
    
    // Fungsi untuk meningkatkan level dengan validasi
    public entry fun level_up(
        profile: &mut Profile
    ) {
        // Validasi: level tidak boleh lebih dari 100
        assert!(profile.level < 100, ERROR_LEVEL_TOO_HIGH);
        
        // Tingkatkan level
        profile.level = profile.level + 1;
    }
    
    // View function untuk melihat level
    public fun get_level(profile: &Profile): u64 {
        profile.level
    }
    
    // Fungsi untuk menentukan status berdasarkan level
    public fun get_status(profile: &Profile): u8 {
        if (profile.level >= 50) {
            3  // Expert
        } else if (profile.level >= 20) {
            2  // Advanced
        } else if (profile.level >= 10) {
            1  // Intermediate
        } else {
            0  // Beginner
        }
    }
}
```

### Penjelasan Kode di Atas

1. **Konstanta Error**: Mendefinisikan kode error untuk berbagai jenis validasi
2. **Struct Profile**: Mendefinisikan blueprint untuk Profile object dengan `key` dan `store` abilities
3. **Validasi Input**: Menggunakan `assert!` untuk memastikan nama tidak kosong dan level tidak melebihi batas
4. **Logika Kondisional**: Menggunakan `if-else` untuk menentukan status berdasarkan level
5. **Create Function**: Membuat Profile object baru dan mentransfernya ke pembuat
6. **Update Function**: Meningkatkan level dengan validasi

---

## 5. Latihan Praktis untuk Pemula

### Latihan 1: Variabel dan Tipe Data

Coba buat variabel-variabel berikut di Move Playground:

```rust
module latihan_pertama::sintaks_dasar {
    use std::string::String;
    
    public fun latihan_variabel() {
        // Buat variabel immutable untuk nama (String)
        
        // Buat variabel mutable untuk level (u64)
        
        // Ubah nilai level menjadi level + 1
        
        // Buat variabel boolean untuk status aktif
        
        // Buat vector berisi 3 level yang sudah dicapai
    }
}
```

### Latihan 2: Logika Kondisional

Lengkapi fungsi berikut:

```rust
module latihan_pertama::logika_kondisional {
    public fun cek_level_genap(level: u64): bool {
        // Return true jika level genap, false jika ganjil
        // Hint: Gunakan operator %
    }
    
    public fun dapat_bonus(level: u64): u64 {
        // Jika level < 10, bonus = 100
        // Jika level 10-50, bonus = 500
        // Jika level > 50, bonus = 1000
    }
}
```

### Latihan 3: Error Handling

Lengkapi fungsi berikut dengan menambahkan validasi menggunakan `assert!`:

```rust
module latihan_pertama::error_handling {
    use std::string::String;
    
    // Definisikan konstanta untuk kode error
    
    public fun level_up(level: u64, tambahan: u64): u64 {
        // Validasi: tambahan tidak boleh 0
        
        // Validasi: level + tambahan tidak boleh lebih dari 100
        
        // Jika validasi lolos, kembalikan level + tambahan
    }
    
    public fun buat_profile(nama: String, level_awal: u64): bool {
        // Validasi: nama tidak boleh kosong
        // Hint: gunakan string::length()
        
        // Validasi: level_awal minimal 1
        
        // Jika validasi lolos, return true
    }
}
```

---

## 6. Kesimpulan

### Apa yang Sudah Kita Pelajari?

- ✅ **Variabel**: Cara menyimpan data dengan `let` dan `let mut`
- ✅ **Tipe Data**: Berbagai tipe data di Move (u64, bool, address, String, vector)
- ✅ **Logika Kondisional**: Membuat keputusan dengan `if-else`
- ✅ **Error Handling**: Melindungi smart contract dengan `assert!`
- ✅ **Praktik**: Menggabungkan semua konsep dalam contoh nyata

### Konsep Kunci yang Perlu Diingat

1. **Variabel = Kotak Penyimpanan**: Variabel adalah tempat menyimpan data dengan nama dan tipe tertentu
2. **Immutable vs Mutable**: `let` untuk variabel yang tidak bisa diubah, `let mut` untuk yang bisa diubah
3. **Tipe Data Penting**: `u64` paling umum untuk angka, `bool` untuk true/false, `address` untuk alamat blockchain
4. **if-else = Pengambil Keputusan**: Memungkinkan program membuat keputusan berdasarkan kondisi
5. **assert! = Penjaga Keamanan**: Validasi kondisi dan hentikan eksekusi jika tidak terpenuhi

### Tips untuk Pemula

1. **Berlatih di Move Playground**: Gunakan [Sui Move Playground](https://sui.move-analyzer.com/) untuk berlatih
2. **Mulai dari Sederhana**: Jangan terburu-buru membuat kontrak kompleks
3. **Baca Error Messages**: Pesan error di Move biasanya sangat membantu
4. **Eksperimen**: Coba ubah kode dan lihat apa yang terjadi

### Langkah Selanjutnya

Selamat! Kamu sudah memahami sintaks dasar Move! 🎉

Di sesi berikutnya, kita akan menggunakan pengetahuan ini untuk:
- Membuat struct (blueprint aset)
- Membuat fungsi untuk smart contract
- Mendeploy smart contract pertama kamu ke blockchain Sui

Teruslah berlatih dan jangan takut untuk bereksperimen! **GMove**
