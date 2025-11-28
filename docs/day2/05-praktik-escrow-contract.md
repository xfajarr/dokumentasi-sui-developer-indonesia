---
sidebar_position: 6
title: "Praktik: Membuat Escrow Smart Contract"
description: Panduan lengkap membuat dan menguji escrow smart contract di Sui blockchain.
keywords: [sui, blockchain, escrow, smart contract, praktik, indonesia]
---

# Praktik: Membuat Escrow Smart Contract

Selamat datang di sesi praktik! Di sesi ini, kita akan membuat **Escrow Smart Contract** yang merupakan salah satu use case penting di blockchain. Escrow adalah sistem penjaminan transaksi di mana dana ditahan oleh pihak ketiga sampai kondisi tertentu terpenuhi.

## Apa yang Akan Kita Pelajari?

- ✅ **Konsep Escrow**: Memahami bagaimana escrow bekerja di blockchain
- ✅ **Membuat Escrow Contract**: Membuat smart contract escrow sederhana
- ✅ **Menggunakan Balance & Coin**: Memahami perbedaan dan penggunaan Balance dan Coin di Sui
- ✅ **Testing Contract**: Menguji contract dengan Sui CLI
- ✅ **Split Coin**: Memahami cara memecah coin untuk testing

---

## 1. Memahami Konsep Escrow

### Apa itu Escrow?

Bayangkan escrow seperti **kotak aman** di bank. Ketika kamu ingin menjual sesuatu secara online:

1. **Seller** (penjual) memasukkan barang/deposit ke kotak aman
2. **Buyer** (pembeli) memasukkan pembayaran ke kotak aman
3. Setelah kedua pihak setuju, dana dan barang ditukar
4. Jika ada masalah, dana bisa dikembalikan

Di blockchain Sui, escrow contract bekerja dengan cara yang sama, tetapi **otomatis** dan **transparan**.

### Flow Escrow di Sui

```
1. Seller membuat escrow dengan deposit
   └─> Escrow object dibuat dengan deposit seller

2. Buyer menerima escrow dan membayar
   └─> Buyer kirim pembayaran, langsung dapat deposit seller

3. Seller menarik pembayaran
   └─> Seller ambil pembayaran dari buyer

4. (Opsional) Seller bisa batalkan escrow
   └─> Deposit dikembalikan ke seller
```

---

## 2. Struktur Escrow Contract

Mari kita lihat struktur contract escrow yang akan kita buat:

```rust
module escrow::escrow_minimal {
    use sui::balance;
    use sui::balance::Balance;
    use sui::coin;
    use sui::coin::Coin;
    use sui::sui::SUI;
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    /// Escrow object (khusus SUI)
    public struct Escrow has key, store {
        id: UID,
        deposit: Balance<SUI>,        // Deposit dari seller
        requested_amount: u64,         // Jumlah yang diminta dari buyer
        receive: Balance<SUI>,        // Pembayaran dari buyer
        creator: address,              // Alamat seller/creator
    }

    // ... functions ...
}
```

### Memahami Struct Escrow

Mari kita pecah setiap field:

| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | `UID` | Unique identifier untuk object escrow |
| `deposit` | `Balance<SUI>` | Deposit SUI dari seller yang ditahan |
| `requested_amount` | `u64` | Jumlah SUI yang diminta dari buyer |
| `receive` | `Balance<SUI>` | Pembayaran SUI yang diterima dari buyer |
| `creator` | `address` | Alamat seller yang membuat escrow |

### Balance vs Coin: Kenapa Menggunakan Balance?

Di Sui, ada dua cara menyimpan SUI:

1. **`Coin<SUI>`**: Object yang bisa ditransfer langsung
2. **`Balance<SUI>`**: "Kantong" internal untuk menyimpan SUI di dalam object

**Kenapa menggunakan Balance?**
- Balance bisa disimpan di dalam object (seperti Escrow)
- Lebih efisien untuk operasi internal
- Bisa digabungkan (`join`) dan dipecah (`withdraw`) dengan mudah
- Coin harus dikonversi ke Balance untuk disimpan di object

---

## 3. Membuat Escrow Contract

Sekarang mari kita buat contract lengkapnya. Buat file baru `sources/escrow.move`:

