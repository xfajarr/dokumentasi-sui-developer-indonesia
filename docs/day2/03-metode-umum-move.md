---
sidebar_position: 4
title: "Tambahan: Metode Umum di Move Smart Contract"
description: Panduan lengkap metode-metode umum yang sering digunakan dalam pengembangan smart contract Move.
keywords: [sui, blockchain, move, metode, public_transfer, shared_transfer, pemula, indonesia]
---

# Metode Umum di Move Smart Contract

Selamat datang di sesi tambahan hari ini! Di sesi ini, kita akan mempelajari "alat-alat" penting yang sering digunakan dalam pengembangan smart contract Move. Metode-metode ini seperti "pisau multifungsi" yang akan membantu kita memanipulasi objek dan transfer aset di blockchain Sui.

## Apa yang Akan Kita Pelajari Hari Ini?

- ✅ **Metode Transfer**: `public_transfer`, `transfer`, `shared_transfer`
- ✅ **Metode Pembuatan Objek**: `new`, `new_from_hash`, `new_with_version`
- ✅ **Metode Utilitas**: `borrow`, `borrow_mut`, `delete`, `exists_`
- ✅ **Praktik Langsung**: Mencoba metode-metode dalam contoh nyata
- ✅ **Best Practices**: Kapan dan bagaimana menggunakan setiap metode

---

## 1. Metode Transfer: Mengirim Objek di Sui

### Apa itu Metode Transfer?

Bayangkan metode transfer seperti **layanan pengiriman paket** di blockchain. Setiap metode memiliki cara kerja yang berbeda dalam mengirim "paket" (objek) dari satu alamat ke alamat lain.

Di Sui, ada tiga metode utama untuk transfer objek:

| Metode | Fungsi Utama | Kapan Digunakan |
|---------|---------------|-----------------|
| **`public_transfer`** | Mengirim ke alamat spesifik | Untuk objek yang dimiliki oleh satu alamat |
| **`transfer`** | Mengirim ke alamat spesifik | Untuk objek yang bisa dimiliki oleh siapa saja |
| **`shared_transfer`** | Membuat objek bisa diakses publik | Untuk objek yang ingin dibagikan ke banyak pengguna |

### 1.1 public_transfer

#### Apa itu `public_transfer`?

`public_transfer` adalah metode yang paling umum digunakan untuk mengirim objek yang dimiliki oleh satu alamat ke alamat lain.

#### Sintaks Dasar
```rust
use sui::transfer;

transfer::public_transfer(objek, alamat_tujuan);
```

#### Contoh Praktis
```rust
module example::nft {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    
    struct NFT has key, store {
        id: UID,
        name: String,
        creator: address,
    }
    
    // Fungsi untuk membuat NFT baru
    public fun mint_nft(name: String, ctx: &mut TxContext) {
        let nft = NFT {
            id: object::new(ctx),
            name,
            creator: tx_context::sender(ctx),
        };
        
        // Mengirim NFT ke pembuat (pemilik awal)
        transfer::public_transfer(nft, tx_context::sender(ctx));
    }
    
    // Fungsi untuk transfer NFT ke alamat lain
    public fun transfer_nft(nft: NFT, recipient: address) {
        // Mengirim NFT ke alamat penerima
        transfer::public_transfer(nft, recipient);
    }
}
```

#### Kapan Menggunakan `public_transfer`?
- ✅ Saat mengirim objek dari satu alamat ke alamat lain
- ✅ Saat objek harus dimiliki oleh satu alamat saja
- ✅ Saat membuat NFT atau aset digital serupa

#### Hal yang Perlu Diperhatikan
- Objek harus memiliki ability `key`
- Pengirim harus memiliki izin untuk mentransfer objek
- Setelah transfer, objek akan dimiliki sepenuhnya oleh alamat tujuan

### 1.2 transfer

#### Apa itu `transfer`?

`transfer` mirip dengan `public_transfer` tetapi digunakan untuk objek-objek khusus yang tidak memiliki batasan kepemilikan ketat.

