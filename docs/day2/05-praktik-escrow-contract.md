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
mock_tbtc = "0x0"
mock_zsui = "0x0"
```

### 2.3. Membuat File Source

Buat tiga file berikut di folder `sources/`:
- `sources/simple_escrow.move`
- `sources/mock_tbtc.move`
- `sources/mock_zsui.move`

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
    use sui::balance::{Self, Balance};
    use sui::coin::{Self, Coin};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::TxContext;

    /// Escrow untuk swap antara dua tipe koin berbeda.
    public struct Escrow<phantom DepositCoinType, phantom PaymentCoinType> has key, store {
        id: UID,
        deposit: Balance<DepositCoinType>,
        requested_amount: u64,
        receive: Balance<PaymentCoinType>,
        creator: address,
    }

    /// Seller deposit koin dan tentukan jumlah pembayaran yang diminta.
    public entry fun create_escrow<DepositCoinType, PaymentCoinType>(
        deposit_coin: Coin<DepositCoinType>,
        request_amount: u64,
        ctx: &mut TxContext,
    ) {
        let escrow = Escrow<DepositCoinType, PaymentCoinType> {
            id: object::new(ctx),
            deposit: coin::into_balance(deposit_coin),
            requested_amount: request_amount,
            receive: balance::zero(),
            creator: ctx.sender(),
        };
        transfer::public_transfer(escrow, ctx.sender());
    }

    /// Buyer bayar dan terima deposit.
    /// Buyer bisa kirim coin >= requested_amount, sisa akan di-refund otomatis.
    public entry fun accept_escrow<DepositCoinType, PaymentCoinType>(
        escrow: &mut Escrow<DepositCoinType, PaymentCoinType>,
        mut payment: Coin<PaymentCoinType>,
        ctx: &mut TxContext,
    ) {
        let payment_value = coin::value(&payment);
        assert!(payment_value >= escrow.requested_amount, 0);

        // Split exact amount, refund sisanya
        let exact_payment = coin::split(&mut payment, escrow.requested_amount, ctx);
        if (coin::value(&payment) > 0) {
            transfer::public_transfer(payment, ctx.sender()); // refund sisa
        } else {
            coin::destroy_zero(payment); // tidak ada sisa
        };

        // Simpan pembayaran di escrow
        balance::join(&mut escrow.receive, coin::into_balance(exact_payment));

        // Transfer deposit ke buyer
        transfer::public_transfer(coin::from_balance(balance::withdraw_all(&mut escrow.deposit), ctx), ctx.sender());
    }

    /// Seller tarik pembayaran yang diterima.
    public entry fun complete_escrow<DepositCoinType, PaymentCoinType>(
        escrow: &mut Escrow<DepositCoinType, PaymentCoinType>,
        ctx: &mut TxContext,
    ) {
        assert!(ctx.sender() == escrow.creator, 1);
        transfer::public_transfer(coin::from_balance(balance::withdraw_all(&mut escrow.receive), ctx), ctx.sender());
    }

    /// Seller batalkan escrow (hanya jika belum ada pembayaran).
    public entry fun cancel_escrow<DepositCoinType, PaymentCoinType>(
        escrow: Escrow<DepositCoinType, PaymentCoinType>,
        ctx: &mut TxContext,
    ) {
        assert!(ctx.sender() == escrow.creator, 2);
        let Escrow { id, deposit, requested_amount: _, receive, creator: _ } = escrow;
        balance::destroy_zero(receive); // Fails if buyer already paid
        object::delete(id);
        transfer::public_transfer(coin::from_balance(deposit, ctx), ctx.sender());
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
   - Pembeli mengirim koin `PaymentCoinType` dengan nilai >= `requested_amount`
   - Jika pembayaran lebih besar, sisa akan di-refund otomatis ke pembeli
   - Deposit `DepositCoinType` penjual langsung dikirim ke pembeli
   - Pembayaran `PaymentCoinType` pembeli disimpan di field `receive`
   - **Contoh**: Buyer bayar 120 zSUI untuk request 100 zSUI, terima TBTC dan refund 20 zSUI

3. **`complete_escrow<DepositCoinType, PaymentCoinType>`**:
   - Penjual menarik pembayaran `PaymentCoinType` yang tersimpan di field `receive`
   - Hanya pembuat escrow (creator) yang boleh memanggil fungsi ini
   - **Contoh**: Seller tarik 100 zSUI yang sudah dibayar buyer

4. **`cancel_escrow<DepositCoinType, PaymentCoinType>`**:
   - Penjual menarik deposit `DepositCoinType` dan menghapus object escrow
   - Hanya bisa dilakukan jika tidak ada pembayaran yang tertahan
   - Hanya pembuat escrow yang diizinkan
   - **Contoh**: Seller batalkan escrow dan kembalikan TBTC

### 3.2. Modul `mock_tbtc` dan `mock_zsui`

Buat file `sources/mock_tbtc.move` dan salin kode berikut:

```rust
module escrow::mock_tbtc {
    use sui::coin::{Self, TreasuryCap};
    use sui::coin_registry;
    use sui::tx_context::TxContext;
    use sui::transfer;

