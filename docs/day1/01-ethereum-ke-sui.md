---
sidebar_position: 3
title: "Ethereum -> Sui"
description: Perbandingan antara Ethereum dan Sui untuk developer yang familiar dengan EVM.
keywords: [sui, ethereum, evm, solidity, move, perbandingan, indonesia]
---

Jika Kamu pernah bekerja dengan Ethereum Virtual Machine (EVM) sebelumnya, perbedaan terbesar saat mengembangkan di Sui adalah bahasa pemrograman. Sui menggunakan Move dan EVM menggunakan Solidity.

## Perbandingan Topik Utama

| Topik | Solidity | Move |
|-------|----------|------|
| **Model akun vs objek-centric** | Logika ownership kustom ditulis dalam kontrak biasanya menggunakan struktur data mapping (seperti kamus). Hanya koin Ethereum yang memiliki dukungan langsung dari blockchain dengan API global. Semua API ownership lainnya harus dibuat sendiri di setiap kontrak. | Ownership objek sudah built-in di Sui, objek diperlakukan sebagai entitas utama dan mencakup semua yang dimiliki di Sui (koin, NFT, token, dll). |
| **Penyimpanan data** | Data disimpan dalam smart contract. | Data disimpan dalam objek Move. |
| **Inheritance (Pewarisan)** | Mendukung multiple inheritance (kontrak bisa mewarisi dari beberapa kontrak lain), termasuk polymorphism (satu fungsi bisa bekerja dengan berbagai tipe data). | Tidak ada interface, tidak ada polymorphism. Namun, Move memiliki generics (tipe data yang bisa digunakan untuk berbagai tipe), seperti `Type<T>`. |
| **Dynamic dispatch** | Diizinkan (fungsi yang dipanggil ditentukan saat program berjalan) | Tidak diizinkan (fungsi yang dipanggil harus sudah diketahui saat kompilasi) |
| **Aksesibilitas Asset/Token** | Terikat ke smart contract (harus melalui kontrak untuk mengakses). | Siapa pun dapat mengakses shared objects. Owned objects hanya dapat diakses oleh pemilik objek (bisa langsung tanpa melalui kontrak). |
| **Access control (Kontrol akses)** | Kontrol akses berbasis identitas/peran melalui kontrak `Ownable` dan `AccessControl` (misalnya: hanya admin yang bisa). | Sebagian besar kontrol akses berbasis capability (objek izin) melalui owned objects. Kontrol akses berbasis identitas/peran juga dimungkinkan. |
| **Upgrade kontrak** | Kontrak proxy meneruskan transaksi pengguna ke kontrak baru (seperti perantara). | Kontrak baru harus kompatibel dengan struktur data yang lama. Perlu mempertimbangkan versioning (pembuatan versi) untuk shared objects. |
| **Lingkungan development** | Hardhat, Foundry | Move VSCode extension |
| **Mengubah state kontrak** | Mengirim transaksi melalui interface ABI yang sudah ditentukan saat kompilasi. | Mengirim transaksi melalui konstruksi programmable transaction block (PTB) yang dibuat saat program berjalan. |

## Model Objek (Object model)

Objek menyimpan data di Move dan segala sesuatu di Move adalah objek. Ini termasuk smart contract (Move packages), alamat on-chain, koin, dan NFT.

Untuk memudahkan pemahaman, Kamu bisa membayangkan objek seperti "barang" atau "aset" yang nyata - seperti koin di wallet, NFT di collection, atau token yang Kamu miliki. Setiap objek memiliki pemilik (ownership).

### Ownership (Kepemilikan)

Ada beberapa nuansa dalam ownership objek, tetapi jenis utama meliputi:

- **Address-owned objects (Objek milik alamat)**: Objek ini dimiliki oleh satu alamat. Kamu dapat mentransfer atau menerima objek ini tanpa berinteraksi dengan smart contract. Contoh: mata uang, NFT, atau token yang mengatur akses ke fungsi tertentu.

- **Shared objects (Objek bersama)**: Objek yang dapat diakses publik dan dapat digunakan siapa saja. Mengubah data yang disimpan dalam objek ini biasanya melibatkan definisi aturan dalam smart contract untuk mengatur siapa yang boleh mengubah dan bagaimana caranya.

