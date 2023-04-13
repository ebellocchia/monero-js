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
const base58 = require("./base58");
const { PublicKey } = require("./keys");

//
// Constants
//
const CHECKSUM_BYTE_LEN = 4;
const PAYMENT_ID_BYTE_LEN = 8;

//
// External classes
//

// Address types enum
class AddressTypes {
    static PRIMARY = 0;
    static INTEGRATED = 1;
    static SUBADDRESS = 2;

    static TYPE_TO_NETWORK_VER = new Map([
        [AddressTypes.PRIMARY, Buffer.from("12", "hex")],
        [AddressTypes.INTEGRATED, Buffer.from("13", "hex")],
        [AddressTypes.SUBADDRESS, Buffer.from("2a", "hex")],
    ]);

    // Get if valid
    static isValid(addr_type) {
        return AddressTypes.TYPE_TO_NETWORK_VER.has(addr_type);
    }

    // Get correspondent network version
    static toNetworkVersion(addr_type) {
        if (!AddressTypes.isValid(addr_type)) {
            throw Error("Invalid address type");
        }
        return AddressTypes.TYPE_TO_NETWORK_VER.get(addr_type);
    }
}

// Class representing a generic address
class Address {
    #net_ver;
    #pub_skey;
    #pub_vkey;

    // Constructor
    constructor(pub_skey, pub_vkey, addr_type) {
        this.#net_ver = AddressTypes.toNetworkVersion(addr_type);
        this.#pub_skey = pub_skey;
        this.#pub_vkey = pub_vkey;
    }

    // Get public spend key
    get publicSpendKey() {
        return this.#pub_skey.toBuffer();
    }

    // Get private view key
    get publicViewKey() {
        return this.#pub_vkey.toBuffer();
    }

    // Encode address to string
    _encode(payment_id = null) {
        if (payment_id !== null && payment_id.length != PAYMENT_ID_BYTE_LEN) {
            throw Error("Invalid payment ID");
        }

        const net_ver_len = this.#net_ver.length;
        const payload = Buffer.alloc(
            net_ver_len + (PublicKey.byteLength() * 2) + (payment_id === null? 0 : PAYMENT_ID_BYTE_LEN)
        );

        this.#net_ver.copy(payload);
        this.publicSpendKey.copy(payload, net_ver_len);
        this.publicViewKey.copy(payload, net_ver_len + PublicKey.byteLength());
        if (payment_id !== null) {
            payment_id.copy(payload, net_ver_len + (PublicKey.byteLength() * 2));
        }

        return base58.encode(
            Buffer.concat([payload, Address.#computeChecksum(payload)])
        );
    }

    // Compute checksum
    static #computeChecksum(payload) {
        return keccak256(payload).slice(0, CHECKSUM_BYTE_LEN);
    }
}

// Class representing a primary address
class PrimaryAddress extends Address {
    // Constructor
    constructor(pub_skey, pub_vkey) {
        super(pub_skey, pub_vkey, AddressTypes.PRIMARY);
    }

    // Encode address to string
    encode() {
        return this._encode();
    }
}

// Class representing an integrated address
class IntegratedAddress extends Address {
    // Constructor
    constructor(pub_skey, pub_vkey) {
        super(pub_skey, pub_vkey, AddressTypes.INTEGRATED);
    }

    // Encode address to string
    encode(payment_id) {
        return this._encode(payment_id);
    }
}

// Class representing a subaddress
class Subaddress extends Address {
    // Constructor
    constructor(pub_skey, pub_vkey) {
        super(pub_skey, pub_vkey, AddressTypes.SUBADDRESS);
    }

    // Encode address to string
    encode() {
        return this._encode();
    }
}

//
// Exports
//
exports.PrimaryAddress = PrimaryAddress;
exports.IntegratedAddress = IntegratedAddress;
exports.Subaddress = Subaddress;
