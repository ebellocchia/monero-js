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

const ed25519 = require("./ed25519");

//
// Constants
//
const PRIV_KEY_BYTE_LEN = 32;
const PUB_KEY_BYTE_LEN = 32;

//
// External classes
//

// Class representing a private key
class PrivateKey {
    #priv_key;

    // Constructor
    constructor(priv_key) {
        if (!PrivateKey.isValid(priv_key)) {
            throw Error("invalid private key");
        }
        this.#priv_key = priv_key;
    }

    // Get as buffer
    toBuffer() {
        return this.#priv_key;
    }

    // Get as integer
    toInt() {
        return ed25519.decodeInt(this.#priv_key);
    }

    // Get the correspondent public key
    publicKey() {
        return new PublicKey(
            ed25519.scalarMulBase(this.#priv_key)
        );
    }

    // Get length in bytes
    static byteLength() {
        return PRIV_KEY_BYTE_LEN;
    }

    // Get if valid
    static isValid(priv_key) {
        return priv_key.length === PrivateKey.byteLength() && ed25519.scalarIsValid(priv_key);
    }
}

// Class representing a public key
class PublicKey {
    #pub_key;

    // Constructor
    constructor(pub_key) {
        if (!PublicKey.isValid(pub_key)) {
            throw Error("invalid public key");
        }
        this.#pub_key = pub_key;
    }

    // Get as buffer
    toBuffer() {
        return this.#pub_key;
    }

    // Get length in bytes
    static byteLength() {
        return PUB_KEY_BYTE_LEN;
    }

    // Get if valid
    static isValid(pub_key) {
        return pub_key.length === PublicKey.byteLength();
    }
}

//
// Exports
//
exports.PrivateKey = PrivateKey;
exports.PublicKey = PublicKey;
