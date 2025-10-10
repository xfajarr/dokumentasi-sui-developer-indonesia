---
sidebar_position: 1
title: "Sesi 1: Pengenalan Blockchain & Smart Contract"
description: Workshop komprehensif untuk menguasai Sui blockchain development.
keywords: [sui, blockchain, move, smart contract, workshop, indonesia, web3, cryptocurrency, development]
---

Dokumen ini adalah materi pengantar untuk kamu yang baru pertama kali terjun ke dunia teknologi blockchain. Tenang aja, kita akan membahasnya selangkah demi selangkah dengan analogi sederhana.

## Bagian 1: Apa Sebenarnya "Blockchain" Itu?

### Masalah yang Ingin Diselesaikan
Bayangkan kamu dan teman-temanmu sedang mencatat utang-piutang. Biasanya, kalian akan menunjuk satu orang (misalnya, si **A**) untuk memegang buku kas. Semua transaksi dicatat di buku itu.

**Kelemahannya:**

- **Tidak Praktis**: Kalau si **A** sakit atau sibuk, pencatatan jadi terhambat.
- **Rawan Curang**: Si **A** bisa saja diam-diam mengubah catatan untuk keuntungannya sendiri.
- **Risiko Hilang**: Bagaimana jika buku kas itu hilang atau rusak? Semua data lenyap.

Masalah utamanya adalah ketergantungan pada satu pihak terpusat; teknologi blockchain hadir untuk mengatasi masalah ini.

### Solusi Blockchain: "Buku Kas Ajaib" yang Terdistribusi
Sekarang, bayangkan solusinya seperti ini: daripada satu buku kas, setiap orang di grup memegang **salinan buku kas yang identik dan sama persis**.

Setiap kali ada transaksi baru (misal: "Bob bayar utang ke Alice Rp 50.000"), transaksi itu akan diumumkan ke semua orang. Semua orang akan mencatat transaksi yang sama di buku mereka masing-masing.

Catatan-catatan ini dikumpulkan dalam sebuah **"Blok"**. Ketika blok sudah penuh, blok itu akan "disegel" dengan segel digital super kuat **(kriptografi)** dan dihubungkan ke blok sebelumnya, membentuk sebuah **"Rantai Blok"** atau **Blockchain**.

![Blockchain Structure](/img/blockchain.png)

### Inilah kekuatan utamanya:

- **Desentralisasi**: Tidak ada satu "bos" yang mengontrol buku kas. Kekuatan tersebar ke semua anggota jaringan.
- **Transparansi**: Semua orang bisa melihat seluruh riwayat transaksi. Tidak ada yang bisa disembunyikan.
- **Keamanan (Immutability)**: Karena setiap blok terhubung dan disegel, sangat mustahil bagi seseorang untuk mengubah data di blok lama tanpa ketahuan oleh seluruh jaringan. Mengubah satu catatan berarti harus mengubah seluruh rantai, yang secara komputasi hampir tidak mungkin dilakukan.


> **Analogi Sederhana**: Bayangkan buku kas bersama yang disalin ke banyak orang. Setiap catatan disegel secara digital. Jika seseorang mengubah catatan lama, segelnya pecah dan seluruh jaringan langsung tahu ada yang salah dan perubahan itu ditolak.

![Blockchain Illustration](/img/connection-blockchain.png)

## Bagian 2: Evolusi Internet - Selamat Datang di Web3
Untuk memahami kenapa blockchain begitu penting, kita perlu melihat evolusi internet.

### Web1 (Sekitar 1990-2004): Read-Only

Ini adalah era internet awal. Situs web itu seperti brosur digital. Kita hanya bisa membaca informasi (statis). Interaksi sangat minim. Contoh: Situs berita awal, halaman profil personal.

![Web1 — Read-Only](/img/web1.png)

### Web2 (Sekitar 2004 - Sekarang): Read-Write (The Social Web)

Era di mana kita bisa berinteraksi, membuat konten, dan berkolaborasi. Kita bisa upload foto, menulis status, dan berkomentar. Inilah internet yang kita kenal sekarang: **media sosial, blog, e-commerce**.

![Web2 — Read-Write](/img/web2.png)

**Masalahnya**: Semua data dan konten kita dikontrol oleh perusahaan besar (Google, Meta, Amazon). Mereka punya kuasa penuh atas akun dan data kita. Kita hanya "menyewa" tempat di platform mereka. Jika mereka memutuskan untuk menutup akun kita, kita kehilangan semuanya.

### Web3 (Masa Depan): Read-Write-Own (The Ownership Web)

Inilah era baru yang didukung oleh teknologi blockchain. Web3 memberikan kembali **kepemilikan dan kontrol data kepada pengguna**.

Di Web3, identitas digital, aset (seperti item game, karya seni), dan data kita tidak lagi terikat pada satu platform, melainkan menjadi milik kita seutuhnya dalam bentuk **"objek"** atau **"token"** di blockchain. Kamu bisa membawa item game dari satu game ke game lain, atau menjual karya senimu tanpa perantara.

![Web3 — Read-Write-Own](/img/web3.png)

**Intinya**: Web3 adalah pergeseran dari internet yang dikuasai platform menjadi internet yang dimiliki oleh pengguna.

## Bagian 3: Apa Itu "Smart Contract"? Mesin Otomatis di Atas Blockchain
Jika blockchain adalah "buku kas" nya, maka **Smart Contract** adalah **"mesin penjual otomatis (vending machine)"** yang ditaruh di atasnya.

