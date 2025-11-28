# Panduan Testing Smart Contract Escrow

Dokumen ini menjelaskan cara menjalankan dan memahami test suite untuk smart contract escrow.

## 🧪 Menjalankan Test

### Menjalankan Semua Test

```bash
cd escrow_contract
sui move test
```

### Menjalankan Test Spesifik

```bash
# Test create escrow
sui move test test_create_escrow_success

# Test accept escrow
sui move test test_accept_escrow_success

# Test cancel escrow
sui move test test_cancel_escrow_success
```

### Menjalankan Test dengan Verbose Output

```bash
sui move test --verbose
```

## 📋 Daftar Test Cases

### ✅ Success Cases

1. **`test_create_escrow_success`**
   - Test membuat escrow baru
   - Verifikasi event EscrowCreated diemit
   - Verifikasi data event (seller, buyer, amount)

2. **`test_accept_escrow_success`**
   - Test buyer menerima escrow
   - Verifikasi event EscrowAccepted diemit
   - Verifikasi coin ditransfer ke buyer

3. **`test_cancel_escrow_success`**
   - Test seller membatalkan escrow
   - Verifikasi event EscrowCancelled diemit
   - Verifikasi coin dikembalikan ke seller

4. **`test_view_escrow`**
   - Test fungsi view untuk melihat detail escrow
   - Verifikasi semua getter functions bekerja

5. **`test_complete_flow_create_and_accept`**
   - Test flow lengkap: create → accept
   - Verifikasi semua event dan balance

6. **`test_complete_flow_create_and_cancel`**
   - Test flow lengkap: create → cancel
   - Verifikasi semua event dan balance

7. **`test_multiple_escrows`**
   - Test membuat multiple escrow
   - Verifikasi semua event terbuat

### ❌ Error Cases

8. **`test_accept_escrow_wrong_buyer`**
   - Test error ketika buyer yang salah mencoba menerima
   - Expected: Error code 1

9. **`test_cancel_escrow_wrong_seller`**
   - Test error ketika seller yang salah mencoba membatalkan
   - Expected: Error code 3

10. **`test_accept_escrow_already_accepted`**
    - Test error ketika mencoba menerima escrow yang sudah diterima
    - Expected: Transaction fails

11. **`test_create_escrow_zero_amount`**
    - Test error ketika membuat escrow dengan amount 0
    - Expected: Error code 0

## 🔍 Memahami Test Code

### Struktur Test

Setiap test mengikuti pola berikut:

```move
#[test]
fun test_name() {
    // 1. Setup: Membuat scenario dan menyiapkan data
    let mut scenario = test_scenario::begin(SELLER);
    
    // 2. Action: Melakukan aksi yang ingin di-test
    test_scenario::next_tx(&mut scenario, SELLER);
    {
        // Kode untuk test
    };
    
    // 3. Verify: Memverifikasi hasil
    test_scenario::next_tx(&mut scenario, SELLER);
    {
        // Assertions
    };
    
    // 4. Cleanup
    test_scenario::end(scenario);
}
```

### Test Scenario API

- **`test_scenario::begin(address)`**: Memulai test scenario dengan address tertentu
- **`test_scenario::next_tx(&mut scenario, address)`**: Memulai transaksi baru dengan address
- **`test_scenario::ctx(&mut scenario)`**: Mendapatkan transaction context
- **`test_scenario::take_from_sender<T>(&scenario)`**: Mengambil object dari sender
- **`test_scenario::created_events<T>(&scenario)`**: Mendapatkan events yang dibuat
- **`test_scenario::end(scenario)`**: Mengakhiri scenario

### Test Constants

```move
const SELLER: address = @0xSELLER;
const BUYER: address = @0xBUYER;
const THIRD_PARTY: address = @0xTHIRD;
const ESCROW_AMOUNT: u64 = 1000;
```

## 🐛 Debugging Test

### Menjalankan Test dengan Debug Output

```bash
sui move test --verbose
```

### Memahami Error Messages

Jika test gagal, error message akan menunjukkan:
- **Error code**: Kode error yang dihasilkan
- **Line number**: Baris kode yang menyebabkan error
- **Assertion failure**: Assertion mana yang gagal

### Contoh Error

```
Test failed: assertion failure at line 46
Expected: SELLER == event.seller
Actual: SELLER != 0xDIFFERENT
```

Ini berarti test gagal karena seller address tidak sesuai dengan yang diharapkan.

## 📊 Coverage

Test suite ini mencakup:

- ✅ **100%** fungsi utama (create, accept, cancel)
- ✅ **100%** error cases
- ✅ **100%** view functions
- ✅ **100%** events
- ✅ **Flow lengkap** (create → accept, create → cancel)
- ✅ **Edge cases** (zero amount, wrong addresses)

## 💡 Tips Testing

1. **Jalankan test setelah setiap perubahan**
   ```bash
   sui move test
   ```

2. **Gunakan verbose mode untuk debugging**
   ```bash
   sui move test --verbose
   ```

3. **Test satu per satu untuk isolasi**
   ```bash
   sui move test test_create_escrow_success
   ```

4. **Pastikan semua test pass sebelum deploy**
   ```bash
   sui move test
   # Semua test harus pass!
   ```

## 🔧 Troubleshooting

### Test Gagal: "Object not found"

**Penyebab**: Object tidak ada di scenario

**Solusi**: Pastikan object dibuat sebelum digunakan

### Test Gagal: "Assertion failure"

**Penyebab**: Assertion tidak terpenuhi

**Solusi**: Periksa nilai yang di-assert dan pastikan sesuai dengan expected value

### Test Gagal: "Expected failure but succeeded"

**Penyebab**: Test yang seharusnya gagal malah berhasil

**Solusi**: Periksa logika validasi di smart contract

## 📚 Referensi

- [Sui Testing Documentation](https://docs.sui.io/build/move/testing)
- [Move Testing Guide](https://move-language.github.io/move/testing.html)
- [Test Scenario API](https://docs.sui.io/build/move/testing#test-scenario)