```move
module escrow::escrow_minimal {
    use sui::balance;
    use sui::balance::Balance;
    use sui::coin;
    use sui::coin::Coin;
    use sui::sui::SUI;
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    /// Escrow object (khusus SUI)
    public struct Escrow has key, store {
        id: UID,
        deposit: Balance<SUI>,
        requested_amount: u64,
        receive: Balance<SUI>,
        creator: address,
    }

    /// Seller kunci SUI miliknya, tentukan jumlah SUI yang diminta dari buyer
    public entry fun create_escrow(
        deposit_coin: Coin<SUI>,
        request_amount: u64,
        ctx: &mut TxContext,
    ) {
        let escrow = Escrow {
            id: object::new(ctx),
            deposit: coin::into_balance(deposit_coin),
            requested_amount: request_amount,
            receive: balance::zero<SUI>(),
            creator: tx_context::sender(ctx),
        };
        transfer::transfer(escrow, tx_context::sender(ctx));
    }

    /// Buyer kirim SUI sesuai request, langsung menerima deposit seller
    public entry fun accept_escrow(
        escrow: &mut Escrow,
        payment: Coin<SUI>,
        ctx: &mut TxContext,
    ) {
        assert!(coin::value(&payment) == escrow.requested_amount, 0);
        balance::join(&mut escrow.receive, coin::into_balance(payment));
        let deposit_balance = balance::withdraw_all(&mut escrow.deposit);
        let deposit_coin = coin::from_balance(deposit_balance, ctx);
        transfer::transfer(deposit_coin, tx_context::sender(ctx));
    }

    /// Seller tarik pembayaran yang sudah diterima dari buyer
    public entry fun complete_escrow(
        escrow: &mut Escrow,
        ctx: &mut TxContext,
    ) {
        assert!(tx_context::sender(ctx) == escrow.creator, 2);
        let receive_balance = balance::withdraw_all(&mut escrow.receive);
        let payout = coin::from_balance(receive_balance, ctx);
        transfer::transfer(payout, tx_context::sender(ctx));
    }

    /// Seller batalkan escrow, deposit dikembalikan ke seller
    public entry fun cancel_escrow(
        escrow: Escrow,
        ctx: &mut TxContext,
    ) {
        assert!(tx_context::sender(ctx) == escrow.creator, 3);
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
        transfer::transfer(coin_out, tx_context::sender(ctx));
    }
}
```

### Penjelasan Setiap Function

#### 1. `create_escrow` - Membuat Escrow Baru

```rust
public entry fun create_escrow(
    deposit_coin: Coin<SUI>,
    request_amount: u64,
    ctx: &mut TxContext,
)
```

**Apa yang dilakukan:**
- Seller memberikan `deposit_coin` (SUI yang akan ditahan)
- Menentukan `request_amount` (jumlah yang diminta dari buyer)
- Membuat Escrow object dan mentransfernya ke seller

**Flow:**
1. Convert `Coin<SUI>` → `Balance<SUI>` menggunakan `coin::into_balance`
2. Buat Escrow object dengan deposit dan requested_amount
3. Transfer Escrow object ke seller

#### 2. `accept_escrow` - Buyer Membayar dan Menerima Deposit

```rust
public entry fun accept_escrow(
    escrow: &mut Escrow,
    payment: Coin<SUI>,
    ctx: &mut TxContext,
)
```

**Apa yang dilakukan:**
- Buyer membayar sesuai `requested_amount`
- Buyer langsung menerima deposit dari seller
- Pembayaran buyer disimpan di `receive` balance

**Flow:**
1. Validasi: pastikan pembayaran = `requested_amount`
2. Gabungkan pembayaran ke `receive` balance
3. Ambil semua deposit dan kirim ke buyer

#### 3. `complete_escrow` - Seller Menarik Pembayaran

```rust
public entry fun complete_escrow(
    escrow: &mut Escrow,
    ctx: &mut TxContext,
)
```

**Apa yang dilakukan:**
- Hanya seller (creator) yang bisa memanggil
- Seller menarik pembayaran yang sudah diterima dari buyer

**Flow:**
1. Validasi: pastikan caller adalah creator
2. Ambil semua balance dari `receive`
3. Convert ke Coin dan kirim ke seller

#### 4. `cancel_escrow` - Seller Membatalkan Escrow

```rust
public entry fun cancel_escrow(
    escrow: Escrow,
    ctx: &mut TxContext,
)
```

