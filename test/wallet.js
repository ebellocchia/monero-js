// Copyright (c) 2023 Emanuele Bellocchia
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

const assert = require("assert");
const monero = require("../");

// Constants
const PAYMENT_ID_BYTE_LEN = 8;
const SUBADDR_MAX_IDX = 2**32;

const TEST_SEED = "2c9623882df4940a734b009e0732ce5a8de7a62c4c1a2a53767a8f6c04874117";
const TEST_PRIV_KEY = "3fc22d2b139182b29cae08fb2838ef458de7a62c4c1a2a53767a8f6c04874107";
const TEST_PUB_KEY = "f7ee64693c501c0f6112f5ab4d33b405c35f66efb2c704ffbd2f7dc63408235e";

const PRIV_KEY_INVALID_1 = "2c9623882df4940a734b009e0732ce5a8de7a62c4c1a2a53767a8f6c04874117";
const PRIV_KEY_INVALID_2 = "3fc22d2b139182b29cae08fb2838ef458de7a62c4c1a2a53767a8f6c048741";
const PRIV_KEY_INVALID_3 = "3fc22d2b139182b29cae08fb2838ef458de7a62c4c1a2a53767a8f6c0487410701";
const PUB_KEY_INVALID_1 = "f7ee64693c501c0f6112f5ab4d33b405c35f66efb2c704ffbd2f7dc6340823";
const PUB_KEY_INVALID_2 = "f7ee64693c501c0f6112f5ab4d33b405c35f66efb2c704ffbd2f7dc63408235e01";

