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

const { toBigIntLE, toBufferLE } = require("bigint-buffer");
const nacl_factory = require("./js-nacl/nacl_factory");
const utils = require("./utils");

//
// Constants
//
const CURVE_ORDER = 0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3edn;
const INT_NONREDUCED_BYTE_LEN = 64;

//
// Global variables
//
var nacl;

//
// External functions
//

// Initialize library
async function initLibrary() {
    return nacl_factory.instantiate((nacl_instance) => {
        nacl = nacl_instance;
    });
}

// Reduce scalar to be a valid ed25519 scalar
function scalarReduce(scalar) {
    return Buffer.from(
        nacl.crypto_core_ed25519_scalar_reduce(
            utils.bufferPad(scalar, INT_NONREDUCED_BYTE_LEN)
        )
    );
}

// Add two points on the ed25519 curve
function scalarAdd(point1, point2) {
    return Buffer.from(
        nacl.crypto_core_ed25519_add(point1, point2)
    );
}

// Multiply a point on the ed25519 curve with a scalar
function scalarMul(scalar, point) {
    return Buffer.from(
        nacl.crypto_scalarmult_ed25519_noclamp(scalar, point)
    );
}

// Multiply the base point of the ed25519 curve with a scalar
function scalarMulBase(scalar) {
    return Buffer.from(
        nacl.crypto_scalarmult_ed25519_base_noclamp(scalar)
    );
}

// Get if a scalar is a valid ed25519 scalar
function scalarIsValid(scalar) {
    return decodeInt(scalar) < CURVE_ORDER;
}

// Decode integer
function decodeInt(buf) {
    return toBigIntLE(buf);
}

// Encode integer
function encodeInt(val) {
    return toBufferLE(val);
}

//
// Exports
//
exports.initLibrary = initLibrary;
exports.scalarReduce = scalarReduce;
exports.scalarAdd = scalarAdd;
exports.scalarMul = scalarMul;
exports.scalarMulBase = scalarMulBase;
exports.scalarIsValid = scalarIsValid;
exports.decodeInt = decodeInt;
exports.encodeInt = encodeInt;
