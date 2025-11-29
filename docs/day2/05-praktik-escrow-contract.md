---
sidebar_position: 6
title: "Praktik: Membuat Escrow Smart Contract"
description: Panduan lengkap membuat dan menguji escrow smart contract di Sui blockchain.
keywords: [sui, blockchain, escrow, smart contract, praktik, indonesia]
---

# Praktik: Membuat Escrow Smart Contract

Selamat datang di sesi praktik. Kita akan membuat **Escrow Smart Contract** sederhana di jaringan Sui. Escrow ibarat kotak aman yang memegang dana sampai penjual dan pembeli selesai bertransaksi.

## Apa yang Akan Dipelajari

- menyiapkan proyek Move dari nol
- memahami kode lengkap `simple_escrow` dan `mock_coin`
- penjelasan setiap bagian kode dengan bahasa mudah
- cerita dan alur escrow supaya konsepnya jelas
- langkah build, publish, dan uji smart contract
- tips dasar memecah coin, membaca object, dan menangani error

---

## 1. Siapkan Proyek

1. buat folder baru:  
   ```bash
   sui move new escrow_contract
   cd escrow_contract
   ```
2. buka `Move.toml` dan isi seperti berikut:
   ```toml
   [package]
   name = "escrow"
   version = "0.0.1"

   [dependencies]
   Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }

   [addresses]
   escrow = "0x0"
   ```
3. buat file `sources/escrow.move`, lalu salin kode `simple_escrow` dan `mock_coin` pada bagian berikutnya
4. jalankan `sui move build` untuk memastikan proyek valid

Jika build berhasil, Move compiler menampilkan pesan sukses. Setelah proyek siap, kita lanjut ke kode utama.

---

## 2. Kode Lengkap `simple_escrow`

Di bawah ini adalah kode Move escrow yang akan dipakai sepanjang latihan. Jangan ubah kodenya agar sesuai dengan instruksi berikut.