Untuk semua jenis ownership di Sui, lihat [Object Ownership](https://docs.sui.io/concepts/object-ownership).

## Kontrol Akses (Access control)

Identitas atau role-based access control banyak digunakan melalui kontrak `Ownable` dan `AccessControl` dari OpenZeppelin di Solidity.

Karena ownership objek sudah built-in di Sui, akses ke fungsi kontrak biasanya diatur melalui [capability object](https://move-book.com/programmability/capability/) (objek yang memberikan izin).

Objek-objek izin ini diberikan kepada pengguna dan memberikan mereka hak untuk memanggil fungsi tertentu. Panggilan fungsi akan otomatis gagal jika pengguna tidak memiliki objek izin yang diharapkan oleh fungsi tersebut.

Kamu masih dapat mengimplementasikan pengecekan berbasis alamat. 

Namun, rekomendasinya adalah menggunakan capability objects sebanyak mungkin untuk keamanan yang lebih baik.

Kamu dapat membaca lebih lanjut di [The Move Book](https://move-book.com/programmability/capability/#address-check-vs-capability).

Dalam contoh ini, pengguna baru hanya dapat dibuat dengan menyajikan objek `AdminCap` selama panggilan fungsi.

```rust
/// Memberikan pemilik hak untuk membuat pengguna baru dalam sistem.
public struct AdminCap {}

/// Membuat pengguna baru dalam sistem. Memerlukan capability `AdminCap` 
/// untuk diteruskan sebagai argumen pertama.
public fun new(_: &AdminCap, ctx: &mut TxContext): User {
    User { id: object::new(ctx) }
}
```

## Mengubah Objek (Mutating objects)

Di Solidity, struktur data seperti Mapping (seperti kamus yang menyimpan data) didefinisikan dan disimpan langsung di dalam kontrak. Untuk mengubah data, siapa pun bisa menandatangani transaksi, terlepas dari apakah mereka benar-benar memiliki data tersebut atau tidak (kecuali ada pengecekan di dalam kontrak).

Di Move, logika untuk mengubah data didefinisikan dalam kontrak, tetapi data itu sendiri disimpan dalam objek Move yang terpisah.

Untuk mengubah data, pemilik objek perlu memanggil fungsi kontrak menggunakan PTB. Pengecekan ownership dilakukan langsung oleh blockchain (protokol), sehingga transaksi otomatis gagal jika penandatangan tidak memiliki akses ke objek yang ingin diubah.

## Programmable Transaction Blocks (PTB)

Di Solidity, jika Kamu ingin melakukan sesuatu yang menggabungkan hasil dari beberapa panggilan kontrak atau di berbagai kontrak berbeda, Kamu harus membuat fungsi khusus di dalam smart contract yang menggabungkan semua panggilan fungsi tersebut. Menggabungkan beberapa panggilan fungsi dengan jaminan "semua berhasil atau semua gagal" (atomisitas) tidak bisa dilakukan langsung dari aplikasi klien.

Di Move, PTB menyelesaikan masalah ini. PTB memberi developer kemampuan untuk menggabungkan banyak panggilan kontrak dalam satu transaksi dengan jaminan "semua berhasil atau semua gagal" yang dibuat saat program berjalan. PTB Sui dapat berisi hingga 1.024 panggilan kontrak berbeda, atau tindakan lainnya. PTB pada dasarnya adalah cara untuk menulis "script" sederhana namun ekspresif, kuat, dan aman.

Developer di Sui memanfaatkan PTB untuk membuat fitur yang sebelumnya sulit atau tidak mungkin dibuat. Contoh yang bagus adalah agregator DeFi yang mencari harga terbaik untuk pertukaran token di beberapa protokol DeFi berbeda. Di Sui, agregator akan menggunakan satu PTB dengan jaminan bahwa semua transaksi akan dieksekusi pada harga yang ditampilkan, atau semuanya akan dibatalkan sepenuhnya jika ada yang gagal. PTB adalah salah satu fitur Sui yang paling kuat. Pengalaman menunjukkan developer yang paling sukses di Sui adalah mereka yang belajar memanfaatkan fitur ini lebih awal dan sering, menggunakannya sebagai fitur utama daripada hanya sebagai cara untuk menggabungkan beberapa transaksi menjadi satu.

Lihat [Programmable Transaction Blocks](https://docs.sui.io/concepts/transactions/prog-txn-blocks) untuk detail tentang PTB.

## Perbandingan Lebih Lanjut

| Topik | Sui | Ethereum |
|-------|-----|----------|
| **Algoritma tanda tangan digital** | Ed25519, secp256k1, secp256r1 | secp256k1 |
| **Mekanisme konsensus** | DPoS | PoS |
| **VM dan bahasanya** | MoveVM, Move Lang | EVM, Solidity, Vyper |
| **Struktur data chain** | DAG | Blocks |
| **Standar umum (koin, token, NFT, dll)** | Currency Standard, Closed-Loop Token | ERC-20 (token), ERC-721 (NFT), ERC-1155 (multi-token) |
| **Nama koin, nama unit terkecil** | SUI, MIST | ETH, Wei |
| **Framework yang tersedia untuk development** | Sui CLI | Foundry, Hardhat |
| **L1/L2** | Tidak ada L2, mengandalkan L1 yang cepat | Banyak L2 |
| **Governance** | On-chain governance | EIP + Konsensus Node Operator |
| **Bridges** | Didukung | Didukung |
| **Keamanan jaringan (stake yang diperlukan untuk kontrol)** | 66% dari total stake | 51% dari total stake |
| **Audit smart contract** | Audit lebih sedikit diperlukan karena bahasa Move dan model objek sudah memberikan banyak perlindungan keamanan. | Solidity memberikan perlindungan lebih sedikit sehingga memerlukan audit yang lebih menyeluruh dan mendalam. |
| **Transaksi pribadi** | Publik secara desain. | Publik secara desain, L2 dan pihak ketiga mendukung transaksi pribadi. |
| **TVL** | ~1 miliar | ~46 miliar |
| **Bahasa implementasi untuk klien** | Rust, TypeScript | Banyak |
| **Eventing (Pencatatan event)** | Diindeks berdasarkan pengirim, object ID, tipe, timestamp. | Diindeks berdasarkan topik (kategori event). |
| **Indexing (Pengindeksan data)** | Data transaksi tingkat tinggi + objek, koin, dll. | Data transaksi tingkat tinggi. |
| **Oracles** | Pihak ketiga | Pihak ketiga |
| **Strategi upgrade jaringan** | Flag protokol dan upgrade framework dipilih oleh validator kemudian diaktifkan. | EIP + Hardforking, tidak ada mekanisme on-chain. |
| **IDE** | VSCode | Banyak |
| **Siklus hidup transaksi** | Dua kali komunikasi dari klien ke validator untuk menghasilkan sertifikat transaksi (menjamin eksekusi), komunikasi tambahan untuk shared objects untuk memastikan urutan yang benar. Waktu tunggu sangat rendah. | Transaksi disebarkan ke jaringan, diverifikasi dan ditambahkan ke mempool, validator memilih transaksi dari mempool. Validator acak mengusulkan blok, validator lain memilih setuju atau tidak setuju pada blok. Setelah beberapa blok baru ditambahkan, transaksi dianggap final. Waktu tunggu tinggi karena harus menunggu beberapa blok untuk finalitas. |
| **Eksekusi paralel vs eksekusi serial Ethereum, fast path** | Transaksi yang dapat diparalelkan dijalankan secara paralel. | Setiap transaksi dijalankan secara berurutan. |
| **Biaya penyimpanan, storage rebates, akun penyimpanan untuk membayar biaya dari waktu ke waktu** | Rendah, ada pengembalian dana (rebate) saat menghapus objek. | Tinggi, tidak ada pengembalian dana. |
| **Immutability kontrak (Kontrak yang tidak bisa diubah)** | Dukungan native untuk kontrak yang bisa diubah dan yang tidak bisa diubah menggunakan fitur upgrade. | Tidak native, memerlukan audit kode Solidity yang di-deploy untuk memastikan tidak bisa diubah. Dapat dibedakan dengan melihat kode operasi tertentu. |
| **Upgrade kontrak** | Native (bawaan), diatur melalui upgrade capability. | Dicapai menggunakan pola proxy untuk meneruskan panggilan. Upgrade mengubah alamat kontrak yang dipanggil. |
| **Composability (Kemampuan menggabungkan)** | Memanggil banyak fungsi dalam satu transaksi menggunakan PTB. Menggabungkan dengan mengambil hasil dari satu panggilan kontrak dan meneruskannya ke panggilan berikutnya. Memastikan semua eksekusi berhasil atau semua gagal (atomik). | Setiap panggilan adalah transaksi sendiri yang harus diproses satu per satu secara berurutan oleh blockchain. Memerlukan perencanaan yang hati-hati untuk memastikan eksekusi. Tidak atomik (bisa sebagian berhasil, sebagian gagal). |
| **Token royalties (Royalti token)** | Ditegakkan langsung oleh blockchain. | Hanya dapat ditegakkan oleh marketplace (platform penjualan). |

## Tautan Terkait

- **[Konsep Move](https://docs.sui.io/concepts/sui-move-concepts)**: Move adalah bahasa open source untuk menulis paket yang aman untuk memanipulasi objek on-chain.

- **[Object Ownership](https://docs.sui.io/concepts/object-ownership)**: Setiap objek memiliki field owner yang menentukan bagaimana Kamu dapat menggunakannya dalam transaksi. Setiap objek adalah address-owned, dynamic fields, immutable, shared, atau wrapped.

- **[Programmable Transaction Blocks](https://docs.sui.io/concepts/transactions/prog-txn-blocks)**: Programmable transaction blocks adalah sekelompok perintah yang menyelesaikan transaksi di Sui.

- **[Dynamic Object Fields](https://move-book.com/programmability/dynamic-object-fields.html)**: Pelajari lebih lanjut tentang Dynamic Object Fields di The Move Book.

