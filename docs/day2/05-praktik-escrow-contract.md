---
sidebar_position: 6
title: "Praktik: Membuat Escrow Smart Contract"
description: Panduan lengkap membuat dan menguji escrow smart contract di Sui blockchain.
keywords: [sui, blockchain, escrow, smart contract, praktik, indonesia]
---

# Praktik: Membuat Escrow Smart Contract

Selamat datang di sesi praktik. Kita akan membuat **Escrow Smart Contract** sederhana di Blockchain Sui.

## Apa yang Akan Dipelajari

- Konsep escrow dan cara kerjanya di blockchain
- Menyiapkan proyek Move dari awal
- Memahami struktur dan fungsi smart contract escrow
- Membuat dan menggunakan mock coin untuk testing
- Langkah-langkah build, publish, dan testing smart contract
- Tips troubleshooting dan debugging

---

## 1. Konsep Escrow

### 1.1. Apa itu Escrow?

Escrow adalah sistem perantara yang aman untuk transaksi antara dua pihak. Bayangkan kamu ingin **swap token A dengan token B**:

- **Penjual** memiliki token A dan ingin menukarnya dengan token B
- **Pembeli** memiliki token B dan ingin menukarnya dengan token A
- Kedua pihak ingin memastikan transaksi aman tanpa risiko rug pull

Escrow menyediakan solusi netral:
1. Penjual menaruh token A (deposit) ke kotak aman (escrow)
2. Pembeli menyerahkan token B (pembayaran) ke kotak aman
3. Setelah semuanya cocok, pembeli menerima token A dan penjual mengambil token B
4. Jika ada masalah, penjual bisa membatalkan dan menarik deposit kembali

Di blockchain, alur ini dijalankan otomatis oleh smart contract tanpa campur tangan manusia.

**Contoh Real-World**:
- Swap TBTC dengan zSUI
- Swap USDC dengan SUI
- Swap token A dengan token B (cross-chain atau same-chain)

### 1.2. Alur Escrow di Sui

1. **Penjual membuat escrow**: 
   - Menaruh token A (DepositCoinType) sebagai deposit
   - Menentukan jumlah token B (PaymentCoinType) yang diminta
   - Escrow object disimpan di blockchain

2. **Pembeli menerima escrow**: 
   - Mengirim token B (PaymentCoinType) sesuai jumlah yang diminta
   - Langsung menerima token A (DepositCoinType) dari escrow

3. **Penjual menarik pembayaran**: 
   - Setelah pembeli membayar, penjual bisa menarik token B (PaymentCoinType) kapan saja

4. **Pembatalan (opsional)**: 
   - Penjual dapat membatalkan escrow jika belum ada pembayaran
   - Deposit token A dikembalikan ke penjual

---

## 2. Persiapan Proyek

### 2.1. Membuat Proyek Baru

Buat folder proyek baru dengan perintah berikut:

```bash
sui move new escrow_contract
```

Masuk ke folder proyek:
```bash
cd escrow_contract
```

### 2.2. Konfigurasi `Move.toml`

Buka file `Move.toml` dan isi dengan konfigurasi berikut:

```toml
[package]
name = "escrow"
version = "0.0.1"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }

[addresses]
simple_escrow = "0x0"
mock_coin = "0x0"
```

### 2.3. Membuat File Source

Buat dua file berikut di folder `sources/`:
- `sources/simple_escrow.move`
- `sources/mock_coin.move`

Salin kode dari bagian berikutnya ke file-file tersebut.

### 2.4. Build Proyek

Jalankan build untuk memastikan proyek valid:

```bash
sui move build
```

Jika build berhasil, Move compiler akan menampilkan pesan sukses.

---

## 3. Kode Smart Contract

### 3.1. Modul `simple_escrow`

Buat file `sources/simple_escrow.move` dan salin kode berikut:

```rust
module escrow::simple_escrow {
    use sui::balance;
    use sui::balance::Balance;
    use sui::coin;
    use sui::coin::Coin;
    use sui::object;
    use sui::transfer;
    use sui::tx_context::TxContext;

    /// Escrow untuk swap antara dua tipe koin berbeda.
    /// DepositCoinType: tipe koin yang di-deposit oleh seller
    /// PaymentCoinType: tipe koin yang harus dibayar oleh buyer
    public struct Escrow<phantom DepositCoinType: store, phantom PaymentCoinType: store> has key, store {
        id: object::UID,
        deposit: Balance<DepositCoinType>,
        requested_amount: u64,
        receive: Balance<PaymentCoinType>,
        creator: address,
    }

    /// Seller kunci koin miliknya (DepositCoinType), tentukan jumlah PaymentCoinType yang diminta dari buyer.
    /// Contoh: Seller deposit TBTC, minta zSUI sebagai pembayaran.
    public entry fun create_escrow<DepositCoinType: store, PaymentCoinType: store>(
        deposit_coin: Coin<DepositCoinType>,
        request_amount: u64,
        ctx: &mut TxContext,
    ) {
        let escrow = Escrow<DepositCoinType, PaymentCoinType> {
            id: object::new(ctx),
            deposit: coin::into_balance(deposit_coin),
            requested_amount: request_amount,
            receive: balance::zero<PaymentCoinType>(),
            creator: ctx.sender(),
        };

        transfer::public_transfer(escrow, ctx.sender());
    }

    /// Buyer kirim koin PaymentCoinType sesuai request, langsung menerima deposit DepositCoinType dari seller.
    /// Contoh: Buyer bayar zSUI, terima TBTC dari escrow.
    public entry fun accept_escrow<DepositCoinType: store, PaymentCoinType: store>(
        escrow: &mut Escrow<DepositCoinType, PaymentCoinType>,
        payment: Coin<PaymentCoinType>,
        ctx: &mut TxContext,
    ) {
        assert!(coin::value(&payment) == escrow.requested_amount, 0);

        balance::join(&mut escrow.receive, coin::into_balance(payment));
        let deposit_balance = balance::withdraw_all(&mut escrow.deposit);
        let deposit_coin = coin::from_balance(deposit_balance, ctx);
        transfer::public_transfer(deposit_coin, ctx.sender());
    }

    /// Seller tarik pembayaran PaymentCoinType yang sudah diterima dari buyer.
    public entry fun complete_escrow<DepositCoinType: store, PaymentCoinType: store>(
        escrow: &mut Escrow<DepositCoinType, PaymentCoinType>,
        ctx: &mut TxContext,
    ) {
        assert!(ctx.sender() == escrow.creator, 2);
        let receive_balance = balance::withdraw_all(&mut escrow.receive);
        let payout = coin::from_balance(receive_balance, ctx);
        transfer::public_transfer(payout, ctx.sender());
    }

    /// Seller batalkan escrow, deposit dikembalikan ke seller.
    /// Hanya bisa dibatalkan jika belum ada pembayaran dari buyer.
    public entry fun cancel_escrow<DepositCoinType: store, PaymentCoinType: store>(
        escrow: Escrow<DepositCoinType, PaymentCoinType>,
        ctx: &mut TxContext,
    ) {
        assert!(ctx.sender() == escrow.creator, 3);

        let Escrow {
            id,
            mut deposit,
            mut receive,
            requested_amount: _,
            creator: _,
        } = escrow;

        // Pastikan tidak ada pembayaran yang tertahan
        let recv_all = balance::withdraw_all(&mut receive);
        balance::destroy_zero(recv_all);
        balance::destroy_zero(receive);

        let deposit_all = balance::withdraw_all(&mut deposit);
        balance::destroy_zero(deposit);
        let coin_out = coin::from_balance(deposit_all, ctx);
        object::delete(id);
        transfer::public_transfer(coin_out, ctx.sender());
    }
}
```

#### Penjelasan Struct `Escrow`

Escrow ini mendukung **swap antara dua tipe koin berbeda**, tidak hanya koin yang sama. Ini membuat escrow lebih fleksibel untuk berbagai use case.

- **`id`**: Tanda unik untuk object escrow (UID)
- **`deposit`**: Saldo penjual (tipe `DepositCoinType`) yang disimpan aman di escrow
- **`requested_amount`**: Jumlah `PaymentCoinType` yang harus dibayar pembeli
- **`receive`**: Saldo pembayaran (tipe `PaymentCoinType`) yang sudah masuk dari pembeli
- **`creator`**: Alamat penjual sebagai pemilik escrow