#### Sintaks Dasar
```rust
use sui::transfer;

transfer::transfer(objek, alamat_tujuan);
```

#### Contoh Praktis
```rust
module example::koin {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    
    struct Koin has key {
        id: UID,
        value: u64,
    }
    
    // Fungsi untuk membuat koin baru
    public fun mint_koin(value: u64, ctx: &mut TxContext) {
        let koin = Koin {
            id: object::new(ctx),
            value,
        };
        
        // Mengirim koin ke pembuat
        transfer::transfer(koin, tx_context::sender(ctx));
    }
}
```

#### Perbedaan `transfer` dan `public_transfer`

| Aspek | `public_transfer` | `transfer` |
|--------|-------------------|-----------|
| **Objek Target** | Objek dengan ability `key` dan `store` | Objek dengan ability `key` saja |
| **Pembatasan** | Lebih ketat | Lebih fleksibel |
| **Use Case** | NFT, aset digital unik | Koin, token, aset yang bisa dibagi |

### 1.3 shared_transfer

#### Apa itu `shared_transfer`?

`shared_transfer` digunakan untuk membuat objek bisa diakses oleh banyak pengguna sekaligus. Ini seperti "membuat taman bermain publik" di blockchain.

#### Sintaks Dasar
```rust
use sui::transfer;

transfer::shared_transfer(objek);
```

#### Contoh Praktis
```rust
module example::game_shared {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    
    struct GameBoard has key {
        id: UID,
        game_state: vector<u8>,
        players: vector<address>,
    }
    
    // Fungsi untuk membuat papan game yang bisa diakses publik
    public fun create_shared_game(ctx: &mut TxContext) {
        let game_board = GameBoard {
            id: object::new(ctx),
            game_state: vector[0, 0, 0],
            players: vector[tx_context::sender(ctx)],
        };
        
        // Membuat game board bisa diakses oleh siapa saja
        transfer::shared_transfer(game_board);
    }
}
```

#### Kapan Menggunakan `shared_transfer`?
- ✅ Saat membuat aplikasi yang memerlukan akses multi-pengguna
- ✅ Saat membuat game yang bisa dimainkan bersama
- ✅ Saat membuat objek yang perlu diakses oleh komunitas

#### Hal yang Perlu Diperhatikan
- Objek yang di-shared tidak bisa lagi diubah kepemilikannya
- Siapa pun bisa berinteraksi dengan objek yang di-shared
- Objek yang di-shared tidak bisa di-transfer menggunakan metode lain

---

## 2. Metode Pembuatan Objek: Menciptakan Aset Digital

### Apa itu Metode Pembuatan Objek?

Bayangkan metode pembuatan objek seperti **pabrik** yang menciptakan objek-objek digital. Setiap objek di Sui memerlukan ID unik, dan metode-metode ini membantu kita membuatnya.

### 2.1 object::new

#### Apa itu `object::new`?

`object::new` adalah metode paling dasar untuk membuat objek baru dengan ID unik.

#### Sintaks Dasar
```rust
use sui::object;

let id = object::new(ctx);
```

#### Contoh Praktis
```rust
module example::objek_dasar {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    
    struct Item has key, store {
        id: UID,
        name: String,
        rarity: u8,
    }
    
    public fun create_item(name: String, rarity: u8, ctx: &mut TxContext) {
        let item = Item {
            id: object::new(ctx),  // Membuat ID unik
            name,
            rarity,
        };
        
        transfer::public_transfer(item, tx_context::sender(ctx));
    }
}
```

#### Penjelasan
- **`object::new(ctx)`**: Membuat UID (Unique Identifier) baru untuk objek
- **`ctx`**: Transaction context yang berisi informasi transaksi
- Setiap objek dengan ability `key` harus memiliki ID unik

### 2.2 object::new_from_hash

#### Apa itu `object::new_from_hash`?

`object::new_from_hash` membuat objek baru dengan ID yang ditentukan oleh hash tertentu. Ini berguna untuk membuat objek dengan ID yang bisa diprediksi.