**Apa yang dilakukan:**
- Hanya seller yang bisa membatalkan
- Deposit dikembalikan ke seller
- Object escrow dihapus

**Flow:**
1. Validasi: pastikan caller adalah creator
2. Bersihkan semua balance (pastikan tidak ada yang tertahan)
3. Kembalikan deposit ke seller
4. Hapus Escrow object

---

## 4. Setup Project dan Build

### Langkah 1: Buat Project Baru

```shell
sui move new escrow_contract
cd escrow_contract
```

### Langkah 2: Update Move.toml

Pastikan `Move.toml` memiliki konfigurasi berikut:

```toml
[package]
name = "escrow"
version = "0.0.1"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }

[addresses]
escrow = "0x0"
```

### Langkah 3: Buat File Contract

Buat file `sources/escrow.move` dan paste kode contract di atas.

### Langkah 4: Build Contract

```shell
sui move build
```

Jika berhasil, kamu akan melihat:
```
INCLUDING DEPENDENCY Sui
INCLUDING DEPENDENCY MoveStdlib
BUILDING escrow
Successfully built modules
```

---

## 5. Memahami Split Coin dan Pay-Sui

### Kenapa Perlu Split Coin?

Di Sui, setiap transaksi memerlukan **gas fee**. Coin yang digunakan untuk gas tidak bisa digunakan sebagai argument untuk function. Oleh karena itu, kita perlu **memecah coin** menjadi beberapa bagian:

1. **Satu bagian untuk gas** (otomatis digunakan oleh Sui)
2. **Satu bagian untuk deposit/payment** (digunakan sebagai argument)

### Cara Split Coin

Ada dua cara untuk memecah coin:

#### Metode 1: Menggunakan `sui client split-coin`

```shell
sui client split-coin \
  --coin-id <COIN_ID> \
  --amounts 100000000 50000000 \
  --gas-budget 100000000
```

**Penjelasan:**
- `--coin-id`: ID coin yang akan dipecah
- `--amounts`: Daftar jumlah untuk setiap coin baru (dalam MIST, 1 SUI = 1,000,000,000 MIST)
- `--gas-budget`: Budget untuk gas fee

**Contoh:**
```shell
# Pecah coin menjadi 2 coin: 0.1 SUI dan 0.05 SUI
sui client split-coin \
  --coin-id 0xdfde3d574592de76987fb4bf564a4cc8d22c9c9a8de53e40400043b47a68e1bf \
  --amounts 100000000 50000000 \
  --gas-budget 100000000
```

#### Metode 2: Menggunakan `sui client pay-sui` (Lebih Mudah!)

`pay-sui` adalah cara yang **lebih mudah** untuk memecah coin dan mengirim ke beberapa alamat sekaligus:

```shell
sui client pay-sui \
  --input-coins <COIN_ID> \
  --recipients <ALAMAT_TUJUAN> \
  --amounts <JUMLAH> \
  --gas-budget <GAS_BUDGET>
```

**Penjelasan:**
- `--input-coins`: ID coin yang akan digunakan (bisa lebih dari satu)
- `--recipients`: Alamat tujuan (bisa lebih dari satu, sesuai dengan jumlah amounts)
- `--amounts`: Jumlah SUI dalam MIST untuk setiap recipient
- `--gas-budget`: Budget untuk gas fee

**Contoh Praktis:**

```shell
# Pecah coin dan kirim 0.001 SUI (1,000,000 MIST) ke alamat sendiri
sui client pay-sui \
  --input-coins 0xdfde3d574592de76987fb4bf564a4cc8d22c9c9a8de53e40400043b47a68e1bf \
  --recipients $(sui client active-address) \
  --amounts 1000000 \
  --gas-budget 5000000
```

**Kenapa Menggunakan Pay-Sui?**

1. **Lebih Sederhana**: Satu perintah untuk split dan transfer
2. **Otomatis Handle Gas**: Sui otomatis menggunakan coin untuk gas
3. **Bisa Multiple Recipients**: Bisa kirim ke beberapa alamat sekaligus
4. **Lebih Efisien**: Mengurangi jumlah transaksi

### Cara Mendapatkan Coin ID

Untuk mendapatkan coin ID yang bisa digunakan:

```shell
# Lihat semua coin yang dimiliki
sui client gas

# Atau lihat semua objects
sui client objects
```

Output akan menampilkan daftar coin dengan ID-nya.

