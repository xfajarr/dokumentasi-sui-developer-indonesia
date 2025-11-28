# Flow Escrow - Penjelasan Detail

Dokumen ini menjelaskan flow lengkap dari smart contract escrow secara detail.

## 🎯 Konsep Escrow

Escrow adalah sistem di mana aset (dalam hal ini token SUI) dipegang oleh pihak ketiga (smart contract) sampai kondisi tertentu terpenuhi. Dalam kasus ini:
- **Seller** menyetor token SUI ke escrow
- **Buyer** bisa menerima token tersebut
- **Seller** bisa membatalkan dan mengambil kembali token jika belum diterima

## 📊 Diagram Flow

```
┌─────────┐
│ Seller  │
└────┬────┘
     │
     │ 1. create_escrow(coin, buyer_address)
     │    └─> Menyetor token SUI
     │
     ▼
┌─────────────────┐
│  Escrow Object  │  Status: Active
│  - Seller       │
│  - Buyer        │
│  - Amount       │
│  - Coin (SUI)   │
└────┬────────────┘
     │
     ├─────────────────┐
     │                 │
     ▼                 ▼
┌─────────┐      ┌─────────┐
│ Buyer   │      │ Seller  │
└────┬────┘      └────┬────┘
     │                │
     │ 2. accept_     │ 3. cancel_
     │    escrow()    │    escrow()
     │                │
     ▼                ▼
┌─────────┐      ┌─────────┐
│ Buyer   │      │ Seller  │
│ Menerima│      │ Menerima│
│ Token   │      │ Token   │
│ SUI     │      │ SUI     │
└─────────┘      └─────────┘
```

## 🔄 Step-by-Step Flow

### Step 1: Seller Membuat Escrow

**Aktor**: Seller

**Tindakan**:
1. Seller memiliki coin SUI (misalnya dari split coin)
2. Seller memanggil `create_escrow(coin, buyer_address)`
3. Smart contract:
   - Membuat Escrow object baru
   - Menyimpan coin di dalam escrow object
   - Menetapkan seller dan buyer
   - Mengatur status menjadi `Active`
   - Mentransfer escrow object ke seller (seller memegang escrow object)

**Hasil**:
- Escrow object dibuat dengan status `Active`
- Coin SUI tersimpan di dalam escrow object
- Event `EscrowCreated` diemit

**Contoh**:
```bash
# Seller split coin
sui client split-coin --amounts 1000 --gas-budget 10000000

# Seller membuat escrow
sui client call \
  --package 0x123... \
  --module escrow \
  --function create_escrow \
  --args 0xabc... 0xdef... \
  --gas-budget 10000000
```

### Step 2: Buyer Menerima Escrow

**Aktor**: Buyer

**Tindakan**:
1. Buyer mendapatkan escrow object ID (dari seller atau query)
2. Buyer memanggil `accept_escrow(escrow)`
3. Smart contract memvalidasi:
   - Buyer adalah penerima yang benar (`escrow.buyer == buyer`)
   - Escrow masih aktif (`status == Active`)
4. Smart contract:
   - Mengambil coin dari escrow object
   - Mentransfer coin ke buyer
   - Menghapus escrow object

**Hasil**:
- Coin SUI ditransfer ke buyer
- Escrow object dihapus
- Event `EscrowAccepted` diemit

**Contoh**:
```bash
# Buyer menerima escrow
sui client call \
  --package 0x123... \
  --module escrow \
  --function accept_escrow \
  --args 0xescrow123... \
  --gas-budget 10000000
```

### Step 3: Seller Membatalkan Escrow (Alternatif)

**Aktor**: Seller

**Tindakan**:
1. Seller memanggil `cancel_escrow(escrow)`
2. Smart contract memvalidasi:
   - Seller adalah pembuat escrow (`escrow.seller == seller`)
   - Escrow masih aktif (`status == Active`)
3. Smart contract:
   - Mengambil coin dari escrow object
   - Mengembalikan coin ke seller
   - Menghapus escrow object

**Hasil**:
- Coin SUI dikembalikan ke seller
- Escrow object dihapus
- Event `EscrowCancelled` diemit

**Contoh**:
```bash
# Seller membatalkan escrow
sui client call \
  --package 0x123... \
  --module escrow \
  --function cancel_escrow \
  --args 0xescrow123... \
  --gas-budget 10000000
```

## 🔍 Validasi dan Error Codes

Smart contract menggunakan error codes untuk validasi:

| Error Code | Kondisi | Penjelasan |
|------------|---------|------------|
| 0 | `amount == 0` | Jumlah token harus lebih dari 0 |
| 1 | `buyer != escrow.buyer` | Hanya buyer yang ditentukan yang bisa menerima |
| 2 | `status != Active` | Escrow harus masih aktif untuk diterima |
| 3 | `seller != escrow.seller` | Hanya seller yang bisa membatalkan |
| 4 | `status != Active` | Escrow harus masih aktif untuk dibatalkan |

## 💡 Tips Penggunaan

1. **Untuk Seller**:
   - Pastikan buyer address sudah benar sebelum membuat escrow
   - Simpan escrow object ID untuk referensi
   - Kamu bisa membatalkan escrow kapan saja selama masih aktif

2. **Untuk Buyer**:
   - Verifikasi escrow object sebelum menerima
   - Pastikan jumlah token sesuai dengan yang diharapkan
   - Setelah diterima, escrow object akan dihapus

3. **Query Escrow**:
   ```bash
   # Lihat detail escrow
   sui client object <ESCROW_OBJECT_ID>
   
   # Lihat semua object yang dimiliki
   sui client objects
   ```

## 🎓 Konsep Penting

### Object Ownership
- Escrow object dimiliki oleh seller setelah dibuat
- Buyer tidak memiliki escrow object, tapi bisa memanggil fungsi `accept_escrow` jika memiliki object ID
- Setelah escrow diterima atau dibatalkan, object dihapus

### Coin Storage
- Coin SUI disimpan di dalam escrow object sebagai field
- Coin hanya bisa diakses melalui fungsi `accept_escrow` atau `cancel_escrow`
- Coin langsung ditransfer, tidak ada penundaan

### Events
- Semua aksi penting menghasilkan event
- Event bisa digunakan untuk tracking dan indexing
- Event bersifat immutable (tidak bisa diubah setelah dibuat)

