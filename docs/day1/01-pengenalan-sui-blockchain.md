---
sidebar_position: 2
title: "Pengenalan Sui Blockchain"
description: Pengantar konsep inti Sui blockchain.
keywords: [sui, blockchain, fundamental, indonesia]
---

Di materi sebelumnya, kita sudah membahas betapa hebatnya teknologi blockchain, tapi juga melihat ada beberapa "pekerjaan rumah" yang ditinggalkan oleh generasi lama: **masalah kecepatan, biaya mahal, dan aset digital yang kaku.**

**Ingat analogi mobil generasi pertama?** Idenya brilian, tapi masih lambat dan belum efisien.

Nah, di sesi inilah kita akan bertemu dengan "mobil sport" generasi baru. Mari kita kenalan dengan **Sui**.

## Apa itu Sui?
Secara sederhana, **Sui adalah blockchain Layer-1** yang didesain dari nol untuk menjadi **super cepat, sangat murah, dan sangat aman,** dengan tujuan melayani miliaran pengguna berikutnya di Web3.

Sui tidak hanya mencoba "memperbaiki" blockchain lama, tetapi membangun ulang fondasinya dengan pendekatan yang sama sekali berbeda. Kuncinya ada pada **tiga pilar utama** yang menjadi fondasi kekuatannya.

### Pilar 1: Model Berbasis Objek (Object-Centric Model)
Ini adalah perubahan paling fundamental. Mari kita bandingkan.

### **Cara Lama (Model Akun, cth: Ethereum)**

Di blockchain lama, aset digital seperti NFT itu bukan "benda" sungguhan. Mereka hanyalah baris catatan di dalam sebuah smart contract besar.

- **Analogi**: Bayangkan sebuah gudang besar (smart contract) yang dipegang oleh satu penjaga. Di dalam gudang itu ada banyak rak, dan setiap rak punya label "NFT Pedang A milik Akun 123", "NFT Perisai B milik Akun 456". Jika kamu mau mengirim pedangmu ke teman, kamu tidak bisa langsung mengambilnya. Kamu harus lapor ke penjaga gudang, "Pak, tolong ubah catatan di rak pedang A, sekarang pemiliknya Akun 789." Ini tidak efisien dan semuanya bergantung pada si penjaga (smart contract).

### **Cara Baru (Model Objek Sui)**

Sui memperlakukan setiap aset digital sebagai **"Objek"** atau **"Aset"** yang berdiri sendiri, punya identitas unik, dan bisa langsung dimiliki serta dikendalikan oleh pemiliknya.

- **Analogi**: Lupakan gudang. Sekarang, setiap aset adalah **barang yang ada di dalam dompetmu sendiri**. NFT Pedang A adalah objek di dompetmu. Jika kamu mau mengirimnya ke teman, kamu tinggal memberikannya langsung. Kamu punya kontrol penuh atas barang-barangmu. Jauh lebih **intuitif dan efisien**.

![Object-Centric Model](/img/object-vs-account.png)

**Jenis-jenis Objek di Sui:**

Karena modelnya berbasis objek, Sui bisa membedakan cara memperlakukan transaksi berdasarkan jenis objek yang terlibat:

1. **Owned Object (Objek Milik Pribadi):** Ini adalah objek yang hanya dimiliki oleh satu alamat/akun. Contoh: NFT, koin di dompetmu. Transaksi yang melibatkan objek ini super cepat karena tidak perlu persetujuan seluruh jaringan.

2. **Shared Object (Objek Milik Bersama):** Ini adalah objek yang bisa diakses dan diubah oleh banyak orang. Contoh: Sebuah liquidity pool di aplikasi DeFi, papan skor global dalam sebuah game. Transaksi ini memerlukan persetujuan bersama (konsensus).

Perbedaan inilah yang menjadi kunci ke pilar kedua.

### Pilar 2: Eksekusi Transaksi Paralel
Ingat masalah "jalan tol satu lajur" di blockchain lama? Semua transaksi harus antre di jalur yang sama, menyebabkan kemacetan parah.