---

## 6. Deploy Contract

Setelah build berhasil, deploy contract ke Sui network:

```shell
sui client publish
```

**Output yang akan muncul:**
```
Transaction Digest: 0x...
Published Objects:
  - PackageID: 0x... (CATAT INI!)
  - ObjectID: 0x...
```

> **Penting:** Simpan **PackageID** yang muncul, karena kita akan membutuhkannya untuk testing!

---

## 7. Testing Escrow Contract

Sekarang mari kita uji contract escrow yang sudah dibuat. Ikuti langkah-langkah berikut:

### Langkah 1: Siapkan Coin untuk Testing

Sebelum testing, kita perlu memecah coin menjadi beberapa bagian:

```shell
# 1. Lihat coin yang dimiliki
sui client gas

# 2. Pecah coin untuk deposit (0.01 SUI = 10,000,000 MIST)
sui client pay-sui \
  --input-coins <COIN_ID_DARI_GAS> \
  --recipients $(sui client active-address) \
  --amounts 10000000 \
  --gas-budget 5000000

# 3. Pecah coin untuk payment (0.01 SUI = 10,000,000 MIST)
sui client pay-sui \
  --input-coins <COIN_ID_DARI_GAS> \
  --recipients $(sui client active-address) \
  --amounts 10000000 \
  --gas-budget 5000000
```

**Catat Coin ID** dari setiap transaksi untuk digunakan di langkah berikutnya.

### Langkah 2: Create Escrow (Seller)

Seller membuat escrow dengan deposit:

```shell
sui client call \
  --package <PACKAGE_ID> \
  --module escrow_minimal \
  --function create_escrow \
  --args <DEPOSIT_COIN_ID> 10000000 \
  --gas-budget 100000000
```

**Penjelasan:**
- `--package <PACKAGE_ID>`: Package ID dari deploy
- `--module escrow_minimal`: Nama module
- `--function create_escrow`: Function yang dipanggil
- `--args <DEPOSIT_COIN_ID> 10000000`: 
  - `DEPOSIT_COIN_ID`: Coin ID untuk deposit (0.01 SUI)
  - `10000000`: Requested amount (0.01 SUI = 10,000,000 MIST)

**Output:**
```
Transaction Digest: 0x...
Created Objects:
  - ObjectID: 0x... (ESCROW_ID - CATAT INI!)
```

> **Penting:** Simpan **ESCROW_ID** yang muncul!

### Langkah 3: Transfer Escrow ke Buyer (Opsional)

Jika buyer menggunakan alamat berbeda, transfer escrow object ke buyer:

```shell
sui client transfer-object \
  --object-id <ESCROW_ID> \
  --to <BUYER_ADDRESS> \
  --gas-budget 50000000
```

**Catatan:** Jika seller dan buyer menggunakan alamat yang sama (untuk testing), langkah ini bisa dilewati.

### Langkah 4: Accept Escrow (Buyer)

Buyer membayar dan langsung menerima deposit:

```shell
sui client call \
  --package <PACKAGE_ID> \
  --module escrow_minimal \
  --function accept_escrow \
  --args <ESCROW_ID> <PAYMENT_COIN_ID> \
  --gas-budget 100000000
```

**Penjelasan:**
- `--args <ESCROW_ID> <PAYMENT_COIN_ID>`:
  - `ESCROW_ID`: Object ID escrow
  - `PAYMENT_COIN_ID`: Coin ID untuk pembayaran (harus sama dengan requested_amount)

**Output:**
```
Transaction Digest: 0x...
Mutated Objects:
  - ObjectID: 0x... (ESCROW_ID yang di-update)
Created Objects:
  - ObjectID: 0x... (Coin deposit yang diterima buyer)
```

Buyer sekarang sudah menerima deposit dari seller!

### Langkah 5: Complete Escrow (Seller)

Seller menarik pembayaran yang sudah diterima dari buyer:

```shell
sui client call \
  --package <PACKAGE_ID> \
  --module escrow_minimal \
  --function complete_escrow \
  --args <ESCROW_ID> \
  --gas-budget 100000000
```

**Output:**
```
Transaction Digest: 0x...
Mutated Objects:
  - ObjectID: 0x... (ESCROW_ID yang di-update)
Created Objects:
  - ObjectID: 0x... (Coin pembayaran yang diterima seller)
```

