/// Test suite untuk Smart Contract Escrow
/// 
/// Test ini mencakup:
/// 1. Test create_escrow - membuat escrow baru
/// 2. Test accept_escrow - buyer menerima escrow
/// 3. Test cancel_escrow - seller membatalkan escrow
/// 4. Test error cases - validasi dan error handling
/// 5. Test view functions - fungsi untuk melihat data
#[test_only]
module escrow::escrow_tests {
    use sui::test_scenario::{Self, Scenario};
    use sui::coin;
    use sui::sui::SUI;
    use std::vector;
    use escrow::escrow::{Self, Escrow, EscrowCreated, EscrowAccepted, EscrowCancelled};

    // Test constants
    const SELLER: address = @0xSELLER;
    const BUYER: address = @0xBUYER;
    const THIRD_PARTY: address = @0xTHIRD;
    const ESCROW_AMOUNT: u64 = 1000;

    /// Test 1: Membuat escrow baru - Success Case
    #[test]
    fun test_create_escrow_success() {
        let mut scenario = test_scenario::begin(SELLER);
        
        // Setup: Seller memiliki coin
        let coin = coin::mint_for_testing<SUI>(ESCROW_AMOUNT);
        test_scenario::next_tx(&mut scenario, SELLER);
        coin::put(coin);
        
        // Test: Seller membuat escrow untuk buyer
        test_scenario::next_tx(&mut scenario, SELLER);
        {
            let coin = coin::take_from_sender<SUI>(ESCROW_AMOUNT);
            escrow::create_escrow(coin, BUYER, test_scenario::ctx(&mut scenario));
        };
        
        // Verify: Event EscrowCreated diemit
        test_scenario::next_tx(&mut scenario, SELLER);
        {
            let events = test_scenario::created_events<EscrowCreated>(&scenario);
            assert!(vector::length(&events) == 1, 0);
            
            let event = *vector::borrow(&events, 0);
            assert!(escrow::get_seller_created(&event) == SELLER, 1);
            assert!(escrow::get_buyer_created(&event) == BUYER, 2);
            assert!(escrow::get_amount_created(&event) == ESCROW_AMOUNT, 3);
        };
        
        test_scenario::end(scenario);
    }

    /// Test 2: Buyer menerima escrow - Success Case
    #[test]
    fun test_accept_escrow_success() {
        let mut scenario = test_scenario::begin(SELLER);
        
        // Setup: Seller membuat escrow
        let coin = coin::mint_for_testing<SUI>(ESCROW_AMOUNT);
        test_scenario::next_tx(&mut scenario, SELLER);
        coin::put(coin);
        
        test_scenario::next_tx(&mut scenario, SELLER);
        {
            let coin = coin::take_from_sender<SUI>(ESCROW_AMOUNT);
            escrow::create_escrow(coin, BUYER, test_scenario::ctx(&mut scenario));
        };
        
        // Test: Buyer menerima escrow
        test_scenario::next_tx(&mut scenario, BUYER);
        {
            let escrow = test_scenario::take_from_sender<Escrow>(&scenario);
            escrow::accept_escrow(escrow, test_scenario::ctx(&mut scenario));
        };
        
        // Verify: Event EscrowAccepted diemit
        test_scenario::next_tx(&mut scenario, BUYER);
        {
            let events = test_scenario::created_events<EscrowAccepted>(&scenario);
            assert!(vector::length(&events) == 1, 4);
            
            let event = *vector::borrow(&events, 0);
            assert!(escrow::get_buyer_accepted(&event) == BUYER, 5);
            assert!(escrow::get_amount_accepted(&event) == ESCROW_AMOUNT, 6);
        };
        
        // Verify: Buyer menerima coin
        test_scenario::next_tx(&mut scenario, BUYER);
        {
            let balance = coin::balance<SUI>(test_scenario::ctx(&mut scenario));
            assert!(balance == ESCROW_AMOUNT, 7);
        };
        
        test_scenario::end(scenario);
    }

