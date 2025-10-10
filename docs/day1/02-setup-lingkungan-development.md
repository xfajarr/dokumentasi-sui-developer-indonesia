---
sidebar_position: 3
title: "Sesi 3: Setup Lingkungan Development Sui"
description: Panduan langkah demi langkah untuk menyiapkan lingkungan pengembangan Sui.
keywords: [sui, blockchain, move, smart contract, workshop, indonesia, web3, cryptocurrency, development]
---

<!-- import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Selamat datang di sesi praktik pertama! Di sesi ini, kita akan **"mengotori tangan"** dengan menyiapkan semua tools yang dibutuhkan untuk menjadi seorang **Sui Developer**.

Tujuan sesi ini adalah memastikan di akhir sesi, semua peserta sudah memiliki:
1. Sui **Command Line Interface (CLI)** yang terinstal.
2. Sebuah wallet Sui yang aktif di komputernya.
3. Saldo SUI dari Testnet Faucet untuk kita gunakan nanti.

Mari kita mulai! Ikuti instruksi sesuai dengan sistem operasi (OS) yang kamu gunakan.

## Langkah 1: Instalasi Prerequisites
Sebelum menginstal Sui, ada beberapa "bahan dasar" yang perlu kita siapkan terlebih dahulu.

<Tabs>
<TabItem value="windows" label="Windows">

Di Windows, kita perlu **C++ build tools** dan **Rust**. Cara termudah adalah menginstal keduanya melalui **rustup**.

Buka PowerShell sebagai Administrator. (Klik kanan Start Menu, pilih "PowerShell (Admin)").

Instal Rust & Build Tools: Salin dan jalankan perintah di bawah ini. rustup akan otomatis mendeteksi kamu butuh C++ build tools dan menawari untuk menginstalnya.

winget install --id Microsoft.VisualStudio.2022.BuildTools --override "--wait --quiet --add Microsoft.VisualStudio.Workload.VSCoreBuildTools --add Microsoft.VisualStudio.Component.VC.Tools.x86.x64 --add Microsoft.VisualStudio.Component.Windows11SDK.22621"
winget install --id Rustlang.Rustup

Tutup dan buka kembali terminal Anda untuk menerapkan perubahan.

</TabItem>
<TabItem value="macos" label="macOS">

Di macOS, kita perlu Xcode command line tools dan Rust.

Buka Terminal.

Instal Xcode Tools:

xcode-select --install

Instal Rust via rustup:

curl --proto '=https' --tlsv1.2 -sSf [https://sh.rustup.rs](https://sh.rustup.rs) | sh

Ikuti instruksi di layar (biasanya cukup tekan 1 untuk melanjutkan instalasi default).

Tutup dan buka kembali terminal Anda untuk menerapkan perubahan.

</TabItem>
<TabItem value="linux" label="Linux (Ubuntu/Debian)">

Di Linux, kita perlu build-essential dan curl sebelum menginstal Rust.

Buka Terminal.

Update package manager dan instal dependencies:

sudo apt-get update && \
sudo apt-get install -y --no-install-recommends \
build-essential \
curl \
git

Instal Rust via rustup:

curl --proto '=https' --tlsv1.2 -sSf [https://sh.rustup.rs](https://sh.rustup.rs) | sh

Ikuti instruksi di layar (biasanya cukup tekan 1 untuk melanjutkan instalasi default).

Restart terminal Anda atau jalankan source "$HOME/.cargo/env" untuk menerapkan perubahan.

</TabItem>
</Tabs>

Penting: Proses instalasi Rust dan build tools mungkin memakan waktu beberapa menit. Sabar ya!

Langkah 2: Instalasi Sui CLI
Sekarang "bahan dasar" sudah siap, kita bisa langsung memasak dan menginstal Sui. Cara yang paling direkomendasikan adalah menggunakan cargo, package manager dari Rust.

Buka terminal baru (pastikan yang lama sudah ditutup setelah instalasi Rust).

Jalankan perintah instalasi Sui:

cargo install --locked --git [https://github.com/MystenLabs/sui.git](https://github.com/MystenLabs/sui.git) --branch main sui

Catatan: Perintah ini akan mengunduh source code Sui terbaru dari GitHub dan meng-compile-nya di komputermu. Proses ini akan memakan waktu cukup lama (bisa 10-30 menit tergantung kecepatan internet dan komputermu) dan akan menggunakan cukup banyak CPU. Ini normal, biarkan saja berjalan sampai selesai.

Langkah 3: Verifikasi Instalasi
Setelah proses cargo install selesai tanpa error, saatnya memastikan Sui CLI sudah terpasang dengan benar.

Tutup dan buka kembali terminalmu untuk memastikan path cargo sudah ter-update.

Cek versi Sui:

sui --version

Jika instalasi berhasil, kamu akan melihat output seperti ini (angka versinya bisa berbeda):

sui 1.15.0-6a75116

Jika kamu mendapatkan error command not found, kemungkinan ada masalah dengan PATH cargo. Coba restart komputermu terlebih dahulu.

Langkah 4: Setup Wallet & Klien Sui
Sekarang Sui CLI sudah ada, kita perlu membuat "identitas" kita di jaringan Sui. Ini termasuk membuat wallet, alamat, dan terhubung ke jaringan Sui.

Jalankan perintah setup klien Sui:

sui client

Kamu akan ditanya beberapa hal:

Sui directory ... not found. Create now? [y/N] -> Ketik y dan Enter.

Select key scheme ... -> Tekan Enter untuk memilih default (ed25519).

Please enter a new password for the keystore ... -> Masukkan password yang aman (dan JANGAN LUPA), lalu ulangi lagi.

Which network do you want to connect to? ... -> Tekan Enter untuk memilih default (sui-devnet).

Setelah selesai, kamu akan melihat output yang berisi Recovery Phrase (12 kata mnemonic).

SANGAT PENTING! Salin 12 kata ini dan simpan di tempat yang sangat aman (misalnya di password manager). Siapapun yang memiliki kata-kata ini bisa mengontrol wallet-mu. Di workshop ini tidak apa-apa, tapi untuk wallet sungguhan, jangan pernah bagikan ke siapapun!

Langkah 5: Meminta Test SUI dari Faucet
Untuk bisa melakukan transaksi di devnet, kita butuh "bensin" yaitu token SUI. Untungnya, kita bisa memintanya secara gratis dari Faucet.

Cek alamat wallet-mu:

sui client active-address

Kamu akan melihat alamatmu, contoh: 0x123abc...

Minta SUI dari faucet menggunakan CLI:

sui client faucet

Jika berhasil, kamu akan mendapatkan pesan Request successful.

Info: Faucet Devnet bisa diakses juga melalui web di Discord resmi Sui. Tapi untuk sekarang, cara CLI ini paling cepat.

Langkah 6: Cek Saldo Wallet
Terakhir, mari kita pastikan SUI dari faucet sudah masuk ke wallet kita.

Jalankan perintah untuk melihat objek gas di walletmu:

sui client gas

Jika semua berjalan lancar, kamu akan melihat daftar objek Gas Coin dengan saldonya masing-masing. Ini artinya wallet-mu sudah siap dan punya saldo untuk kita gunakan di sesi-sesi berikutnya.

Selamat! Kamu sudah berhasil menjadi seorang Sui node operator (secara teknis) dan siap untuk mulai membangun di atas Sui. Jika kamu mengalami kendala di salah satu langkah, jangan ragu untuk bertanya kepada mentor! -->