#### Sintaks Dasar
```rust
use sui::object;

let id = object::new_from_hash(hash, ctx);
```

#### Contoh Praktis
```rust
module example::objek_deterministik {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::hash;
    
    struct DeterministikItem has key, store {
        id: UID,
        seed: vector<u8>,
    }
    
    public fun create_deterministik_item(seed: vector<u8>, ctx: &mut TxContext) {
        // Membuat hash dari seed
        let hash_val = hash::sha3_256(seed);
        
        // Membuat ID dari hash
        let id = object::new_from_hash(hash_val, ctx);
        
        let item = DeterministikItem {
            id,
            seed,
        };
        
        transfer::public_transfer(item, tx_context::sender(ctx));
    }
}
```

#### Kapan Menggunakan `object::new_from_hash`?
- ✅ Saat memerlukan objek dengan ID yang bisa diprediksi
- ✅ Saat membuat sistem yang memerlukan konsistensi
- ✅ Saat membuat objek berdasarkan input tertentu

### 2.3 object::new_with_version

#### Apa itu `object::new_with_version`?

`object::new_with_version` membuat objek baru dengan versi spesifik. Ini berguna untuk upgrade dan migrasi objek.

#### Sintaks Dasar
```rust
use sui::object;

let id = object::new_with_version(version, ctx);
```

#### Contoh Praktis
```rust
module example::objek_versi {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    
    struct VersionedItem has key, store {
        id: UID,
        version: u64,
    }
    
    public fun create_versioned_item(version: u64, ctx: &mut TxContext) {
        let item = VersionedItem {
            id: object::new_with_version(version, ctx),
            version,
        };
        
        transfer::public_transfer(item, tx_context::sender(ctx));
    }
}
```

#### Kapan Menggunakan `object::new_with_version`?
- ✅ Saat membuat sistem yang memerlukan versioning
- ✅ Saat melakukan upgrade smart contract
- ✅ Saat memerlukan kontrol terhadap versi objek

---

## 3. Metode Utilitas: Manipulasi Objek

### Apa itu Metode Utilitas?

Bayangkan metode utilitas seperti **alat-alat tukang** yang membantu kita memanipulasi, memeriksa, dan mengelola objek dengan cara yang berbeda.

### 3.1 borrow & borrow_mut

#### Apa itu `borrow` dan `borrow_mut`?

`borrow` dan `borrow_mut` adalah metode untuk "meminjam" objek tanpa mengambil kepemilikannya. Ini seperti meminjam buku dari perpustakaan tanpa membawanya pulang.

#### Sintaks Dasar
```rust
use sui::object;

// Meminjam objek secara immutable (tidak bisa diubah)
let objek_ref = &object::borrow<T>(id);

// Meminjam objek secara mutable (bisa diubah)
let objek_ref_mut = &mut object::borrow_mut<T>(id);
```

#### Contoh Praktis
```rust
module example::peminjaman_objek {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    
    struct Profile has key, store {
        id: UID,
        name: String,
        level: u8,
    }
    
    // Fungsi untuk membaca profile (immutable borrow)
    public fun get_name(profile: &Profile): String {
        profile.name
    }
    
    // Fungsi untuk upgrade level (mutable borrow)
    public fun level_up(profile: &mut Profile) {
        profile.level = profile.level + 1;
    }
}
```

#### Perbedaan `borrow` dan `borrow_mut`

| Aspek | `borrow` | `borrow_mut` |
|--------|----------|--------------|
| **Tipe Akses** | Immutable (tidak bisa diubah) | Mutable (bisa diubah) |
| **Use Case** | Membaca data | Mengubah data |
| **Keyword** | `&` | `&mut` |
| **Keamanan** | Lebih aman | Perlu hati-hati |

### 3.2 delete

#### Apa itu `delete`?

`delete` adalah metode untuk menghapus objek dari blockchain secara permanen. Ini seperti "menghancurkan" barang yang tidak lagi dibutuhkan.