    /// Test 3: Seller membatalkan escrow - Success Case
    #[test]
    fun test_cancel_escrow_success() {
        let mut scenario = test_scenario::begin(SELLER);
        
        // Setup: Seller membuat escrow
        let coin = coin::mint_for_testing<SUI>(ESCROW_AMOUNT);
        test_scenario::next_tx(&mut scenario, SELLER);
        coin::put(coin);
        
        test_scenario::next_tx(&mut scenario, SELLER);
        {
            let coin = coin::take_from_sender<SUI>(ESCROW_AMOUNT);
            escrow::create_escrow(coin, BUYER, test_scenario::ctx(&mut scenario));
        };
        
        // Test: Seller membatalkan escrow
        test_scenario::next_tx(&mut scenario, SELLER);
        {
            let escrow = test_scenario::take_from_sender<Escrow>(&scenario);
            escrow::cancel_escrow(escrow, test_scenario::ctx(&mut scenario));
        };
        
        // Verify: Event EscrowCancelled diemit
        test_scenario::next_tx(&mut scenario, SELLER);
        {
            let events = test_scenario::created_events<EscrowCancelled>(&scenario);
            assert!(vector::length(&events) == 1, 8);
            
            let event = *vector::borrow(&events, 0);
            assert!(escrow::get_seller_cancelled(&event) == SELLER, 9);
            assert!(escrow::get_amount_cancelled(&event) == ESCROW_AMOUNT, 10);
        };
        
        // Verify: Seller menerima kembali coin
        test_scenario::next_tx(&mut scenario, SELLER);
        {
            let balance = coin::balance<SUI>(test_scenario::ctx(&mut scenario));
            assert!(balance == ESCROW_AMOUNT, 11);
        };
        
        test_scenario::end(scenario);
    }

    /// Test 4: Error - Buyer yang salah mencoba menerima escrow
    #[test]
    #[expected_failure(abort_code = 1)]
    fun test_accept_escrow_wrong_buyer() {
        let mut scenario = test_scenario::begin(SELLER);
        
        // Setup: Seller membuat escrow untuk BUYER
        let coin = coin::mint_for_testing<SUI>(ESCROW_AMOUNT);
        test_scenario::next_tx(&mut scenario, SELLER);
        coin::put(coin);
        
        test_scenario::next_tx(&mut scenario, SELLER);
        {
            let coin = coin::take_from_sender<SUI>(ESCROW_AMOUNT);
            escrow::create_escrow(coin, BUYER, test_scenario::ctx(&mut scenario));
        };
        
        // Test: THIRD_PARTY (bukan buyer) mencoba menerima escrow
        // Ini seharusnya gagal karena hanya BUYER yang bisa menerima
        test_scenario::next_tx(&mut scenario, THIRD_PARTY);
        {
            let escrow = test_scenario::take_from_sender<Escrow>(&scenario);
            escrow::accept_escrow(escrow, test_scenario::ctx(&mut scenario));
        };
        
        test_scenario::end(scenario);
    }

    /// Test 5: Error - Seller yang salah mencoba membatalkan escrow
    #[test]
    #[expected_failure(abort_code = 3)]
    fun test_cancel_escrow_wrong_seller() {
        let mut scenario = test_scenario::begin(SELLER);
        
        // Setup: Seller membuat escrow
        let coin = coin::mint_for_testing<SUI>(ESCROW_AMOUNT);
        test_scenario::next_tx(&mut scenario, SELLER);
        coin::put(coin);
        
        test_scenario::next_tx(&mut scenario, SELLER);
        {
            let coin = coin::take_from_sender<SUI>(ESCROW_AMOUNT);
            escrow::create_escrow(coin, BUYER, test_scenario::ctx(&mut scenario));
        };
        
        // Test: THIRD_PARTY (bukan seller) mencoba membatalkan escrow
        // Ini seharusnya gagal karena hanya SELLER yang bisa membatalkan
        test_scenario::next_tx(&mut scenario, THIRD_PARTY);
        {
            let escrow = test_scenario::take_from_sender<Escrow>(&scenario);
            escrow::cancel_escrow(escrow, test_scenario::ctx(&mut scenario));
        };
        
        test_scenario::end(scenario);
    }