Seller sekarang sudah menerima pembayaran dari buyer!

### Langkah 6: Verifikasi Object (Opsional)

Untuk melihat detail escrow object:

```shell
sui client object <ESCROW_ID>
```

Output akan menampilkan detail object termasuk balance yang tersisa.

---

## 8. Testing Cancel Escrow

Jika seller ingin membatalkan escrow sebelum buyer accept, gunakan function `cancel_escrow`:

### Langkah 1: Create Escrow Baru

```shell
sui client call \
  --package <PACKAGE_ID> \
  --module escrow_minimal \
  --function create_escrow \
  --args <DEPOSIT_COIN_ID> 10000000 \
  --gas-budget 100000000
```

Catat `ESCROW_ID` baru.

### Langkah 2: Cancel Escrow

```shell
sui client call \
  --package <PACKAGE_ID> \
  --module escrow_minimal \
  --function cancel_escrow \
  --args <ESCROW_ID> \
  --gas-budget 100000000
```

**Output:**
```
Transaction Digest: 0x...
Deleted Objects:
  - ObjectID: 0x... (ESCROW_ID yang dihapus)
Created Objects:
  - ObjectID: 0x... (Coin deposit yang dikembalikan ke seller)
```

Deposit dikembalikan ke seller dan escrow object dihapus!

---

## 9. Panduan Testing Lengkap

Berikut adalah panduan lengkap untuk testing escrow contract dengan berbagai skenario:

### Skenario 1: Flow Lengkap (Create → Accept → Complete)

#### Step 1: Deploy Package

```bash
sui client publish --gas-budget 200000000

# Catat PACKAGE_ID dari output
```

#### Step 2: Siapkan Coin

```bash
# Lihat coin yang dimiliki
sui client gas

# Pecah coin untuk deposit (0.01 SUI)
sui client pay-sui \
  --input-coins <GAS_COIN_ID> \
  --recipients $(sui client active-address) \
  --amounts 10000000 \
  --gas-budget 5000000

# Pecah coin untuk payment (0.01 SUI)
sui client pay-sui \
  --input-coins <GAS_COIN_ID> \
  --recipients $(sui client active-address) \
  --amounts 10000000 \
  --gas-budget 5000000
```

**Catat Coin ID** dari setiap transaksi:
- `DEPOSIT_COIN_ID`: Coin untuk deposit seller
- `PAYMENT_COIN_ID`: Coin untuk pembayaran buyer

#### Step 3: Create Escrow (Seller)

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module escrow_minimal \
  --function create_escrow \
  --args <DEPOSIT_COIN_ID> 10000000 \
  --gas-budget 100000000
```

**Output menampilkan `Escrow` object id** - catat sebagai `ESCROW_ID`.

#### Step 4: Transfer Escrow ke Buyer (Jika Buyer Beda Akun)

```bash
sui client transfer-object \
  --object-id <ESCROW_ID> \
  --to <BUYER_ADDRESS> \
  --gas-budget 50000000
```

**Catatan:** Jika seller dan buyer menggunakan alamat yang sama (untuk testing), langkah ini bisa dilewati.

#### Step 5: Accept Escrow (Buyer)

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module escrow_minimal \
  --function accept_escrow \
  --args <ESCROW_ID> <PAYMENT_COIN_ID> \
  --gas-budget 100000000
```

**Hasil:** Buyer menerima koin deposit sebagai output.

#### Step 6: Complete Escrow (Seller)

Pastikan `ESCROW_ID` kembali ke seller (transfer dari buyer jika perlu).

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module escrow_minimal \
  --function complete_escrow \
  --args <ESCROW_ID> \
  --gas-budget 100000000
```

**Hasil:** Seller menerima koin pembayaran sebagai output.

### Skenario 2: Cancel Escrow

#### Step 1: Create Escrow Baru

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module escrow_minimal \
  --function create_escrow \
  --args <DEPOSIT_COIN_ID> 10000000 \
  --gas-budget 100000000
```

Catat `ESCROW_ID` baru.

#### Step 2: Cancel Escrow (Sebelum Buyer Accept)

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module escrow_minimal \
  --function cancel_escrow \
  --args <ESCROW_ID> \
  --gas-budget 100000000