**Catatan Penting**: 
- `Balance<T>` adalah kantong internal untuk menyimpan koin tipe tertentu. Kita memakai `Balance` karena bisa diletakkan di dalam object.
- `Coin<T>` adalah objek yang siap ditransfer. Kita ubah `Coin` menjadi `Balance` saat masuk ke escrow dan mengubahnya kembali saat keluar.
- Menggunakan **phantom type parameters** (`phantom`) karena tipe coin hanya digunakan untuk type checking, tidak disimpan sebagai data.

#### Penjelasan Fungsi

1. **`create_escrow<DepositCoinType, PaymentCoinType>`**: 
   - Penjual memasukkan koin `DepositCoinType` sebagai deposit
   - Menentukan jumlah `PaymentCoinType` yang diminta dari pembeli
   - Escrow object langsung dikembalikan ke alamat penjual supaya bisa diteruskan ke pembeli
   - **Contoh**: Seller deposit TBTC, minta 100 zSUI sebagai pembayaran

2. **`accept_escrow<DepositCoinType, PaymentCoinType>`**: 
   - Pembeli mengirim koin `PaymentCoinType` dengan nilai yang tepat sesuai `requested_amount`
   - Deposit `DepositCoinType` penjual langsung dikirim ke pembeli
   - Pembayaran `PaymentCoinType` pembeli disimpan di field `receive`
   - **Contoh**: Buyer bayar 100 zSUI, langsung terima TBTC dari escrow

3. **`complete_escrow<DepositCoinType, PaymentCoinType>`**: 
   - Penjual menarik pembayaran `PaymentCoinType` yang tersimpan di field `receive`
   - Hanya pembuat escrow (creator) yang boleh memanggil fungsi ini
   - **Contoh**: Seller tarik 100 zSUI yang sudah dibayar buyer

4. **`cancel_escrow<DepositCoinType, PaymentCoinType>`**: 
   - Penjual menarik deposit `DepositCoinType` dan menghapus object escrow
   - Hanya bisa dilakukan jika tidak ada pembayaran yang tertahan
   - Hanya pembuat escrow yang diizinkan

### 3.2. Modul `mock_coin`

Buat file `sources/mock_coin.move` dan salin kode berikut:

```rust
module escrow::mock_coin {
    use sui::coin;
    use sui::coin::TreasuryCap;
    use sui::coin_registry;
    use sui::tx_context::TxContext;
    use sui::transfer;

    /// One-time witness untuk mock fungible token (juga tipe koin).
    public struct MOCK_COIN has drop {}

    /// Initializer otomatis saat publish: buat koin, metadata, dan serahkan kapabilitas ke publisher.
    fun init(witness: MOCK_COIN, ctx: &mut TxContext) {
        let (builder, cap) = coin_registry::new_currency_with_otw(
            witness,
            9,
            b"MOCK".to_string(),
            b"Mock Coin".to_string(),
            b"Mock coin for escrow demo".to_string(),
            b"".to_string(),
            ctx,
        );
        let metadata_cap = coin_registry::finalize(builder, ctx);
        transfer::public_transfer(cap, ctx.sender());
        transfer::public_transfer(metadata_cap, ctx.sender());
    }

    /// Mint mock coin ke sender.
    public entry fun mint_mock_coin(
        cap: &mut TreasuryCap<MOCK_COIN>,
        amount: u64,
        ctx: &mut TxContext,
    ) {
        let minted = coin::mint(cap, amount, ctx);
        transfer::public_transfer(minted, ctx.sender());
    }
}
```

#### Penjelasan

- **`MOCK_COIN`**: One-time witness untuk membuat tipe koin baru
- **`init`**: Otomatis dijalankan saat paket dipublish untuk menyiapkan metadata dan kapabilitas mint
- **`mint_mock_coin`**: Mencetak token latihan sesuai jumlah yang diminta, lalu mengirim ke alamat pemanggil

**Catatan**: Setelah publish, simpan `TreasuryCap<MOCK_COIN>` supaya bisa mencetak koin kapan saja.

### 3.3. One-Time Witness (OTW) - Penjelasan Lengkap

#### Apa itu One-Time Witness?

