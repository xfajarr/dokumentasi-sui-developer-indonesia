---
sidebar_position: 1
title: "Setup Environment Development Sui"
description: Panduan langkah demi langkah untuk menyiapkan lingkungan pengembangan Sui.
keywords: [sui, blockchain, move, smart contract, workshop, indonesia, web3, cryptocurrency, development]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


## Instalasi Sui

### Prerequisites (Persyaratan)

- Memiliki device dengan salah satu sistem operasi yang didukung berikut:
  - **Linux**: Ubuntu versi 22.04 (Jammy Jellyfish) atau lebih baru
  - **macOS**: macOS Monterey atau lebih baru
  - **Microsoft Windows**: Windows 10 atau 11

## Instalasi Cepat

Sui CLI digunakan untuk berinteraksi dengan jaringan Sui, deploy packages, dan mengelola aset. Untuk menginstal Sui CLI, Kamu bisa menggunakan [`suiup`](https://github.com/MystenLabs/suiup).

[`suiup`](https://github.com/MystenLabs/suiup) adalah metode instalasi yang paling efektif, karena memungkinkan Kamu untuk dengan mudah menginstal dan beralih antar berbagai versi tidak hanya Sui CLI tetapi juga komponen Sui stack lainnya seperti [`walrus`](https://docs.wal.app/usage/setup.html) dan [`mvr`](https://github.com/MystenLabs/mvr).

Instruksi instalasi cepat alternatif untuk [Homebrew](https://brew.sh/) atau [Chocolatey](https://chocolatey.org/) tidak mendukung instalasi komponen Sui stack lainnya. Komponen lain perlu diinstal melalui binary individual mereka jika Kamu ingin menggunakannya di masa depan.

:::warning
Instalasi menggunakan **Homebrew** atau **Chocolatey** mungkin memakan waktu beberapa menit jika Kamu belum memiliki [prerequisites Sui](https://docs.sui.io/guides/developer/getting-started/install-source) yang terinstal. Menggunakan `suiup` seringkali jauh lebih cepat dan sangat direkomendasikan.
:::

<Tabs>
<TabItem value="suiup" label="suiup (Direkomendasikan)">

Pertama, install `suiup`:

```bash
$ curl -sSfL \
  https://raw.githubusercontent.com/Mystenlabs/suiup/main/install.sh \
  | sh
```

Kemudian, install Sui:

```bash
$ suiup install sui@testnet
```

Untuk metode instalasi alternatif, lihat [repository `suiup`](https://github.com/MystenLabs/suiup).

:::danger
Menginstal Sui dengan `suiup` tidak mengkonfigurasi client. 
Untuk menggunakan perintah `sui`, Kamu harus [mengkonfigurasi Sui client](#konfigurasi-sui-client).
:::

Untuk memastikan Sui terinstal dengan benar:

1. Buka terminal atau console
2. Ketik `sui --version` dan tekan Enter

Jika Kamu menerima error "command not found", verifikasi direktori binary Sui ada di environment variable `PATH` Kamu.

</TabItem>
<TabItem value="homebrew" label="Homebrew (macOS)">

Kamu harus memiliki [Homebrew](https://brew.sh/) terinstal sebelum menjalankan perintah berikut:

```bash
$ brew install sui
```

Untuk memastikan Sui terinstal dengan benar:

1. Buka terminal atau console
2. Ketik `sui --version` dan tekan Enter

Jika Kamu menerima error "command not found", verifikasi direktori binary Sui ada di environment variable `PATH` Kamu.

</TabItem>
<TabItem value="chocolatey" label="Chocolatey (Windows)">

Kamu harus memiliki [Chocolatey](https://chocolatey.org/) terinstal sebelum menjalankan perintah berikut:

```bash
$ choco install sui
```

Temukan lebih banyak [versi Sui untuk Windows](https://community.chocolatey.org/packages/sui) di website komunitas Chocolatey.

Untuk memastikan Sui terinstal dengan benar:

1. Buka terminal atau console
2. Ketik `sui --version` dan tekan Enter

Jika Kamu menerima error "command not found", verifikasi direktori binary Sui ada di environment variable `PATH` Kamu.

</TabItem>
</Tabs>

Jika Sui sudah terinstal dari environment development sebelumnya, pastikan untuk upgrade ke [versi terbaru](https://docs.sui.io/guides/developer/getting-started/install-binaries).

## Detail Instalasi

Terlepas dari menggunakan `suiup`, Homebrew, atau Chocolatey, instalasi Sui Kamu akan mencakup paket-paket berikut:

| Nama | Deskripsi |
|------|-----------|
| `move-analyzer` | Implementasi Language Server Protocol. |
| `sui` | Binary utama Sui. |
| `sui-bridge` | Bridge native Sui. |
| `sui-data-ingestion` | Menangkap data full node untuk indexer untuk disimpan di database. |
| `sui-faucet` | Faucet lokal untuk mint koin di jaringan lokal. |
| `sui-graphql-rpc` | Layanan GraphQL untuk Sui RPC. |
| `sui-node` | Menjalankan node lokal. |
| `sui-test-validator` | Menjalankan test validator di jaringan lokal untuk development. |
| `sui-tool` | Menyediakan utilitas untuk Sui. |

### Detail instalasi `suiup`

`suiup` menyalin binary ke `$HOME/.local/bin` secara default di sistem macOS dan Linux, kecuali environment variable `SUIUP_DEFAULT_BIN_DIR` sudah disetel. Instalasi macOS dan Linux juga mencakup environment variables untuk `XDG_DATA_HOME`, `XDG_CACHE_HOME`, dan `XDG_CONFIG_HOME`.

Di Windows, `suiup` menyalin binary ke `LOCALAPPDATA\bin`, dan akan menggunakan `LOCALAPPDATA` atau `USERPROFILE\AppData\Local` untuk menyimpan data dan `TEMP` atau `USERPROFILE\AppData\Local\Temp` untuk caching.

### File konfigurasi default

Terlepas dari apakah Kamu menggunakan `suiup`, Homebrew, atau Chocolatey, Sui akan menyimpan konfigurasi utama di file `~/.sui/sui_config/client.yaml`. File ini mendefinisikan pengaturan dan preferensi untuk environment Kamu, seperti:

- Detail environment jaringan untuk jaringan Mainnet, Testnet, Devnet, dan Localnet.
- Environment aktif, yang menentukan jaringan yang akan menjadi target perintah CLI.
- Alamat aktif, yang menentukan alamat Sui yang akan digunakan CLI untuk transaksi dan query.
- Lokasi keystore, yang menentukan di mana Sui menyimpan private key alamat Kamu.

Untuk dokumentasi lengkap tentang instalasi Sui, kunjungi: [https://docs.sui.io/guides/developer/getting-started/sui-install](https://docs.sui.io/guides/developer/getting-started/sui-install)

---

## Konfigurasi Sui Client

Konfigurasi Sui client menentukan jaringan mana yang akan digunakan dan alamat mana yang akan digunakan untuk mengirim transaksi.

### Prerequisites (Persyaratan)

Pertama, pastikan Sui sudah terinstal dengan benar:

```bash
sui --version
```

Jika perintah ini mengembalikan `sui not found`, berarti Sui belum terinstal dan Kamu harus mengikuti instruksi instalasi terlebih dahulu.

### Menjalankan Konfigurasi Client

Jalankan Sui CLI dengan perintah:

```bash
sui client
```

:::info
Jika Sui client sudah dikonfigurasi sebelumnya, menjalankan perintah ini akan mengembalikan output `sui client --help` daripada prompt interaktif. Jika ini terjadi, Kamu bisa langsung skip ke bagian tentang file `client.yaml`.
:::

### Proses Konfigurasi

**Prompt pertama** menanyakan apakah Kamu ingin membuat file `client.yaml`, pilih **Y**:

```
Config file ["<PATH-TO-FILE>/client.yaml"] doesn't exist, do you want to connect to a Sui full node server [y/N]?
```

**Prompt kedua** mengkonfigurasi URL server jaringan yang akan digunakan:

```
Sui full node server URL (Defaults to Sui Testnet if not specified) :
```

Jika Kamu tidak memasukkan apa-apa (langsung tekan Enter), client akan menggunakan **Testnet** secara default. Menggunakan Testnet direkomendasikan untuk developer baru di Sui yang belum memiliki project yang sudah dikembangkan.

Pilihan jaringan yang tersedia:

- **`https://fullnode.testnet.sui.io:443`**: URL RPC untuk Testnet. Direkomendasikan untuk pemula.
- **`https://fullnode.devnet.sui.io:443`**: URL RPC untuk Devnet. Devnet tidak direkomendasikan untuk developer baru Sui, karena lebih cocok untuk use case yang lebih advanced dan jaringan ini menghapus data setiap minggu sebagai bagian dari proses update.
- **`https://fullnode.mainnet.sui.io:443`**: URL RPC untuk jaringan Mainnet. Mempublish aplikasi ke Mainnet memerlukan token SUI yang asli (berbayar).
- **`http://0.0.0.0:9000`**: URL RPC untuk jaringan Localnet, jika sudah dikonfigurasi. Pelajari cara setup jaringan lokal.

:::info
Persistence data Testnet dan Devnet tidak dijamin.

- Data Devnet dihapus secara teratur sebagai bagian dari update software mingguan yang terjadwal.
- Data Testnet bertahan melalui proses update reguler, tapi mungkin dihapus sesekali. Penghapusan data Testnet akan diumumkan sebelumnya.

Untuk informasi lebih lanjut tentang jadwal release jaringan Sui, lihat [Sui Network Release](https://docs.sui.io/guides/developer/getting-started/install-source).
:::

**Prompt ketiga** adalah untuk memilih skema enkripsi. Kamu harus memilih skema key dengan menekan **0**, **1**, atau **2**. Setelah Kamu memilih skema, client akan menghasilkan alamat Sui baru.

```
Select key scheme to generate key pair (0 for ed25519, 1 for secp256k1, 2 for secp256r1):
```

Pilihan yang tersedia:

- **ed25519** (tekan **0**): Ukuran key kecil dan signature yang kompak. Direkomendasikan untuk pemula.
- **secp256k1** (tekan **1**): Menyediakan keamanan melalui pembuatan dan verifikasi key menggunakan ECDSA.
- **secp256r1** (tekan **2**): Menggunakan kurva yang dihasilkan secara acak untuk menghasilkan key.

Client akan mengembalikan alamat baru Kamu dan recovery phrase 12 kata:

```
Generated new key pair for address with scheme "ed25519" [0xb9c83a8b40d3263c9ba40d551514fbac1f8c12e98a4005a0dac072d3549c2442]

Secret Recovery Phrase : [cap wheat many line human lazy few solid bored proud speed grocery]
```

:::danger PENTING!
Simpan recovery phrase dengan aman dan jangan bagikan ke siapapun, karena mereka memberikan akses ke semua objek dan token yang dimiliki oleh alamat tersebut.

Recovery phrase tidak akan terlihat lagi setelah history CLI menghilang.

Pelajari lebih lanjut tentang [alamat Sui, pembuatan key, dan recovery phrase](https://docs.sui.io/guides/developer/getting-started/create-address).
:::

### File client.yaml

Sui client Kamu sekarang sudah dikonfigurasi. Secara default, Sui menyimpan informasi ini di file `~/.sui/sui_config/client.yaml` (macOS/Linux) atau `%USERPROFILE%\.sui\sui_config\client.yaml` (Windows). Kamu bisa menyimpan file `client.yaml` di lokasi yang berbeda jika diinginkan, dan menentukan lokasinya dengan flag `--client.config`.

Sui menyimpan key untuk alamat Sui di file terpisah, `~/.sui/sui_config/sui.keystore` (macOS/Linux) atau `%USERPROFILE/.sui/sui_config/sui.keystore` (Windows). Pelajari lebih lanjut tentang alamat Sui di [Create a Sui Address](https://docs.sui.io/guides/developer/getting-started/create-address).

:::warning
Jika instalasi Sui sebelumnya sudah menyimpan file `client.yaml` secara lokal, Kamu akan menerima output `sui client --help` di console. Kamu bisa menghapus file `~/.sui/sui_config/client.yaml` yang sudah ada jika ingin memulai dari awal, atau bisa melanjutkan menggunakan konfigurasi yang sudah ada.
:::

File `client.yaml` berisi informasi konfigurasi berikut:

```yaml
keystore:
  File: /Users/your_user/.sui/sui_config/sui.keystore
external_keys: ~
envs:
  - alias: testnet
    rpc: "https://fullnode.testnet.sui.io:443"
    ws: ~
    basic_auth: ~
active_env: testnet
active_address: "0x7df01d3935b7ab3cd1da6828eed763ee2cc556670528a47baa6af8c251866e48"
```

File ini berisi:
- **keystore**: Lokasi file yang menyimpan key alamat Kamu
- **envs**: Daftar environment jaringan yang dikonfigurasi (testnet, devnet, mainnet, dll)
- **active_env**: Environment yang sedang aktif (jaringan yang akan digunakan)
- **active_address**: Alamat Sui yang sedang aktif (alamat yang akan digunakan untuk transaksi)

---

## Langkah Selanjutnya

Setelah Sui CLI terinstal dan dikonfigurasi, langkah selanjutnya adalah:

1. **[Setup Wallet & Mendapatkan SUI dari Faucet](/docs/setup/02-setup-wallet-dan-faucet)**: Membuat wallet dan mendapatkan token SUI untuk transaksi
2. **Membuat Smart Contract**: Mulai membangun smart contract Move pertama Kamu
3. **Deploy Package**: Deploy smart contract ke Testnet

Selamat! Kamu sudah berhasil menginstal dan mengkonfigurasi Sui CLI. Jika Kamu mengalami kendala di salah satu langkah, jangan ragu untuk bertanya kepada mentor!