```rust
module escrow::simple_escrow {
    use sui::balance;
    use sui::balance::Balance;
    use sui::coin;
    use sui::coin::Coin;

    /// Escrow sederhana untuk koin fungible apa pun.
    public struct Escrow<phantom CoinType: store> has key, store {
        id: object::UID,
        deposit: Balance<CoinType>,
        requested_amount: u64,
        receive: Balance<CoinType>,
        creator: address,
    }

    /// Seller kunci koin miliknya, tentukan jumlah yang diminta dari buyer.
    public entry fun create_escrow<CoinType: store>(
        deposit_coin: Coin<CoinType>,
        request_amount: u64,
        ctx: &mut TxContext,
    ) {
        let escrow = Escrow {
            id: object::new(ctx),
            deposit: coin::into_balance(deposit_coin),
            requested_amount: request_amount,
            receive: balance::zero<CoinType>(),
            creator: ctx.sender(),
        };

        transfer::public_transfer(escrow, ctx.sender());
    }

    /// Buyer kirim koin sesuai request, langsung menerima deposit seller.
    public entry fun accept_escrow<CoinType: store>(
        escrow: &mut Escrow<CoinType>,
        payment: Coin<CoinType>,
        ctx: &mut TxContext,
    ) {
        assert!(coin::value(&payment) == escrow.requested_amount, 0);

        balance::join(&mut escrow.receive, coin::into_balance(payment));
        let deposit_balance = balance::withdraw_all(&mut escrow.deposit);
        let deposit_coin = coin::from_balance(deposit_balance, ctx);
        transfer::public_transfer(deposit_coin, ctx.sender());
    }

    /// Seller tarik pembayaran yang sudah diterima dari buyer.
    public entry fun complete_escrow<CoinType: store>(
        escrow: &mut Escrow<CoinType>,
        ctx: &mut TxContext,
    ) {
        assert!(ctx.sender() == escrow.creator, 2);
        let receive_balance = balance::withdraw_all(&mut escrow.receive);
        let payout = coin::from_balance(receive_balance, ctx);
        transfer::public_transfer(payout, ctx.sender());
    }

    /// Seller batalkan escrow, deposit dikembalikan ke seller.
    public entry fun cancel_escrow<CoinType: store>(
        escrow: Escrow<CoinType>,
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

### 2.1. Penjelasan Struct `Escrow`

- `id`: tanda unik untuk object escrow
- `deposit`: saldo penjual yang disimpan aman
- `requested_amount`: angka yang harus dibayar pembeli
- `receive`: saldo pembayaran yang sudah masuk
- `creator`: alamat penjual sebagai pemilik escrow

`Balance<T>` adalah kantong internal untuk menyimpan koin tipe tertentu. Kita memakai `Balance` karena bisa diletakkan di dalam object. `Coin<T>` adalah objek yang siap ditransfer. Kita ubah `Coin` menjadi `Balance` saat masuk ke escrow dan mengubahnya kembali saat keluar.

### 2.2. Penjelasan Fungsi

- `create_escrow`: penjual memasukkan koin dan menentukan angka. Escrow langsung kembali ke alamat penjual supaya bisa diteruskan ke pembeli.
- `accept_escrow`: pembeli mengirim koin dengan nilai tepat. Deposit penjual langsung dikirim ke pembeli, sementara pembayaran pembeli disimpan di `receive`.
- `complete_escrow`: penjual menarik pembayaran yang tersimpan di field `receive`. Hanya pembuat escrow yang boleh memanggil fungsi ini.
- `cancel_escrow`: penjual menarik deposit dan menghapus object escrow selama tidak ada pembayaran tersisa. Hanya pembuat escrow yang diizinkan.

---

## 3. Kode Pendukung `mock_coin`

Kita butuh token latihan supaya tidak memakai SUI asli. Modul `mock_coin` membuat token fiktif bernama MOCK. Kode di bawah juga tidak perlu diubah.

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

### 3.1. Penjelasan Singkat

- `MOCK_COIN`: saksi satu kali untuk membuat tipe koin baru.
- `init`: otomatis dijalankan saat paket dipublish untuk menyiapkan metadata dan kapabilitas mint.
- `mint_mock_coin`: mencetak token latihan sesuai jumlah yang diminta, lalu mengirim ke alamat pemanggil.

Setelah publish, simpan `TreasuryCap<MOCK_COIN>` supaya bisa mencetak koin kapan saja.

---

## 4. Cerita Singkat Escrow

Bayangkan kamu menjual barang ke teman jauh. Kamu ingin pembeli membayar tepat waktu, pembeli ingin barang aman. Escrow menyediakan perantara netral:

1. penjual menaruh deposit ke kotak aman
2. pembeli menyerahkan pembayaran ke kotak aman
3. setelah semuanya cocok, pembeli menerima deposit dan penjual mengambil pembayaran
4. jika ada masalah, penjual bisa membatalkan dan menarik deposit

Di blockchain, alur itu dijalankan otomatis oleh smart contract sehingga tidak ada campur tangan manusia.

---

## 5. Alur Escrow di Sui

1. penjual membuat escrow, deposit disimpan di object escrow  
2. pembeli menerima escrow dan mengirim pembayaran sesuai angka yang diminta  
3. penjual menarik pembayaran kapan saja setelah pembeli membayar  
4. penjual dapat membatalkan escrow selama belum ada pembayaran yang tertahan

---

## 6. Membagi Coin untuk Testing

Satu object coin tidak bisa dipakai sekaligus sebagai gas dan argumen. Gunakan `sui client pay-sui` untuk memecah coin menjadi beberapa bagian yang lebih kecil.

```bash
sui client pay-sui ^
  --input-coins <COIN_ID_BESAR> ^
  --recipients $(sui client active-address) ^
  --amounts 10000000 ^
  --gas-budget 5000000
```

Penjelasan cepat:

- `COIN_ID_BESAR`: coin utama yang nilainya besar
- `recipients`: alamat tujuan, gunakan alamat aktif sendiri agar coin baru tetap di dompet
- `amounts`: nilai coin baru dalam MIST (1 SUI = 1.000.000.000 MIST)
- `gas-budget`: biaya transaksi

Jalankan perintah dua kali untuk menyiapkan coin deposit dan coin pembayaran.

Tips tambahan:

- cek daftar coin dengan `sui client gas`
- catat setiap `ObjectID` karena kita akan memakainya sebagai argumen perintah

---

## 7. Publish Paket dan Simpan ID Penting

1. jalankan `sui client publish --gas-budget 200000000`
2. catat `PackageID` dari hasil publish
3. catat juga `TreasuryCap<MOCK_COIN>` untuk proses mint

Setelah publish, kita siap melakukan flow lengkap escrow.

---

## 8. Uji Alur Escrow

Gunakan angka contoh `10000000` (0,01 token dengan 9 desimal) agar mudah. Ganti ID sesuai milikmu.

### 8.1. Mint MOCK Coin

```bash
sui client call ^
  --package <PACKAGE_ID> ^
  --module mock_coin ^
  --function mint_mock_coin ^
  --args <TREASURY_CAP_ID> 100000000 ^
  --gas-budget 100000000