#### Sintaks Dasar
```rust
use sui::object;

object::delete(objek);
```

#### Contoh Praktis
```rust
module example::penghapusan_objek {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    
    struct TemporaryItem has key, drop {
        id: UID,
        expiry_timestamp: u64,
    }
    
    // Fungsi untuk menghapus item yang sudah kadaluarsa
    public fun delete_expired(item: TemporaryItem, current_timestamp: u64) {
        // Hanya bisa dihapus jika sudah kadaluarsa
        if (item.expiry_timestamp <= current_timestamp) {
            // Menghapus objek dari blockchain
            object::delete(item);
        } else {
            // Jika belum kadaluarsa, transfer kembali ke pemilik
            // (Kode ini tidak lengkap, hanya contoh)
            abort(0);
        }
    }
}
```

#### Kapan Menggunakan `delete`?
- ✅ Saat objek sudah tidak lagi dibutuhkan
- ✅ Saat membersihkan data sementara
- ✅ Saat mengimplementasikan logika kadaluarsa

#### Hal yang Perlu Diperhatikan
- Objek harus memiliki ability `drop` untuk bisa dihapus
- Setelah dihapus, objek tidak bisa dikembalikan
- Hapus objek dengan hati-hati karena ini permanen

### 3.3 exists_

#### Apa itu `exists_`?

`exists_` adalah metode untuk memeriksa apakah objek dengan ID tertentu ada di blockchain.

#### Sintaks Dasar
```rust
use sui::object;

let exists = object::exists_<T>(id);
```

#### Contoh Praktis
```rust
module example::pemeriksaan_objek {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    
    struct GameItem has key, store {
        id: UID,
        power: u32,
    }
    
    // Fungsi untuk memeriksa apakah item ada
    public fun item_exists(id: UID): bool {
        object::exists_<GameItem>(id)
    }
    
    // Fungsi untuk mendapatkan power jika item ada
    public fun get_power_if_exists(id: UID): u32 {
        if (object::exists_<GameItem>(id)) {
            // Kode untuk mendapatkan power item
            // (Ini hanya contoh, implementasi sebenarnya lebih kompleks)
            100
        } else {
            0
        }
    }
}
```

#### Kapan Menggunakan `exists_`?
- ✅ Saat memeriksa keberadaan objek sebelum operasi
- ✅ Saat membuat logika kondisional berdasarkan keberadaan objek
- ✅ Saat memvalidasi input pengguna

---

## 4. Praktik: Menggabungkan Semua Metode

Sekarang mari kita lihat contoh yang menggabungkan semua metode yang telah kita pelajari:

```rust
module example::game_nft {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::String;
    
    // Struct untuk NFT Game
    struct GameNFT has key, store {
        id: UID,
        name: String,
        power: u32,
        level: u8,
        owner: address,
    }
    
    // Struct untuk Game Board (shared object)
    struct GameBoard has key {
        id: UID,
        active_players: vector<address>,
        game_state: vector<u8>,
    }
    
    // Fungsi untuk mint NFT baru
    public fun mint_nft(name: String, power: u32, ctx: &mut TxContext) {
        let nft = GameNFT {
            id: object::new(ctx),
            name,
            power,
            level: 1,
            owner: tx_context::sender(ctx),
        };
        
        // Menggunakan public_transfer untuk mengirim ke pemilik
        transfer::public_transfer(nft, tx_context::sender(ctx));
    }
    
    // Fungsi untuk upgrade NFT (menggunakan borrow_mut)
    public fun upgrade_nft(nft: &mut GameNFT) {
        nft.level = nft.level + 1;
        nft.power = nft.power + 10;
    }
    
    // Fungsi untuk transfer NFT
    public fun transfer_nft(nft: GameNFT, recipient: address) {
        transfer::public_transfer(nft, recipient);
    }
    
    // Fungsi untuk membuat game board shared
    public fun create_game_board(ctx: &mut TxContext) {
        let game_board = GameBoard {
            id: object::new(ctx),
            active_players: vector[tx_context::sender(ctx)],
            game_state: vector[1, 2, 3],
        };
        
        // Menggunakan shared_transfer untuk membuat game board publik
        transfer::shared_transfer(game_board);
    }
    
    // Fungsi untuk menghapus NFT (jika memungkinkan)
    public fun burn_nft(nft: GameNFT) {
        // Menggunakan delete untuk menghapus objek
        object::delete(nft);
    }
}
```