    /// One-time witness untuk mock TBTC token
    public struct MOCK_TBTC has drop {}

    /// Initializer otomatis saat publish
    fun init(witness: MOCK_TBTC, ctx: &mut TxContext) {
        let (builder, cap) = coin_registry::new_currency_with_otw(
            witness,
            8,  // 8 desimal seperti Bitcoin
            b"TBTC".to_string(),
            b"Mock Bitcoin".to_string(),
            b"Mock Bitcoin for escrow demo".to_string(),
            b"".to_string(),
            ctx,
        );
        let metadata_cap = coin_registry::finalize(builder, ctx);
        transfer::public_transfer(cap, ctx.sender());
        transfer::public_transfer(metadata_cap, ctx.sender());
    }

    /// Mint mock TBTC ke sender
    public entry fun mint_mock_tbtc(
        cap: &mut TreasuryCap<MOCK_TBTC>,
        amount: u64,
        ctx: &mut TxContext,
    ) {
        let minted = coin::mint(cap, amount, ctx);
        transfer::public_transfer(minted, ctx.sender());
    }
}
```

Buat file `sources/mock_zsui.move` dan salin kode berikut:

```rust
module escrow::mock_zsui {
    use sui::coin::{Self, TreasuryCap};
    use sui::coin_registry;
    use sui::tx_context::TxContext;
    use sui::transfer;

    /// One-time witness untuk mock zSUI token
    public struct MOCK_ZSUI has drop {}

    /// Initializer otomatis saat publish
    fun init(witness: MOCK_ZSUI, ctx: &mut TxContext) {
        let (builder, cap) = coin_registry::new_currency_with_otw(
            witness,
            9,  // 9 desimal seperti SUI
            b"zSUI".to_string(),
            b"Mock zSUI".to_string(),
            b"Mock zSUI for escrow demo".to_string(),
            b"".to_string(),
            ctx,
        );
        let metadata_cap = coin_registry::finalize(builder, ctx);
        transfer::public_transfer(cap, ctx.sender());
        transfer::public_transfer(metadata_cap, ctx.sender());
    }