Sui mengubah ini menjadi **"jalan tol dengan ribuan lajur"**.

Berkat model objeknya, Sui bisa "melihat" sebuah transaksi dan langsung tahu: "Oh, transaksi ini hanya melibatkan Bob yang mengirim NFT pedangnya ke Alice (Owned Object). Ini urusan mereka berdua, tidak ada hubungannya dengan transaksi lain. Silakan lewat lajur ekspres!"

Dengan begitu, jutaan transaksi sederhana seperti ini bisa diproses secara **paralel** **(bersamaan)** tanpa harus antre.

![Sui vs Ethereum](/img/parallel-vs-sequential.png)

Bagaimana dengan _Shared Object_? Nah, transaksi yang melibatkan objek bersama inilah yang akan masuk ke "lajur utama" yang memerlukan validasi dan persetujuan dari seluruh jaringan. Proses ini diamankan oleh mekanisme konsensus super canggih.

> Mekanisme konsensus yang digunakan Sui bernama **Narwhal & Bullshark**. Kita tidak akan membahas detail teknisnya hari ini, tapi akan kita bedah lebih dalam di Hari ke-2 untuk melihat bagaimana Sui menjaga keamanan jaringan untuk transaksi kompleks.

Hasilnya? Kapasitas pemrosesan transaksi (TPS - Transactions Per Second) di Sui bisa mencapai **ratusan ribu**, sementara blockchain lama masih berkutat di puluhan atau ratusan.

### Pilar 3: Bahasa Pemrograman Sui Move
Ingat masalah **bahasa pemrograman yang rawan kesalahan** di generasi lama? Sui menjawab ini dengan menggunakan **Sui Move.**

**Sui Move** adalah varian dari bahasa pemrograman Move yang awalnya dikembangkan di Facebook (Meta) untuk proyek Diem/Libra. Move didesain secara spesifik untuk satu tujuan: membuat aset digital menjadi sangat aman.

**Keunggulan Utama Sui Move:**
- **Fokus pada Sumber Daya (Resource-Oriented):** Di Move, sebuah objek secara default tidak bisa diduplikasi atau dihapus secara tidak sengaja. Ia hanya bisa dipindahkan (moved) dari satu pemilik ke pemilik lain. Ini secara fundamental mencegah banyak sekali jenis serangan dan bug umum, seperti double spending.

- **Keamanan di Tingkat Bahasa:** Fitur keamanan sudah tertanam di dalam fondasi bahasanya, bukan sesuatu yang harus ditambahkan oleh developernya. Ini seperti membangun rumah dengan batu bata tahan api, bukan sekadar mengecatnya dengan cat anti api.

- **Sangat Ekspresif:** Meskipun aman, Sui Move sangat fleksibel untuk mendefinisikan logika kompleks dan properti unik dari sebuah objek.

### Perbandingan Singkat: Sui vs. Ethereum
Untuk memperjelas, mari kita lihat perbandingan langsung antara pendekatan Sui dengan Ethereum sebagai representasi blockchain generasi sebelumnya.

![Sui vs Ethereum](/img/perbedaan-eth-sui.png)

### Kesimpulan Sesi
Jadi, inilah tiga pilar yang membuat Sui menjadi game-changer:

1. **Model Objek:** Membuat aset digital jadi intuitif dan efisien.
2. **Transaksi Paralel:** Menghilangkan kemacetan dan membuat jaringan super cepat.
3. **Sui Move:** Memberikan keamanan tingkat tinggi langsung dari fondasi bahasanya.

Dengan tiga inovasi ini, Sui bukan sekadar "lebih cepat", tapi sebuah platform yang benar-benar siap untuk aplikasi skala besar seperti game, media sosial, dan DeFi yang melayani jutaan pengguna.

Sekarang kita sudah paham **"mengapa"** Sui begitu spesial. Di sesi berikutnya, kita akan mulai masuk ke bagian **"bagaimana"** dengan menyiapkan semua alat yang kita butuhkan untuk mulai membangun di atasnya!