### Penjelasan Kode di Atas

1. **Pembuatan Objek**: Menggunakan `object::new` untuk membuat ID unik
2. **Public Transfer**: Menggunakan `transfer::public_transfer` untuk mengirim NFT ke pemilik
3. **Mutable Borrow**: Menggunakan `&mut GameNFT` untuk mengubah properti NFT
4. **Shared Transfer**: Menggunakan `transfer::shared_transfer` untuk membuat game board publik
5. **Delete**: Menggunakan `object::delete` untuk menghapus NFT

---

## 5. Best Practices untuk Menggunakan Metode

### Kapan Menggunakan Metode Transfer?

| Metode | Use Case | Contoh |
|---------|----------|---------|
| **`public_transfer`** | Objek dengan kepemilikan tunggal | NFT, tiket, sertifikat |
| **`transfer`** | Objek dengan kepemilikan fleksibel | Koin, token, aset yang bisa dibagi |
| **`shared_transfer`** | Objek dengan akses multi-pengguna | Game board, aplikasi komunitas |

### Kapan Menggunakan Metode Pembuatan Objek?

| Metode | Use Case | Contoh |
|---------|----------|---------|
| **`object::new`** | Objek dengan ID unik acak | NFT, item game unik |
| **`object::new_from_hash`** | Objek dengan ID deterministik | Item berdasarkan seed, sistem konsisten |
| **`object::new_with_version`** | Objek dengan kontrol versi | Sistem upgrade, migrasi data |

### Kapan Menggunakan Metode Utilitas?

| Metode | Use Case | Contoh |
|---------|----------|---------|
| **`borrow`** | Membaca data tanpa mengubah | Mendapatkan nama, memeriksa status |
| **`borrow_mut`** | Mengubah data | Upgrade level, mengubah properti |
| **`delete`** | Menghapus objek permanen | Menghapus item kadaluarsa, membersihkan data |
| **`exists_`** | Memeriksa keberadaan objek | Validasi input, logika kondisional |

### Tips Keamanan

1. **Validasi Sebelum Operasi**: Selalu validasi input sebelum melakukan operasi
   ```rust
   public fun safe_transfer(nft: NFT, recipient: address) {
       // Validasi: pastikan recipient bukan alamat nol
       assert!(recipient != @0x0, 0);
       
       transfer::public_transfer(nft, recipient);
   }
   ```

2. **Hati-hati dengan Mutable Operations**: Gunakan `borrow_mut` dengan hati-hati
   ```rust
   public fun safe_upgrade(nft: &mut NFT, max_level: u8) {
       // Validasi: pastikan level tidak melebihi batas
       assert!(nft.level < max_level, 1);
       
       nft.level = nft.level + 1;
   }
   ```

3. **Pertimbangkan Gas Cost**: Operasi yang berbeda memiliki biaya gas yang berbeda
   - `delete` biasanya lebih murah daripada transfer
   - `shared_transfer` bisa lebih mahal karena memerlukan storage publik

---

## 6. Latihan Praktis untuk Pemula

### Latihan 1: Membuat NFT dengan Transfer

Lengkapi kode berikut:

```rust
module latihan::nft_sederhana {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::String;
    
    struct NFT has key, store {
        id: UID,
        name: String,
        artist: String,
    }
    
    // Fungsi untuk mint NFT baru
    public fun mint_nft(name: String, artist: String, ctx: &mut TxContext) {
        // TODO: Buat NFT baru dengan object::new
        // TODO: Kirim NFT ke pembuat dengan public_transfer
    }
    
    // Fungsi untuk transfer NFT
    public fun transfer_nft(nft: NFT, recipient: address) {
        // TODO: Transfer NFT ke alamat penerima
    }
}
```

