/// Smart Contract Escrow Sederhana untuk Sui
/// 
/// Flow Escrow:
/// 1. Seller membuat escrow dan menyetor token SUI
/// 2. Buyer bisa melihat escrow yang tersedia
/// 3. Buyer bisa menerima escrow (mengambil token)
/// 4. Seller bisa membatalkan escrow jika belum diterima
module escrow::escrow {
    use sui::coin::{Self, Coin};
    use sui::transfer;
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::event;

    /// Struct untuk Escrow
    /// Escrow menyimpan token SUI sampai buyer menerimanya atau seller membatalkannya
    struct Escrow has key {
        id: UID,
        seller: address,        // Alamat seller yang membuat escrow
        buyer: address,         // Alamat buyer yang bisa menerima escrow
        amount: u64,            // Jumlah token SUI yang di-escrow
        coin: Coin< sui::sui::SUI>, // Objek coin yang di-escrow
        created_at: u64,        // Timestamp saat escrow dibuat
        status: u8,             // Status: 0 = Active, 1 = Accepted, 2 = Cancelled
    }

    /// Event ketika escrow dibuat
    struct EscrowCreated has copy, drop {
        escrow_id: ID,
        seller: address,
        buyer: address,
        amount: u64,
    }

    /// Event ketika escrow diterima
    struct EscrowAccepted has copy, drop {
        escrow_id: ID,
        buyer: address,
        amount: u64,
    }

    /// Event ketika escrow dibatalkan
    struct EscrowCancelled has copy, drop {
        escrow_id: ID,
        seller: address,
        amount: u64,
    }

    /// Konstanta untuk status
    const STATUS_ACTIVE: u8 = 0;
    const STATUS_ACCEPTED: u8 = 1;
    const STATUS_CANCELLED: u8 = 2;

    /// Fungsi untuk membuat escrow baru
    /// 
    /// Flow:
    /// 1. Seller memanggil fungsi ini dengan coin yang ingin di-escrow
    /// 2. Fungsi membuat objek Escrow dengan status Active
    /// 3. Coin ditransfer ke escrow object
    /// 
    /// @param payment: Coin SUI yang akan di-escrow
    /// @param buyer: Alamat buyer yang bisa menerima escrow
    /// @param ctx: Transaction context
    /// @return: Objek Escrow yang baru dibuat
    public entry fun create_escrow(
        payment: Coin<sui::sui::SUI>,
        buyer: address,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let amount = coin::value(&payment);
        
        // Validasi: jumlah harus lebih dari 0
        assert!(amount > 0, 0);

        // Buat escrow object
        let escrow_id = object::new(ctx);
        let escrow = Escrow {
            id: escrow_id,
            seller: sender,
            buyer,
            amount,
            coin: payment,
            created_at: tx_context::epoch_timestamp_ms(ctx),
            status: STATUS_ACTIVE,
        };

        // Simpan ID sebelum transfer
        let escrow_object_id = object::id(&escrow);

        // Transfer escrow ke seller (seller akan memegang escrow object)
        // Buyer bisa melihat escrow melalui query, tapi tidak bisa mengambil tanpa accept
        transfer::public_transfer(escrow, sender);

        // Emit event
        event::emit(EscrowCreated {
            escrow_id: escrow_object_id,
            seller: sender,
            buyer,
            amount,
        });
    }

    /// Fungsi untuk buyer menerima escrow
    /// 
    /// Flow:
    /// 1. Buyer memanggil fungsi ini dengan escrow object
    /// 2. Fungsi memvalidasi bahwa buyer adalah penerima yang benar
    /// 3. Coin ditransfer ke buyer
    /// 4. Escrow object dihapus
    /// 
    /// @param escrow: Objek Escrow yang akan diterima
    /// @param ctx: Transaction context
    public entry fun accept_escrow(
        escrow: Escrow,
        ctx: &mut TxContext
    ) {
        let buyer = tx_context::sender(ctx);
        let escrow_id = object::id(&escrow);
        let amount = escrow.amount;

        // Validasi: hanya buyer yang bisa menerima
        assert!(escrow.buyer == buyer, 1);
        
        // Validasi: escrow harus masih aktif
        assert!(escrow.status == STATUS_ACTIVE, 2);

        // Ambil coin dari escrow
        let coin = escrow.coin;

        // Transfer coin ke buyer
        transfer::public_transfer(coin, buyer);

        // Hapus escrow object (coin sudah diambil, escrow tidak diperlukan lagi)
        let Escrow {
            id,
            seller: _,
            buyer: _,
            amount: _,
            coin: _,
            created_at: _,
            status: _,
        } = escrow;
        object::delete(id);

        // Emit event
        event::emit(EscrowAccepted {
            escrow_id,
            buyer,
            amount,
        });
    }