// Test vector
const TEST_VECTOR = [
    {
        mnemonic: "rapid obedient brunt lofty pepper python erected typist looking upgrade bumper lemon behind jobs orders lower elbow nephew rotate oscar amused dapper scamper tequila bumper",
        seed: "2c9623882df4940a734b009e0732ce5a8de7a62c4c1a2a53767a8f6c04874117",
        priv_skey: "3fc22d2b139182b29cae08fb2838ef458de7a62c4c1a2a53767a8f6c04874107",
        priv_vkey: "66e7495a49d2f1b9458204386bd6aadf6402c270d37d503a1cebde58a0d38a00",
        pub_skey: "f7ee64693c501c0f6112f5ab4d33b405c35f66efb2c704ffbd2f7dc63408235e",
        pub_vkey: "7f9e54e6dc3fbbd4b7a3b4412c22f4e2d78ee91ddfeaa30a9181e4b374ac3613",
        primary_address: "4B23epeYLCj3aCTG8X83ZM1xunHBjWEB5jmzM1zfrAKcGokjBPvS7eAcadEQZEgDhDeweod9KEZ5L2mXYVthxdxy3CQiRDK",
        integrated_address: {
            payment_id: "d6f093554c0daa94",
            address: "4LiifdU2wUF3aCTG8X83ZM1xunHBjWEB5jmzM1zfrAKcGokjBPvS7eAcadEQZEgDhDeweod9KEZ5L2mXYVthxdxy4KUCty2MEBbHiGc8eM",
        },
        subaddresses: [
            {
                acc_idx: 0,
                subaddr_idx: 0,
                address: "4B23epeYLCj3aCTG8X83ZM1xunHBjWEB5jmzM1zfrAKcGokjBPvS7eAcadEQZEgDhDeweod9KEZ5L2mXYVthxdxy3CQiRDK",
            },
            {
                acc_idx: 0,
                subaddr_idx: 1,
                address: "89EpSrB4wKB3UrLk8Zf4dHhvcfo1TqVfR6PAE8WPtwK9YuJhiEaU49y8w9fBaCTPUSCmaYTQbD3LhgbkHriuQLgDMM1dpsk",
            },
            {
                acc_idx: 0,
                subaddr_idx: 2,
                address: "88CnECEzYfUdvYwKL4tSNq3dsFuamTz7m9XaFF7q9pTTXUTCWfaZfVg2tW2TuYyyF2Fuaemsn5FPxNHY5WbF4NQA6xXQCQx",
            },
            {
                acc_idx: 1,
                subaddr_idx: 0,
                address: "87zT4PHnBDUJodyx5gzbenceaByre9ijiHa9FkZnu2yJP2xLEv9ivMTcLtkzaFp6pffWwcZ2htGU94VGiXMsR67q9yenKYT",
            },
            {
                acc_idx: 1,
                subaddr_idx: 1,
                address: "88gNnRiJ4q9BrcsaxoTxFMPeVHPuZELNwTZgqSNwbRKv9gSbfzJDgyKB1sKsH81mGVN991LaAaN9f5v8orhk6Yf64F2XmT8",
            },
        ],
    },
    {
        mnemonic: "cuisine deepest goldfish wetsuit circle purged kiosk touchy adrenalin fabrics haystack roared hobby vibrate vaults daily bacon dosage adrenalin fences tolerant females aptitude army fences",
        seed: "b6514a29ff612189af1bba250606bb5b1e7846fe8f31a91fc0beb393cddb6101",
        priv_skey: "b6514a29ff612189af1bba250606bb5b1e7846fe8f31a91fc0beb393cddb6101",
        priv_vkey: "8f3461d947f48cebd597dade700b6f345be43af8139b85fef7d577007462b509",
        pub_skey: "323abccb6e92ee89b1a07f6829ab3e16cc4fd276377c11d84a5719808f16ec83",
        pub_vkey: "4842482c21c0d0459f04dd7a27256b1743fe018727bd395c964a5ae9e3c6f6c1",
        primary_address: "43XWXXDCyHwQ2oZtBc8LUm4pAs5koPg2kdBHgwQNJBKRNxbwRnYufB5CeQvnbkGiWE4thv1A7GptxGVDDPN4d8ehNpQv99J",
        integrated_address: {
            payment_id: "ccc172c2ffcac9d8",
            address: "4DEBYL2haZTQ2oZtBc8LUm4pAs5koPg2kdBHgwQNJBKRNxbwRnYufB5CeQvnbkGiWE4thv1A7GptxGVDDPN4d8ehZR6s3aQNNzLRREzGFz",
        },
        subaddresses: [
            {
                acc_idx: 0,
                subaddr_idx: 0,
                address: "43XWXXDCyHwQ2oZtBc8LUm4pAs5koPg2kdBHgwQNJBKRNxbwRnYufB5CeQvnbkGiWE4thv1A7GptxGVDDPN4d8ehNpQv99J",
            },
            {
                acc_idx: 0,
                subaddr_idx: 1,
                address: "87QhdsHjCjMdWax6htvM7P2jFP9JAVC2eUpFiVdewQSpPbg1M4WPVCdHvvxH18WgyDTkfQVCNQ8j23oBhJYoBEQiF8onTRb",
            },
            {
                acc_idx: 0,
                subaddr_idx: 2,
                address: "83hJR2XcGkrhTvVHDa6j98E6Y6YWti7fcd87B7RE8aGoH3EpxeFXya8afivtKuoKDGY2xaX65cBpLRR6rKaPf3g1L8Fs6wN",
            },
            {
                acc_idx: 1,
                subaddr_idx: 0,
                address: "82tUn7VxgpfYdsjn8PygwLf8PyvinAGoEZxVG98d1FEsVVqUsWkJBL92NMUJ28hkGDdsZNCdcPH7McwSDxKYQ2UX1sHnDqD",
            },
            {
                acc_idx: 1,
                subaddr_idx: 1,
                address: "87XnCr9zqmpbkkydpbafUtbRbRrCwTRfKD9hRs387BCF4aFqJ9d3wRiEzstySVgcMuio513aEpgxKMQtyvy1HaHSUbb18ad",
            },
        ],
    },
    {
        mnemonic: "mural regular reunion mystery skew nearby volcano goat usual cafe radar nineteen teardrop jolted unnoticed yellow ruined inundate trash gleeful tumbling boyfriend imagine kennel trash",
        seed: "b8083b02224454c8671868930d0ae9e1aa347373ec450aaff336478ae32cc10d",
        priv_skey: "b8083b02224454c8671868930d0ae9e1aa347373ec450aaff336478ae32cc10d",
        priv_vkey: "b10e56f46ac431cc7b8374abe8eb569a30432a8738587416705514460b1f9e0b",
        pub_skey: "310e380533336d850081ee63cece4a9ec6df17db97d67b18f35b4d5b406a2375",
        pub_vkey: "51fa5e598f6aeb4516aa34e8dc974961cb0a7ef5398f6d329afd69ca2a8045bb",
        primary_address: "43UvsrFvMbaPFHaZ5G57SyTZLPSKEZbQn5B42ZtErUGSLd9tEAVjSCzCZFEHopF7qrHMiX88Krpkk9TwHtZ31uTrNBNADjb",
        integrated_address: {
            payment_id: "6e8b9ea55f3e01af",
            address: "4DBbtf5Qxs6PFHaZ5G57SyTZLPSKEZbQn5B42ZtErUGSLd9tEAVjSCzCZFEHopF7qrHMiX88Krpkk9TwHtZ31uTrYMKkzEB2yoELnsszjL",
        },
        subaddresses: [
            {
                acc_idx: 0,
                subaddr_idx: 0,
                address: "43UvsrFvMbaPFHaZ5G57SyTZLPSKEZbQn5B42ZtErUGSLd9tEAVjSCzCZFEHopF7qrHMiX88Krpkk9TwHtZ31uTrNBNADjb",
            },
            {
                acc_idx: 0,
                subaddr_idx: 1,
                address: "85UDGmQ5SzVJ4gh78Q9DTzasCe1x7PA1JL3SYJeNverqfMiebxdB1MVaPVJ1BhSUwcVxU1vmjxeFx26xvz2akLinPh2c6Qk",
            },
            {
                acc_idx: 0,
                subaddr_idx: 2,
                address: "8Bnbtdz4ymRbpaGRzQWZovD1q2m6cuKWYjWJEijcdk7PhJNpotQw8usDjPdGgpRM2uQsx66fxDHfudvYhvqnUgR9Sr7DhmL",
            },
            {
                acc_idx: 1,
                subaddr_idx: 0,
                address: "82iPzGQVviR6vN1Zz46wKDMfRbowhwPyNYeaS4YMrfmUXUc2b5WkrSEND8oHYQY7dRiDZDcF3QaFaX8FkFJ9ETTi9Kt1eWg",
            },
            {
                acc_idx: 1,
                subaddr_idx: 1,
                address: "8AAqYJnikUk87KEoyBd79jgVk2qS9fsxfEWcjrXPzSJVhjde3pFhMkW6SCbbd396L3NSJWhw1dGVe43G8V3iq2jrTKMqyCu",
            },
        ],
    },
    {
        mnemonic: "inkling taxi sequence network stylishly ringing sake cool jagged alarms duration ulcers arena business silk cocoa elite ginger uneven evenings budget initiate daily jukebox arena",
        seed: "595c3ced60e0f3e854213f45b1228aaa30a229a54b90f717ba6335dc8be10847",
        priv_skey: "a50c6579f753aa88fbad60b9363b0e5730a229a54b90f717ba6335dc8be10807",
        priv_vkey: "1babbde3864c84d35e7f5edc402410aa925f260bd860e88b5a4ae5cd250d9405",
        pub_skey: "c707330bef59d517441914de9a1b162eb96616ebda039f14890cdd2cd3a32566",
        pub_vkey: "f1b35f37e0ad852739087d1b3bba41d4cf790d2e006ac0bf9b89070832023d8b",
        primary_address: "49AZTfTdMLx4ti9VAN7DRP8pHSNj8nGA24SDgWvUubfJJDgrYmKcZtY7ZWbAGKmNS4cbXchYB4VHyZ3qLNkak5hvGh65HGG",
        integrated_address: {
            payment_id: "07c438e423452c60",
            address: "4JsEUUH7xcU4ti9VAN7DRP8pHSNj8nGA24SDgWvUubfJJDgrYmKcZtY7ZWbAGKmNS4cbXchYB4VHyZ3qLNkak5hvQFma1eWWr6oBrXXEP5",
        },
        subaddresses: [
            {
                acc_idx: 0,
                subaddr_idx: 0,
                address: "49AZTfTdMLx4ti9VAN7DRP8pHSNj8nGA24SDgWvUubfJJDgrYmKcZtY7ZWbAGKmNS4cbXchYB4VHyZ3qLNkak5hvGh65HGG",
            },
            {
                acc_idx: 0,
                subaddr_idx: 1,
                address: "8AogFFayV3Y81TTTcHWS2rYKZg4ixjnUxR2Cyc9Y9qwuWKBY9vNMPTc4v35uWL7vpKE63H54Vo1WH1QjZYZeij2SNjhyUT2",
            },
            {
                acc_idx: 0,
                subaddr_idx: 2,
                address: "8366mMbywbgVPVKGnitLPkZQHdfjX6WBMcVGYHDyUWKaAQeiMQ1FzZRa2d7vx5PKS61cmNrbWcqFYKHN98spjCyU644dpDJ",
            },
            {
                acc_idx: 1,
                subaddr_idx: 0,
                address: "8ASrsZoDkiYSDxhJnTUJo5d83GMXnwsniLrd9cCjSkgxF3NAYeUEKt4bLr4nnpdJxn5UYjHwuAq8rNnLY3LMsovPSZPA2pH",
            },
            {
                acc_idx: 1,
                subaddr_idx: 1,
                address: "82w1KmNFfmGHWKfhrd9QxJ5qmvGZ8FtDENxAJMstDDRUE6FFVyGen1ngXZy3Xqf6JKWYmSMqSHMBvY1rD12Ls3rFJPtgdaL",
            },
        ],
    },
];