    /// Mint mock zSUI ke sender
    public entry fun mint_mock_zsui(
        cap: &mut TreasuryCap<MOCK_ZSUI>,
        amount: u64,
        ctx: &mut TxContext,
    ) {
        let minted = coin::mint(cap, amount, ctx);
        transfer::public_transfer(minted, ctx.sender());
    }
}
```

#### Penjelasan

**Modul `mock_tbtc`**:
- **`MOCK_TBTC`**: One-time witness untuk membuat tipe koin TBTC (8 desimal seperti Bitcoin)
- **`init`**: Otomatis dijalankan saat paket dipublish untuk menyiapkan metadata dan kapabilitas mint
- **`mint_mock_tbtc`**: Mencetak TBTC sesuai jumlah yang diminta

**Modul `mock_zsui`**:
- **`MOCK_ZSUI`**: One-time witness untuk membuat tipe koin zSUI (9 desimal seperti SUI)
- **`init`**: Otomatis dijalankan saat paket dipublish untuk menyiapkan metadata dan kapabilitas mint
- **`mint_mock_zsui`**: Mencetak zSUI sesuai jumlah yang diminta

**Catatan**: Setelah publish, simpan `TreasuryCap<MOCK_TBTC>` dan `TreasuryCap<MOCK_ZSUI>` supaya bisa mencetak koin kapan saja.

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
module escrow::mock_tbtc {
    // Nama struct MOCK_TBTC sama dengan nama module (mock_tbtc dalam uppercase)
    public struct MOCK_TBTC has drop {}
    
    fun init(witness: MOCK_TBTC, ctx: &mut TxContext) {
        // witness adalah instance MOCK_TBTC yang dibuat otomatis saat publish
        let (builder, cap) = coin_registry::new_currency_with_otw(
            witness,  // OTW digunakan di sini
            8,       // 8 desimal seperti Bitcoin
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
   - Compiler Sui melihat struct `MOCK_TBTC` dan `MOCK_ZSUI` dengan `drop` ability
   - Compiler memeriksa apakah nama struct sama dengan nama module
   - Jika ya, compiler membuat instance OTW secara otomatis
   - Instance ini dikirim ke fungsi `init` sebagai parameter

2. **Fungsi `init` dipanggil**:
   - Menerima instance OTW sebagai `witness`
   - Menggunakan `witness` untuk membuat currency baru via `coin_registry::new_currency_with_otw`
   - Setelah digunakan, `witness` di-drop (tidak bisa digunakan lagi)

3. **Setelah publish**:
   - Tidak ada cara untuk membuat instance OTW lagi
   - Tipe koin sudah terdaftar di sistem
   - Hanya bisa mint coin menggunakan `TreasuryCap`

#### Tips Penting

- ✅ **Nama struct harus sama persis** dengan nama module (case-sensitive)
- ✅ **Harus memiliki `drop` ability** saja
- ✅ **Hanya bisa digunakan sekali** di fungsi `init`
- ❌ **Tidak bisa membuat instance manual** setelah publish
- ❌ **Tidak bisa membuat koin dengan nama yang sama** di package lain

---

## 4. Publish dan Testing

### 4.1. Publish Paket

Jalankan perintah publish:

```bash
sui client publish --gas-budget 200000000
```

**Penting**: Catat ID-ID berikut dari hasil publish:
- **`PackageID`**: ID paket yang akan digunakan untuk memanggil fungsi
- **`TreasuryCap<MOCK_TBTC>`**: ID untuk proses mint TBTC
- **`TreasuryCap<MOCK_ZSUI>`**: ID untuk proses mint zSUI

**Cara mengambil ID dari hasil publish:**
```bash
# Output publish akan terlihat seperti ini:
# ┌───┬───────────────────────────────────────────────────────────────┐
# │ objectId │                                                   │
# ├───┼───────────────────────────────────────────────────────────────┤
# │ 0x1234... │ PackageID (simpan ini!)                      │
# │ 0x5678... │ TreasuryCap<MOCK_TBTC> (simpan ini!)           │
# │ 0x9abc... │ TreasuryCap<MOCK_ZSUI> (simpan ini!)           │
# └───┴───────────────────────────────────────────────────────────────┘
```

### 4.2. Mint Mock Coins

Mint TBTC untuk testing. Gunakan angka contoh `10000000` (0.1 TBTC dengan 8 desimal):

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module mock_tbtc \
  --function mint_mock_tbtc \
  --args <TBTC_TREASURY_CAP_ID> 10000000 \
  --gas-budget 100000000
```

Mint zSUI untuk testing. Gunakan angka contoh `100000000` (0.1 zSUI dengan 9 desimal):

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module mock_zsui \
  --function mint_mock_zsui \
  --args <ZSUI_TREASURY_CAP_ID> 100000000 \
  --gas-budget 100000000
