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
const ed25519 = require("./ed25519");
const { PrimaryAddress, Subaddress } = require("./address");
const { PrivateKey, PublicKey } = require("./keys");

//
// Constants
//
const SUBADDR_PREFIX = Buffer.from("SubAddr\0");
const SUBADDR_MAX_IDX = 2**32;
const SUBADDR_IDX_BYTE_LEN = 4;

//
// Internal classes
//

// Class representing a subaddress index
class _SubaddressIndex {
    #idx;

    // Constructor
    constructor(idx) {
        if (!_SubaddressIndex.isValid(idx)) {
            throw Error("invalid subaddress index");
        }
        this.#idx = idx;
    }

    // Encode to bytes
    encode() {
        const buf = Buffer.alloc(SUBADDR_IDX_BYTE_LEN);
        buf.writeInt32LE(this.#idx);

        return buf;
    }

    // Get if valid
    static isValid(idx) {
        return idx >= 0 && idx < SUBADDR_MAX_IDX;
    }
}

//
// External classes
//

// Class to generate subaddresses
class SubaddressGenerator {
    #priv_vkey;
    #pub_skey;
    #pub_vkey;

    // Constructor
    constructor(priv_vkey, pub_skey) {
        this.#priv_vkey = priv_vkey;
        this.#pub_skey = pub_skey;
        this.#pub_vkey = this.#priv_vkey.publicKey();
    }

    // Compute subaddress keys
    computeKeys(subaddr_idx, acc_idx) {
        // Primary address
        if (SubaddressGenerator.#isPrimaryAddress(acc_idx, subaddr_idx)) {
            return new PrimaryAddress(
                this.#pub_skey,
                this.#pub_vkey
            );
        }

        // Compute "m"
        const m = this.#computeScalarM(
            new _SubaddressIndex(acc_idx),
            new _SubaddressIndex(subaddr_idx)
        );
        // Compute new keys
        const subaddr_pub_skey = ed25519.scalarAdd(
            this.#pub_skey.toBuffer(),
            ed25519.scalarMulBase(ed25519.scalarReduce(m))
        );
        const subaddr_pub_vkey = ed25519.scalarMul(
            this.#priv_vkey.toBuffer(), 
            subaddr_pub_skey
        );

        return new Subaddress(
            new PublicKey(subaddr_pub_skey),
            new PublicKey(subaddr_pub_vkey)
        );
    }

    // Compute the scalar "m" associated with the subaddress
    #computeScalarM(acc_idx, subaddr_idx) {
        const buf = Buffer.alloc(SUBADDR_PREFIX.length + PrivateKey.byteLength() + (SUBADDR_IDX_BYTE_LEN * 2));

        SUBADDR_PREFIX.copy(buf);
        this.#priv_vkey.toBuffer().copy(buf, SUBADDR_PREFIX.length);
        acc_idx.encode().copy(buf, SUBADDR_PREFIX.length + PrivateKey.byteLength());
        subaddr_idx.encode().copy(buf, SUBADDR_PREFIX.length + PrivateKey.byteLength() + SUBADDR_IDX_BYTE_LEN);

        return keccak256(buf);
    }

    // Get if indexes correspond to a primary address
    static #isPrimaryAddress(acc_idx, subaddr_idx) {
        return acc_idx === 0 && subaddr_idx === 0;
    }
}

//
// Exports
//
exports.SubaddressGenerator = SubaddressGenerator;