**One-Time Witness (OTW)** adalah pattern keamanan di Sui Move yang memastikan suatu struct hanya bisa dibuat **sekali** saat package dipublish. Ini sangat penting untuk membuat tipe koin baru karena mencegah duplikasi atau pembuatan koin palsu.

#### Karakteristik OTW

1. **Struct dengan `drop` ability**: OTW harus memiliki ability `drop` saja
2. **Nama sama dengan module**: Nama struct harus sama persis dengan nama module (case-sensitive)
3. **Hanya dibuat saat publish**: Compiler Sui secara otomatis membuat instance OTW saat package pertama kali dipublish
4. **Tidak bisa dibuat manual**: Tidak ada cara untuk membuat instance OTW secara manual setelah publish

#### Contoh di Kode Kita

```rust
module escrow::mock_coin {
    // Nama struct MOCK_COIN sama dengan nama module (mock_coin dalam uppercase)
    public struct MOCK_COIN has drop {}
    
    fun init(witness: MOCK_COIN, ctx: &mut TxContext) {
        // witness adalah instance MOCK_COIN yang dibuat otomatis saat publish
        let (builder, cap) = coin_registry::new_currency_with_otw(
            witness,  // OTW digunakan di sini
            // ... parameter lainnya
        );
    }
}
```

#### Mengapa OTW Penting?

1. **Keamanan**: Mencegah pembuatan koin duplikat atau palsu
2. **Unik**: Setiap package hanya bisa membuat satu tipe koin dengan nama yang sama
3. **Trustless**: Tidak perlu mempercayai pihak ketiga untuk membuat koin
4. **Immutable**: Setelah dibuat, tipe koin tidak bisa diubah

#### Alur Kerja OTW

1. **Saat publish package**:
   ```
   sui client publish
   ```
   - Compiler Sui melihat struct `MOCK_COIN` dengan `drop` ability
   - Compiler memeriksa apakah nama struct sama dengan nama module
   - Jika ya, compiler membuat instance `MOCK_COIN` secara otomatis
   - Instance ini dikirim ke fungsi `init` sebagai parameter

2. **Fungsi `init` dipanggil**:
   - Menerima instance `MOCK_COIN` sebagai `witness`
   - Menggunakan `witness` untuk membuat currency baru via `coin_registry::new_currency_with_otw`
   - Setelah digunakan, `witness` di-drop (tidak bisa digunakan lagi)

3. **Setelah publish**:
   - Tidak ada cara untuk membuat instance `MOCK_COIN` lagi
   - Tipe koin `MOCK_COIN` sudah terdaftar di sistem
   - Hanya bisa mint coin menggunakan `TreasuryCap`

#### Tips Penting

- ✅ **Nama struct harus sama persis** dengan nama module (case-sensitive)
- ✅ **Harus memiliki `drop` ability** saja
- ✅ **Hanya bisa digunakan sekali** di fungsi `init`
- ❌ **Tidak bisa membuat instance manual** setelah publish
- ❌ **Tidak bisa membuat koin dengan nama yang sama** di package lain

#### Contoh Lain OTW

```rust
module my_package::my_token {
    // ✅ Benar: nama struct sama dengan module (MY_TOKEN = my_token uppercase)
    public struct MY_TOKEN has drop {}
    
    fun init(witness: MY_TOKEN, ctx: &mut TxContext) {
        // gunakan witness untuk membuat currency
    }
}
```

---

## 4. Publish dan Testing

### 4.1. Publish Paket

Jalankan perintah publish:

```bash
sui client publish --gas-budget 200000000
```

**Penting**: Catat ID-ID berikut dari hasil publish:
- **`PackageID`**: ID paket yang akan digunakan untuk memanggil fungsi
- **`TreasuryCap<MOCK_COIN>`**: ID untuk proses mint coin

### 4.2. Mint MOCK Coin

Mint coin untuk testing. Gunakan angka contoh `100000000` (0.1 token dengan 9 desimal):

```bash
sui client call ^
  --package <PACKAGE_ID> ^
  --module mock_coin ^
  --function mint_mock_coin ^
  --args <TREASURY_CAP_ID> 100000000 ^
  --gas-budget 100000000
```

**Tips**: 
- Cek coin yang tersedia dengan `sui client gas`
- Catat `ObjectID` dari coin yang baru dibuat