```

**Tips**:
- Cek coin yang tersedia dengan `sui client gas`
- Catat `ObjectID` dari coin yang baru dibuat (akan muncul di output transaksi)
- **Cara mengambil Coin ID**: Lihat di bagian "created objects" pada output transaksi mint

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

### 4.4. Cara Mengambil Object ID dengan Mudah

**PENTING**: Ini adalah bagian yang paling sering membuat bingung! Berikut cara mudah mengambil ID:

#### Setelah Publish:
```bash
sui client publish --gas-budget 200000000
# Lihat di bagian "Created Objects" - ambil 3 ID ini:
# 1. PackageID (untuk --package)
# 2. TreasuryCap<MOCK_TBTC> (untuk mint TBTC)
# 3. TreasuryCap<MOCK_ZSUI> (untuk mint zSUI)
```

#### Setelah Mint Coin:
```bash
sui client call --package <PACKAGE_ID> --module mock_tbtc --function mint_mock_tbtc ...
# Lihat di bagian "Created Objects" - ambil Coin ID TBTC
```

#### Setelah Create Escrow:
```bash
sui client call --package <PACKAGE_ID> --module simple_escrow --function create_escrow ...
# Lihat di bagian "Created Objects" - ambil Escrow ID
```

#### Setelah Accept Escrow:
```bash
sui client call --package <PACKAGE_ID> --module simple_escrow --function accept_escrow ...
# Lihat di bagian "Created Objects" - ambil TBTC Coin ID (yang diterima buyer)
```

#### Setelah Complete Escrow:
```bash
sui client call --package <PACKAGE_ID> --module simple_escrow --function complete_escrow ...
# Lihat di bagian "Created Objects" - ambil zSUI Coin ID (yang diterima seller)
```

**Tips Pro**:
- Selalu lihat bagian **"Created Objects"** di setiap output transaksi
- Copy ID langsung dari output, jangan ketik manual
- Gunakan `sui client objects` untuk melihat semua object yang kamu punya

---

## 5. Testing Alur Escrow

Gunakan angka contoh `10000000` (0.01 token dengan 9 desimal). Ganti semua `<ID>` dengan ID yang sesuai milikmu.

### 5.1. Create Escrow (Penjual)

Penjual membuat escrow dengan deposit TBTC dan meminta pembayaran zSUI.

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module simple_escrow \
  --function create_escrow \
  --type-args \
    "$PACKAGE_ID::mock_tbtc::MOCK_TBTC" \
    "$PACKAGE_ID::mock_zsui::MOCK_ZSUI" \
  --args \
    $TBTC_COIN_ID \
    $RAW_AMOUNT \
  --gas-budget 100000000
```

**Contoh dengan nilai spesifik**:
```bash
sui client call \
  --package <PACKAGE_ID> \
  --module simple_escrow \
  --function create_escrow \
  --type-args \
    "<PACKAGE_ID>::mock_tbtc::MOCK_TBTC" \
    "<PACKAGE_ID>::mock_zsui::MOCK_ZSUI" \
  --args \
    <TBTC_COIN_ID> \
    10000000 \
  --gas-budget 100000000
```

**Catatan**:
- **Type-args pertama**: `DepositCoinType` (TBTC yang di-deposit penjual)
- **Type-args kedua**: `PaymentCoinType` (zSUI yang harus dibayar pembeli)
- `$RAW_AMOUNT`: Jumlah zSUI yang diminta (contoh: 10000000 = 0.01 zSUI)
- **ESCROW_ID**: Akan muncul di output transaksi di bagian "created objects" - **simpan ID ini!**

**Cara mengambil ESCROW_ID:**
```bash
# Output transaksi akan terlihat seperti ini:
# ┌───┬───────────────────────────────────────────────────────────────┐
# │ objectId │                                                   │
# ├───┼───────────────────────────────────────────────────────────────┤
# │ 0xdef0... │ Escrow object (simpan sebagai ESCROW_ID!)      │
# └───┴───────────────────────────────────────────────────────────────┘
```

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

Pembeli mengirim pembayaran sesuai jumlah yang diminta. Buyer bisa mengirim lebih dari yang diminta, sisa akan di-refund otomatis.

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module simple_escrow \
  --function accept_escrow \
  --type-args \
    "$PACKAGE_ID::mock_tbtc::MOCK_TBTC" \
    "$PACKAGE_ID::mock_zsui::MOCK_ZSUI" \
  --args \
    $ESCROW_ID \
    $ZSUI_COIN_ID \
  --gas-budget 100000000