```

Setelah mint, gunakan `sui client gas` untuk melihat coin baru. Pecah coin agar memiliki deposit dan payment dengan nilai sama.

### 8.2. Create Escrow oleh Penjual

```bash
sui client call ^
  --package <PACKAGE_ID> ^
  --module simple_escrow ^
  --function create_escrow ^
  --type-args <COIN_TYPE> ^
  --args <DEPOSIT_COIN_ID> 10000000 ^
  --gas-budget 100000000
```

`COIN_TYPE` bisa berupa `0x...::mock_coin::MOCK_COIN`. Output transaksi berisi `ESCROW_ID`. Simpan ID ini.

### 8.3. Transfer Escrow ke Pembeli (Jika Perlu)

Jika akun pembeli berbeda, lakukan:

```bash
sui client transfer-object ^
  --object-id <ESCROW_ID> ^
  --to <ALAMAT_PEMBELI> ^
  --gas-budget 50000000
```

Jika kamu memakai satu alamat untuk latihan, langkah ini boleh dilewati.

### 8.4. Accept Escrow oleh Pembeli

```bash
sui client call ^
  --package <PACKAGE_ID> ^
  --module simple_escrow ^
  --function accept_escrow ^
  --type-args <COIN_TYPE> ^
  --args <ESCROW_ID> <PAYMENT_COIN_ID> ^
  --gas-budget 100000000
```

- pembayaran harus sama persis dengan `requested_amount`
- setelah transaksi, pembeli langsung menerima coin deposit

### 8.5. Complete Escrow oleh Penjual

Pastikan object escrow kembali ke penjual (transfer lagi jika diperlukan). Lalu jalankan:

```bash
sui client call ^
  --package <PACKAGE_ID> ^
  --module simple_escrow ^
  --function complete_escrow ^
  --type-args <COIN_TYPE> ^
  --args <ESCROW_ID> ^
  --gas-budget 100000000
```

Penjual sekarang memegang pembayaran dari pembeli. Flow utama selesai.

---

## 9. Membatalkan Escrow

Jika penjual ingin berhenti sebelum pembeli bayar:

```bash
sui client call ^
  --package <PACKAGE_ID> ^
  --module simple_escrow ^
  --function cancel_escrow ^
  --type-args <COIN_TYPE> ^
  --args <ESCROW_ID> ^
  --gas-budget 100000000
```

Escrow dihapus, deposit kembali ke penjual. Fungsi ini hanya bisa dipanggil oleh pembuat escrow.

---

## 10. Pemeriksaan dan Debug

- `sui client object <ESCROW_ID>` menampilkan isi object escrow (deposit, receive, owner)
- `sui client objects` menunjukkan semua object milik alamat aktif
- `sui client transaction <DIGEST>` membantu membaca detail transaksi terakhir

---

## 11. Troubleshooting

- **Insufficient gas**: isi faucet lagi atau kurangi `gas-budget`
- **Object not found**: cek kembali penulisan `ObjectID`, mungkin sudah digunakan lalu terhapus
- **Assertion failure**: pastikan nilai pembayaran sama dengan `requested_amount` dan pemanggil fungsi sesuai aturan (misal hanya creator yang boleh complete atau cancel)
- **Coin value mismatch**: gunakan `sui client object <COIN_ID>` untuk mengecek nilai coin sebelum dipakai

---

## 12. Ringkasan

- Escrow menyimpan deposit penjual sampai pembeli membayar sesuai angka yang disepakati
- `Balance` dipakai untuk menyimpan koin di dalam object, `Coin` dipakai saat transfer keluar
- `simple_escrow` mendukung empat aksi utama: buat, terima, selesaikan, batalkan
- `mock_coin` memberi token latihan agar kita tidak memakai dana sebenarnya
- Catat semua ID penting (package, treasury cap, coin, escrow) supaya setiap langkah mudah diulang

Selamat berlatih. Setelah memahami contoh ini, kamu bisa menambahkan status, batas waktu, atau event untuk mencatat setiap aksi escrow.