### 4.3. Membagi Coin untuk Testing

Satu object coin tidak bisa dipakai sekaligus sebagai gas dan argumen. Gunakan `sui client pay-sui` untuk memecah coin:

```bash
sui client pay-sui ^
  --input-coins <COIN_ID_BESAR> ^
  --recipients $(sui client active-address) ^
  --amounts 10000000 ^
  --gas-budget 5000000
```

**Penjelasan**:
- `COIN_ID_BESAR`: Coin utama yang nilainya besar
- `recipients`: Alamat tujuan (gunakan alamat aktif sendiri)
- `amounts`: Nilai coin baru dalam MIST (1 SUI = 1.000.000.000 MIST)
- `gas-budget`: Biaya transaksi

Jalankan perintah ini dua kali untuk menyiapkan coin deposit dan coin pembayaran.

---

## 5. Testing Alur Escrow

Gunakan angka contoh `10000000` (0.01 token dengan 9 desimal). Ganti semua `<ID>` dengan ID yang sesuai milikmu.

### 5.1. Create Escrow (Penjual)

Penjual membuat escrow dengan deposit. Karena escrow sekarang mendukung dua tipe coin berbeda, kita perlu menentukan kedua tipe coin.

**Contoh 1: Swap MOCK_COIN dengan MOCK_COIN (sama)**
```bash
sui client call ^
  --package <PACKAGE_ID> ^
  --module simple_escrow ^
  --function create_escrow ^
  --type-args <PACKAGE_ID>::mock_coin::MOCK_COIN <PACKAGE_ID>::mock_coin::MOCK_COIN ^
  --args <DEPOSIT_COIN_ID> 10000000 ^
  --gas-budget 100000000
```

**Contoh 2: Swap MOCK_COIN dengan SUI (berbeda)**
```bash
sui client call ^
  --package <PACKAGE_ID> ^
  --module simple_escrow ^
  --function create_escrow ^
  --type-args <PACKAGE_ID>::mock_coin::MOCK_COIN 0x2::sui::SUI ^
  --args <DEPOSIT_COIN_ID> 10000000 ^
  --gas-budget 100000000
```

**Catatan**:
- **Type-args pertama**: `DepositCoinType` (tipe coin yang di-deposit penjual)
- **Type-args kedua**: `PaymentCoinType` (tipe coin yang harus dibayar pembeli)
- Format: `<PACKAGE_ID>::mock_coin::MOCK_COIN` atau `0x2::sui::SUI`
- Output transaksi berisi `ESCROW_ID` - **simpan ID ini!**

### 5.2. Transfer Escrow ke Pembeli (Opsional)

Jika menggunakan akun pembeli berbeda:

```bash
sui client transfer-object ^
  --object-id <ESCROW_ID> ^
  --to <ALAMAT_PEMBELI> ^
  --gas-budget 50000000
```

Jika menggunakan satu alamat untuk latihan, langkah ini bisa dilewati.

### 5.3. Accept Escrow (Pembeli)

Pembeli mengirim pembayaran sesuai jumlah yang diminta. Pastikan menggunakan type-args yang sama dengan saat create escrow.

```bash
sui client call ^
  --package <PACKAGE_ID> ^
  --module simple_escrow ^
  --function accept_escrow ^
  --type-args <DEPOSIT_COIN_TYPE> <PAYMENT_COIN_TYPE> ^
  --args <ESCROW_ID> <PAYMENT_COIN_ID> ^
  --gas-budget 100000000
```

**Penting**:
- **Type-args harus sama** dengan saat create escrow (DepositCoinType, PaymentCoinType)
- Pembayaran harus sama persis dengan `requested_amount` (10000000)
- Setelah transaksi, pembeli langsung menerima coin deposit (DepositCoinType)
- Pembayaran pembeli (PaymentCoinType) tersimpan di escrow untuk diambil penjual

### 5.4. Complete Escrow (Penjual)

Penjual menarik pembayaran yang sudah diterima. Pastikan menggunakan type-args yang sama.

```bash
sui client call ^
  --package <PACKAGE_ID> ^
  --module simple_escrow ^
  --function complete_escrow ^
  --type-args <DEPOSIT_COIN_TYPE> <PAYMENT_COIN_TYPE> ^
  --args <ESCROW_ID> ^
  --gas-budget 100000000
```