// Initialize ECC
before(() => {
    monero.wallet.initEcc();
})

// Common function to test a wallet
function testWallet(test_wallet, wallet) {
    // Keys
    if (!wallet.isWatchOnly()) {
        assert.equal(test_wallet.priv_skey, wallet.privateSpendKey.toString("hex"));
    }
    else {
        assert.equal(null, wallet.privateSpendKey);
    }
    assert.equal(test_wallet.priv_vkey, wallet.privateViewKey.toString("hex"));
    assert.equal(test_wallet.pub_skey, wallet.publicSpendKey.toString("hex"));
    assert.equal(test_wallet.pub_vkey, wallet.publicViewKey.toString("hex"));

    // Primary/Integrated address
    assert.equal(test_wallet.primary_address, wallet.primaryAddress().encode());
    assert.equal(
        test_wallet.integrated_address.address, 
        wallet.integratedAddress().encode(Buffer.from(test_wallet.integrated_address.payment_id, "hex"))
    );

    // Subaddresses
    for (const test_subaddress of test_wallet.subaddresses) {
        assert.equal(
            test_subaddress.address,
            wallet.subaddress(test_subaddress.subaddr_idx, test_subaddress.acc_idx).encode()
        );
    }
}

// Creation
describe("Wallet creation", () => {
    describe("fromMnemonic", () => {
        it("should construct correctly from mnemonic", () => {
            for (const test of TEST_VECTOR) {
                const wallet = monero.wallet.fromSeed(monero.mnemonic.toSeed(test.mnemonic));
                testWallet(test, wallet);
            }
        });
    });

    describe("fromSeed", () => {
        it("should construct correctly from seed", () => {
            for (const test of TEST_VECTOR) {
                const wallet = monero.wallet.fromSeed(Buffer.from(test.seed, "hex"));
                testWallet(test, wallet);
            }
        });
    });

    describe("fromPrivateSpendKey", () => {
        it("should construct correctly from private spend key", () => {
            for (const test of TEST_VECTOR) {
                const wallet = monero.wallet.fromPrivateSpendKey(Buffer.from(test.priv_skey, "hex"));
                testWallet(test, wallet);
            }
        });
        it("should throw if private spend key is not valid", () => {
            assert.throws(() => {monero.wallet.fromPrivateSpendKey(Buffer.from(PRIV_KEY_INVALID_1, "hex"))}, Error);
            assert.throws(() => {monero.wallet.fromPrivateSpendKey(Buffer.from(PRIV_KEY_INVALID_2, "hex"))}, Error);
            assert.throws(() => {monero.wallet.fromPrivateSpendKey(Buffer.from(PRIV_KEY_INVALID_3, "hex"))}, Error);
        });
    });

    describe("fromWatchOnly", () => {
        it("should construct correctly from watch-only", () => {
            for (const test of TEST_VECTOR) {
                const wallet = monero.wallet.fromWatchOnly(
                    Buffer.from(test.priv_vkey, "hex"), 
                    Buffer.from(test.pub_skey, "hex")
                );
                testWallet(test, wallet);
            }
        });
        it("should throw if private view key is not valid", () => {
            assert.throws(() => {monero.wallet.fromWatchOnly(Buffer.from(PRIV_KEY_INVALID_1, "hex"), TEST_PUB_KEY)}, Error);
            assert.throws(() => {monero.wallet.fromWatchOnly(Buffer.from(PRIV_KEY_INVALID_2, "hex"), TEST_PUB_KEY)}, Error);
            assert.throws(() => {monero.wallet.fromWatchOnly(Buffer.from(PRIV_KEY_INVALID_3, "hex"), TEST_PUB_KEY)}, Error);
        });
        it("should throw if public spend key is not valid", () => {
            assert.throws(() => {monero.wallet.fromWatchOnly(TEST_PRIV_KEY, Buffer.from(PUB_KEY_INVALID_1, "hex"))}, Error);
            assert.throws(() => {monero.wallet.fromWatchOnly(TEST_PRIV_KEY, Buffer.from(PUB_KEY_INVALID_2, "hex"))}, Error);
        });
    });
});

// Integrated address
describe("Integrated address generation", () => {
    describe("integratedAddress", () => {
        it("should throw if payment ID is not valid", () => {
            const wallet = monero.wallet.fromSeed(Buffer.from(TEST_SEED, "hex"));

            assert.throws(() => {wallet.integratedAddress().encode(Buffer.alloc(PAYMENT_ID_BYTE_LEN - 1))}, Error);
            assert.throws(() => {wallet.integratedAddress().encode(Buffer.alloc(PAYMENT_ID_BYTE_LEN + 1))}, Error);
        });
    });
});

// Subaddresses
describe("Subaddresses generation", () => {
    describe("subaddress", () => {
        it("should throw if one of the index is not valid", () => {
            const wallet = monero.wallet.fromSeed(Buffer.from(TEST_SEED, "hex"));

            assert.throws(() => {wallet.subaddress(-1, 0).encode()}, Error);
            assert.throws(() => {wallet.subaddress(SUBADDR_MAX_IDX, 0).encode()}, Error);
            assert.throws(() => {wallet.subaddress(0, -1).encode()}, Error);
            assert.throws(() => {wallet.subaddress(0, SUBADDR_MAX_IDX).encode()}, Error);
        });
    });
});