```

**Hasil:** Deposit dikembalikan ke seller, escrow object dihapus.

### Debug dan Verifikasi

#### Melihat Detail Object Escrow

```bash
sui client object <ESCROW_ID>
```

Output akan menampilkan:
- Object ID dan type
- Owner address
- Fields dari Escrow struct
- Balance yang tersimpan

#### Melihat Semua Objects yang Dimiliki

```bash
sui client objects
```

#### Melihat Coin yang Dimiliki

```bash
sui client gas
```

### Tips Testing

1. **Gunakan Alias untuk Memudahkan:**
   ```bash
   export PACKAGE_ID=0x...
   export ESCROW_ID=0x...
   export DEPOSIT_COIN_ID=0x...
   export PAYMENT_COIN_ID=0x...
   
   # Kemudian gunakan dalam command
   sui client call --package $PACKAGE_ID --module escrow_minimal --function create_escrow --args $DEPOSIT_COIN_ID 10000000 --gas-budget 100000000
   ```

2. **Pastikan Coin Value Sesuai:**
   - `DEPOSIT_COIN_ID` dan `PAYMENT_COIN_ID` harus bernilai sama dengan `requested_amount` saat accept
   - Gunakan `sui client object <COIN_ID>` untuk melihat nilai coin

3. **Verifikasi Ownership:**
   - Pastikan pemilik escrow sesuai: seller untuk create/complete/cancel, buyer untuk accept
   - Atau transfer kepemilikan dulu dengan `transfer-object`

4. **Cek Transaction History:**
   ```bash
   # Lihat transaction terakhir
   sui client transaction <TRANSACTION_DIGEST>
   ```

---

## 10. Troubleshooting

### Error: "Insufficient gas"

**Solusi:** Pastikan kamu memiliki cukup SUI untuk gas. Cek saldo dengan:
```shell
sui client gas
```

### Error: "Object not found"

**Solusi:** Pastikan `ESCROW_ID` atau `COIN_ID` yang digunakan sudah benar. Verifikasi dengan:
```shell
sui client object <OBJECT_ID>
```

### Error: "Assertion failure"

**Solusi:** 
- Pastikan `requested_amount` sama dengan nilai coin payment saat `accept_escrow`
- Pastikan hanya creator yang bisa memanggil `complete_escrow` dan `cancel_escrow`

### Error: "Coin value mismatch"

**Solusi:** Pastikan jumlah pembayaran (`PAYMENT_COIN_ID`) sama persis dengan `requested_amount` yang ditentukan saat create escrow.

---

## 11. Kesimpulan

### Apa yang Sudah Kita Pelajari?

- ✅ **Konsep Escrow**: Memahami bagaimana escrow bekerja di blockchain
- ✅ **Balance vs Coin**: Memahami perbedaan dan kapan menggunakan masing-masing
- ✅ **Split Coin**: Memahami cara memecah coin menggunakan `pay-sui` dan `split-coin`
- ✅ **Escrow Functions**: Membuat dan menggunakan 4 function utama escrow
- ✅ **Testing**: Menguji contract dengan Sui CLI

### Konsep Kunci

1. **Balance untuk Internal Storage**: Gunakan `Balance<SUI>` untuk menyimpan SUI di dalam object
2. **Coin untuk Transfer**: Gunakan `Coin<SUI>` untuk transfer antar alamat
3. **Split Coin untuk Testing**: Selalu pecah coin sebelum digunakan sebagai argument
4. **Pay-Sui Lebih Mudah**: Gunakan `pay-sui` untuk split dan transfer sekaligus
5. **Validasi Penting**: Selalu validasi input dengan `assert!` untuk keamanan

### Tips Praktis

1. **Selalu Catat ID**: Simpan PackageID, ObjectID, dan CoinID untuk memudahkan testing
2. **Gunakan Pay-Sui**: Lebih mudah daripada split-coin manual
3. **Cek Object**: Gunakan `sui client object` untuk melihat detail object
4. **Test Semua Flow**: Test create, accept, complete, dan cancel untuk memastikan semua berfungsi

### Langkah Selanjutnya

Selamat! Kamu sudah berhasil membuat dan menguji escrow contract! 🎉

Kamu bisa melanjutkan dengan:
- Menambahkan event untuk tracking transaksi
- Menambahkan status untuk escrow (pending, completed, cancelled)
- Membuat escrow dengan multiple buyers
- Menambahkan deadline untuk escrow

Teruslah bereksperimen dan jangan takut untuk mencoba hal baru! **GMove!**