```

**Penting**:
- **Type-args harus sama** dengan saat create escrow (TBTC, zSUI)
- Pembayaran bisa >= `requested_amount`, sisa akan di-refund otomatis
- Setelah transaksi, pembeli langsung menerima TBTC dari escrow (lihat di "created objects")
- Pembayaran zSUI pembeli tersimpan di escrow untuk diambil penjual
- **TBTC Coin ID**: Akan muncul di output transaksi sebagai "created objects" - pembeli menerima ini otomatis
- **Refund**: Jika pembayaran lebih dari requested, sisa akan dikembalikan otomatis

### 5.4. Complete Escrow (Penjual)

Penjual menarik pembayaran zSUI yang sudah diterima dari buyer.

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module simple_escrow \
  --function complete_escrow \
  --type-args \
    "$PACKAGE_ID::mock_tbtc::MOCK_TBTC" \
    "$PACKAGE_ID::mock_zsui::MOCK_ZSUI" \
  --args \
    $ESCROW_ID \
  --gas-budget 100000000
```

**Catatan**:
- **Type-args harus sama** dengan saat create escrow
- Pastikan object escrow kembali ke penjual (transfer lagi jika diperlukan)
- Penjual akan menerima pembayaran zSUI dari buyer (lihat di "created objects")
- **zSUI Coin ID**: Akan muncul di output transaksi sebagai "created objects" - penjual menerima ini otomatis

Setelah ini, penjual memegang pembayaran dari pembeli. Flow utama selesai!

### 5.5. Cancel Escrow (Opsional)

Jika penjual ingin membatalkan sebelum pembeli bayar:

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module simple_escrow \
  --function cancel_escrow \
  --type-args \
    "$PACKAGE_ID::mock_tbtc::MOCK_TBTC" \
    "$PACKAGE_ID::mock_zsui::MOCK_ZSUI" \
  --args \
    $ESCROW_ID \
  --gas-budget 100000000
```

**Catatan**:
- **Type-args harus sama** dengan saat create escrow
- Escrow akan dihapus dan deposit TBTC kembali ke penjual
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
- Pastikan nilai pembayaran >= `requested_amount` (bisa lebih, sisa di-refund)
- Pastikan pemanggil fungsi sesuai aturan (hanya creator yang boleh complete atau cancel)
- Error code: `0` = payment kurang dari requested, `1` = bukan creator (complete), `2` = bukan creator (cancel)

**Coin value mismatch**
- Gunakan `sui client object <COIN_ID>` untuk mengecek nilai coin sebelum dipakai

**Type mismatch**
- Pastikan menggunakan **dua type-args** yang benar: `<DEPOSIT_COIN_TYPE> <PAYMENT_COIN_TYPE>`
- Format: `<PACKAGE_ID>::mock_tbtc::MOCK_TBTC` atau `<PACKAGE_ID>::mock_zsui::MOCK_ZSUI`
- Type-args harus konsisten di semua fungsi (create, accept, complete, cancel)

---

## 7. Ringkasan

### 7.1. Konsep Utama

- **Escrow** menyimpan deposit penjual sampai pembeli membayar sesuai jumlah yang disepakati
- **Mendukung swap dua tipe coin berbeda**: `DepositCoinType` dan `PaymentCoinType`
- **`Balance<T>`** dipakai untuk menyimpan koin di dalam object
- **`Coin<T>`** dipakai saat transfer keluar
- **`simple_escrow`** mendukung empat aksi utama: buat, terima, selesaikan, batalkan
- **Automatic refund**: Buyer bisa bayar lebih dari requested, sisa otomatis di-refund
- **One-Time Witness (OTW)** memastikan tipe koin hanya dibuat sekali saat publish

### 7.2. Best Practices

- **Catat semua ID penting**: Package ID, Treasury Cap TBTC & zSUI, Coin IDs, Escrow ID
- **Gunakan mock coin** untuk testing agar tidak memakai dana sebenarnya
- **Pecah coin** sebelum testing untuk memisahkan gas dan argumen
- **Verifikasi object** dengan `sui client object` sebelum menggunakan
- **Perhatikan desimal**: TBTC menggunakan 8 desimal, zSUI menggunakan 9 desimal

### 7.3. Langkah Selanjutnya

Setelah memahami contoh ini, kamu bisa:
- Menambahkan status escrow (pending, completed, cancelled)
- Menambahkan batas waktu (deadline)
- Menambahkan event untuk mencatat setiap aksi escrow
- Menambahkan fee untuk escrow service

Selamat berlatih! 🚀