Bayangkan sebuah vending machine:

1. **Ada Aturan Jelas**: "JIKA kamu memasukkan uang Rp 10.000 dan menekan tombol Coca-Cola, MAKA mesin akan mengeluarkan sebotol Coca-Cola."
2. **Otomatis**: Prosesnya berjalan sendiri tanpa kasir.
3. **Tidak Bisa Dicurangi**: Kamu tidak bisa mendapatkan minuman tanpa membayar, dan mesin tidak bisa mengambil uangmu tanpa memberikan minuman (jika stok ada).

**Smart Contract adalah versi digital dari logika ini.** Ia adalah sepotong kode program yang hidup di blockchain. Kode ini berisi aturan "JIKA... MAKA..." yang akan dieksekusi secara otomatis ketika kondisi tertentu terpenuhi.

![Smart Contract Illustration](/img/smart-contract.png)

### Mengapa Smart Contract Penting?

- **Otomatisasi**: Proses yang biasanya memerlukan perantara (seperti notaris, bank) bisa dijalankan otomatis.
- **Transparansi**: Aturan dalam smart contract bisa dilihat dan diverifikasi oleh siapa saja.
- **Keamanan**: Karena berjalan di atas blockchain, smart contract sulit untuk dimanipulasi atau diubah setelah dibuat.

**Contoh Penggunaan:**
- **Asuransi Otomatis:** Smart contract bisa dibuat untuk asuransi penerbangan. "JIKA data penerbangan menunjukkan pesawat delay lebih dari 3 jam, MAKA otomatis kirim uang klaim ke dompet penumpang." Tidak perlu lagi proses klaim manual yang rumit.
- **Voting Digital:** Smart contract bisa memastikan setiap orang hanya bisa memilih satu kali dan hasilnya dihitung secara transparan tanpa ada yang bisa memanipulasi.
- **Game & Aset Digital:** Smart contract mengatur kelangkaan item dalam game (misalnya, pedang legendaris hanya ada 10 di seluruh dunia) dan memungkinkan pemain untuk benar-benar memiliki dan memperjualbelikan item tersebut.

Karena berjalan di atas blockchain, eksekusi Smart Contract bersifat final, transparan, dan tidak dapat diubah, menciptakan tingkat kepercayaan yang tinggi tanpa perlu perantara.

## Bagian 4: Tapi... Apa Batasan Blockchain Generasi Lama?

Meskipun revolusioner, blockchain generasi awal (seperti Bitcoin dan Ethereum) memiliki beberapa tantangan mendasar yang menghambat adopsi massal. Anggap saja ini seperti mobil generasi pertama: idenya brilian, tapi masih lambat dan belum efisien.

### Beberapa masalah utamanya

1. **Skalabilitas & Kecepatan yang Terbatas**
    - Banyak blockchain lama beroperasi seperti jalan tol dengan satu lajur. Semua jenis transaksi, mulai dari transfer koin biasa hingga transaksi game yang kompleks, harus antre di lajur yang sama. **Akibatnya**:
        - **Jaringan Lambat: Saat ramai**, konfirmasi transaksi bisa memakan waktu ber menit-menit, bahkan berjam-jam.
        - **Biaya Gas (Gas Fee) Mahal**: Karena "lajur" nya terbatas, pengguna harus saling "menyogok" (membayar biaya lebih tinggi) agar transaksinya diproses lebih dulu. Ini membuat banyak aplikasi jadi tidak ekonomis untuk digunakan.

2. **Aset Digital yang Tidak Intuitif**
   - Di banyak platform, aset digital seperti NFT (Non-Fungible Token) sebenarnya bukanlah **"objek"** atau **"aset"** yang benar-benar kamu miliki. Mereka lebih seperti entri atau catatan di dalam sebuah smart contract besar.
        - **Ketergantungan pada Smart Contract**: Untuk mengirim NFT, kamu tidak mengirim "objek"-nya langsung, melainkan meminta smart contract utama untuk mengubah catatan kepemilikan. Ini rumit dan kurang efisien.
        - **Sulit untuk Dikomposisi**: Menggabungkan atau berinteraksi antar aset dari smart contract yang berbeda bisa menjadi sangat kompleks dan rawan kesalahan.

3. **Bahasa Pemrograman yang Rawan Kesalahan**
   - Bahasa smart contract generasi awal (seperti Solidity) tidak dirancang dengan fokus utama pada keamanan aset. Hal ini menyebabkan banyak sekali kasus peretasan dan kerugian miliaran dolar karena kesalahan logika sederhana dalam kode, seperti masalah _re-entrancy_ (**re-entrancy** adalah ketika sebuah fungsi dapat dipanggil kembali sebelum eksekusi fungsi sebelumnya selesai, yang dapat dimanfaatkan oleh penyerang).

- **Key Takeaway**: Masalah-masalah inilah seperti skalabilitas, model aset yang kaku, dan keamanan yang menjadi motivasi lahirnya blockchain generasi baru.

**Dan di sinilah SUI join the game.**

Di sesi berikutnya, kita akan membahas secara mendalam bagaimana arsitektur unik Sui, dengan model **berbasis objek (object-centric model)** dan bahasa **Move**, dirancang secara fundamental untuk menyelesaikan semua masalah ini.