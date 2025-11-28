---
sidebar_position: 2
title: "Setup Wallet & Mendapatkan SUI dari Faucet"
description: Panduan lengkap untuk membuat wallet Sui, mengelola address, dan mendapatkan token SUI dari faucet.
keywords: [sui, wallet, address, faucet, keystore, recovery phrase, indonesia]
---

Setelah Sui CLI terinstal dan dikonfigurasi, langkah selanjutnya adalah membuat wallet dan mendapatkan token SUI untuk melakukan transaksi. Di sini, Kamu akan belajar cara membuat address Sui, mengelola wallet, dan mendapatkan token SUI dari faucet.

## Apa itu Address Sui?

Address adalah identitas unik dan anonim di jaringan blockchain. Di Sui, address secara khusus mewakili lokasi on-chain yang dapat:

- Menyimpan dan mengirim token
- Memiliki objek seperti NFT dan Move packages
- Mengirim transaksi dan berinteraksi dengan smart contract

Kamu tidak perlu memberikan informasi identitas pribadi untuk membuat address. Satu individu bisa membuat dan memiliki banyak address.

Setiap address Sui adalah identifier unik 32-byte dan muncul dalam encoding hexadecimal dengan prefix `0x`, kecuali jika dirujuk dengan alias. Contoh:

```
0x02a212de6a9dfa3a69e22387acfbafbb1a9e591bd9d636e7895dcfc8de05f331
```

Address dihasilkan dari fungsi hash kriptografi yang membuat public key. Setiap public key memiliki private key yang sesuai untuk mengakses address dan objek yang dimilikinya. Address dan key pair-nya bersama-sama disebut sebagai **account**.

## Membuat Address Sui