    /// Test 6: Error - Mencoba menerima escrow yang sudah diterima
    /// Note: Test ini akan gagal karena escrow sudah dihapus setelah diterima
    /// Ini adalah expected behavior - escrow tidak bisa diterima dua kali
    #[test]
    #[expected_failure]
    fun test_accept_escrow_already_accepted() {
        let mut scenario = test_scenario::begin(SELLER);
        
        // Setup: Seller membuat escrow
        let coin = coin::mint_for_testing<SUI>(ESCROW_AMOUNT);
        test_scenario::next_tx(&mut scenario, SELLER);
        coin::put(coin);
        
        test_scenario::next_tx(&mut scenario, SELLER);
        {
            let coin = coin::take_from_sender<SUI>(ESCROW_AMOUNT);
            escrow::create_escrow(coin, BUYER, test_scenario::ctx(&mut scenario));
        };
        
        // Buyer menerima escrow pertama kali (berhasil)
        test_scenario::next_tx(&mut scenario, BUYER);
        {
            let escrow = test_scenario::take_from_sender<Escrow>(&scenario);
            escrow::accept_escrow(escrow, test_scenario::ctx(&mut scenario));
        };
        
        // Test: Mencoba menerima escrow yang sama lagi (seharusnya gagal)
        // Escrow sudah dihapus setelah diterima, jadi ini akan gagal
        test_scenario::next_tx(&mut scenario, BUYER);
        {
            // Ini akan gagal karena escrow object sudah tidak ada
            let escrow = test_scenario::take_from_sender<Escrow>(&scenario);
            escrow::accept_escrow(escrow, test_scenario::ctx(&mut scenario));
        };
        
        test_scenario::end(scenario);
    }

    /// Test 7: Error - Mencoba membuat escrow dengan amount 0
    #[test]
    #[expected_failure(abort_code = 0)]
    fun test_create_escrow_zero_amount() {
        let mut scenario = test_scenario::begin(SELLER);
        
        // Setup: Seller memiliki coin dengan amount 0
        let coin = coin::mint_for_testing<SUI>(0);
        test_scenario::next_tx(&mut scenario, SELLER);
        coin::put(coin);
        
        // Test: Mencoba membuat escrow dengan amount 0 (seharusnya gagal)
        test_scenario::next_tx(&mut scenario, SELLER);
        {
            let coin = coin::take_from_sender<SUI>(0);
            escrow::create_escrow(coin, BUYER, test_scenario::ctx(&mut scenario));
        };
        
        test_scenario::end(scenario);
    }

    /// Test 8: Test view functions - melihat detail escrow
    #[test]
    fun test_view_escrow() {
        let mut scenario = test_scenario::begin(SELLER);
        
        // Setup: Seller membuat escrow
        let coin = coin::mint_for_testing<SUI>(ESCROW_AMOUNT);
        test_scenario::next_tx(&mut scenario, SELLER);
        coin::put(coin);
        
        test_scenario::next_tx(&mut scenario, SELLER);
        {
            let coin = coin::take_from_sender<SUI>(ESCROW_AMOUNT);
            escrow::create_escrow(coin, BUYER, test_scenario::ctx(&mut scenario));
        };
        
        // Test: View escrow details
        test_scenario::next_tx(&mut scenario, SELLER);
        {
            let escrow = test_scenario::take_from_sender<Escrow>(&scenario);
            
            // Test view_escrow
            let (seller, buyer, amount, status) = escrow::view_escrow(&escrow);
            assert!(seller == SELLER, 12);
            assert!(buyer == BUYER, 13);
            assert!(amount == ESCROW_AMOUNT, 14);
            assert!(status == 0, 15); // STATUS_ACTIVE = 0
            
            // Test individual getter functions
            assert!(escrow::get_seller(&escrow) == SELLER, 16);
            assert!(escrow::get_buyer(&escrow) == BUYER, 17);
            assert!(escrow::get_amount(&escrow) == ESCROW_AMOUNT, 18);
            assert!(escrow::get_status(&escrow) == 0, 19);
            
            // Return escrow untuk cleanup
            test_scenario::return_to_sender(&scenario, escrow);
        };
        
        test_scenario::end(scenario);
    }