    /// Fungsi untuk seller membatalkan escrow
    /// 
    /// Flow:
    /// 1. Seller memanggil fungsi ini dengan escrow object
    /// 2. Fungsi memvalidasi bahwa seller adalah pembuat escrow
    /// 3. Coin dikembalikan ke seller
    /// 4. Escrow object dihapus
    /// 
    /// @param escrow: Objek Escrow yang akan dibatalkan
    /// @param ctx: Transaction context
    public entry fun cancel_escrow(
        escrow: Escrow,
        ctx: &mut TxContext
    ) {
        let seller = tx_context::sender(ctx);
        let escrow_id = object::id(&escrow);
        let amount = escrow.amount;

        // Validasi: hanya seller yang bisa membatalkan
        assert!(escrow.seller == seller, 3);
        
        // Validasi: escrow harus masih aktif
        assert!(escrow.status == STATUS_ACTIVE, 4);

        // Ambil coin dari escrow
        let coin = escrow.coin;

        // Kembalikan coin ke seller
        transfer::public_transfer(coin, seller);

        // Hapus escrow object
        let Escrow {
            id,
            seller: _,
            buyer: _,
            amount: _,
            coin: _,
            created_at: _,
            status: _,
        } = escrow;
        object::delete(id);

        // Emit event
        event::emit(EscrowCancelled {
            escrow_id,
            seller,
            amount,
        });
    }

    /// Fungsi view untuk melihat detail escrow
    /// 
    /// @param escrow: Objek Escrow yang ingin dilihat
    /// @return: Tuple (seller, buyer, amount, status)
    public fun view_escrow(escrow: &Escrow): (address, address, u64, u8) {
        (escrow.seller, escrow.buyer, escrow.amount, escrow.status)
    }

    /// Fungsi untuk mendapatkan status escrow
    public fun get_status(escrow: &Escrow): u8 {
        escrow.status
    }

    /// Fungsi untuk mendapatkan seller address
    public fun get_seller(escrow: &Escrow): address {
        escrow.seller
    }

    /// Fungsi untuk mendapatkan buyer address
    public fun get_buyer(escrow: &Escrow): address {
        escrow.buyer
    }

    /// Fungsi untuk mendapatkan amount
    public fun get_amount(escrow: &Escrow): u64 {
        escrow.amount
    }

    // ========== Helper functions untuk testing ==========
    
    /// Helper function untuk test: mendapatkan escrow_id dari EscrowCreated event
    #[test_only]
    public fun get_escrow_id_created(event: &EscrowCreated): ID {
        event.escrow_id
    }

    /// Helper function untuk test: mendapatkan seller dari EscrowCreated event
    #[test_only]
    public fun get_seller_created(event: &EscrowCreated): address {
        event.seller
    }

    /// Helper function untuk test: mendapatkan buyer dari EscrowCreated event
    #[test_only]
    public fun get_buyer_created(event: &EscrowCreated): address {
        event.buyer
    }

    /// Helper function untuk test: mendapatkan amount dari EscrowCreated event
    #[test_only]
    public fun get_amount_created(event: &EscrowCreated): u64 {
        event.amount
    }

    /// Helper function untuk test: mendapatkan buyer dari EscrowAccepted event
    #[test_only]
    public fun get_buyer_accepted(event: &EscrowAccepted): address {
        event.buyer
    }

    /// Helper function untuk test: mendapatkan amount dari EscrowAccepted event
    #[test_only]
    public fun get_amount_accepted(event: &EscrowAccepted): u64 {
        event.amount
    }

    /// Helper function untuk test: mendapatkan seller dari EscrowCancelled event
    #[test_only]
    public fun get_seller_cancelled(event: &EscrowCancelled): address {
        event.seller
    }

    /// Helper function untuk test: mendapatkan amount dari EscrowCancelled event
    #[test_only]
    public fun get_amount_cancelled(event: &EscrowCancelled): u64 {
        event.amount
    }
}