:::warning
Jika Kamu sudah memiliki address atau sudah membuat address baru saat [Mengkonfigurasi Sui Client](setup-lingkungan-development#konfigurasi-sui-client), Kamu bisa langsung skip ke bagian [Mendapatkan SUI dari Faucet](#mendapatkan-sui-dari-faucet) untuk melanjutkan.
:::

### Prerequisites (Persyaratan)

- Sui sudah terinstal
- Sui client sudah dikonfigurasi

Secara default, ketika Sui client dijalankan untuk pertama kali, sistem akan meminta Kamu untuk mengkonfigurasi client. Konfigurasi awal ini akan menghasilkan address Sui baru, key pair-nya, dan recovery phrase yang terkait.

### Membuat Address Baru

Untuk membuat address Sui baru di luar konfigurasi awal client, jalankan:

```bash
sui client new-address ed25519
```

Perintah ini menentukan skema key pair yang akan digunakan, dalam hal ini `ed25519`.

Pilihan skema key yang tersedia:

- **`ed25519`**: Ukuran key kecil dan signature yang kompak. Direkomendasikan untuk pemula.
- **`secp256k1`**: Menyediakan keamanan melalui pembuatan dan verifikasi key menggunakan ECDSA.
- **`secp256r1`**: Menggunakan kurva yang dihasilkan secara acak untuk menghasilkan key.

Client akan mengembalikan address baru Kamu dan recovery phrase 12 kata:

```
Generated new key pair for address with scheme "ed25519" [0xb9c83a8b40d3263c9ba40d551514fbac1f8c12e98a4005a0dac072d3549c2442]

Secret Recovery Phrase : [cap wheat many line human lazy few solid bored proud speed grocery]
```

## Recovery Phrase (Frase Pemulihan)

Setiap address Sui memiliki recovery phrase. Recovery phrase adalah serangkaian 12 kata yang dihasilkan secara acak yang Kamu gunakan untuk memulihkan address jika Kamu kehilangan akses ke key pair address tersebut.

:::danger PENTING!
Recovery phrase hanya ditampilkan **sekali**. Mereka tidak disimpan di mana pun secara otomatis dan **tidak bisa diambil kembali** jika Kamu tidak menyimpannya sendiri.

Simpan recovery phrase dengan aman dan **jangan bagikan ke siapapun**, karena mereka memberikan akses ke semua objek dan token yang dimiliki oleh address tersebut.
:::

### Memulihkan Address dengan Recovery Phrase (Import Address)

Untuk memulihkan address menggunakan recovery phrase, gunakan perintah:

```bash
sui keytool import '<RECOVERY_PHRASE>' <KEY_SCHEME>
```

Ganti `'<RECOVERY_PHRASE>'` dengan recovery phrase 12 kata Kamu. Seluruh recovery phrase harus diapit dengan tanda kutip `'` atau `"`. Kamu harus memasukkan kata-kata dalam urutan yang benar.

Ganti `<KEY_SCHEME>` dengan jenis enkripsi yang digunakan untuk membuat address, seperti `ed25519`.

Jika berhasil, CLI akan memulihkan address Kamu dan mencetaknya di output CLI.

## File sui.keystore

Sui menyimpan private key untuk setiap address di file `~/.sui/sui_config/sui.keystore` (macOS/Linux) atau `%USERPROFILE/.sui/sui_config/sui.keystore` (Windows).

File ini berisi konten yang mirip dengan berikut:

```json
[
  "AK6q1/Yzz5qmTfHGLot4wkbRP5lP5NUQVDlf3FggLrKZ",
  "ADAWAFS+J9KcDjFmAiVI/e9ZluG0id9AnI6a7Bk5tH+G",
  "AJ42rQfCrPIfrQvzCgeHVDCcQZ4R1qAzKtob61VTw5k5",
  "AHoKrY7DDnUOq2RgP7gXLPa86bFfzqEMvmOs7TmHtST+"
]
```

Ketika Kamu membuat address baru di sistem Kamu, baris baru ditambahkan ke file ini yang terdiri dari private key address tersebut. Pastikan Kamu **tidak membagikan** ini ke siapapun, karena mereka bisa menggunakannya untuk mendapatkan akses ke account Kamu.

:::danger
File `sui.keystore` **tidak sama** dengan keystore lokal mesin Kamu yang berisi password untuk website, data biometrik seperti sidik jari, atau kredensial autentikasi lainnya. Keystore lokal mesin Kamu tidak bisa menandatangani dan mengirim transaksi di Sui. Hanya address dengan key terkait yang termasuk dalam file `sui.keystore` yang bisa menandatangani dan mengirim transaksi.
:::

## Address Aliases (Alias Address)

Alias adalah nama yang mudah dibaca manusia yang bisa digunakan sebagai pengganti string hexadecimal 32-byte lengkap dari address Sui. Mereka bisa digunakan di mana pun address akan digunakan untuk memudahkan referensi address dalam script dan perintah CLI.

Ketika address dibuat, address tersebut diberi alias acak secara default. Kamu bisa melihat alias address saat ini dengan perintah:

```bash
sui client addresses
```

Output akan mencakup address, alias-nya, dan indikasi address mana yang aktif jika ada beberapa address lokal yang tersedia:

```
╭───────────────────────┬────────────────────────────────────────────────────────────────────┬────────────────╮
│ alias                 │ address                                                            │ active address │
├───────────────────────┼────────────────────────────────────────────────────────────────────┼────────────────┤
│ vigorous-spinel       │ 0x6ebb36a3c1ab2124c082d93f60f518f70494b82d8d13c5aabb3abad6ec8cd82d │ *              │
╰───────────────────────┴────────────────────────────────────────────────────────────────────┴────────────────╯
```

Kemudian, untuk memperbarui alias ke sesuatu yang lain, gunakan perintah:

```bash
sui keytool update-alias <OLD-ALIAS> <NEW-ALIAS>
```

Sekarang Kamu bisa menggunakan alias sebagai pengganti address dalam perintah, seperti:

```bash
sui client objects <NEW-ALIAS>
```

## Melihat Semua Address Lokal

Address aktif adalah address yang sedang digunakan oleh Sui client saat ini. Address ini memiliki semua objek yang Kamu buat dan transaksi yang Kamu kirim, kecuali Kamu menentukan sebaliknya dengan flag `--address` dalam perintah.

### Melihat Address Aktif

Untuk melihat address aktif saat ini, gunakan perintah:

```bash
sui client active-address
```

### Melihat Semua Address

Untuk melihat semua address di mesin lokal Kamu, jalankan:

```bash
sui keytool list
```

Ini akan mengembalikan semua address, beserta alias, public key, skema key, dan peer ID mereka:

```
╭────────────────────────────────────────────────────────────────────────────────────────────╮
│ ╭─────────────────┬──────────────────────────────────────────────────────────────────────╮ │
│ │ alias           │  vigorous-spinel                                                     │ │
│ │ suiAddress      │  0x6ebb36a3c1ab2124c082d93f60f518f70494b82d8d13c5aabb3abad6ec8cd82d  │ │
│ │ publicBase64Key │  AKDCajKN877Uc7o8NP2cQVJkSewhq1ZbWgw5LgpWVqbj                        │ │
│ │ keyScheme       │  ed25519                                                             │ │
│ │ flag            │  0                                                                   │ │
│ │ peerId          │  a0c26a328df3bed473ba3c34fd9c41526449ec21ab565b5a0c392e0a5656a6e3    │ │
│ ╰─────────────────┴──────────────────────────────────────────────────────────────────────╯ │
╰────────────────────────────────────────────────────────────────────────────────────────────╯
```

### Mengganti Address Aktif

Jika Kamu ingin beralih ke address lain, pertama konfirmasi address mana yang aktif dan address mana yang tersedia untuk Kamu gunakan:

```bash
sui client addresses
```

Kemudian, untuk beralih ke address lain, gunakan perintah:

```bash
sui client switch --address <ADDRESS>
```

Atau menggunakan alias:

```bash
sui client switch --address <ALIAS>
```

## Query Informasi tentang Address

Kamu bisa menggunakan Sui network explorer untuk menemukan informasi lebih lanjut tentang address, saldo token-nya, dan objek yang dimilikinya. Explorer Sui populer termasuk:

- **[SuiVision](https://suivision.xyz/)**
- **[SuiScan](https://suiscan.xyz/)**

:::danger
Data yang ditampilkan di explorer berbeda tergantung pada jaringan mana Kamu membuat address. Jika Kamu sudah mengikuti halaman [Konfigurasi Sui Client](setup-lingkungan-development#konfigurasi-sui-client) sebelumnya, kemungkinan besar Kamu menggunakan Testnet. Pastikan untuk memilih Testnet di Sui explorer atau gunakan URL khusus, seperti https://testnet.suivision.xyz/.
:::

Dari CLI, Kamu bisa melihat semua objek yang dimiliki oleh address dengan perintah:

```bash
sui client objects <ADDRESS>
```

Jika address tidak diberikan, perintah ini akan mengembalikan semua objek yang dimiliki oleh address aktif.

## Mendapatkan SUI dari Faucet

Untuk bisa melakukan transaksi di Testnet atau Devnet, Kamu membutuhkan token SUI. Untungnya, Kamu bisa mendapatkan token SUI secara gratis dari faucet.

### Metode 1: Menggunakan Sui CLI (Paling Mudah)

Cara termudah untuk mendapatkan SUI dari faucet adalah menggunakan perintah CLI:

```bash
sui client faucet
```

Perintah ini akan otomatis meminta token SUI untuk address aktif Kamu dari faucet Testnet.

Jika berhasil, Kamu akan melihat output seperti:

```
Request successful. You can view your coins at:
https://testnet.suivision.xyz/address/0x...
```

### Metode 2: Menggunakan Discord Faucet

Jika perintah CLI tidak bekerja, Kamu bisa menggunakan Discord faucet:

1. **Bergabung dengan Discord Sui**: [https://discord.gg/sui](https://discord.gg/sui)

2. **Cari channel faucet**: Pergi ke channel `#testnet-faucet` atau `#devnet-faucet`

3. **Minta token**: Ketik perintah berikut di channel:
   ```
   !faucet <ADDRESS_KAMU>
   ```
   Ganti `<ADDRESS_KAMU>` dengan address Sui Kamu.

4. **Tunggu**: Bot akan memproses permintaan dan mengirim token SUI ke address Kamu.

### Verifikasi Saldo

Setelah meminta token dari faucet, verifikasi bahwa token sudah masuk:

```bash
# Lihat saldo gas (SUI) Kamu
sui client gas
```

Output akan menampilkan daftar coin objects dengan saldo masing-masing:

```
╭────────────────────────────────────────────────────────────────────┬────────────╮
│ Gas Coin ID                                                        │ Amount     │
├────────────────────────────────────────────────────────────────────┼────────────┤
│ 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef │ 1000000000 │
╰────────────────────────────────────────────────────────────────────┴────────────╯
```

### Catatan Penting tentang Faucet

- **Testnet Faucet**: Memberikan token untuk Testnet. Token ini tidak memiliki nilai riil.
- **Devnet Faucet**: Memberikan token untuk Devnet. Data di Devnet dihapus secara berkala.
- **Rate Limiting**: Faucet memiliki batasan berapa kali Kamu bisa meminta token dalam periode tertentu.
- **Jumlah Default**: Biasanya faucet memberikan 1 SUI (1,000,000,000 MIST) per permintaan.

## Langkah Selanjutnya

Setelah Kamu memiliki wallet dan token SUI, Kamu siap untuk:

1. **Membuat Smart Contract**: Mulai membangun smart contract Move pertama Kamu
2. **Deploy Package**: Deploy smart contract ke Testnet
3. **Berinteraksi dengan Smart Contract**: Memanggil fungsi dari smart contract yang sudah di-deploy
4. **Membangun dApp**: Membuat aplikasi terdesentralisasi di atas Sui

## Troubleshooting

### Masalah: "Address not found"

**Solusi**: Pastikan Kamu sudah membuat address dengan `sui client new-address` atau sudah mengkonfigurasi client.

### Masalah: "Insufficient gas"

**Solusi**: Pastikan Kamu sudah mendapatkan SUI dari faucet dan memiliki saldo yang cukup.

### Masalah: "Faucet request failed"

**Solusi**: 
- Coba lagi setelah beberapa saat (mungkin ada rate limiting)
- Gunakan Discord faucet sebagai alternatif
- Pastikan Kamu menggunakan Testnet atau Devnet, bukan Mainnet

### Masalah: "Recovery phrase tidak bekerja"

**Solusi**:
- Pastikan Kamu memasukkan semua 12 kata dalam urutan yang benar
- Pastikan Kamu menggunakan skema key yang sama (ed25519, secp256k1, atau secp256r1)
- Pastikan tidak ada typo dalam recovery phrase

## Referensi

- [Sui Address Documentation](https://docs.sui.io/concepts/cryptography/sui-addresses)
- [Sui Keytool CLI](https://docs.sui.io/references/cli/keytool)
- [Sui Faucet](https://docs.sui.io/guides/developer/getting-started/get-coins)
- [SuiVision Explorer](https://suivision.xyz/)
- [SuiScan Explorer](https://suiscan.xyz/)