    /// Test 9: Flow lengkap - Create, Accept, Verify
    #[test]
    fun test_complete_flow_create_and_accept() {
        let mut scenario = test_scenario::begin(SELLER);
        
        // Step 1: Seller membuat escrow
        let coin = coin::mint_for_testing<SUI>(ESCROW_AMOUNT);
        test_scenario::next_tx(&mut scenario, SELLER);
        coin::put(coin);
        
        test_scenario::next_tx(&mut scenario, SELLER);
        {
            let coin = coin::take_from_sender<SUI>(ESCROW_AMOUNT);
            escrow::create_escrow(coin, BUYER, test_scenario::ctx(&mut scenario));
        };
        
        // Verify: EscrowCreated event
        test_scenario::next_tx(&mut scenario, SELLER);
        {
            let events = test_scenario::created_events<EscrowCreated>(&scenario);
            assert!(vector::length(&events) == 1, 20);
        };
        
        // Step 2: Buyer menerima escrow
        test_scenario::next_tx(&mut scenario, BUYER);
        {
            let escrow = test_scenario::take_from_sender<Escrow>(&scenario);
            escrow::accept_escrow(escrow, test_scenario::ctx(&mut scenario));
        };
        
        // Verify: EscrowAccepted event
        test_scenario::next_tx(&mut scenario, BUYER);
        {
            let events = test_scenario::created_events<EscrowAccepted>(&scenario);
            assert!(vector::length(&events) == 1, 21);
            
            // Verify buyer balance
            let balance = coin::balance<SUI>(test_scenario::ctx(&mut scenario));
            assert!(balance == ESCROW_AMOUNT, 22);
        };
        
        test_scenario::end(scenario);
    }

    /// Test 10: Flow lengkap - Create, Cancel, Verify
    #[test]
    fun test_complete_flow_create_and_cancel() {
        let mut scenario = test_scenario::begin(SELLER);
        
        // Step 1: Seller membuat escrow
        let coin = coin::mint_for_testing<SUI>(ESCROW_AMOUNT);
        test_scenario::next_tx(&mut scenario, SELLER);
        coin::put(coin);
        
        test_scenario::next_tx(&mut scenario, SELLER);
        {
            let coin = coin::take_from_sender<SUI>(ESCROW_AMOUNT);
            escrow::create_escrow(coin, BUYER, test_scenario::ctx(&mut scenario));
        };
        
        // Step 2: Seller membatalkan escrow
        test_scenario::next_tx(&mut scenario, SELLER);
        {
            let escrow = test_scenario::take_from_sender<Escrow>(&scenario);
            escrow::cancel_escrow(escrow, test_scenario::ctx(&mut scenario));
        };
        
        // Verify: EscrowCancelled event
        test_scenario::next_tx(&mut scenario, SELLER);
        {
            let events = test_scenario::created_events<EscrowCancelled>(&scenario);
            assert!(vector::length(&events) == 1, 23);
            
            // Verify seller balance (coin dikembalikan)
            let balance = coin::balance<SUI>(test_scenario::ctx(&mut scenario));
            assert!(balance == ESCROW_AMOUNT, 24);
        };
        
        test_scenario::end(scenario);
    }

    /// Test 11: Multiple escrows - Seller membuat beberapa escrow
    #[test]
    fun test_multiple_escrows() {
        let mut scenario = test_scenario::begin(SELLER);
        
        // Setup: Seller memiliki coin untuk 3 escrow
        let total_amount = ESCROW_AMOUNT * 3;
        let coin = coin::mint_for_testing<SUI>(total_amount);
        test_scenario::next_tx(&mut scenario, SELLER);
        coin::put(coin);
        
        // Create 3 escrows
        test_scenario::next_tx(&mut scenario, SELLER);
        {
            let coin1 = coin::take_from_sender<SUI>(ESCROW_AMOUNT);
            escrow::create_escrow(coin1, BUYER, test_scenario::ctx(&mut scenario));
        };
        
        test_scenario::next_tx(&mut scenario, SELLER);
        {
            let coin2 = coin::take_from_sender<SUI>(ESCROW_AMOUNT);
            escrow::create_escrow(coin2, BUYER, test_scenario::ctx(&mut scenario));
        };
        
        test_scenario::next_tx(&mut scenario, SELLER);
        {
            let coin3 = coin::take_from_sender<SUI>(ESCROW_AMOUNT);
            escrow::create_escrow(coin3, BUYER, test_scenario::ctx(&mut scenario));
        };
        
        // Verify: 3 EscrowCreated events
        test_scenario::next_tx(&mut scenario, SELLER);
        {
            let events = test_scenario::created_events<EscrowCreated>(&scenario);
            assert!(vector::length(&events) == 3, 25);
        };
        
        test_scenario::end(scenario);
    }
}

