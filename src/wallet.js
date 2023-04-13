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

"use-strict";

const keccak256 = require("keccak256");
const { IntegratedAddress } = require("./address");
const ed25519 = require("./ed25519");
const { PrivateKey, PublicKey } = require("./keys");
const { SubaddressGenerator } = require("./subaddress");

//
// External functions
//

// Initialize ECC
async function initEcc() {
    return ed25519.initLibrary();
}

// Create wallet from seed
function fromSeed(seed) {
    if (seed.length !== PrivateKey.byteLength()) {
        seed = keccak256(seed);
    }

    return fromPrivateSpendKey(
        ed25519.scalarReduce(seed)
    );
}

// Create wallet from private spend key
function fromPrivateSpendKey(priv_skey) {
    return new Wallet(priv_skey);
}

// Create watch-only wallet
function fromWatchOnly(priv_vkey, pub_skey) {
    return new Wallet(
        null,
        priv_vkey,
        pub_skey
    );
}

//
// External classes
//

// Class representing a wallet
class Wallet {
    #priv_skey;
    #priv_vkey;
    #pub_skey;
    #pub_vkey;

    // Constructor
    constructor(priv_skey, priv_vkey = null, pub_skey = null) {
        if (priv_skey !== null) {
            this.#priv_skey = new PrivateKey(priv_skey);
            this.#priv_vkey = Wallet.#spendPrivateKeyToView(priv_skey);
            this.#pub_skey = this.#priv_skey.publicKey();
            this.#pub_vkey = this.#priv_vkey.publicKey();
        }
        else {
            this.#priv_skey = null;
            this.#priv_vkey = new PrivateKey(priv_vkey);
            this.#pub_skey = new PublicKey(pub_skey);
            this.#pub_vkey = this.#priv_vkey.publicKey();
        }
    }

    // Get private spend key
    get privateSpendKey() {
        return this.isWatchOnly() ? null : this.#priv_skey.toBuffer();
    }

    // Get private view key
    get privateViewKey() {
        return this.#priv_vkey.toBuffer();
    }

    // Get public spend key
    get publicSpendKey() {
        return this.#pub_skey.toBuffer();
    }

    // Get private view key
    get publicViewKey() {
        return this.#pub_vkey.toBuffer();
    }

    // Get if watch-only
    isWatchOnly() {
        return this.#priv_skey === null;
    }

    // Get the primary address
    primaryAddress() {
        return this.subaddress(0, 0);
    }

    // Get an integrated address
    integratedAddress() {
        return new IntegratedAddress(this.#pub_skey, this.#pub_vkey);
    }

    // Get the specified subaddress
    subaddress(subaddr_idx, acc_idx = 0) {
        let sub_gen = new SubaddressGenerator(this.#priv_vkey, this.#pub_skey);
        return sub_gen.computeKeys(subaddr_idx, acc_idx);
    }

    // Get the private view key from a private spend key
    static #spendPrivateKeyToView(priv_skey) {
        return new PrivateKey(
            ed25519.scalarReduce(
                keccak256(priv_skey)
            )
        );
    }
}

//
// Exports
//
exports.initEcc = initEcc;
exports.fromSeed = fromSeed;
exports.fromPrivateSpendKey = fromPrivateSpendKey;
exports.fromWatchOnly = fromWatchOnly;
exports.Wallet = Wallet;