### Latihan 2: Game Board dengan Shared Object

Lengkapi kode berikut:

```rust
module latihan::game_board {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    
    struct GameBoard has key {
        id: UID,
        players: vector<address>,
        scores: vector<u64>,
    }
    
    // Fungsi untuk membuat game board baru
    public fun create_game_board(ctx: &mut TxContext) {
        // TODO: Buat game board baru
        // TODO: Tambahkan pemutar sebagai player pertama
        // TODO: Gunakan shared_transfer untuk membuat game board publik
    }
    
    // Fungsi untuk menambahkan player ke game
    public fun add_player(game_board: &mut GameBoard, player: address) {
        // TODO: Tambahkan player ke vector players
        // TODO: Tambahkan skor awal 0 ke vector scores
    }
}
```

### Latihan 3: Sistem Item dengan Borrow dan Delete

Lengkapi kode berikut:

```rust
module latihan::item_system {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    
    struct Item has key, drop {
        id: UID,
        name: String,
        durability: u8,
    }
    
    // Fungsi untuk membuat item baru
    public fun create_item(name: String, durability: u8, ctx: &mut TxContext) {
        // TODO: Buat item baru
        // TODO: Kirim item ke pembuat
    }
    
    // Fungsi untuk menggunakan item (mengurangi durability)
    public fun use_item(item: &mut Item) {
        // TODO: Kurangi durability sebesar 1
        // TODO: Cek apakah durability sudah 0
    }
    
    // Fungsi untuk menghapus item jika durability 0
    public fun destroy_item_if_broken(item: Item) {
        // TODO: Hapus item jika durability sudah 0
        // TODO: Jika masih > 0, transfer kembali ke pemilik
    }
}
```

---

## 7. Kesimpulan

### Apa yang Sudah Kita Pelajari?

- ✅ **Metode Transfer**: `public_transfer`, `transfer`, `shared_transfer` untuk mengirim objek
- ✅ **Metode Pembuatan Objek**: `new`, `new_from_hash`, `new_with_version` untuk membuat objek
- ✅ **Metode Utilitas**: `borrow`, `borrow_mut`, `delete`, `exists_` untuk manipulasi objek
- ✅ **Praktik Langsung**: Menggabungkan semua metode dalam contoh nyata
- ✅ **Best Practices**: Kapan dan bagaimana menggunakan setiap metode dengan aman

### Konsep Kunci yang Perlu Diingat

1. **Transfer = Layanan Pengiriman**: Setiap metode transfer memiliki cara kerja berbeda untuk tujuan berbeda
2. **Pembuatan Objek = Pabrik**: Metode pembuatan objek menciptakan ID unik untuk setiap objek
3. **Utilitas = Alat Tukang**: Metode utilitas membantu memanipulasi objek dengan cara yang aman
4. **Keamanan = Prioritas**: Selalu validasi input dan gunakan metode dengan hati-hati
5. **Gas Cost = Pertimbangan**: Setiap operasi memiliki biaya gas yang berbeda

### Tips untuk Pemula

1. **Mulai dari Sederhana**: Kuasai `public_transfer` dan `object::new` terlebih dahulu
2. **Pahami Use Case**: Pahami kapan menggunakan setiap metode
3. **Praktik di Playground**: Gunakan [Sui Move Playground](https://sui.move-analyzer.com/) untuk berlatih
4. **Baca Dokumentasi**: Selalu merujuk ke dokumentasi resmi Sui untuk informasi terbaru

### Langkah Selanjutnya

Selamat! Kamu sudah memahami metode-metode umum di Move! 🎉

Di sesi berikutnya, kita akan mempelajari:
- Konsep lanjutan dalam pengembangan smart contract
- Pattern dan arsitektur yang umum digunakan
- Integrasi dengan frontend dan aplikasi lain

Teruslah berlatih dan jangan takut untuk bereksperimen dengan metode-metode ini!