**Catatan**: 
- **Type-args harus sama** dengan saat create escrow
- Pastikan object escrow kembali ke penjual (transfer lagi jika diperlukan)
- Penjual akan menerima pembayaran `PaymentCoinType` dari buyer

Setelah ini, penjual memegang pembayaran dari pembeli. Flow utama selesai!

### 5.5. Cancel Escrow (Opsional)

Jika penjual ingin membatalkan sebelum pembeli bayar:

```bash
sui client call ^
  --package <PACKAGE_ID> ^
  --module simple_escrow ^
  --function cancel_escrow ^
  --type-args <DEPOSIT_COIN_TYPE> <PAYMENT_COIN_TYPE> ^
  --args <ESCROW_ID> ^
  --gas-budget 100000000
```

**Catatan**:
- **Type-args harus sama** dengan saat create escrow
- Escrow akan dihapus dan deposit `DepositCoinType` kembali ke penjual
- Hanya pembuat escrow yang bisa memanggil fungsi ini
- Hanya bisa dibatalkan jika belum ada pembayaran dari buyer

---

## 6. Pemeriksaan dan Debug

### 6.1. Perintah Pemeriksaan

- **Cek object escrow**:
  ```bash
  sui client object <ESCROW_ID>
  ```
  Menampilkan isi object escrow (deposit, receive, owner)

- **Cek semua object**:
  ```bash
  sui client objects
  ```
  Menampilkan semua object milik alamat aktif

- **Cek detail transaksi**:
  ```bash
  sui client transaction <DIGEST>
  ```
  Membantu membaca detail transaksi terakhir

- **Cek coin yang tersedia**:
  ```bash
  sui client gas
  ```
  Menampilkan daftar coin untuk gas

### 6.2. Troubleshooting

**Insufficient gas**
- Isi faucet lagi atau kurangi `gas-budget`

**Object not found**
- Cek kembali penulisan `ObjectID`
- Object mungkin sudah digunakan lalu terhapus

**Assertion failure**
- Pastikan nilai pembayaran sama dengan `requested_amount`
- Pastikan pemanggil fungsi sesuai aturan (hanya creator yang boleh complete atau cancel)
- Error code: `0` = payment mismatch, `2` = bukan creator (complete), `3` = bukan creator (cancel)

**Coin value mismatch**
- Gunakan `sui client object <COIN_ID>` untuk mengecek nilai coin sebelum dipakai

**Type mismatch**
- Pastikan menggunakan **dua type-args** yang benar: `<DEPOSIT_COIN_TYPE> <PAYMENT_COIN_TYPE>`
- Format: `<PACKAGE_ID>::mock_coin::MOCK_COIN` atau `0x2::sui::SUI`
- Type-args harus konsisten di semua fungsi (create, accept, complete, cancel)

---

## 7. Ringkasan

### 7.1. Konsep Utama

- **Escrow** menyimpan deposit penjual sampai pembeli membayar sesuai jumlah yang disepakati
- **Mendukung swap dua tipe coin berbeda**: `DepositCoinType` dan `PaymentCoinType`
- **`Balance<T>`** dipakai untuk menyimpan koin di dalam object
- **`Coin<T>`** dipakai saat transfer keluar
- **`simple_escrow`** mendukung empat aksi utama: buat, terima, selesaikan, batalkan
- **One-Time Witness (OTW)** memastikan tipe koin hanya dibuat sekali saat publish

### 7.2. Best Practices

- **Catat semua ID penting**: Package ID, Treasury Cap, Coin IDs, Escrow ID
- **Gunakan mock coin** untuk testing agar tidak memakai dana sebenarnya
- **Pecah coin** sebelum testing untuk memisahkan gas dan argumen
- **Verifikasi object** dengan `sui client object` sebelum menggunakan

### 7.3. Langkah Selanjutnya

Setelah memahami contoh ini, kamu bisa:
- Menambahkan status escrow (pending, completed, cancelled)
- Menambahkan batas waktu (deadline)
- Menambahkan event untuk mencatat setiap aksi escrow
- Menambahkan fee untuk escrow service

Selamat berlatih! 🚀
