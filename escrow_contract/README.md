# Smart Contract Escrow Sederhana untuk Sui

Smart contract escrow sederhana yang memungkinkan seller menyetor token SUI dan buyer menerimanya, atau seller membatalkan escrow.

## 📋 Flow Escrow

### 1. **Create Escrow** (Membuat Escrow)
- Seller membuat escrow dengan menyetor token SUI
- Seller menentukan buyer yang bisa menerima escrow
- Escrow object dibuat dengan status `Active`

### 2. **Accept Escrow** (Menerima Escrow)
- Buyer memanggil fungsi `accept_escrow` dengan escrow object
- Sistem memvalidasi bahwa buyer adalah penerima yang benar
- Token SUI ditransfer ke buyer
- Escrow object dihapus

### 3. **Cancel Escrow** (Membatalkan Escrow)
- Seller memanggil fungsi `cancel_escrow` dengan escrow object
- Sistem memvalidasi bahwa seller adalah pembuat escrow
- Token SUI dikembalikan ke seller
- Escrow object dihapus

## 🏗️ Struktur Proyek

```
escrow_contract/
├── Move.toml          # Konfigurasi proyek
├── sources/          # Kode smart contract
│   └── escrow.move   # Smart contract escrow
└── README.md         # Dokumentasi
```

## 🚀 Cara Menggunakan

### 1. Build Smart Contract

```bash
sui move build
```

### 2. Deploy ke Testnet

```bash
sui client publish --gas-budget 100000000
```

### 3. Menggunakan Smart Contract

#### Membuat Escrow (Seller)

```bash
# 1. Split coin untuk escrow (misalnya 1000 MIST)
sui client split-coin --amounts 1000 --gas-budget 10000000

# 2. Panggil fungsi create_escrow
sui client call \
  --package <PACKAGE_ID> \
  --module escrow \
  --function create_escrow \
  --args <COIN_OBJECT_ID> <BUYER_ADDRESS> \
  --gas-budget 10000000
```

#### Menerima Escrow (Buyer)

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module escrow \
  --function accept_escrow \
  --args <ESCROW_OBJECT_ID> \
  --gas-budget 10000000
```

#### Membatalkan Escrow (Seller)

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module escrow \
  --function cancel_escrow \
  --args <ESCROW_OBJECT_ID> \
  --gas-budget 10000000
```

## 📊 Event yang Dihasilkan

Smart contract ini menghasilkan 3 jenis event:

1. **EscrowCreated**: Ketika escrow dibuat
   - `escrow_id`: ID escrow object
   - `seller`: Alamat seller
   - `buyer`: Alamat buyer
   - `amount`: Jumlah token

2. **EscrowAccepted**: Ketika escrow diterima
   - `escrow_id`: ID escrow object
   - `buyer`: Alamat buyer
   - `amount`: Jumlah token

3. **EscrowCancelled**: Ketika escrow dibatalkan
   - `escrow_id`: ID escrow object
   - `seller`: Alamat seller
   - `amount`: Jumlah token

## 🔒 Keamanan

- ✅ Hanya buyer yang ditentukan yang bisa menerima escrow
- ✅ Hanya seller yang bisa membatalkan escrow
- ✅ Escrow harus dalam status `Active` untuk bisa diterima atau dibatalkan
- ✅ Coin langsung ditransfer, tidak ada penundaan

## 📝 Catatan Penting

1. **Ownership**: Escrow object dimiliki oleh seller setelah dibuat. Buyer bisa melihat escrow melalui query, tapi tidak bisa mengambil coin tanpa memanggil `accept_escrow`.

2. **Status**: Escrow memiliki 3 status:
   - `0` = Active (bisa diterima atau dibatalkan)
   - `1` = Accepted (sudah diterima buyer)
   - `2` = Cancelled (sudah dibatalkan seller)

3. **Coin**: Coin SUI disimpan di dalam escrow object dan hanya bisa diambil melalui `accept_escrow` atau `cancel_escrow`.

## 🧪 Testing

Untuk testing, Kamu bisa menggunakan Sui CLI atau membuat test file di folder `tests/`.

Contoh query escrow:

```bash
# Lihat detail escrow object
sui client object <ESCROW_OBJECT_ID>
```

## 📚 Referensi

- [Sui Documentation](https://docs.sui.io)
- [Move Language](https://move-language.github.io/move/)
- [Sui CLI Commands](https://docs.sui.io/build/cli-client)

