# Contoh Penggunaan Smart Contract Escrow

Dokumen ini berisi contoh-contoh praktis penggunaan smart contract escrow.

## 📋 Prerequisites

1. Sui CLI sudah terinstal
2. Smart contract sudah di-deploy ke Testnet
3. Memiliki Package ID dan Object IDs yang relevan

## 🎯 Skenario 1: Flow Lengkap Escrow

### Step 1: Seller Membuat Escrow

**Situasi**: Alice (seller) ingin membuat escrow untuk Bob (buyer) dengan 1000 MIST SUI.

```bash
# 1. Alice split coin untuk escrow
sui client split-coin \
  --amounts 1000 \
  --gas-budget 10000000

# Output akan memberikan coin object ID, misalnya: 0xabc123...

# 2. Alice membuat escrow untuk Bob
sui client call \
  --package <PACKAGE_ID> \
  --module escrow \
  --function create_escrow \
  --args 0xabc123... 0xbob_address... \
  --gas-budget 10000000
```

**Hasil**:
- Escrow object dibuat dengan ID baru (misalnya: `0xescrow456...`)
- Coin 1000 MIST tersimpan di escrow object
- Event `EscrowCreated` diemit
- Alice sekarang memiliki escrow object

**Query untuk melihat escrow**:
```bash
sui client object 0xescrow456...
```

### Step 2: Bob Menerima Escrow

**Situasi**: Bob ingin menerima escrow dari Alice.

```bash
# Bob menerima escrow
sui client call \
  --package <PACKAGE_ID> \
  --module escrow \
  --function accept_escrow \
  --args 0xescrow456... \
  --gas-budget 10000000
```

**Hasil**:
- 1000 MIST ditransfer ke Bob
- Escrow object dihapus
- Event `EscrowAccepted` diemit

**Verifikasi**:
```bash
# Cek saldo Bob
sui client gas
```

### Step 3: Alternatif - Alice Membatalkan Escrow

**Situasi**: Jika Bob tidak menerima escrow, Alice bisa membatalkannya.

```bash
# Alice membatalkan escrow
sui client call \
  --package <PACKAGE_ID> \
  --module escrow \
  --function cancel_escrow \
  --args 0xescrow456... \
  --gas-budget 10000000
```

**Hasil**:
- 1000 MIST dikembalikan ke Alice
- Escrow object dihapus
- Event `EscrowCancelled` diemit

## 🔍 Contoh Query dan Validasi

### Melihat Detail Escrow Object

```bash
sui client object <ESCROW_OBJECT_ID>
```

Output akan menampilkan:
- Seller address
- Buyer address
- Amount
- Status
- Created timestamp

### Melihat Semua Object yang Dimiliki

```bash
sui client objects
```

### Melihat Events

```bash
# Lihat events dari transaksi tertentu
sui client transaction <TRANSACTION_DIGEST>
```

## ⚠️ Error Handling

### Error Code 0: Amount is Zero

**Penyebab**: Mencoba membuat escrow dengan jumlah 0.

**Solusi**: Pastikan coin yang digunakan memiliki nilai lebih dari 0.

### Error Code 1: Unauthorized Buyer

**Penyebab**: Address yang memanggil `accept_escrow` bukan buyer yang ditentukan.

**Solusi**: Pastikan hanya buyer yang ditentukan saat membuat escrow yang bisa menerima.

### Error Code 2: Escrow Not Active

**Penyebab**: Mencoba menerima escrow yang sudah diterima atau dibatalkan.

**Solusi**: Pastikan escrow masih dalam status Active.

### Error Code 3: Unauthorized Seller

**Penyebab**: Address yang memanggil `cancel_escrow` bukan seller yang membuat escrow.

**Solusi**: Pastikan hanya seller yang membuat escrow yang bisa membatalkan.

### Error Code 4: Escrow Not Active (Cancel)

**Penyebab**: Mencoba membatalkan escrow yang sudah diterima atau dibatalkan.

**Solusi**: Pastikan escrow masih dalam status Active.

## 💡 Tips Praktis

### 1. Verifikasi Sebelum Membuat Escrow

```bash
# Pastikan buyer address benar
sui client active-address  # untuk melihat address aktif

# Verifikasi jumlah coin
sui client gas  # untuk melihat coin yang tersedia
```

### 2. Simpan Object IDs

Setelah membuat escrow, simpan:
- Escrow object ID
- Package ID
- Transaction digest

Ini akan memudahkan tracking dan debugging.

### 3. Monitor Events

Gunakan events untuk tracking:
- `EscrowCreated`: Ketika escrow dibuat
- `EscrowAccepted`: Ketika escrow diterima
- `EscrowCancelled`: Ketika escrow dibatalkan

### 4. Testing di Local Network

Sebelum deploy ke Testnet, test di local network:

```bash
# Start local network
sui-test-validator

# Deploy ke local network
sui client publish --gas-budget 100000000
```

## 📊 Contoh Workflow Lengkap

```bash
# ============================================
# WORKFLOW LENGKAP: ALICE -> BOB ESCROW
# ============================================

# 1. Setup (Alice)
sui client active-address  # Catat: 0xalice...
sui client gas            # Pastikan ada coin

# 2. Alice split coin
sui client split-coin --amounts 1000 --gas-budget 10000000
# Output: Coin ID: 0xcoin123...

# 3. Alice dapat Bob's address
# (Dalam real scenario, ini dari komunikasi off-chain)
BOB_ADDRESS="0xbob..."

# 4. Alice membuat escrow
sui client call \
  --package <PACKAGE_ID> \
  --module escrow \
  --function create_escrow \
  --args 0xcoin123... $BOB_ADDRESS \
  --gas-budget 10000000
# Output: Escrow ID: 0xescrow456...

# 5. Alice share escrow ID ke Bob (off-chain)

# 6. Bob switch ke address-nya
sui client switch --address $BOB_ADDRESS

# 7. Bob menerima escrow
sui client call \
  --package <PACKAGE_ID> \
  --module escrow \
  --function accept_escrow \
  --args 0xescrow456... \
  --gas-budget 10000000

# 8. Verifikasi
sui client gas  # Bob sekarang punya 1000 MIST lebih
```

## 🎓 Latihan

Coba buat skenario berikut:

1. **Skenario A**: Seller membuat escrow, buyer menerima
2. **Skenario B**: Seller membuat escrow, seller membatalkan
3. **Skenario C**: Multiple escrow dari seller yang sama ke buyer berbeda

## 📚 Referensi

- [Sui CLI Documentation](https://docs.sui.io/build/cli-client)
- [Move Language](https://move-language.github.io/move/)
- [Sui Object Model](https://docs.sui.io/concepts/object-model)

